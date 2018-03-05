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
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing1',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing1'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing2',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing2'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing3',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing3'}
        return Promise.reject(error) 
    }
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
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing4'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing5',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing5'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing6',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing6'}
        return Promise.reject(error) 
    }
}, {
    name: 'testing7',
    requestModel: (arg) => Promise.resolve(arg),
    errorThreshold: 10,
    timeout: 10000,
    requestVolumeThreshold: 10,
    sleepWindowInMilliseconds: 1000,
    statisticalWindowLength: 10000,
    statisticalWindowNumberOfBuckets: 10000,
    errorHandler: (err) => err,
    fallbackTo: function(err, args){
        let error = new Error()
        error.debug = {error: err.message, service: 'testing7'}
        return Promise.reject(error) 
    }
}]