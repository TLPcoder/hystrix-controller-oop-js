const ensureArray = require('ensure-array')

module.exports = class Constructor{

    constructor(config){
        this.hystrixConfig = ensureArray(config)
        this.structuredConfig = this.structureHystrixConfig(config)
        this.serviceCommands = {}
    }

    structureHystrixConfig(){
        return this.hystrixConfig.reduce((obj, cv) => {
            obj[cv.name] = cv
            return obj
        }, {})
    }

    updateHystrix(newConfig){
        this.resetCache()
        this.hystrixConfig = ensureArray(newConfig)
        this.structuredConfig = this.structureHystrixConfig(newConfig)
        this.serviceCommands = {}
    }

    getConig(){
        return this.hystrixConfig
    }

    getServiceCommands(){
        return this.serviceCommands
    }
}
