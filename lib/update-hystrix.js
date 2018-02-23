'use strict'
const structureHystrixConfig = require('../utils/structure-hystrix-config')
const createWrappers = require('./create-wrappers')
const resetCache = require('./reset-cache')

const updateHystrix = (newConfig, hystrixConfig, structuredConfig, serviceCommands) => {
    resetCache()
    hystrixConfig = newConfig
    structuredConfig = structureHystrixConfig(newConfig)
    clearCommands(serviceCommands)
    createWrappers(structuredConfig, serviceCommands)
}

const clearCommands = (serviceCommands) => {
    for(let key in serviceCommands){
        delete serviceCommands[key]
    }
}
module.exports = updateHystrix