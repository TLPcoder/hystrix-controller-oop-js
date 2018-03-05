const ensureArray = require('ensure-array')
const hystrixjs = require('hystrixjs')

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
        this.createCommands()
    }
    
    addCommand(command){
        if(Array.isArray(command)){
            command = command[0]
        }
        this.hystrixConfig.push(command)
        this.structuredConfig[command.name] = command
        this.standardCommand(command)
    }

    getConfig(){
        return this.hystrixConfig
    }

    getServiceCommands(){
        return this.serviceCommands
    }

    hystrixjs(){
        return hystrixjs
    }
}
