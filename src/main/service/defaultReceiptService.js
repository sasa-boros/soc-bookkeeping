const { DefaultReceipt } = require('../model/receipt')

function getDefaultReceipt () {
  return new Promise((resolve, reject) => {
    console.log('Getting default receipt')
    DefaultReceipt
      .find({})
      .exec()
      .then((defaultReceipts) => {
        if (defaultReceipts && defaultReceipts.length > 0) {
          console.log(`Returning: \n${JSON.stringify(defaultReceipts[0], null, 2)}`)
          resolve(defaultReceipts[0])
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

function createDefaultReceipt (defaultReceipt) {
  return new Promise((resolve, reject) => {
    console.log(`Creating default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
    delete defaultReceipt['_id']
    DefaultReceipt
      .deleteOne({}, (err) => {
        if (err) {
          reject(err)
        }
        var newDefaultReceipt = DefaultReceipt(defaultReceipt)
        newDefaultReceipt
          .save((err, createdDefaultReceipt) => {
            if (err) {
              reject(err)
            }
            console.log(`Returning: \n${createdDefaultReceipt}`)
            resolve(createdDefaultReceipt)
          })
      })
  })
}

function deleteDefaultReceipt () {
  return new Promise((resolve, reject) => {
    console.log('Deleting default receipt')
    DefaultReceipt
      .deleteOne({}, (err, deletedDefaultReceipt) => {
        if (err) {
          reject(err)
        }
        console.log(`Returning: \n${deletedDefaultReceipt}`)
        resolve(deletedDefaultReceipt)
      })
  })
}

module.exports = {
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt,
  deleteDefaultReceipt: deleteDefaultReceipt
}
