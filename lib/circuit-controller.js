'use strict'
const ensureArray = require('ensure-array')
const CircuitHealth = require('./circuit-health')
const { commandFactory, circuitFactory, metricsFactory } = require('hystrixjs')

module.exports = class CircuitController extends CircuitHealth {

    controller({ services, circuitStatus, cache }) {
        try {
            services = ensureArray(services)
 
            this.checkArgs(services, circuitStatus)

            if (services[0] === 'all') services = this.mapServicesToArr(this.structuredConfig)

            const params = this.resolveParams({ services, circuitStatus })

            this.createCommand(services, params)

            return `${services.join(', ')} circuit has been ${{open: 'opened',close: 'closed',reset: 'reset'}[circuitStatus]}`
        } catch (err) {
            throw err
        }
    }

    createCommand(services, params) {
        for (let key in this.structuredConfig) {
            if (services.indexOf(this.structuredConfig[key].name) !== -1) {
                this.setCircuitStatus(this.structuredConfig[key].name, params)
            }
        }
    }

    setCircuitStatus(circuit, status){
        const circuitBreaker = circuitFactory.getOrCreate(commandFactory.getOrCreate(circuit))

        if(status.open === true) {
            circuitBreaker.circuitBreakerForceClosed = false
            circuitBreaker.circuitBreakerForceOpened = true
            circuitBreaker.circuitOpen = false
        } else if (status.close === true) {
            circuitBreaker.circuitBreakerForceClosed = true
            circuitBreaker.circuitBreakerForceOpened = false
            circuitBreaker.circuitOpen = false
        } else {
            circuitBreaker.circuitBreakerForceClosed = this.structuredConfig[circuit].forceClosed || false
            circuitBreaker.circuitBreakerForceOpened = this.structuredConfig[circuit].forceOpened || false
            circuitBreaker.circuitOpen = false
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
            case 'command':
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