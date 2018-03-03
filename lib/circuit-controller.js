'use strict'
const ensureArray = require('ensure-array')
const CircuitHealth = require('./circuit-health')
const { commandFactory, circuitFactory, metricsFactory } = require('hystrixjs')

module.exports = class CircuitController extends CircuitHealth {

    controller({ services, circuitStatus }) {
        services = ensureArray(services)
        this.checkArgs(services, circuitStatus)
        if (services[0] === 'all' && (circuitStatus === 'open' || circuitStatus === 'close')) {
            services = this.mapServicesToArr(this.structuredConfig);
        }
        if (services[0] === 'all' && circuitStatus === 'reset') {
            try {
                this.resetCache()
                this.createCommands(this.structuredConfig, this.serviceCommands)
                return 'The hystrix setting\'s have been reset'
            } catch (err) {
                throw err
            }
        } else {
            try {
                this.resetCache()
                const params = this.resolveParams({ services, circuitStatus })
                this.createCommand(params, services)
                return `${services.join(', ')} circuit has been ${{open: 'opened',close: 'closed',reset: 'reset'}[circuitStatus]}`
            } catch (err) {
                throw err
            }
        }
    }

    createCommand(params, services) {
        for (let key in this.hystrixConfig) {
            if (services.indexOf(this.hystrixConfig[key].name) !== -1) {
                this.forceCommand(this.hystrixConfig[key], params)
            } else if (this.serviceCommands[this.hystrixConfig[key].name].circuitConfig.circuitBreakerForceOpened) {
                this.forceCommand(this.hystrixConfig[key], {
                    open: true,
                    close: undefined
                })
            } else {
                this.standardCommand(this.hystrixConfig[key])
            }
        }
    }

    resolveParams({ services, circuitStatus }) {
        switch (circuitStatus.toLowerCase()) {
            case 'open':
                return { open: true, close: false, services }
            case 'close':
                return { open: false, close: true, services }
            case 'reset':
                return { open: false, close: false, services }
            default:
                return { error: 'incorrect request' }
        }
    }

    getCircuitBreaker(circuit) {
        return circuitFactory.getOrCreate(commandFactory.getOrCreate(circuit))
    }

    resetCache(factory) {
        switch(factory){
            case 'metrics':
                return metricsFactory.resetCache()
            case 'circuit':
                return circuitFactory.resetCache()
            case 'commandFactory':
                return commandFactory.resetCache()
            default: 
                metricsFactory.resetCache()
                circuitFactory.resetCache()
                commandFactory.resetCache()
        }
    }

    checkArgs(services, status){
        this.checkServicesArg(services)
        this.checkStatusArg(status)
    }

    checkServicesArg(services){
        if (services.length === 0){
            throw new Error('no services were given to the command method')
        } else if (services[0] !== 'all') {
            services.forEach(service => {
                if(!this.serviceCommands[service]){
                    throw new Error(`${service} is not a hystrix command`)
                }
            })
        }
    }

    checkStatusArg(status){
        if (status !== 'open' && status !== 'close' && status !== 'reset'){
            throw new Error(`circuitStatus argument "${status}" is not supported. Please use open, close, or reset.`)
        }
    }

    mapServicesToArr() {
        var arr = []
        for (var key in this.structuredConfig) {
            arr.push(this.structuredConfig[key].name)
        }
        return arr
    }
}