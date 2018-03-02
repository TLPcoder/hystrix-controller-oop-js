'use strict'
const HystrixController = require('../index')
const chai = require('chai');
const testConfigs = require('./test-config')

describe('Hystrix Constroller', function(){

    before(function (){
        HystrixController(testConfigs.config).createCommands();
    })

    describe('State', function(){

        it('Config', function(){
            const hystrixConfig = HystrixController().hystrixConfig
            chai.expect(hystrixConfig).to.deep.equal(testConfigs.config)
        })

        it('structuredConfig', function(){
            const structuredConfig = HystrixController().structuredConfig;
            chai.expect(structuredConfig.testing).to.deep.equal(testConfigs.config[0])
        })

        it('serviceCommands', function(){
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

    describe('get State methods', function(){

        it('fn getConfig', function(){
            const hystrixConfig = HystrixController().hystrixConfig
            chai.expect(hystrixConfig).to.deep.equal(HystrixController().getConfig())
        })

        it('fn getServiceCommands', function(){
            const serviceCommands = HystrixController().serviceCommands
            chai.expect(serviceCommands).to.deep.equal(HystrixController().getServiceCommands())
        })

    })

    describe('circuits methods', function(){

        it('fn getCircuitStatus', function(){
            const statusCheck = HystrixController()
            chai.expect(statusCheck.getCircuitStatus('testing')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing1')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing2')).to.equal('closed')
            chai.expect(statusCheck.getCircuitStatus('testing3')).to.equal('closed')
        })

        it('fn circuitHealth', function(){
            const circuitHealth = HystrixController().circuitHealth()
            chai.expect(circuitHealth).to.deep.equal([
                  {
                    'circuitStatus': 'closed',
                    'name': 'testing'
                  },{
                    'circuitStatus': 'closed',
                    'name': 'testing1'
                  },{
                    'circuitStatus': 'closed',
                    'name': 'testing2'
                  },{
                    'circuitStatus': 'closed',
                    'name': 'testing3'
                  }
                ])
        })
    })
    describe('circuit-controller methods', function(){
        it('fn resolveParams', function(){
            const resolveParams1 = HystrixController().resolveParams({ services: ['testing'], circuitStatus: 'open' })
            const resolveParams2 = HystrixController().resolveParams({ services: ['testing'], circuitStatus: 'close' })
            const resolveParams3 = HystrixController().resolveParams({ services: ['testing'], circuitStatus: 'reset' })
            chai.expect(resolveParams1).to.deep.equal({ open: true, close: false, services: ['testing'] })
            chai.expect(resolveParams2).to.deep.equal({ open: false, close: true, services: ['testing'] })
            chai.expect(resolveParams3).to.deep.equal({ open: false, close: false, services: ['testing'] })
        })
    })
})


// const hystrixTesting = HystrixController(config)
// hystrixTesting.createCommands()
// console.log('reste cache bro', hystrixTesting.resetCache('metrics'))
// console.log(hystrixTesting.controller({services: ['testing1', 'testing2'], circuitStatus: 'open'}))
// console.log(hystrixTesting.circuitHealth())
// console.log(hystrixTesting.hystrixjs())