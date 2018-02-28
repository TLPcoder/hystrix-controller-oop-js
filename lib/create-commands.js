'use strict'
const { commandFactory } = require('hystrixjs')
const Constructor = require('./constructor')

module.exports = class CreateCommands extends Constructor{

    createWrappers(){
        for(let key in this.hystrixConfig){
            this.serviceCommands[this.hystrixConfig[key].name] = commandFactory.getOrCreate(this.hystrixConfig[key].name)
            .circuitBreakerErrorThresholdPercentage(this.hystrixConfig[key].errorThreshold || 50)
            .timeout(this.hystrixConfig[key].timeout || 30000)
            .run(this.hystrixConfig[key].requestModel)
            .circuitBreakerRequestVolumeThreshold(this.hystrixConfig[key].requestVolumeThreshold || 10)
            .circuitBreakerSleepWindowInMilliseconds(this.hystrixConfig[key].sleepWindowInMilliseconds || 3000)
            .statisticalWindowLength(this.hystrixConfig[key].statisticalWindowLength || 10000)
            .percentileWindowLength(this.hystrixConfig[key].percentileWindowLength || 10000)
            .percentileWindowNumberOfBuckets(this.hystrixConfig[key].percentileWindowNumberOfBuckets || 10)
            .statisticalWindowNumberOfBuckets(this.hystrixConfig[key].statisticalWindowNumberOfBuckets || 10)
            .requestVolumeRejectionThreshold(this.hystrixConfig[key].requestVolumeRejectionThreshold || 0)
            .circuitBreakerForceClosed(this.hystrixConfig[key].forceClosed || false)
            .circuitBreakerForceOpened(this.hystrixConfig[key].forceOpened || false)
            .errorHandler(this.hystrixConfig[key].errorHandler)
            .fallbackTo(this.hystrixConfig[key].fallbackTo)
            .build();
        }
    }

    standardCommand(service) {
        this.serviceCommands[service.name] = commandFactory.getOrCreate(service.name)
        .circuitBreakerErrorThresholdPercentage(service.errorThreshold || 50)
        .timeout(service.timeout || 30000)
        .run(service.requestModel)
        .circuitBreakerRequestVolumeThreshold(service.requestVolumeThreshold || 10)
        .circuitBreakerSleepWindowInMilliseconds(service.sleepWindowInMilliseconds || 3000)
        .statisticalWindowLength(service.statisticalWindowLength || 10000)
        .percentileWindowLength(service.percentileWindowLength || 10000)
        .percentileWindowNumberOfBuckets(service.percentileWindowNumberOfBuckets || 10)
        .statisticalWindowNumberOfBuckets(service.statisticalWindowNumberOfBuckets || 10)
        .requestVolumeRejectionThreshold(service.requestVolumeRejectionThreshold || 0)
        .circuitBreakerForceClosed(service.forceClosed || false)
        .circuitBreakerForceOpened(service.forceOpened || false)
        .errorHandler(service.errorHandler)
        .fallbackTo(service.fallbackTo)
        .build();
    }

    forceCommand (service, params){
        this.serviceCommands[service.name] = commandFactory.getOrCreate(service.name)
        .circuitBreakerErrorThresholdPercentage(service.errorThreshold || 50)
        .timeout(service.timeout || 30000)
        .run(service.requestModel)
        .circuitBreakerRequestVolumeThreshold(service.requestVolumeThreshold || 10)
        .circuitBreakerSleepWindowInMilliseconds(service.sleepWindowInMilliseconds || 3000)
        .statisticalWindowLength(service.statisticalWindowLength || 10000)
        .percentileWindowLength(service.percentileWindowLength || 10000)
        .percentileWindowNumberOfBuckets(service.percentileWindowNumberOfBuckets || 10)
        .statisticalWindowNumberOfBuckets(service.statisticalWindowNumberOfBuckets || 10)
        .requestVolumeRejectionThreshold(service.requestVolumeRejectionThreshold || 0)
        .circuitBreakerForceClosed(params.close)
        .circuitBreakerForceOpened(params.open)
        .errorHandler(service.errorHandler)
        .fallbackTo(service.fallbackTo)
        .build()
    };
}