# Hystrix Controller #
This library an abstraction of hystrixjs to help give developers a simpler solution.
This document does not go over hystrixjs or how to create commands please find that information here https://www.npmjs.com/package/hystrixjs

## To create hystrix wrappers ##

```javascipt
    const setConfig = require('hystrix-controller');
    const config = require('../hystrix/hystrix-service-config')();

    setConfig(config).createWrappers();
```
## Config ##

Config must be an array of configurations for each hystrix wrapper
example:
```javascipt
    const config = [{
        name: 'wapper',
        requestModel: requestFunc,
        errorThreshold: 10,
        timeout: 10000,
        requestVolumeThreshold: 10,
        sleepWindowInMilliseconds: 1000,
        statisticalWindowLength: 10000,
        statisticalWindowNumberOfBuckets: 10000,
        checkServiceHealthTime: 1000,
        errorHandler: errorHandlerFunc,
        fallbackTo: hystrixFallbackFunc
    }]
```
## hystrix wrapper options: ##

•circuitBreakerSleepWindowInMilliseconds - how long the circuit breaker should stay opened, before allowing a single request to test the health of the service

•errorHandler - function to validate if the error response from the service is an actual error. If this function returns an error object (default implementation), this request call will be marked as failure, which will influence the error percentage. If it returns null or false, the call will not be marked as failure. An example could be a 404 error, if the customer is not found.

•requestModel - The function that is called when you run the execution method on the hystrix command. Must return a promise.
timeout for request

•circuitBreakerRequestVolumeThreshold - minimum number of requests in a rolling window that needs to be exceeded, before the circuit breaker will bother at all to calculate the health

•circuitBreakerForceOpened - force this circuit breaker to be always opened

•circuitBreakerForceClosed - force this circuit breaker to be always closed

•circuitBreakerErrorThresholdPercentage - error percentage threshold to trip the circuit

•statisticalWindowLength - length of the window to keep track of execution counts metrics (success, failure)

•statisticalWindowNumberOfBuckets - number of buckets within the statistical window

•percentileWindowNumberOfBuckets - number of buckets within the percentile window

•percentileWindowLength - length of the window to keep track of execution times

•requestVolumeRejectionThreshold - maximum number of concurrent requests, which can be executed. Defaults to 0, i.e. no limitation

•fallbackTo - function, which will be executed if the request fails. The function will be called with the error as the 1st argument and an array of the original args as the 2nd argument

## Methods avaliable: ##

createWrappers: Creates and saves all your hystrix wrappers using the Config passed to HystrixController 

getConfig: returns the current config

getServiceCommands: returns hystrix serviceCommands to be used in your application

updateHystrix: Let the developer update the config and serviceCommands with a new config Array

circuitHealth: Will return an Array of all your hystrix circuits and their health status. Either open or closed

getCircuitStatus: Will return status of passed in circuit "Name" status will be either open or closed

controller: Allows developer to open, close, or reset circuits or a circuit.