const { ipcRenderer } = require('electron')

function getReceipts (year) {
  return ipcRenderer.sendSync('get-receipts', year)
}

function createReceipt (receipt) {
  return ipcRenderer.sendSync('create-receipt', receipt)
}

function updateReceipt (receipt) {
  return ipcRenderer.sendSync('update-receipt', receipt)
}

function deleteReceipt (receiptId) {
  return ipcRenderer.sendSync('delete-receipt', receiptId)
}

function getDefaultReceipt () {
  return ipcRenderer.sendSync('get-default-receipt')
}

function createDefaultReceipt (defaultReceipt) {
  return ipcRenderer.sendSync('create-default-receipt', defaultReceipt)
}

function deleteDefaultReceipt () {
  return ipcRenderer.sendSync('delete-default-receipt')
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
