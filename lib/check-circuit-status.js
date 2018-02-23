'use strict'
const hystrix = require('hystrixjs')

const circuitStatus = (circuit) => {
    const forcedStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitBreakerForceOpened ? 'opened' : 'closed';
    const circuitStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitOpen ? 'opened' : 'closed';
    return forcedStatus === 'opened' || circuitStatus === 'opened' ? 'opened' : 'closed'
}

module.exports = circuitStatus