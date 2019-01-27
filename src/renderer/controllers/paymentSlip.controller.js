const {ipcRenderer} = require('electron')

function getPaymentSlips (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-payment-slips', year)
    ipcRenderer.once('get-payment-slips-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function createPaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-payment-slip', paymentSlip)
    ipcRenderer.once('create-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}
function updatePaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-payment-slip', paymentSlip)
    ipcRenderer.once('update-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function deletePaymentSlip (paymentSlipId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-payment-slip', paymentSlipId)
    ipcRenderer.once('delete-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function getDefaultPaymentSlip () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-default-payment-slip')
    ipcRenderer.once('get-default-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function createDefaultPaymentSlip (defaultPaymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-default-payment-slip', defaultPaymentSlip)
    ipcRenderer.once('create-default-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function deleteDefaultPaymentSlip () {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-default-payment-slip')
    ipcRenderer.once('delete-default-payment-slip-reply', function (event, res) {
      resolve(JSON.parse(res))
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
