const {ipcRenderer} = require('electron')

function getPaymentSlips (year) {
  ipcRenderer.send('get-payment-slips', year)
}

function createPaymentSlip (paymentSlip) {
  ipcRenderer.send('create-payment-slip', paymentSlip)
}
function updatePaymentSlip (paymentSlip) {
  ipcRenderer.send('update-payment-slip', paymentSlip)
}

function deletePaymentSlip (paymentSlipId) {
  ipcRenderer.send('delete-payment-slip', paymentSlipId)
}

function getDefaultPaymentSlip () {
  ipcRenderer.send('get-default-payment-slip')
}

function createDefaultPaymentSlip (defaultPaymentSlip) {
  ipcRenderer.send('create-default-payment-slip', defaultPaymentSlip)
}

ipcRenderer.on('get-payment-slips-reply', function (event, paymentSlips) {
  // update table on frontend
})

ipcRenderer.on('create-payment-slip-reply', function (event, createdPaymentSlip) {
  // year should be taken from select
  ipcRenderer.send('get-payment-slips', year)
})

ipcRenderer.on('update-payment-slip-reply', function (event, updatedPaymentSlip) {
  // year should be taken from select
  ipcRenderer.send('get-payment-slips', year)
})

ipcRenderer.on('delete-payment-slip-reply', function (event, deletedPaymentSlip) {
  // year should be taken from select
  ipcRenderer.send('get-payment-slips', year)
})

ipcRenderer.on('get-default-payment-slip-reply', function (event, defaultPaymentSlip) {
  // update default on frontend
})

ipcRenderer.on('create-default-payment-slip-reply', function (event, createdDefaultPaymentSlip) {
  ipcRenderer.send('get-default-payment-slip')
})

ipcRenderer.on('delete-default-payment-slip-reply', function (event) {
  // do whatever
})

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip,
  getDefaultPaymentSlip: getDefaultPaymentSlip,
  createDefaultPaymentSlip: createDefaultPaymentSlip
}
