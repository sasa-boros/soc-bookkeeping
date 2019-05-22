const { ipcMain } = require('electron')
const incomeCodeService = require('./service/incomeCodeService')
const outcomeCodeService = require('./service/outcomeCodeService')
const paymentSlipService = require('./service/paymentSlipService')
const receiptService = require('./service/receiptService')
const defaultPaymentSlipService = require('./service/defaultPaymentSlipService')
const defaultReceiptService = require('./service/defaultReceiptService')
const annualReportService = require('./service/annualReportService')

ipcMain.on('get-income-codes', async (event) => {
  try {
    reply(event, 'get-income-codes-reply', await incomeCodeService.getIncomeCodes())
  } catch (err) {
    replyError(event, 'get-income-codes-reply', err.message)
  }
})

ipcMain.on('get-outcome-codes', async (event) => {
  try {
    reply(event, 'get-outcome-codes-reply', await outcomeCodeService.getOutcomeCodes())
  } catch (err) {
    replyError(event, 'get-outcome-codes-reply', err.message)
  }
})

ipcMain.on('get-payment-slips', async (event, year) => {
  try {
    reply(event, 'get-payment-slips-reply', await paymentSlipService.getPaymentSlips(year))
  } catch (err) {
    replyError(event, 'get-payment-slips-reply', err.message)
  }
})

ipcMain.on('create-payment-slip', async (event, paymentSlip) => {
  try {
    reply(event, 'create-payment-slip-reply', await paymentSlipService.createPaymentSlip(paymentSlip))
  } catch (err) {
    replyError(event, 'create-payment-slip-reply', err.message)
  }
})

ipcMain.on('delete-payment-slip', async (event, paymentSlipId) => {
  try {
    reply(event, 'delete-payment-slip-reply', await paymentSlipService.deletePaymentSlip(paymentSlipId))
  } catch (err) {
    replyError(event, 'delete-payment-slip-reply', err.message)
  }
})

ipcMain.on('update-payment-slip', async (event, paymentSlip) => {
  try {
    reply(event, 'update-payment-slip-reply', await paymentSlipService.updatePaymentSlip(paymentSlip))
  } catch (err) {
    replyError(event, 'update-payment-slip-reply', err.message)
  }
})

ipcMain.on('get-receipts', async (event, year) => {
  try {
    reply(event, 'get-receipts-reply', await receiptService.getReceipts(year))
  } catch (err) {
    replyError(event, 'get-receipts-reply', err.message)
  }
})

ipcMain.on('create-receipt', async (event, receipt) => {
  try {
    reply(event, 'create-receipt-reply', await receiptService.createReceipt(receipt))
  } catch (err) {
    replyError(event, 'create-receipt-reply', err.message)
  }
})

ipcMain.on('delete-receipt', async (event, receiptId) => {
  try {
    reply(event, 'delete-receipt-reply', await receiptService.deleteReceipt(receiptId))
  } catch (err) {
    replyError(event, 'delete-receipt-reply', err.message)
  }
})

ipcMain.on('update-receipt', async (event, receipt) => {
  try {
    reply(event, 'update-receipt-reply', await receiptService.updateReceipt(receipt))
  } catch (err) {
    replyError(event, 'update-receipt-reply', err.message)
  }
})

ipcMain.on('get-default-payment-slip', async (event) => {
  try {
    reply(event, 'get-default-payment-slip-reply', await defaultPaymentSlipService.getDefaultPaymentSlip())
  } catch (err) {
    replyError(event, 'get-default-payment-slip-reply', err.message)
  }
})

ipcMain.on('create-default-payment-slip', async (event, defaultPaymentSlip) => {
  try {
    reply(event, 'create-default-payment-slip-reply', await defaultPaymentSlipService.createDefaultPaymentSlip(defaultPaymentSlip))
  } catch (err) {
    replyError(event, 'create-default-payment-slip-reply', err.message)
  }
})

ipcMain.on('delete-default-payment-slip', async (event) => {
  try {
    reply(event, 'delete-default-payment-slip-reply', await defaultPaymentSlipService.deleteDefaultPaymentSlip())
  } catch (err) {
    replyError(event, 'delete-default-payment-slip-reply', err.message)
  }
})

ipcMain.on('get-default-receipt', async (event) => {
  try {
    reply(event, 'get-default-receipt-reply', await defaultReceiptService.getDefaultReceipt())
  } catch (err) {
    replyError(event, 'get-default-receipt-reply', err.message)
  }
})

ipcMain.on('create-default-receipt', async (event, defaultReceipt) => {
  try {
    reply(event, 'create-default-receipt-reply', await defaultReceiptService.createDefaultReceipt(defaultReceipt))
  } catch (err) {
    replyError(event, 'create-default-receipt-reply', err.message)
  }
})

ipcMain.on('delete-default-receipt', async (event) => {
  try {
    reply(event, 'delete-default-receipt-reply', await defaultReceiptService.deleteDefaultReceipt())
  } catch (err) {
    replyError(event, 'delete-default-receipt-reply', err.message)
  }
})

ipcMain.on('get-annual-report', async (event, year) => {
  try {
    reply(event, 'get-annual-report-reply', await annualReportService.getAnnualReport(year))
  } catch (err) {
    replyError(event, 'get-annual-report-reply', err.message)
  }
})

function reply (event, target, data) {
  event.sender.send(target, JSON.stringify({ data: data }))
}

function replyError (event, target, error) {
  console.error(error)
  event.sender.send(target, JSON.stringify({ error: error }))
}
