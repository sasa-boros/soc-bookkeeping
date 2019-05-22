const { ipcMain } = require('electron')
const incomeCodeService = require('./service/incomeCodeService')
const outcomeCodeService = require('./service/outcomeCodeService')
const paymentSlipService = require('./service/paymentSlipService')
const receiptService = require('./service/receiptService')
const defaultPaymentSlipService = require('./service/defaultPaymentSlipService')
const defaultReceiptService = require('./service/defaultReceiptService')
const annualReportService = require('./service/annualReportService')

ipcMain.on('get-income-codes', (event) => {
  incomeCodeService
    .getIncomeCodes()
    .then((incomeCodes) => {
      basicReply(event, 'get-income-codes-reply', incomeCodes)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-income-codes-reply', undefined, err.message)
    })
})

ipcMain.on('get-outcome-codes', (event) => {
  outcomeCodeService
    .getOutcomeCodes()
    .then((outcomeCodes) => {
      basicReply(event, 'get-outcome-codes-reply', outcomeCodes)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-outcome-codes-reply', undefined, err.message)
    })
})

ipcMain.on('get-payment-slips', (event, year) => {
  paymentSlipService
    .getPaymentSlips(year)
    .then((paymentSlips) => {
      basicReply(event, 'get-payment-slips-reply', paymentSlips)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-payment-slips-reply', undefined, err.message)
    })
})

ipcMain.on('create-payment-slip', (event, paymentSlip) => {
  paymentSlipService
    .createPaymentSlip(paymentSlip)
    .then((createdPaymentSlip) => {
      basicReply(event, 'create-payment-slip-reply', createdPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'create-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('delete-payment-slip', (event, paymentSlipId) => {
  paymentSlipService
    .deletePaymentSlip(paymentSlipId)
    .then((deletedPaymentSlip) => {
      basicReply(event, 'delete-payment-slip-reply', deletedPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'delete-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('update-payment-slip', (event, paymentSlip) => {
  paymentSlipService
    .updatePaymentSlip(paymentSlip)
    .then((updatedPaymentSlip) => {
      basicReply(event, 'update-payment-slip-reply', updatedPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'update-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('get-receipts', (event, year) => {
  receiptService
    .getReceipts(year)
    .then((receipts) => {
      basicReply(event, 'get-receipts-reply', receipts)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-receipts-reply', undefined, err.message)
    })
})

ipcMain.on('create-receipt', (event, receipt) => {
  receiptService
    .createReceipt(receipt)
    .then((createdReceipt) => {
      basicReply(event, 'create-receipt-reply', createdReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'create-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('delete-receipt', (event, receiptId) => {
  receiptService
    .deleteReceipt(receiptId)
    .then((deletedReceipt) => {
      basicReply(event, 'delete-receipt-reply', deletedReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'delete-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('update-receipt', (event, receipt) => {
  receiptService
    .updateReceipt(receipt)
    .then((updatedReceipt) => {
      basicReply(event, 'update-receipt-reply', updatedReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'update-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('get-default-payment-slip', (event) => {
  defaultPaymentSlipService
    .getDefaultPaymentSlip()
    .then((defaultPaymentSlip) => {
      basicReply(event, 'get-default-payment-slip-reply', defaultPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-default-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('create-default-payment-slip', (event, defaultPaymentSlip) => {
  defaultPaymentSlipService
    .createDefaultPaymentSlip(defaultPaymentSlip)
    .then((createdDefaultPaymentSlip) => {
      basicReply(event, 'create-default-payment-slip-reply', createdDefaultPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'create-default-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('delete-default-payment-slip', (event) => {
  defaultPaymentSlipService
    .deleteDefaultPaymentSlip()
    .then((deletedDefaultPaymentSlip) => {
      basicReply(event, 'delete-default-payment-slip-reply', deletedDefaultPaymentSlip)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'delete-default-payment-slip-reply', undefined, err.message)
    })
})

ipcMain.on('get-default-receipt', (event) => {
  defaultReceiptService
    .getDefaultReceipt()
    .then((defaultReceipt) => {
      basicReply(event, 'get-default-receipt-reply', defaultReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-default-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('create-default-receipt', (event, defaultReceipt) => {
  defaultReceiptService
    .createDefaultReceipt(defaultReceipt)
    .then((createdDefaultReceipt) => {
      basicReply(event, 'create-default-receipt-reply', createdDefaultReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'create-default-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('delete-default-receipt', (event) => {
  defaultReceiptService
    .deleteDefaultReceipt()
    .then((deletedDefaultReceipt) => {
      basicReply(event, 'delete-default-receipt-reply', deletedDefaultReceipt)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'delete-default-receipt-reply', undefined, err.message)
    })
})

ipcMain.on('get-annual-report', (event, year) => {
  annualReportService
    .getAnnualReport(year)
    .then((annualReport) => {
      basicReply(event, 'get-annual-report-reply', annualReport)
    })
    .catch((err) => {
      console.error(err)
      basicReply(event, 'get-annual-report-reply', undefined, err.message)
    })
})

function basicReply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({ error: error, data: data }))
}
