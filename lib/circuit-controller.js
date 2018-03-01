'use strict'
const ensureArray = require('ensure-array')
const CircuitHealth = require('./circuit-health')
const { commandFactory, circuitFactory, metricsFactory } = require('hystrixjs')

module.exports = class CircuitController extends CircuitHealth {

    controller({ services, circuitStatus }) {
        services = ensureArray(services)
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

    resolveParams({ circuitStatus, services }) {
        switch (circuitStatus.toLowerCase()) {
            case 'open':
                return { open: true, close: false, services }
            case 'close':
                return { open: false, close: true, services }
            case 'reset':
                return { open: false, close: false, services }
            default:
                return reject({ error: 'incorrect request' })
        }
    }

    getCircuitBreaker(circuit) {
        return hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit))
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

    mapServicesToArr() {
        var arr = []
        for (var key in this.structuredConfig) {
            arr.push(this.structuredConfig[key].name)
        }
        return arr
    }
}