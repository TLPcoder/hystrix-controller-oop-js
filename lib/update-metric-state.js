'use strict'
module.exports = class UpdateMetricState{
    trafficVolume(json, requestRate, percentileCount){
        if ( json.trafficVolume ) {
            json.trafficVolume.push({count: requestRate, date: Date.now()})
            for(let i = 0; i < json.trafficVolume.length; i++){
                if(json.trafficVolume[i].date + percentileCount.windowLength > Date.now()){
                    break
                } else {
                    json.trafficVolume.splice(i, 1)
                }
            }
        } else {
            json.trafficVolume = [{count: requestRate, date: Date.now()}]
        }
    }
}