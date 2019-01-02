const {ipcRenderer} = require('electron')

function getPaymentSlips () {
  var slips = ipcRenderer.sendSync('get-payment-slips')
  return slips
}

function createPaymentSlip (newSlip) {
  ipcRenderer.sendSync('create-payment-slip', newSlip)
}

function updatePaymentSlip (slip) {
  ipcRenderer.send('update-payment-slip', slip)
}

function deletePaymentSlip (slipId) {
  ipcRenderer.sendSync('delete-payment-slip', slipId)
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip
}
