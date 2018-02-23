'use strict';
const getCircuitStatus = require('./check-circuit-status')

const circuitHealth = (hystrixConfig) => (
    hystrixConfig.map(({name}) => ({
        name,
        circuitStatus: getCircuitStatus(name)
    }
)))

module.exports = circuitHealth