var exports = module.exports = {};

 

exports.config = [{
    name: 'testing',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing'} }
}, {
    name: 'testing1',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing1'} }
}, {
    name: 'testing2',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing2'} }
}, {
    name: 'testing3',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing3'} }
}]

exports.newConfig = [{
    name: 'testing4',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing4'} }
}, {
    name: 'testing5',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing5'} }
}, {
    name: 'testing6',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing6'} }
}, {
    name: 'testing7',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: () => console.log('error handler'),
    fallbackTo: function(err, args){return {error: err.message, service: 'testing7'} }
}]