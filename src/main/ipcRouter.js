const {ipcMain} = require('electron')
const paymentSlips = require('./models/paymentSlips')

ipcMain.on('get-payment-slips', function (event) {
  event.returnValue = paymentSlips.getPaymentSlips()
})

ipcMain.on('create-payment-slip', function (event, slip) {
  event.returnValue = paymentSlips.createPaymentSlip(slip)
})

ipcMain.on('delete-payment-slip', function (event, slipId) {
  event.returnValue = paymentSlips.deletePaymentSlip(slipId)
})

ipcMain.on('update-payment-slip', function (event, slip) {
  event.returnValue = paymentSlips.updatePaymentSlip(slip)
})
