const { ipcRenderer } = require('electron')

function areReceiptsValid () {
  return new Promise(function (resolve) {
    ipcRenderer.send('are-receipts-valid')
    ipcRenderer.once('are-receipts-valid-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function getReceipts (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-receipts', year)
    ipcRenderer.once('get-receipts-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-receipt', receipt)
    ipcRenderer.once('create-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function updateReceipt (receipt) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-receipt', receipt)
    ipcRenderer.once('update-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function deleteReceipt (receiptId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-receipt', receiptId)
    ipcRenderer.once('delete-receipt-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function deleteReceipts (receiptsIds) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-receipts', receiptsIds)
    ipcRenderer.once('delete-receipts-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createReceiptPdf () {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-receipt-pdf')
    ipcRenderer.once('create-receipt-pdf-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  areReceiptsValid: areReceiptsValid,
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  updateReceipt: updateReceipt,
  deleteReceipt: deleteReceipt,
  deleteReceipts: deleteReceipts,
  createReceiptPdf: createReceiptPdf
}
