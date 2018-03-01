const HystrixController = require('../index')

var someFunc = () => {
    var something = 1 + 534 + 435 / 4
    return Promise.resolve(something)
}

var config = [{
    name: 'testing',
    requestModel: someFunc,
    // errorThreshold: 10,
    // timeout: 10000,
    // requestVolumeThreshold: 10,
    // sleepWindowInMilliseconds: 1000,
    // statisticalWindowLength: 10000,
    // statisticalWindowNumberOfBuckets: 10000,
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

const hystrixTesting = HystrixController(config)
hystrixTesting.createCommands()
console.log(hystrixTesting.controller({services: ['testing1', 'testing2'], circuitStatus: 'open'}))
console.log(hystrixTesting.circuitHealth())