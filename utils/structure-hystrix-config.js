'use strict'
const ensureArray = require('ensure-array');

const structureHystricConfig = (config) => {
    return ensureArray(config).reduce((obj, cv) => {
        obj[cv.name] = cv
        return obj
    }, {})
}

module.exports = structureHystricConfig