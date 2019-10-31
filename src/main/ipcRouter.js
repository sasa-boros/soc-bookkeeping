const { ipcMain } = require('electron')
const incomeCodeService = require('./service/incomeCodeService')
const outcomeCodeService = require('./service/outcomeCodeService')
const paymentSlipService = require('./service/paymentSlipService')
const receiptService = require('./service/receiptService')
const defaultPaymentSlipService = require('./service/defaultPaymentSlipService')
const defaultReceiptService = require('./service/defaultReceiptService')
const annualReportService = require('./service/annualReportService')
const commonService = require('./service/commonService')

ipcMain.on('get-income-codes', async (event) => {
  try {
    reply(event, 'get-income-codes-reply', await incomeCodeService.getIncomeCodes())
  } catch (err) {
    replyError(event, 'get-income-codes-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-income-code', async (event, incomeCode) => {
  try {
    reply(event, 'create-income-code-reply', await incomeCodeService.createIncomeCode(incomeCode))
  } catch (err) {
    replyError(event, 'create-income-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('update-income-code', async (event, incomeCode) => {
  try {
    reply(event, 'update-income-code-reply', await incomeCodeService.updateIncomeCode(incomeCode))
  } catch (err) {
    replyError(event, 'update-income-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-income-code', async (event, incomeCodeId) => {
  try {
    reply(event, 'delete-income-code-reply', await incomeCodeService.deleteIncomeCode(incomeCodeId))
  } catch (err) {
    replyError(event, 'delete-income-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-outcome-codes', async (event) => {
  try {
    reply(event, 'get-outcome-codes-reply', await outcomeCodeService.getOutcomeCodes())
  } catch (err) {
    replyError(event, 'get-outcome-codes-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-outcome-code', async (event, outcomeCode) => {
  try {
    reply(event, 'create-outcome-code-reply', await outcomeCodeService.createOutcomeCode(outcomeCode))
  } catch (err) {
    replyError(event, 'create-outcome-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('update-outcome-code', async (event, outcomeCode) => {
  try {
    reply(event, 'update-outcome-code-reply', await outcomeCodeService.updateOutcomeCode(outcomeCode))
  } catch (err) {
    replyError(event, 'update-outcome-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-outcome-code', async (event, outcomeCodeId) => {
  try {
    reply(event, 'delete-outcome-code-reply', await outcomeCodeService.deleteOutcomeCode(outcomeCodeId))
  } catch (err) {
    replyError(event, 'delete-outcome-code-reply', err.message ? err.message : err)
  }
})

ipcMain.on('are-payment-slips-valid', async (event) => {
  try {
    reply(event, 'are-payment-slips-valid-reply', await paymentSlipService.arePaymentSlipsValid())
  } catch (err) {
    replyError(event, 'are-payment-slips-valid-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-payment-slips', async (event) => {
  try {
    reply(event, 'get-payment-slips-reply', await paymentSlipService.getPaymentSlips())
  } catch (err) {
    replyError(event, 'get-payment-slips-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-payment-slip', async (event, paymentSlip) => {
  try {
    reply(event, 'create-payment-slip-reply', await paymentSlipService.createPaymentSlip(paymentSlip))
  } catch (err) {
    replyError(event, 'create-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-payment-slip', async (event, paymentSlipId) => {
  try {
    reply(event, 'delete-payment-slip-reply', await paymentSlipService.deletePaymentSlip(paymentSlipId))
  } catch (err) {
    replyError(event, 'delete-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-payment-slips', async (event, paymentSlipsIds) => {
  try {
    reply(event, 'delete-payment-slips-reply', await paymentSlipService.deletePaymentSlips(paymentSlipsIds))
  } catch (err) {
    replyError(event, 'delete-payment-slips-reply', err.message ? err.message : err)
  }
})

ipcMain.on('update-payment-slip', async (event, paymentSlip) => {
  try {
    reply(event, 'update-payment-slip-reply', await paymentSlipService.updatePaymentSlip(paymentSlip))
  } catch (err) {
    replyError(event, 'update-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-payment-slip-pdf', async (event) => {
  try {
    reply(event, 'create-payment-slip-pdf-reply', await paymentSlipService.createPaymentSlipPdf(event.sender.webContents))
  } catch (err) {
    replyError(event, 'create-payment-slip-pdf-reply', err.message ? err.message : err)
  }
})

ipcMain.on('are-receipts-valid', async (event) => {
  try {
    reply(event, 'are-receipts-valid-reply', await receiptService.areReceiptsValid())
  } catch (err) {
    replyError(event, 'are-receipts-valid-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-receipts', async (event) => {
  try {
    reply(event, 'get-receipts-reply', await receiptService.getReceipts())
  } catch (err) {
    replyError(event, 'get-receipts-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-receipt', async (event, receipt) => {
  try {
    reply(event, 'create-receipt-reply', await receiptService.createReceipt(receipt))
  } catch (err) {
    replyError(event, 'create-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-receipt', async (event, receiptId) => {
  try {
    reply(event, 'delete-receipt-reply', await receiptService.deleteReceipt(receiptId))
  } catch (err) {
    replyError(event, 'delete-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-receipts', async (event, receiptsIds) => {
  try {
    reply(event, 'delete-receipts-reply', await receiptService.deleteReceipts(receiptsIds))
  } catch (err) {
    replyError(event, 'delete-receipts-reply', err.message ? err.message : err)
  }
})

ipcMain.on('update-receipt', async (event, receipt) => {
  try {
    reply(event, 'update-receipt-reply', await receiptService.updateReceipt(receipt))
  } catch (err) {
    replyError(event, 'update-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-receipt-pdf', async (event) => {
  try {
    reply(event, 'create-receipt-pdf-reply', await receiptService.createReceiptPdf(event.sender.webContents))
  } catch (err) {
    replyError(event, 'create-receipt-pdf-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-default-payment-slip', async (event) => {
  try {
    reply(event, 'get-default-payment-slip-reply', await defaultPaymentSlipService.getDefaultPaymentSlip())
  } catch (err) {
    replyError(event, 'get-default-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-default-payment-slip', async (event, defaultPaymentSlip) => {
  try {
    reply(event, 'create-default-payment-slip-reply', await defaultPaymentSlipService.createDefaultPaymentSlip(defaultPaymentSlip))
  } catch (err) {
    replyError(event, 'create-default-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-default-payment-slip', async (event) => {
  try {
    reply(event, 'delete-default-payment-slip-reply', await defaultPaymentSlipService.deleteDefaultPaymentSlip())
  } catch (err) {
    replyError(event, 'delete-default-payment-slip-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-default-receipt', async (event) => {
  try {
    reply(event, 'get-default-receipt-reply', await defaultReceiptService.getDefaultReceipt())
  } catch (err) {
    replyError(event, 'get-default-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-default-receipt', async (event, defaultReceipt) => {
  try {
    reply(event, 'create-default-receipt-reply', await defaultReceiptService.createDefaultReceipt(defaultReceipt))
  } catch (err) {
    replyError(event, 'create-default-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('delete-default-receipt', async (event) => {
  try {
    reply(event, 'delete-default-receipt-reply', await defaultReceiptService.deleteDefaultReceipt())
  } catch (err) {
    replyError(event, 'delete-default-receipt-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-annual-report', async (event, year) => {
  try {
    reply(event, 'get-annual-report-reply', await annualReportService.getAnnualReport(year))
  } catch (err) {
    replyError(event, 'get-annual-report-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-annual-report-pages', async (event, annualReport) => {
  try {
    reply(event, 'get-annual-report-pages-reply', await annualReportService.getAnnualReportPages(annualReport))
  } catch (err) {
    replyError(event, 'get-annual-report-pages-reply', err.message ? err.message : err)
  }
})

ipcMain.on('create-annual-report-pdf', async (event) => {
  try {
    reply(event, 'create-annual-report-pdf-reply', await annualReportService.createAnnualReportPdf(event.sender.webContents))
  } catch (err) {
    replyError(event, 'create-annual-report-pdf-reply', err.message ? err.message : err)
  }
})

ipcMain.on('get-booked-years', async (event) => {
  try {
    reply(event, 'get-booked-years-reply', await commonService.getBookedYears())
  } catch (err) {
    replyError(event, 'get-booked-years-reply', err.message ? err.message : err)
  }
})

function reply (event, target, data) {
  event.sender.send(target, { data: data })
}

function replyError (event, target, err) {
  console.error(err)
  event.sender.send(target, { err: err })
}
