const { ipcRenderer } = require('electron')

function getReceipts (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-receipts', year)
    ipcRenderer.once('get-receipts-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function createReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-receipt', receipt)
    ipcRenderer.once('create-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function updateReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-receipt', receipt)
    ipcRenderer.once('update-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function deleteReceipt (receiptId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-receipt', receiptId)
    ipcRenderer.once('delete-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function getDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-default-receipt')
    ipcRenderer.once('get-default-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function createDefaultReceipt (defaultReceipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-default-receipt', defaultReceipt)
    ipcRenderer.once('create-default-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function deleteDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-default-receipt')
    ipcRenderer.once('delete-default-receipt-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  updateReceipt: updateReceipt,
  deleteReceipt: deleteReceipt,
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt,
  deleteDefaultReceipt: deleteDefaultReceipt
}
