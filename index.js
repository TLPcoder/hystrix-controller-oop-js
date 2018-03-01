'use strict'
const CircuitController = require('./lib/circuit-controller')

class HystrixController extends CircuitController{
    constructor(config){
        super(config)
    }
}

module.exports = (config) => {
    if (module.exports.instance) {
        return module.exports.instance;
    } else {
        module.exports.instance = new HystrixController(config)
        return module.exports.instance
    }
}