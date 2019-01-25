const { ipcRenderer } = require('electron')

function getReceipts (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-receipts', year)
    ipcRenderer.on('get-receipts-reply', function (event, res) {
      resolve(res)
    })
  })
}

function createReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-receipt', receipt)
    ipcRenderer.on('create-receipt-reply', function (event, res) {
      resolve(res)
    })
  })
}

function updateReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-receipt', receipt)
    ipcRenderer.on('update-receipt-reply', function (event, res) {
      resolve(res)
    })
  })
}

function deleteReceipt (receiptId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-receipt', receiptId)
    ipcRenderer.on('delete-receipt-reply', function (event, res) {
      resolve(res)
    })
  })
}

function getDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-default-receipt')
    ipcRenderer.on('get-default-receipt-reply', function (event, res) {
      resolve(res)
    })
  })
}

function createDefaultReceipt (defaultReceipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-default-receipt', defaultReceipt)
    ipcRenderer.on('create-default-receipt-reply', function (event, res) {
      resolve(res)
    })
  })
}

function deleteDefaultReceipt () {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-default-receipt')
    ipcRenderer.on('delete-default-receipt-reply', function (event, res) {
      resolve(res)
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
