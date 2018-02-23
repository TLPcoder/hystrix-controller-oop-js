'use strict'

const resolveParams = ({circuitStatus, services}) => (
    new Promise((resolve, reject) => {
      switch (circuitStatus.toLowerCase()) {
        case 'open':
          return resolve({open: true, close: undefined, services})
        case 'close':
          return resolve({open: undefined, close: true, services})
        case 'reset':
          return resolve({open: undefined, close: undefined, services})
        default:
          return reject({error: 'incorrect request'})
      }
    })
  )

module.exports = resolveParams;