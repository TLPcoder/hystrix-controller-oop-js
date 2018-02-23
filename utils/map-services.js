'use strict'

const mapServicesToArr = (services) => {
    var arr = []
    for(var key in services){
      arr.push(services[key].name)
    }
    return arr
  }

module.exports = mapServicesToArr