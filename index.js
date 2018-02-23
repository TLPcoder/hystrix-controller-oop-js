'use strict'
const createWrapper = require('./lib/create-wrappers')
const structureHystrixConfig = require('./utils/structure-hystrix-config')
const circuitController = require('./lib/circuit-controller')
const getCircuitBreaker = require('./lib/get-circuit')
const circuitStatus = require('./lib/check-circuit-status')
const resetHystrixCache = require('./lib/reset-cache')
const checkCircuitHealth = require('./lib/circuit-health')
const updateHystrix =  require('./lib/update-hystrix')
const ensureArray = require('ensure-array');

const hystrixController = (config) => {
    let hystrixConfig = ensureArray(config);
    let structuredConfig = structureHystrixConfig(config)
    let serviceCommands = {};
    return {
        getConfig: () => hystrixConfig,
        updateHystrix: (newConfig) => updateHystrix(newConfig, hystrixConfig, structuredConfig, serviceCommands),
        getServiceCommands: () => serviceCommands,
        createWrappers: () => createWrapper(structuredConfig, serviceCommands),
        circuitController: command => circuitController(command, structuredConfig, serviceCommands),
        getCircuitBreaker: circuit => getCircuitBreaker(circuit),
        circuitStatus: circuit => circuitStatus(circuit),
        resetHystrixCache: () => resetHystrixCache(),
        circuitHealth: () => checkCircuitHealth(hystrixConfig)
    }
}

var someFunc = () => {
    var something = 1 + 534 + 435 / 4
    return Promise.resolve(something)
}

var config = [{
    name: 'testing',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing1',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing2',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing3',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}]

const newConfig = [{
    name: 'testing4',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing5',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing6',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}, {
    name: 'testing7',
    requestModel: someFunc,
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    checkServiceHealthTime: 1000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: (err, args) => console.log('fallback function', err)
}]

var hystrix = hystrixController(config)
Promise.resolve(hystrix.createWrappers())
    // .then(() => hystrix.circuitStatus('testing'))
    .then(() => console.log(hystrix.getServiceCommands()))
    .then(() => console.log(hystrix.updateHystrix(newConfig)))
    .then(() => console.log('new stuff bro', hystrix.getServiceCommands()))
    // .then(() => console.log(hystrix.circuitHealth()))
    .catch(err => console.log(err))

module.exports = hystrixController