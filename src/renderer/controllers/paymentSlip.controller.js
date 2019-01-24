const {ipcRenderer} = require('electron')

function getPaymentSlips (year) {
  const paymentSlips = ipcRenderer.sendSync('get-payment-slips', year)
  return paymentSlips
}

function createPaymentSlip (paymentSlip) {
  ipcRenderer.sendSync('create-payment-slip', paymentSlip)
}
function updatePaymentSlip (paymentSlip) {
  ipcRenderer.sendSync('update-payment-slip', paymentSlip)
}

function deletePaymentSlip (paymentSlipId) {
  ipcRenderer.sendSync('delete-payment-slip', paymentSlipId)
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip
}
