const MetricsUtil = require('./metrics-util')

module.exports = class Metrics {
    constructor(str){
        this.metricsState = {}
        this.metricsUtil = new MetricsUtil()
    }

    getCircuitMetric(circuit){
        return this.metricsState[circuit]
    }
    
    updateOrCreateMetrics({circuit, metrics}){
        this.metrics({ 
            circuit,
            metrics,
            circuitMetrics: this.metricsState[circuit.commandKey]})
    }

    clearMetrics(){
        this.metricsState = {}
    }

    getMetricsState(){
        return this.metricsState
    }

    metrics({ circuit, metrics, circuitMetrics, run }){
        let json = circuitMetrics ? circuitMetrics : {}
        let { percentileCount, rollingCount } = metrics

        json.type = "HystrixCommand"
        json.name = circuit.commandKey
        json.group = circuit.commandGroup
        json.currentTime = new Date()
        json.isCircuitBreakerOpen = circuit.isOpen() || circuit.circuitBreakerForceOpened ? true : false
        json.count = json.count ? json.count += 1 : 1

        let {totalCount, errorCount, errorPercentage} = this.getCommandMetrics(rollingCount.buckets)
        let { success, timeout, shortCircuited, failure, rejected, fallbackSuccess, fallbackFailure } = this.getRollingSum(rollingCount.buckets)

        json.errorPercentage = errorPercentage
        json.errorCount = errorCount
        json.previousCount = json.requestCount || 0
        json.requestCount = totalCount
        json.rollingCountFailure = failure
        json.rollingCountTimeout = timeout
        json.rollingCountSuccess = success
        json.rollingCountShortCircuited = shortCircuited
        json.rollingCountBadRequests = json.rollingCountFailure
        json.rollingCountFallbackFailure = fallbackFailure
        json.rollingCountFallbackSuccess = fallbackSuccess

        this.metricsUtil.trafficVolume(json, (totalCount - json.previousCount), percentileCount)

        json.requestRateSecond = this.metricsUtil.requestRate(json.trafficVolume, percentileCount.windowLength)

        let { percentileSnapshot } = percentileCount

        json.latencyExecute_mean = percentileSnapshot.mean
        json.latencyExecute = json.latencyExecute ? json.latencyExecute : {}
        json.latencyExecute["0"] = percentileSnapshot.p0
        json.latencyExecute["25"] = percentileSnapshot.p25
        json.latencyExecute["50"] = percentileSnapshot.p50
        json.latencyExecute["75"] = percentileSnapshot.p75
        json.latencyExecute["90"] = percentileSnapshot.p90
        json.latencyExecute["95"] = percentileSnapshot.p95
        json.latencyExecute["99"] = percentileSnapshot.p99
        json.latencyExecute["99.5"] = percentileSnapshot.p995
        json.latencyExecute["100"] = percentileSnapshot.p100

        json.propertyValue_circuitBreakerRequestVolumeThreshold = circuit.circuitBreakerRequestVolumeThreshold
        json.propertyValue_circuitBreakerSleepWindowInMilliseconds = circuit.circuitBreakerSleepWindowInMilliseconds
        json.propertyValue_circuitBreakerErrorThresholdPercentage = circuit.circuitBreakerErrorThresholdPercentage
        json.propertyValue_circuitBreakerForceOpen = false
        json.propertyValue_circuitBreakerForceClosed = false
        json.propertyValue_circuitBreakerEnabled = true
        json.propertyValue_metricsRollingStatisticalWindowInMilliseconds = metrics.metricsRollingStatisticalWindowInMilliseconds

        this.metricsState[circuit.commandKey] = json
    }

    getCommandMetrics(buckets) {
        const {success, error, timeout, shortCircuited} = this.getRollingSum(buckets)
        
        let totalCount = success + error + timeout + shortCircuited
        let errorCount = error + timeout + shortCircuited
        let errorPercentage = 0

        if (totalCount > 0) {
            errorPercentage = errorCount / totalCount * 100
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
            metrics.failure += bucketValues.FAILURE || 0
            metrics.rejected += bucketValues.REJECTED || 0
            metrics.fallbackSuccess += bucketValues.FALLBACK_SUCCESS || 0
            metrics.fallbackFailure += bucketValues.FALLBACK_FAILURE || 0

            return metrics
        }, {
            success: 0,
            error: 0,
            timeout: 0,
            shortCircuited: 0,
            failure: 0,
            rejected: 0,
            fallbackSuccess: 0,
            fallbackFailure: 0
        })
    }
}
