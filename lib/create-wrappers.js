'use strict'
const { commandFactory } = require('hystrixjs')
var count = 0

const createWrappers = (hystrixConfig, serviceCommands) => {
    for(let key in hystrixConfig){
        serviceCommands[hystrixConfig[key].name] = commandFactory.getOrCreate(hystrixConfig[key].name)
        .circuitBreakerErrorThresholdPercentage(hystrixConfig[key].errorThreshold)
        .timeout(hystrixConfig[key].timeout)
        .run(hystrixConfig[key].requestModel)
        .circuitBreakerRequestVolumeThreshold(hystrixConfig[key].requestVolumeThreshold)
        .circuitBreakerSleepWindowInMilliseconds(hystrixConfig[key].sleepWindowInMilliseconds)
        .statisticalWindowLength(hystrixConfig[key].statisticalWindowLength)
        .percentileWindowLength(hystrixConfig[key].percentileWindowLength)
        .percentileWindowNumberOfBuckets(hystrixConfig[key].percentileWindowNumberOfBuckets)
        .circuitBreakerForceClosed(hystrixConfig[key].forceClosed || undefined)
        .circuitBreakerForceOpened(hystrixConfig[key].forceOpened || undefined)
        .statisticalWindowNumberOfBuckets(hystrixConfig[key].statisticalWindowNumberOfBuckets)
        .requestVolumeRejectionThreshold(hystrixConfig[key].requestVolumeRejectionThreshold || 0)
        .errorHandler(hystrixConfig[key].errorHandler)
        .fallbackTo(hystrixConfig[key].fallbackTo)
        .build();
    }
}

module.exports = createWrappers