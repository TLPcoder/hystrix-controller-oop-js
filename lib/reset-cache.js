'use strict'
const { commandFactory, circuitFactory, metricsFactory } = require('hystrixjs')

const resetHystrixCache = () => {
    metricsFactory.resetCache()
    circuitFactory.resetCache()
    commandFactory.resetCache()
}

module.exports = resetHystrixCache