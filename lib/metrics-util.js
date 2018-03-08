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
    
    requestRate(trafficVolume, windowLength){
        if (trafficVolume) {
            const requestInWindowLength = trafficVolume.reduce((total, {count}) => total + count, 0)
            const timeBetweenFirstLast = (trafficVolume[trafficVolume.length - 1].date - trafficVolume[0].date) / 1000
            return requestInWindowLength / timeBetweenFirstLast
        } else {
            return 0
        }
    }
}