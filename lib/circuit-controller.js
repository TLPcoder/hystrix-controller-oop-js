'use strict'
const resetCache = require('./reset-cache')
const ensureArray = require('ensure-array')
const resetCircuits = require('./create-wrappers')
const actions = require('../utils/circuit-actions')
const createCommand = require('../utils/create-command')
const resolveParams = require('../utils/resolve-params')
const mapServicesToArr = require('../utils/map-services')
const { commandFactory, circuitFactory, metricsFactory } = require('hystrixjs')

module.exports = ({ services, circuitStatus }, structuredConfig, serviceCommands) => {
  services = ensureArray(services)
  if (services[0] === 'all' && (circuitStatus === 'open' || circuitStatus === 'close')) {
    services = mapServicesToArr(structuredConfig);
  }
  if (services[0] === 'all' && circuitStatus === 'reset') {
    return Promise.resolve(resetCache())
      .then(() => resetCircuits(structuredConfig, serviceCommands))
      .then(() => {HystrixCircuit: 'The hystrix setting\'s have been reset'})
      .catch(err => {throw err})
  }
  return Promise.resolve(resetCache())
    .then(() => resolveParams({ services, circuitStatus }))
    .then(params => createCommand(structuredConfig, serviceCommands, params, services))
    .then(() => {HystrixCircuit: `${services.join(', ')} circuit has been ${actions[circuitStatus]}`})
    .catch(err => {throw err})
}