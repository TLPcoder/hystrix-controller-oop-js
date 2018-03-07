'use strict';
const CreateCommands = require('./create-commands')
const ensureArray = require('ensure-array')
const { circuitFactory, commandFactory, metricsFactory} = require('hystrixjs')

module.exports = class CircuitHealth extends CreateCommands{

    circuitHealth(circuit){
        let circuits = circuit ? ensureArray(this.structuredConfig[circuit]) : this.hystrixConfig
        return circuits.map(({name}) => ({
            name,
            circuitStatus: this.getCircuitStatus(name),
            metrics: this.metrics(name)
        }))
    }

    getCircuitStatus(circuit){
        return circuitFactory.getOrCreate(commandFactory.getOrCreate(circuit)).isOpen() ? 'opened' : 'closed'
    }

    metrics(circuit){
        const buckets = this.getCircuitMetrics(circuit).rollingCount.buckets
        return this.getHealthCounts(buckets)
    }

    getHealthCounts(buckets) {
        const {success, error, timeout, shortCircuited} = this.getRollingSum(buckets);
        
        let totalCount = success + error + timeout + shortCircuited
        let errorCount = error + timeout + shortCircuited
        let errorPercentage = 0

        if (totalCount > 0) {
            errorPercentage = errorCount / totalCount * 100;
        }

        const metrics = {
            totalCount,
            successCount: success,
            errorCount,
            errorPercentage: parseInt(errorPercentage)
        }

        return metrics
    }

    getRollingSum(buckets){
        return buckets.reduce((metrics, {bucketValues}) => {
            metrics.success += bucketValues.SUCCESS || 0
            metrics.error += bucketValues.FAILURE || 0
            metrics.timeout += bucketValues.TIMEOUT || 0
            metrics.shortCircuited += bucketValues.SHORT_CIRCUITED || 0
            return metrics
        }, {success: 0, error: 0, timeout: 0, shortCircuited: 0})
    }
}