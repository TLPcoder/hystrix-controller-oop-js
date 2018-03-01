Hystrix Controller is a abstraction of hystrixjs to help developers a simpler Hystrix application
These documents do not go over hystrixjs or how to create commands please find that information here https://www.npmjs.com/package/hystrixjs

To create hystrix wrappers

```javascipt
    const setConfig = require('hystrix-controller');
    const config = require('../hystrix/hystrix-service-config')();

    setConfig(config).createWrappers();
```

Methods avaliable:

createWrappers: Creates and saves all your hystrix wrappers using the Config passed to HystrixController 

getConfig: returns the current config

getServiceCommands: returns hystrix serviceCommands to be used in your application

updateHystrix: Let the developer update the config and serviceCommands with a new config Array

circuitHealth: Will return an Array of all your hystrix circuits and their health status. Either open or closed

getCircuitStatus: Will return status of passed in circuit "Name" status will be either open or closed

controller: Allows developer to open, close, or reset circuits or a circuit.