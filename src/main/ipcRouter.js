const {ipcMain} = require('electron')
const PaymentSlip = require('./model/paymentSlip')
const Receipt = require('./model/receipt')

ipcMain.on('get-payment-slips', function (event) {
  console.log('Initiated get payment slips')
  PaymentSlip.find({}, function (err, paymentSlips) {
    if (err) {
      console.error(err.message)
      throw err
    }
    console.log(`Found: \n${paymentSlips}`)
    event.returnValue = paymentSlips
  })
})

ipcMain.on('create-payment-slip', function (event, slip) {
  console.log(`Initiated create payment slip: \n${JSON.stringify(slip, null, 2)}`)
  var newSlip = PaymentSlip(slip)
  newSlip.save(function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
    console.log(`Successfully created payment slip: \n${newSlip}`)
    event.returnValue = true
  })
})

ipcMain.on('delete-payment-slip', function (event, slipId) {
  console.log(`Initiated delete payment slip with: ${slipId}`)
  PaymentSlip.findOneAndRemove({_id: slipId}, function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
    console.log('Successfully deleted payment slip')
    event.returnValue = true
  })
})

ipcMain.on('update-payment-slip', function (event, slip) {
  console.log(`Initiated update payment slip with: \n${JSON.stringify(slip, null, 2)}`)
  PaymentSlip.findOneAndUpdate({_id: slip._id}, slip, function (err, updatedSlip) {
    if (err) {
      console.error(err.message)
      throw err
    }
    console.log(`Successfully updated payment slip: \n${updatedSlip}`)
    event.returnValue = true
  })
})

ipcMain.on('get-receipts', function (event) {
  console.log('Initiated get receipts')
  Receipt.find({}, function (err, receipts) {
    if (err) {
      console.error(err.message)
      throw err
    }
    console.log(`Found: \n${receipts}`)
    event.returnValue = receipts
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
    console.log(`Successfully created receipt: \n${newReceipt}`)
    event.returnValue = true
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  console.log(`Initiated delete receipt with: ${receiptId}`)
  Receipt.findOneAndRemove({_id: receiptId}, function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
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
    console.log(`Successfully updated receipt: \n${updatedReceipt}`)
    event.returnValue = true
  })
})
