const {ipcRenderer} = require('electron')

function getPaymentSlips (year) {
  return ipcRenderer.sendSync('get-payment-slips', year)
}

function createPaymentSlip (paymentSlip) {
  return ipcRenderer.sendSync('create-payment-slip', paymentSlip)
}
function updatePaymentSlip (paymentSlip) {
  return ipcRenderer.sendSync('update-payment-slip', paymentSlip)
}

function deletePaymentSlip (paymentSlipId) {
  return ipcRenderer.sendSync('delete-payment-slip', paymentSlipId)
}

function getDefaultPaymentSlip () {
  return ipcRenderer.sendSync('get-default-payment-slip')
}

function createDefaultPaymentSlip (defaultPaymentSlip) {
  return ipcRenderer.sendSync('create-default-payment-slip', defaultPaymentSlip)
}

function deleteDefaultPaymentSlip () {
  return ipcRenderer.sendSync('delete-default-payment-slip')
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
