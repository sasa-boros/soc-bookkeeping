const { ipcMain } = require('electron')
const { PaymentSlip, DefaultPaymentSlip } = require('./model/paymentSlip')
const { Receipt, DefaultReceipt } = require('./model/receipt')
const annualReport = require('./model/annualReport')

ipcMain.on('get-income-codes', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get income codes')
    console.log(`Found: \n${JSON.stringify(annualReport.INCOME_CODES, null, 2)}`)
    resolve(annualReport.INCOME_CODES)
  })
})

ipcMain.on('get-outcome-codes', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get outcome codes')
    console.log(`Found: \n${JSON.stringify(annualReport.OUTCOME_CODES, null, 2)}`)
    resolve(annualReport.OUTCOME_CODES)
  })
})

ipcMain.on('get-payment-slips', function (event, year) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get payment slips')
    PaymentSlip.find({
      'date':
      {
        '$gte': new Date(year, 0, 1),
        '$lt': new Date(year + 1, 0, 1)
      }
    }).exec().then(function (paymentSlips) {
      console.log(`Found: \n${JSON.stringify(paymentSlips, null, 2)}`)
      resolve(paymentSlips)
    }).catch((err) => {
      console.error(err.message)
      reject(err)
    })
  })
})

ipcMain.on('create-payment-slip', function (event, paymentSlip) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated create payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
    var newPaymentSlip = PaymentSlip(paymentSlip)
    newPaymentSlip.save(async function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await PaymentSlip.reorderByDate(newPaymentSlip.date)
      console.log(`Successfully created payment slip: \n${newPaymentSlip}`)
      resolve(newPaymentSlip)
    })
  })
})

ipcMain.on('delete-payment-slip', function (event, paymentSlipId) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated delete payment slip with: ${paymentSlipId}`)
    PaymentSlip.findOneAndRemove({ _id: paymentSlipId }, async function (err, deletedPaymentSlip) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await PaymentSlip.reorderByDate(deletedPaymentSlip.date)
      console.log('Successfully deleted payment slip')
      resolve()
    })
  })
})

ipcMain.on('update-payment-slip', function (event, paymentSlip) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated update payment slip with: \n${JSON.stringify(paymentSlip, null, 2)}`)
    PaymentSlip.findOneAndUpdate({ _id: paymentSlip._id }, paymentSlip, async function (err, updatedPaymentSlip) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await PaymentSlip.reorderByDate(updatedPaymentSlip.date)
      console.log(`Successfully updated payment slip: \n${updatedPaymentSlip}`)
      resolve(updatedPaymentSlip)
    })
  })
})

ipcMain.on('get-receipts', function (event, year) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get receipts')
    Receipt.find({
      'date':
      {
        '$gte': new Date(year, 0, 1),
        '$lt': new Date(year + 1, 0, 1)
      }
    }).exec().then(function (receipts) {
      console.log(`Found: \n${JSON.stringify(receipts, null, 2)}`)
      resolve(receipts)
    }).catch((err) => {
      console.error(err.message)
      reject(err)
    })
  })
})

ipcMain.on('create-receipt', function (event, receipt) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated create receipt: \n${JSON.stringify(receipt, null, 2)}`)
    var newReceipt = Receipt(receipt)
    newReceipt.save(async function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await Receipt.reorderByDate(newReceipt.date)
      console.log(`Successfully created receipt: \n${newReceipt}`)
      resolve(newReceipt)
    })
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated delete receipt with: ${receiptId}`)
    Receipt.findOneAndRemove({ _id: receiptId }, async function (err, deletedReceipt) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await Receipt.reorderByDate(deletedReceipt.date)
      console.log('Successfully deleted receipt')
      resolve()
    })
  })
})

ipcMain.on('update-receipt', function (event, receipt) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated update receipt with: \n${JSON.stringify(receipt, null, 2)}`)
    Receipt.findOneAndUpdate({ _id: receipt._id }, receipt, async function (err, updatedReceipt) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      await Receipt.reorderByDate(updatedReceipt.date)
      console.log(`Successfully updated receipt: \n${updatedReceipt}`)
      resolve(updatedReceipt)
    })
  })
})

ipcMain.on('get-annual-report', async function (event, year) {
  event.returnValue = new Promise(async function (resolve, reject) {
    console.log('Initiated get annual report')
    const generatedAnnualReport = await annualReport.getAnnualReport(year)
    console.log(`Found: \n${JSON.stringify(generatedAnnualReport, null, 2)}`)
    resolve(generatedAnnualReport)
  })
})

ipcMain.on('get-default-payment-slip', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get default payment slip')
    DefaultPaymentSlip.find({}).exec().then(function (defaultPaymentSlips) {
      console.log(`Found: \n${JSON.stringify(defaultPaymentSlips, null, 2)}`)
      if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
        resolve(defaultPaymentSlips[0])
      } else {
        resolve(null)
      }
    }).catch((err) => {
      console.error(err.message)
      reject(err)
    })
  })
})

ipcMain.on('create-default-payment-slip', function (event, defaultPaymentSlip) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated create default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
    DefaultPaymentSlip.remove({}, function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      var newDefaultPaymentSlip = DefaultPaymentSlip(defaultPaymentSlip)
      newDefaultPaymentSlip.save(function (err) {
        if (err) {
          console.error(err.message)
          reject(err)
        }
        console.log(`Successfully created default payment slip: \n${newDefaultPaymentSlip}`)
        resolve(newDefaultPaymentSlip)
      })
    })
  })
})

ipcMain.on('delete-default-payment-slip', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated delete default payment slip')
    DefaultPaymentSlip.remove({}, function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      console.log('Successfully deleted default payment slip')
      resolve()
    })
  })
})

ipcMain.on('get-default-receipt', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated get default receipt')
    DefaultReceipt.find({}).exec().then(function (defaultReceipts) {
      console.log(`Found: \n${JSON.stringify(defaultReceipts, null, 2)}`)
      if (defaultReceipts && defaultReceipts.length > 0) {
        resolve(defaultReceipts[0])
      } else {
        resolve(null)
      }
    }).catch((err) => {
      console.error(err.message)
      reject(err)
    })
  })
})

ipcMain.on('create-default-receipt', function (event, defaultReceipt) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log(`Initiated create default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
    DefaultReceipt.remove({}, function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      var newDefaultReceipt = DefaultReceipt(defaultReceipt)
      newDefaultReceipt.save(function (err) {
        if (err) {
          console.error(err.message)
          reject(err)
        }
        console.log(`Successfully created default receipt: \n${newDefaultReceipt}`)
        resolve(newDefaultReceipt)
      })
    })
  })
})

ipcMain.on('delete-default-receipt', function (event) {
  event.returnValue = new Promise(function (resolve, reject) {
    console.log('Initiated delete default receipt')
    DefaultReceipt.remove({}, function (err) {
      if (err) {
        console.error(err.message)
        reject(err)
      }
      console.log('Successfully deleted default receipt')
      resolve()
    })
  })
})
