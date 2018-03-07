'use strict'
const HystrixController = require('../index')
const chai = require('chai');
const testConfigs = require('./test-config')

describe('Hystrix Constroller', function () {

    before(function () {
        HystrixController(testConfigs.config).createCommands();
    })

    describe('state', function () {

        it('Config', function () {
            const hystrixConfig = HystrixController().hystrixConfig
            chai.expect(hystrixConfig).to.deep.equal(testConfigs.config)
        })

        it('structuredConfig', function () {
            const structuredConfig = HystrixController().structuredConfig;
            chai.expect(structuredConfig.testing).to.deep.equal(testConfigs.config[0])
        })

        it('serviceCommands', function () {
            const serviceCommand = HystrixController().serviceCommands.testing
            chai.expect(serviceCommand.commandKey).to.equal(testConfigs.config[0].name)
            chai.expect(serviceCommand.run).to.equal(testConfigs.config[0].requestModel)
            chai.expect(serviceCommand.fallback).to.equal(testConfigs.config[0].fallbackTo)
            chai.expect(serviceCommand.timeout).to.equal(testConfigs.config[0].timeout)
            chai.expect(serviceCommand.isError).to.equal(testConfigs.config[0].errorHandler)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerErrorThresholdPercentage).to.equal(testConfigs.config[0].errorThreshold)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerSleepWindowInMilliseconds).to.equal(testConfigs.config[0].sleepWindowInMilliseconds)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerForceClosed).to.equal(false)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerForceOpened).to.equal(false)
            chai.expect(serviceCommand.requestVolumeRejectionThreshold).to.equal(testConfigs.config[0].requestVolumeRejectionThreshold || 0)
        })

    })

    describe('updating hytrix', function () {
        before(function () {
            HystrixController().updateHystrix(testConfigs.newConfig)

        })

        after(function () {
            HystrixController().updateHystrix(testConfigs.config)
        })

        it('check updated config', function () {
            const newHystrixConfig = HystrixController().hystrixConfig
            chai.expect(newHystrixConfig).to.deep.equal(testConfigs.newConfig)
        })

        it('check updated structuredConfig', function () {
            const structuredConfig = HystrixController().structuredConfig;
            chai.expect(structuredConfig.testing4).to.deep.equal(testConfigs.newConfig[0])
        })

        it('updating serviceCommands', function () {
            const serviceCommand = HystrixController().serviceCommands.testing4
            chai.expect(serviceCommand.commandKey).to.equal(testConfigs.newConfig[0].name)
            chai.expect(serviceCommand.run).to.equal(testConfigs.newConfig[0].requestModel)
            chai.expect(serviceCommand.fallback).to.equal(testConfigs.newConfig[0].fallbackTo)
            chai.expect(serviceCommand.timeout).to.equal(testConfigs.newConfig[0].timeout)
            chai.expect(serviceCommand.isError).to.equal(testConfigs.newConfig[0].errorHandler)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerErrorThresholdPercentage).to.equal(testConfigs.newConfig[0].errorThreshold)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerSleepWindowInMilliseconds).to.equal(testConfigs.newConfig[0].sleepWindowInMilliseconds)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerForceClosed).to.equal(false)
            chai.expect(serviceCommand.circuitConfig.circuitBreakerForceOpened).to.equal(false)
            chai.expect(serviceCommand.requestVolumeRejectionThreshold).to.equal(testConfigs.newConfig[0].requestVolumeRejectionThreshold || 0)
        })

        it('fn addCommand', function () {
            const command = {
                name: 'addCommand',
                requestModel: () => Promise.resolve('hello world'),
                errorThreshold: 10,
                timeout: 12345,
                requestVolumeThreshold: 10,
                sleepWindowInMilliseconds: 1000,
                statisticalWindowLength: 10000,
                statisticalWindowNumberOfBuckets: 10000,
                errorHandler: (err) => err,
                fallbackTo: (err, args) => { err, args }
            }
            HystrixController().addCommand(command)
            const newCommand = HystrixController().getServiceCommands().addCommand;
            chai.expect(newCommand.commandKey).to.equal('addCommand')
            chai.expect(newCommand.timeout).to.equal(12345)
            chai.expect(newCommand.circuitConfig.circuitBreakerForceClosed).to.equal(false)
            chai.expect(newCommand.circuitConfig.circuitBreakerForceOpened).to.equal(false)
            chai.expect(HystrixController().hystrixConfig[HystrixController().hystrixConfig.length-1].name).to.equal('addCommand')
            chai.expect(HystrixController().structuredConfig.addCommand.name).to.equal('addCommand')
        })
    })

    describe('get State methods', function () {

        it('fn getConfig', function () {
            const hystrixConfig = HystrixController().hystrixConfig
            chai.expect(hystrixConfig).to.deep.equal(HystrixController().getConfig())
        })

        it('fn getServiceCommands', function () {
            const serviceCommands = HystrixController().serviceCommands
            chai.expect(serviceCommands).to.deep.equal(HystrixController().getServiceCommands())
        })

    })

    describe('circuits methods', function () {

        after(function() {
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'reset'
            })
        })

        it('fn getCircuitStatus', function () {
            const statusCheck = HystrixController()
            chai.expect(statusCheck.getCircuitStatus('testing')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing1')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing2')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing3')).to.equal('closed')
        })

        it('fn circuitHealth', function (done) {
            const { testing } = HystrixController().getServiceCommands()
            var arr = []
            for(var i = 0; i < 20; i++){
                arr.push(testing.execute('success'))
            }
            Promise.all(arr).then(data => {
                const circuitHealth = HystrixController().circuitHealth('testing')
                chai.expect(circuitHealth).to.deep.equal([{
                    'circuitStatus': 'closed',
                    'name': 'testing',
                    'metrics': {
                        'errorCount': 0,
                        'errorPercentage': 0,
                        'successCount': 20,
                        'totalCount': 20
                    }
                }])
            }).then(() => {
                var arr = []
                for(var i = 0; i < 5; i++){
                    arr.push(testing.execute('err'))
                }
                Promise.all(arr).then(() => {})
                .then(done, () => {
                    const circuitHealth = HystrixController().circuitHealth('testing')
                    chai.expect(circuitHealth).to.deep.equal([{
                        'circuitStatus': 'opened',
                        'name': 'testing',
                        'metrics': {
                            'errorCount': 5,
                            'errorPercentage': 20,
                            'successCount': 20,
                            'totalCount': 25
                        }
                    }])
                }).then(done, done)
            })
        })
    })

    describe('circuit-controller methods', function () {
        it('fn resolveParams', function () {
            const resolveParams1 = HystrixController().resolveParams({
                services: ['testing'],
                circuitStatus: 'open'
            })
            const resolveParams2 = HystrixController().resolveParams({
                services: ['testing'],
                circuitStatus: 'close'
            })
            const resolveParams3 = HystrixController().resolveParams({
                services: ['testing'],
                circuitStatus: 'reset'
            })
            chai.expect(resolveParams1).to.deep.equal({
                open: true,
                close: false,
                services: ['testing']
            })
            chai.expect(resolveParams2).to.deep.equal({
                open: false,
                close: true,
                services: ['testing']
            })
            chai.expect(resolveParams3).to.deep.equal({
                open: false,
                close: false,
                services: ['testing']
            })
        })
        it('fn getCircuitBreaker', function () {
            const testingCircuit = HystrixController().getCircuitBreaker('testing')
            chai.expect(testingCircuit.commandKey).to.equal(testConfigs.config[0].name)
            chai.expect(testingCircuit.circuitBreakerErrorThresholdPercentage).to.equal(testConfigs.config[0].errorThreshold)
            chai.expect(testingCircuit.circuitBreakerSleepWindowInMilliseconds).to.equal(testConfigs.config[0].sleepWindowInMilliseconds)
            chai.expect(testingCircuit.circuitOpen).to.equal(false)
            chai.expect(testingCircuit.circuitBreakerForceOpened).to.equal(false)
            chai.expect(testingCircuit.circuitBreakerForceClosed).to.equal(false)
        })
        it('fn mapServicesToArr', function () {
            const mapServicesToArr = HystrixController().mapServicesToArr();
            chai.expect(mapServicesToArr).to.deep.equal(['testing', 'testing1', 'testing2', 'testing3'])
        })
        it('fn checkServicesArg', function () {
            chai.expect(() => {
                HystrixController().checkServicesArg([])
            }).to.throw('no services were given to the command method')
            chai.expect(function () {
                HystrixController().checkServicesArg(['testing5'])
            }).to.throw('testing5 is not a hystrix command')
        })
        it('fn checkStatusArg', function () {
            chai.expect(() => {
                HystrixController().checkStatusArg('notOpen')
            }).to.throw('circuitStatus argument "notOpen" is not supported. Please use open, close, or reset.')
        })
    })
    describe('testing circuit breaker controller scenarios', function () {

        beforeEach(function () {
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'reset'
            })
        })
        it('open one circuit', function () {
            HystrixController().controller({
                services: ['testing'],
                circuitStatus: 'open'
            })
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceOpened).to.equal(true)
        })

        it('open more than one circuit', function () {
            const services = ['testing', 'testing1']
            HystrixController().controller({
                services,
                circuitStatus: 'open'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(true)
            })
        })

        it('close one circuit', function () {
            HystrixController().controller({
                services: ['testing'],
                circuitStatus: 'close'
            })
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceClosed).to.equal(true)
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceOpened).to.equal(false)
        })

        it('close more than one circuit', function () {
            const services = ['testing', 'testing1']
            HystrixController().controller({
                services,
                circuitStatus: 'close'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(true)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(false)
            })
        })

        it('reset one circuit', function () {
            HystrixController().controller({
                services: ['testing'],
                circuitStatus: 'open'
            })
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceOpened).to.equal(true)
            HystrixController().controller({
                services: ['testing'],
                circuitStatus: 'reset'
            })
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceClosed).to.equal(false)
            chai.expect(HystrixController().getCircuitBreaker('testing').circuitBreakerForceOpened).to.equal(false)
        })

        it('reset more than one circuit', function () {
            const services = ['testing', 'testing1']
            HystrixController().controller({
                services,
                circuitStatus: 'open'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(true)
            })
            HystrixController().controller({
                services,
                circuitStatus: 'reset'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(false)
            })
        })

        it('open all circuits', function () {
            const services = Object.keys(HystrixController().getServiceCommands())
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'open'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(true)
            })
        })

        it('close all circuits', function () {
            const services = Object.keys(HystrixController().getServiceCommands())
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'close'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(true)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(false)
            })
        })

        it('reset all circuits', function () {
            const services = Object.keys(HystrixController().getServiceCommands())
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'open'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(true)
            })
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'reset'
            })
            services.forEach(service => {
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceClosed).to.equal(false)
                chai.expect(HystrixController().getCircuitBreaker(service).circuitBreakerForceOpened).to.equal(false)
            })
        })
    })
    describe('testing commands', function () {
        beforeEach(function () {
            HystrixController().controller({
                services: ['all'],
                circuitStatus: 'reset'
            })
        })
        it('trigger open circuit', function (done) {
            const { testing } = HystrixController().getServiceCommands()
            var arr = []
            for(var i = 0; i < 10; i++){
                arr.push(testing.execute('success'))
            }
            Promise.all(arr).then(data => {
                const circuitHealth = HystrixController().circuitHealth('testing')
                chai.expect(circuitHealth).to.deep.equal([{
                    'circuitStatus': 'closed',
                    'name': 'testing',
                    'metrics': {
                        'errorCount': 0,
                        'errorPercentage': 0,
                        'successCount': 10,
                        'totalCount': 10
                    }
                }])
            }).then(() => {
                var arr = []
                for(var i = 0; i < 2; i++){
                    arr.push(testing.execute('err'))
                }
                Promise.all(arr).then(() => {})
                .then(done, () => {
                    const circuitHealth = HystrixController().circuitHealth('testing')
                    chai.expect(circuitHealth).to.deep.equal([{
                        'circuitStatus': 'opened',
                        'name': 'testing',
                        'metrics': {
                            'errorCount': 2,
                            'errorPercentage': 16,
                            'successCount': 10,
                            'totalCount': 12
                        }
                    }])
                }).then(done, done)
            })
        })
        it('circuit closed', function (done) {
            const { testing } = HystrixController().getServiceCommands()
            testing.execute('testing command closed circuit')
            .then(str => {
                chai.expect(str).to.equal('testing command closed circuit')
            })
            .then(done, done)
        })

        it('circuit opened', function (done) {
            const { testing } = HystrixController().getServiceCommands()
            HystrixController().controller({
                services: 'testing',
                circuitStatus: 'open'
            })
            testing.execute('testing command closed circuit')
            .then(str => {})
            .then(done, (err) => {
                chai.expect(err.debug.error).to.equal('OpenCircuitError')
            })
            .then(done, done)
        })
        
        it('open circuit reset circuit', function (done) {
            const { testing } = HystrixController().getServiceCommands()
            HystrixController().controller({
                services: 'testing',
                circuitStatus: 'open'
            })
            testing.execute('testing command closed circuit')
            .then(str => {})
            .then(done, (err) => {
                chai.expect(err.debug.error).to.equal('OpenCircuitError')
            })
            .then(() => {
                HystrixController().controller({
                    services: 'testing',
                    circuitStatus: 'reset'
                })
                return testing.execute('testing command closed circuit')
            }).then(str => {
                chai.expect(str).to.equal('testing command closed circuit')
            }).then(done, done)
        })
    })
})