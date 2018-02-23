'use strict'
const { commandFactory } = require('hystrixjs')

const forceCommand = (serviceCommands, service, params) => {
    serviceCommands[service.name] = commandFactory.getOrCreate(service.name)
    .circuitBreakerErrorThresholdPercentage(service.errorThreshold || null)
    .timeout(service.timeout)
    .run(service.requestModel)
    .circuitBreakerRequestVolumeThreshold(service.requestVolumeThreshold)
    .circuitBreakerSleepWindowInMilliseconds(service.sleepWindowInMilliseconds)
    .statisticalWindowLength(service.statisticalWindowLength)
    .percentileWindowLength(service.percentileWindowLength)
    .percentileWindowNumberOfBuckets(service.percentileWindowNumberOfBuckets)
    .circuitBreakerForceClosed(params.close)
    .circuitBreakerForceOpened(params.open)
    .statisticalWindowNumberOfBuckets(service.statisticalWindowNumberOfBuckets)
    .requestVolumeRejectionThreshold(service.requestVolumeRejectionThreshold || 0)
    .errorHandler(service.errorHandler)
    .fallbackTo(service.fallbackTo)
    .build()
  };

  module.exports = forceCommand