const {ipcMain} = require('electron')
const PaymentSlip = require('./models/paymentSlips')

ipcMain.on('get-payment-slips', function (event) {
  // event.returnValue = paymentSlips.getPaymentSlips()
  PaymentSlip.find({}, function (err, paymentSlips) {
    if (err) throw err
    event.returnValue = paymentSlips
  })
})

ipcMain.on('create-payment-slip', function (event, slip) {
  var newSlip = PaymentSlip(slip)
  newSlip.save(function (err) {
    if (err) throw err
    event.returnValue = newSlip
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
