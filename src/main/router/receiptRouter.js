const {ipcMain} = require('electron')
const Receipt = require('../model/receipt')

ipcMain.on('get-receipts', (event, year) => {
  console.log('Initiated get receipts')
  Receipt.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then((receipts) => {
    console.log(`Found: \n${JSON.stringify(receipts, null, 2)}`)
    reply(event, 'get-receipts-reply', receipts, null)
  }).catch((err) => {
    console.error(err.message)
    reply(event, 'get-receipts-reply', null, err.message)
  })
})

ipcMain.on('create-receipt', (event, receipt) => {
  console.log(`Initiated create receipt: \n${JSON.stringify(receipt, null, 2)}`)
  delete receipt['_id']
  var newReceipt = Receipt(receipt)
  newReceipt.save((err, createdReceipt) => {
    if (err) {
      console.error(err.message)
      reply(event, 'create-receipt-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log(`Successfully created receipt: \n${createdReceipt}`)
      reply(event, 'create-receipt-reply', createdReceipt, null)
    })
  })
})

ipcMain.on('delete-receipt', (event, receiptId) => {
  console.log(`Initiated delete receipt with: ${receiptId}`)
  Receipt.findByIdAndRemove(receiptId, (err, deletedReceipt) => {
    if (err) {
      console.error(err.message)
      reply(event, 'delete-receipt-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log('Successfully deleted receipt')
      reply(event, 'delete-receipt-reply', deletedReceipt, null)
    })
  })
})

ipcMain.on('update-receipt', (event, receipt) => {
  console.log(`Initiated update receipt with: \n${JSON.stringify(receipt, null, 2)}`)
  Receipt.findByIdAndUpdate({_id: receipt._id}, receipt, (err, updatedReceipt) => {
    if (err) {
      console.error(err.message)
      reply(event, 'update-receipt-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log(`Successfully updated receipt: \n${updatedReceipt}`)
      reply(event, 'update-receipt-reply', updatedReceipt, null)
    })
  })
})

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
              console.error(err.message)
              reject(err)
            }
          })
        }
        resolve()
      })
      .catch((err) => {
        console.error(err.message)
        reject(err)
      })
  })
}

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
