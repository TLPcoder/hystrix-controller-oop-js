'use strict'
const hystrix = require('hystrixjs')

const getCircuitBreaker = (circuit) => (
    hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit))
)

module.exports = getCircuitBreaker