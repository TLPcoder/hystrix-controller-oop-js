'use strict'
const { commandFactory } = require('hystrixjs')
const Constructor = require('./constructor')

module.exports = class CreateCommands extends Constructor{

    createCommands(){
        for(let key in this.hystrixConfig){
            this.standardCommand(this.hystrixConfig[key])
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