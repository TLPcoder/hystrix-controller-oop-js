'use strict';
const CreateCommands = require('./create-commands')
const hystrix = require('hystrixjs')

module.exports = class CircuitHealth extends CreateCommands{

    circuitHealth(){
        return this.hystrixConfig.map(({name}) => ({
            name,
            circuitStatus: this.getCircuitStatus(name),
            metrics: this.metrics(name)
        }))
    }

    getCircuitStatus(circuit){
        const forcedStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitBreakerForceOpened ? 'opened' : 'closed';
        const circuitStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitOpen ? 'opened' : 'closed';
        return forcedStatus === 'opened' || circuitStatus === 'opened' ? 'opened' : 'closed'
    }

    metrics(circuit){
        const buckets = hystrix.metricsFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).rollingCount.buckets
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