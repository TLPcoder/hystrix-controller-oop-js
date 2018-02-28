'use strict'
const { commandFactory } = require('hystrixjs')
const Constructor = require('./constructor')

module.exports = class CreateCommands extends Constructor{
    createWrappers(){
        for(let key in this.hystrixConfig){
            this.serviceCommands[this.hystrixConfig[key].name] = commandFactory.getOrCreate(this.hystrixConfig[key].name)
            .circuitBreakerErrorThresholdPercentage(this.hystrixConfig[key].errorThreshold)
            .timeout(this.hystrixConfig[key].timeout)
            .run(this.hystrixConfig[key].requestModel)
            .circuitBreakerRequestVolumeThreshold(this.hystrixConfig[key].requestVolumeThreshold)
            .circuitBreakerSleepWindowInMilliseconds(this.hystrixConfig[key].sleepWindowInMilliseconds)
            .statisticalWindowLength(this.hystrixConfig[key].statisticalWindowLength)
            .percentileWindowLength(this.hystrixConfig[key].percentileWindowLength)
            .percentileWindowNumberOfBuckets(this.hystrixConfig[key].percentileWindowNumberOfBuckets)
            .circuitBreakerForceClosed(this.hystrixConfig[key].forceClosed || undefined)
            .circuitBreakerForceOpened(this.hystrixConfig[key].forceOpened || undefined)
            .statisticalWindowNumberOfBuckets(this.hystrixConfig[key].statisticalWindowNumberOfBuckets)
            .requestVolumeRejectionThreshold(this.hystrixConfig[key].requestVolumeRejectionThreshold || 0)
            .errorHandler(this.hystrixConfig[key].errorHandler)
            .fallbackTo(this.hystrixConfig[key].fallbackTo)
            .build();
        }
    }
    standardCommand(service) {
        this.serviceCommands[service.name] = commandFactory.getOrCreate(service.name)
        .circuitBreakerErrorThresholdPercentage(service.errorThreshold || null)
        .timeout(service.timeout)
        .run(service.requestModel)
        .circuitBreakerRequestVolumeThreshold(service.requestVolumeThreshold)
        .circuitBreakerSleepWindowInMilliseconds(service.sleepWindowInMilliseconds)
        .statisticalWindowLength(service.statisticalWindowLength)
        .percentileWindowLength(service.percentileWindowLength)
        .percentileWindowNumberOfBuckets(service.percentileWindowNumberOfBuckets)
        .circuitBreakerForceClosed(service.forceClosed || undefined)
        .circuitBreakerForceOpened(service.forceOpened || undefined)
        .statisticalWindowNumberOfBuckets(service.statisticalWindowNumberOfBuckets)
        .requestVolumeRejectionThreshold(service.requestVolumeRejectionThreshold || 0)
        .errorHandler(service.errorHandler)
        .fallbackTo(service.fallbackTo)
        .build();
    }
    forceCommand (service, params){
        this.serviceCommands[service.name] = commandFactory.getOrCreate(service.name)
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
}