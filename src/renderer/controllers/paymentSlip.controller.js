const {ipcRenderer} = require('electron')

function getPaymentSlips (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-payment-slips', year)
    ipcRenderer.on('get-payment-slips-reply', function (event, res) {
      resolve(res)
    })
  })
}

function createPaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-payment-slip', paymentSlip)
    ipcRenderer.on('create-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}
function updatePaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-payment-slip', paymentSlip)
    ipcRenderer.on('update-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}

function deletePaymentSlip (paymentSlipId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-payment-slip', paymentSlipId)
    ipcRenderer.on('delete-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}

function getDefaultPaymentSlip () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-default-payment-slip')
    ipcRenderer.on('get-default-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}

function createDefaultPaymentSlip (defaultPaymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-default-payment-slip', defaultPaymentSlip)
    ipcRenderer.on('create-default-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}

function deleteDefaultPaymentSlip () {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-default-payment-slip')
    ipcRenderer.on('delete-default-payment-slip-reply', function (event, res) {
      resolve(res)
    })
  })
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip,
  getDefaultPaymentSlip: getDefaultPaymentSlip,
  createDefaultPaymentSlip: createDefaultPaymentSlip,
  deleteDefaultPaymentSlip: deleteDefaultPaymentSlip
}
