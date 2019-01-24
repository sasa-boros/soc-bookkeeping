const {ipcMain} = require('electron')
const PaymentSlip = require('./model/paymentSlip')
const Receipt = require('./model/receipt')
const {INCOME_CODES, OUTCOME_CODES} = require('./model/annualReport')

ipcMain.on('get-income-codes', function (event) {
  console.log('Initiated get income codes')
  console.log(`Found: \n${INCOME_CODES}`)
  event.returnValue = INCOME_CODES
})

ipcMain.on('get-outcome-codes', function (event) {
  console.log('Initiated get outcome codes')
  console.log(`Found: \n${OUTCOME_CODES}`)
  event.returnValue = OUTCOME_CODES
})

ipcMain.on('get-payment-slips', function (event, year) {
  console.log('Initiated get payment slips')
  PaymentSlip.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then(function (paymentSlips) {
    event.returnValue = paymentSlips
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
})

ipcMain.on('create-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated create payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  var newPaymentSlip = PaymentSlip(paymentSlip)
  newPaymentSlip.save(function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
    PaymentSlip.reorderByDate(newPaymentSlip.date)
    console.log(`Successfully created payment slip: \n${newPaymentSlip}`)
    event.returnValue = true
  })
})

ipcMain.on('delete-payment-slip', function (event, paymentSlipId) {
  console.log(`Initiated delete payment slip with: ${paymentSlipId}`)
  PaymentSlip.findOneAndRemove({_id: paymentSlipId}, function (err, deletedPaymentSlip) {
    if (err) {
      console.error(err.message)
      throw err
    }
    PaymentSlip.reorderByDate(deletedPaymentSlip.date)
    console.log('Successfully deleted payment slip')
    event.returnValue = true
  })
})

ipcMain.on('update-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated update payment slip with: \n${JSON.stringify(paymentSlip, null, 2)}`)
  PaymentSlip.findOneAndUpdate({_id: paymentSlip._id}, paymentSlip, function (err, updatedPaymentSlip) {
    if (err) {
      console.error(err.message)
      throw err
    }
    PaymentSlip.reorderByDate(updatedPaymentSlip.date)
    console.log(`Successfully updated payment slip: \n${updatedPaymentSlip}`)
    event.returnValue = true
  })
})

ipcMain.on('get-receipts', function (event, year) {
  console.log('Initiated get receipts')
  Receipt.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then(function (receipts) {
    event.returnValue = receipts
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
})

ipcMain.on('create-receipt', function (event, receipt) {
  console.log(`Initiated create receipt: \n${JSON.stringify(receipt, null, 2)}`)
  var newReceipt = Receipt(receipt)
  newReceipt.save(function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
    Receipt.reorderByDate(newReceipt.date)
    console.log(`Successfully created receipt: \n${newReceipt}`)
    event.returnValue = true
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  console.log(`Initiated delete receipt with: ${receiptId}`)
  Receipt.findOneAndRemove({_id: receiptId}, function (err, deletedReceipt) {
    if (err) {
      console.error(err.message)
      throw err
    }
    Receipt.reorderByDate(deletedReceipt.date)
    console.log('Successfully deleted receipt')
    event.returnValue = true
  })
})

ipcMain.on('update-receipt', function (event, receipt) {
  console.log(`Initiated update receipt with: \n${JSON.stringify(receipt, null, 2)}`)
  Receipt.findOneAndUpdate({_id: receipt._id}, receipt, function (err, updatedReceipt) {
    if (err) {
      console.error(err.message)
      throw err
    }
    Receipt.reorderByDate(updatedReceipt.date)
    console.log(`Successfully updated receipt: \n${updatedReceipt}`)
    event.returnValue = true
  })
})
