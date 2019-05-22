const { DefaultPaymentSlip } = require('../model/paymentSlip')

function getDefaultPaymentSlip () {
  return new Promise((resolve, reject) => {
    console.log('Getting default payment slip')
    DefaultPaymentSlip
      .find({})
      .exec()
      .then((defaultPaymentSlips) => {
        if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
          console.log(`Returning: \n${JSON.stringify(defaultPaymentSlips[0], null, 2)}`)
          resolve(defaultPaymentSlips[0])
        } else {
          console.log('Returning: null')
          resolve(null)
        }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function createDefaultPaymentSlip (defaultPaymentSlip) {
  return new Promise((resolve, reject) => {
    console.log(`Creating default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
    delete defaultPaymentSlip['_id']
    DefaultPaymentSlip
      .deleteOne({}, (err) => {
        if (err) {
          reject(err)
        }
        var newDefaultPaymentSlip = DefaultPaymentSlip(defaultPaymentSlip)
        newDefaultPaymentSlip
          .save((err, createdDefaultPaymentSlip) => {
            if (err) {
              reject(err)
            }
            console.log(`Returning: \n${createdDefaultPaymentSlip}`)
            resolve(createdDefaultPaymentSlip)
          })
      })
  })
}

function deleteDefaultPaymentSlip () {
  return new Promise((resolve, reject) => {
    console.log('Deleting default payment slip')
    DefaultPaymentSlip
      .deleteOne({}, (err, deletedDefaultPaymentSlip) => {
        if (err) {
          reject(err)
        }
        console.log(`Returning: \n${deletedDefaultPaymentSlip}`)
        resolve(deletedDefaultPaymentSlip)
      })
  })
}

module.exports = {
  getDefaultPaymentSlip: getDefaultPaymentSlip,
  createDefaultPaymentSlip: createDefaultPaymentSlip,
  deleteDefaultPaymentSlip: deleteDefaultPaymentSlip
}
