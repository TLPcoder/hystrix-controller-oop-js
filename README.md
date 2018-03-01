# Hystrix Controller #
This library is an abstraction of hystrixjs to help give developers a simpler solution. 
This document does not go over hystrixjs or how to create commands please find that information here https://www.npmjs.com/package/hystrixjs. As I work on a way to improve the experience for hystrix monitoring I have added a method "hystrixjs" which will return hystrix where the developer can access hystrixSSEStream to create monitoring.

## To create Hystrix Commands ##

```javascipt
    const setConfig = require('hystrix-controller');
    const config = require('../hystrix/hystrix-service-config')();

    setConfig(config).createCommands();
```
## Config ##

Config must be an array of configurations for each hystrix command
example:
```javascipt
    const config = [{
        name: 'command',
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
## hystrix command options: ##

• circuitBreakerSleepWindowInMilliseconds - How long the circuit breaker should stay opened, before allowing a single request to test the health of the service

• errorHandler - Function to validate if the error response from the service is an actual error. If this function returns an error object (default implementation), this request call will be marked as failure, which will influence the error percentage. If it returns null or false, the call will not be marked as failure. An example could be a 404 error, if the customer is not found.

• requestModel - The function that is called when the developer runs the execution method on the hystrix command. Must return a promise.

•timeout: Timeout in milliseconds for request

• circuitBreakerRequestVolumeThreshold - minimum number of requests in a rolling window that needs to be exceeded, before the circuit breaker will bother at all to calculate the health

• circuitBreakerForceOpened - force this circuit breaker to be always opened

• circuitBreakerForceClosed - force this circuit breaker to be always closed

• circuitBreakerErrorThresholdPercentage - error percentage threshold to trip the circuit

• statisticalWindowLength - length of the window to keep track of execution counts metrics (success, failure)

• statisticalWindowNumberOfBuckets - number of buckets within the statistical window

• percentileWindowNumberOfBuckets - number of buckets within the percentile window

• percentileWindowLength - length of the window to keep track of execution times

•requestVolumeRejectionThreshold - maximum number of concurrent requests, which can be executed. Defaults to 0, i.e. no limitation

•fallbackTo - function, which will be executed if the request fails. The function will be called with the error as the 1st argument and an array of the original args as the 2nd argument

## Methods avaliable: ##

**createCommands:** Creates and saves all hystrix commands using the Config passed to HystrixController
 ```javascipt
    const HystrixController = require('hystrix-controller')
    const Config = require('./hystrix-config')

    HystrixController(Config).createCommands()
 ```

**getConfig:** returns the current config
 
 ```javascipt
    const HystrixController = require('hystrix-controller')

    HystrixController().getConfig()
    <!-- returns [{
        name: 'command',
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
    }] -->
 ```

**getServiceCommands:** returns hystrix serviceCommands to be used in the application 

 ```javascipt
    const HystrixController = require('hystrix-controller')

    const { getUser } = HystrixController().getServiceCommands()

    getUser.execute(request)
        .then((user) => {
            return user
        })
 ```

**updateHystrix:** Let the developer update the config and serviceCommands with a new config Array

 ```javascipt
    const HystrixController = require('hystrix-controller')

    const { getUser } = HystrixController().getServiceCommands()

    getUser.execute(request)
        .then((user) => {
            return user
        })
 ```

**circuitHealth:** Will return an Array of all hystrix circuits and their health status. Either open or closed

 ```javascipt
    const HystrixController = require('hystrix-controller')

    const circuitHealth = HystrixController().circuitHealth()
    
    <!-- [ { name: 'getUser', circuitStatus: 'closed' }, { name: 'getFriends', circuitStatus: 'opened' } ] -->
 ```

**getCircuitStatus:** Will return status of passed in circuit "Name" status will be either open or closed

 ```javascipt
    const HystrixController = require('hystrix-controller')

    const circuitHealth = HystrixController().getCircuitStatus('getUser')
    
    <!-- 'closed' -->
 ```

**resetCache:** hystrixjs holds state and this makes it testing tricky. The resetCache method resets the state of the current taste of hystrix. ResetCache also can take one argument a string if the developer wants to clear the state for a specific factory "metrics, circuit, commandFactory". If the method is called with out an argument all three factories state will be reset.

 ```javascipt
    const HystrixController = require('hystrix-controller')

    HystrixController.resetCache()

    <!-- resets state for all factories -->

    HystrixController.resetCache('metrics')

    <!-- resets state for  metricsFactory: -->
 ```


**controller:** Allows developer to open, close, or reset circuit or circuits. 

The controller method takes an Object as an argument with two nodes "services" which needs to be an array with the services the developer wishes to change the circuit status. This will be the name of service from the config the developer is using. "All" is also an option if the developer wishes to effect all circuits. 

The second node "circuitStatus" is the status the developer want to set the service/services circuit to: open, close, reset. Open forces the circuit open, close force the circuit closed, and reset rebuilds the command with the most current config.


 ```javascipt
    const HystrixController = require('hystrix-controller')

    HystrixController().controller({services: ['getUser'], circuitStatus: 'open'})
        
        <!-- 'getUser circuit has been opened' -->
    
    HystrixController().getCircuitStatus('getUser') 

        <!-- 'opened' -->

    HystrixController().controller({services: ['getUser'], circuitStatus: 'reset'})

        <!-- 'closed' -->

    HystrixController().controller({services: ['all'], circuitStatus: 'open'})
        
        <!-- 'getUser, getFriends circuit has been opened' -->

    HystrixController().circuitHealth()

        <!-- [ { name: 'getUser', circuitStatus: 'opened' }, { name: 'getFriends', circuitStatus: 'opened' } ] -->

    HystrixController().controller({services: ['all'], circuitStatus: 'reset'})

        <!-- [ { name: 'getUser', circuitStatus: 'closed' }, { name: 'getFriends', circuitStatus: 'closed' } ] -->
     
 ```