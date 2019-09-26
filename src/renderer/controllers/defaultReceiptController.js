const { ipcRenderer } = require('electron')

function getDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-default-receipt')
    ipcRenderer.once('get-default-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createDefaultReceipt (defaultReceipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-default-receipt', defaultReceipt)
    ipcRenderer.once('create-default-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function deleteDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-default-receipt')
    ipcRenderer.once('delete-default-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt,
  deleteDefaultReceipt: deleteDefaultReceipt
}
