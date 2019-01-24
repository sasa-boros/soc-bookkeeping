const { ipcRenderer } = require('electron')

function getReceipts (year) {
  const receipts = ipcRenderer.sendSync('get-receipts', year)
  return receipts
}

function createReceipt (receipt) {
  ipcRenderer.sendSync('create-receipt', receipt)
}

function updateReceipt (receipt) {
  ipcRenderer.sendSync('update-receipt', receipt)
}

function deleteReceipt (receiptId) {
  ipcRenderer.sendSync('delete-receipt', receiptId)
}

function getDefaultReceipt () {
  const defaultReceipt = ipcRenderer.sendSync('get-default-receipt')
  return defaultReceipt
}

function createDefaultReceipt (defaultReceipt) {
  ipcRenderer.sendSync('create-default-receipt', defaultReceipt)
}

module.exports = {
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  updateReceipt: updateReceipt,
  deleteReceipt: deleteReceipt,
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt
}
