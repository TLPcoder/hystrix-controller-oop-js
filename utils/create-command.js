'use strict'
const forceCommand = require('../utils/force-command')
const standardCommand = require('../utils/standard-command')

const createCommand = (hystrixConfig, serviceCommands, params, services) => {
    for (let key in hystrixConfig) {
      if (services.indexOf(hystrixConfig[key].name) !== -1) {
        forceCommand(serviceCommands, hystrixConfig[key], params)
      } else if (serviceCommands[hystrixConfig[key].name].circuitConfig.circuitBreakerForceOpened) {
        forceCommand(serviceCommands, hystrixConfig[key], {open: true, close: undefined})
      } else {
        standardCommand(serviceCommands, hystrixConfig[key])
      }
    }
  }

module.exports = createCommand