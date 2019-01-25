const { ipcRenderer } = require('electron')

function getReceipts (year) {
  ipcRenderer.send('get-receipts', year)
}

function createReceipt (receipt) {
  ipcRenderer.send('create-receipt', receipt)
}

function updateReceipt (receipt) {
  ipcRenderer.send('update-receipt', receipt)
}

function deleteReceipt (receiptId) {
  ipcRenderer.send('delete-receipt', receiptId)
}

function getDefaultReceipt () {
  ipcRenderer.send('get-default-receipt')
}

function createDefaultReceipt (defaultReceipt) {
  ipcRenderer.send('create-default-receipt', defaultReceipt)
}

ipcRenderer.on('get-receipts-reply', function (event, receipts) {
  // update table on frontend
})

ipcRenderer.on('create-receipt-reply', function (event, createdReceipt) {
  // year should be taken from select
  ipcRenderer.send('get-receipts', year)
})

ipcRenderer.on('update-receipt-reply', function (event, updatedReceipt) {
  // year should be taken from select
  ipcRenderer.send('get-receipts', year)
})

ipcRenderer.on('delete-receipt-reply', function (event, deletedReceipt) {
  // year should be taken from select
  ipcRenderer.send('get-receipts', year)
})

ipcRenderer.on('get-default-receipt-reply', function (event, defaultReceipt) {
  // update default on frontend
})

ipcRenderer.on('create-default-receipt-reply', function (event, createdDefaultReceipt) {
  ipcRenderer.send('get-default-receipt')
})

ipcRenderer.on('delete-default-receipt-reply', function (event) {
  // do whatever
})

module.exports = {
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  updateReceipt: updateReceipt,
  deleteReceipt: deleteReceipt,
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt
}
