const {ipcMain} = require('electron')
const PaymentSlip = require('./models/paymentSlips')
const Receipt = require('./models/receipts')

ipcMain.on('get-payment-slips', function (event) {
  PaymentSlip.find({}, function (err, paymentSlips) {
    if (err) throw err

    event.returnValue = paymentSlips
  })
})

ipcMain.on('create-payment-slip', function (event, slip) {
  var newSlip = PaymentSlip(slip)
  newSlip.save(function (err) {
    if (err) throw err

    event.returnValue = true
  })
})

ipcMain.on('delete-payment-slip', function (event, slipId) {
  PaymentSlip.findOneAndRemove({_id: slipId}, function (err) {
    if (err) throw err

    event.returnValue = true
  })
})

ipcMain.on('update-payment-slip', function (event, slip) {
  PaymentSlip.findOneAndUpdate({_id: slip._id}, slip, function (err, slip) {
    if (err) throw err

    event.returnValue = true
  })
})

ipcMain.on('get-receipts', function (event) {
  Receipt.find({}, function (err, receipts) {
    if (err) throw err

    event.returnValue = receipts
  })
})

ipcMain.on('create-receipt', function (event, receipt) {
  var newReceipt = Receipt(receipt)
  newReceipt.save(function (err) {
    if (err) throw err

    event.returnValue = true
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  Receipt.findOneAndRemove({_id: receiptId}, function (err) {
    if (err) throw err

    event.returnValue = true
  })
})

ipcMain.on('update-receipt', function (event, receipt) {
  Receipt.findOneAndUpdate({_id: receipt._id}, receipt, function (err, receipt) {
    if (err) throw err

    event.returnValue = true
  })
})
