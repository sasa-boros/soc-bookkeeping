const { Receipt } = require('../model/receipt')

function getReceipts (year) {
  return new Promise((resolve, reject) => {
    console.log(`Getting receipts for year ${year}`)
    Receipt
      .find({
        'date':
        {
          '$gte': new Date(year, 0, 1),
          '$lt': new Date(year + 1, 0, 1)
        }
      })
      .exec()
      .then((receipts) => {
        console.log(`Returning: \n${JSON.stringify(receipts, null, 2)}`)
        resolve(receipts)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function createReceipt (receipt) {
  return new Promise((resolve, reject) => {
    console.log(`Creating receipt: \n${JSON.stringify(receipt, null, 2)}`)
    delete receipt['_id']
    var newReceipt = Receipt(receipt)
    newReceipt
      .save((err, createdReceipt) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${createdReceipt}`)
            resolve(createdReceipt)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

function deleteReceipt (receiptId) {
  return new Promise((resolve, reject) => {
    console.log(`Deleting receipt by id ${receiptId}`)
    Receipt
      .findByIdAndRemove(receiptId, (err, deletedReceipt) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${deletedReceipt}`)
            resolve(deletedReceipt)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

function updateReceipt (receipt) {
  return new Promise((resolve, reject) => {
    console.log(`Updating receipt by: \n${JSON.stringify(receipt, null, 2)}`)
    Receipt
      .findByIdAndUpdate(receipt._id, receipt, (err, updatedReceipt) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${updatedReceipt}`)
            resolve(updatedReceipt)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

function assignAnnualReportValues () {
  return new Promise((resolve, reject) => {
    Receipt
      .find({})
      .sort({ 'date': 1 })
      .exec()
      .then((receipts) => {
        for (let i = 0; i < receipts.length; i++) {
          const receipt = receipts[i]
          receipt.ordinal = i + 1
          receipt.annualReportPage = receipt.date.getMonth() + 1
          Receipt.findByIdAndUpdate(receipt._id, receipt, (err) => {
            if (err) {
              reject(err)
            }
          })
        }
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = {
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  deleteReceipt: deleteReceipt,
  updateReceipt: updateReceipt
}
