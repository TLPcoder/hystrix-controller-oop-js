'use strict';
const CreateCommands = require('./create-commands')
const hystrix = require('hystrixjs')

module.exports = class CircuitHealth extends CreateCommands{

    circuitHealth(){
        return this.hystrixConfig.map(({name}) => ({
            name,
            circuitStatus: this.getCircuitStatus(name)
        }))
    }

    getCircuitStatus(circuit){
        const forcedStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitBreakerForceOpened ? 'opened' : 'closed';
        const circuitStatus = hystrix.circuitFactory.getOrCreate(hystrix.commandFactory.getOrCreate(circuit)).circuitOpen ? 'opened' : 'closed';
        return forcedStatus === 'opened' || circuitStatus === 'opened' ? 'opened' : 'closed'
    }
}