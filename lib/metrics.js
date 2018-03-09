

module.exports = class Metrics {

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
