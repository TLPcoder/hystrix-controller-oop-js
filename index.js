'use strict'
const CircuitController = require('./lib/circuit-controller')

module.exports = class HystrixController extends CircuitController{
    constructor(config){
        super(config)
    }
}
