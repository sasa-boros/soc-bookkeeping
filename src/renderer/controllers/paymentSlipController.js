const { ipcRenderer } = require('electron')

function getPaymentSlips (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-payment-slips', year)
    ipcRenderer.once('get-payment-slips-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createPaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-payment-slip', paymentSlip)
    ipcRenderer.once('create-payment-slip-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}
function updatePaymentSlip (paymentSlip) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-payment-slip', paymentSlip)
    ipcRenderer.once('update-payment-slip-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function deletePaymentSlip (paymentSlipId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-payment-slip', paymentSlipId)
    ipcRenderer.once('delete-payment-slip-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip
}
