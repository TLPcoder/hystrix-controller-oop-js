'use strict';
const CreateCommands = require('./create-commands')
const ensureArray = require('ensure-array')
const { circuitFactory, commandFactory, metricsFactory} = require('hystrixjs')
const Metrics = require('./metrics')

module.exports = class CircuitHealth extends CreateCommands{
    constructor(config){
        super(config)
        this.metrics = new Metrics()
    }

    circuitHealth(circuit){
        let circuits = circuit ? ensureArray(this.structuredConfig[circuit]) : this.hystrixConfig
        return circuits.map(({name}) => ({
            name,
            circuitStatus: this.getCircuitStatus(name),
            metrics: this.metrics.getCommandMetrics(this.getCircuitMetrics(name).rollingCount.buckets)
        }))
    }

    getCircuitStatus(circuit){
        const forceStatus = this.getCircuitBreaker(circuit).circuitBreakerForceOpened
        const isOpen = this.getCircuitBreaker(circuit).isOpen();
        return forceStatus ||  isOpen ? 'opened' : 'closed'
    }

    updateOrCreateMetrics(circuit){
        const circuitFactory = this.getCircuitBreaker(circuit)
        const metricsFactory = this.getCircuitMetrics(circuit)
        return this.metrics.updateOrCreateMetrics({ circuit: circuitFactory, metrics:  metricsFactory})
    }
}