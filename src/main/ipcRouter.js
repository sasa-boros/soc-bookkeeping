const { ipcMain } = require('electron')
const { PaymentSlip, DefaultPaymentSlip } = require('./model/paymentSlip')
const { Receipt, DefaultReceipt } = require('./model/receipt')
const annualReport = require('./model/annualReport')

ipcMain.on('get-income-codes', function (event) {
  console.log('Initiated get income codes')
  console.log(`Found: \n${JSON.stringify(annualReport.INCOME_CODES, null, 2)}`)
  sendReply(event, 'get-income-codes-reply', annualReport.INCOME_CODES, null)
})

ipcMain.on('get-outcome-codes', function (event) {
  console.log('Initiated get outcome codes')
  console.log(`Found: \n${JSON.stringify(annualReport.OUTCOME_CODES, null, 2)}`)
  sendReply(event, 'get-outcome-codes-reply', annualReport.OUTCOME_CODES, null)
})

ipcMain.on('get-payment-slips', function (event, year) {
  console.log('Initiated get payment slips')
  PaymentSlip.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then(function (paymentSlips) {
    console.log(`Found: \n${JSON.stringify(paymentSlips, null, 2)}`)
    sendReply(event, 'get-payment-slips-reply', paymentSlips, null)
  }).catch((err) => {
    console.error(err.message)
    sendReply(event, 'get-payment-slips-reply', null, err.message)
  })
})

ipcMain.on('create-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated create payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  delete paymentSlip['_id']
  var newPaymentSlip = PaymentSlip(paymentSlip)
  newPaymentSlip.save(function (err, createdPaymentSlip) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'create-payment-slip-reply', null, err.message)
    }
    PaymentSlip.assignAnnualReportValues().then(function () {
      console.log(`Successfully created payment slip: \n${createdPaymentSlip}`)
      sendReply(event, 'create-payment-slip-reply', createdPaymentSlip, null)
    })
  })
})

ipcMain.on('delete-payment-slip', function (event, paymentSlipId) {
  console.log(`Initiated delete payment slip with: ${paymentSlipId}`)
  PaymentSlip.findByIdAndRemove(paymentSlipId, function (err, deletedPaymentSlip) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'delete-payment-slip-reply', null, err.message)
    }
    PaymentSlip.assignAnnualReportValues().then(function () {
      console.log('Successfully deleted payment slip')
      sendReply(event, 'delete-payment-slip-reply', deletedPaymentSlip, null)
    })
  })
})

ipcMain.on('update-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated update payment slip with: \n${JSON.stringify(paymentSlip, null, 2)}`)
  PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip, function (err, updatedPaymentSlip) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'update-payment-slip-reply', null, err.message)
    }
    PaymentSlip.assignAnnualReportValues().then(function () {
      console.log(`Successfully updated payment slip: \n${updatedPaymentSlip}`)
      sendReply(event, 'update-payment-slip-reply', updatedPaymentSlip, null)
    })
  })
})

ipcMain.on('get-receipts', function (event, year) {
  console.log('Initiated get receipts')
  Receipt.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then(function (receipts) {
    console.log(`Found: \n${JSON.stringify(receipts, null, 2)}`)
    sendReply(event, 'get-receipts-reply', receipts, null)
  }).catch((err) => {
    console.error(err.message)
    sendReply(event, 'get-receipts-reply', null, err.message)
  })
})

ipcMain.on('create-receipt', function (event, receipt) {
  console.log(`Initiated create receipt: \n${JSON.stringify(receipt, null, 2)}`)
  delete receipt['_id']
  var newReceipt = Receipt(receipt)
  newReceipt.save(function (err, createdReceipt) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'create-receipt-reply', null, err.message)
    }
    Receipt.assignAnnualReportValues().then(function () {
      console.log(`Successfully created receipt: \n${createdReceipt}`)
      sendReply(event, 'create-receipt-reply', createdReceipt, null)
    })
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  console.log(`Initiated delete receipt with: ${receiptId}`)
  Receipt.findByIdAndRemove(receiptId, function (err, deletedReceipt) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'delete-receipt-reply', null, err.message)
    }
    Receipt.assignAnnualReportValues().then(function () {
      console.log('Successfully deleted receipt')
      sendReply(event, 'delete-receipt-reply', deletedReceipt, null)
    })
  })
})

ipcMain.on('update-receipt', function (event, receipt) {
  console.log(`Initiated update receipt with: \n${JSON.stringify(receipt, null, 2)}`)
  Receipt.findByIdAndUpdate({_id: receipt._id}, receipt, function (err, updatedReceipt) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'update-receipt-reply', null, err.message)
    }
    Receipt.assignAnnualReportValues().then(function () {
      console.log(`Successfully updated receipt: \n${updatedReceipt}`)
      sendReply(event, 'update-receipt-reply', updatedReceipt, null)
    })
  })
})

ipcMain.on('get-annual-report', function (event, year) {
  console.log('Initiated get annual report')
  annualReport.getAnnualReport(year).then(function (generatedAnnualReport) {
    console.log(`Found: \n${JSON.stringify(generatedAnnualReport, null, 2)}`)
    sendReply(event, 'get-annual-report-reply', generatedAnnualReport, null)
  })
})

ipcMain.on('get-default-payment-slip', function (event) {
  console.log('Initiated get default payment slip')
  DefaultPaymentSlip.find({}).exec().then(function (defaultPaymentSlips) {
    console.log(`Found: \n${JSON.stringify(defaultPaymentSlips, null, 2)}`)
    if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
      sendReply(event, 'get-default-payment-slip-reply', defaultPaymentSlips[0], null)
    } else {
      sendReply(event, 'get-default-payment-slip-reply', null, null)
    }
  }).catch(function (err) {
    console.error(err.message)
    sendReply(event, 'get-default-payment-slip-reply', null, err.message)
  })
})

ipcMain.on('create-default-payment-slip', function (event, defaultPaymentSlip) {
  console.log(`Initiated create default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
  delete defaultPaymentSlip['_id']
  DefaultPaymentSlip.deleteOne({}, function (err) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'create-default-payment-slip-reply', null, err.message)
    }
    var newDefaultPaymentSlip = DefaultPaymentSlip(defaultPaymentSlip)
    newDefaultPaymentSlip.save(function (err, createdDefaultPaymentSlip) {
      if (err) {
        console.error(err.message)
        sendReply(event, 'create-default-payment-slip-reply', null, err.message)
      }
      console.log(`Successfully created default payment slip: \n${createdDefaultPaymentSlip}`)
      sendReply(event, 'create-default-payment-slip-reply', createdDefaultPaymentSlip, null)
    })
  })
})

ipcMain.on('delete-default-payment-slip', function (event) {
  console.log('Initiated delete default payment slip')
  DefaultPaymentSlip.deleteOne({}, function (err, deletedDefaultPaymentSlip) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'delete-default-payment-slip-reply', null, err.message)
    }
    console.log('Successfully deleted default payment slip')
    sendReply(event, 'delete-default-payment-slip-reply', deletedDefaultPaymentSlip, null)
  })
})

ipcMain.on('get-default-receipt', function (event) {
  console.log('Initiated get default receipt')
  DefaultReceipt.find({}).exec().then(function (defaultReceipts) {
    console.log(`Found: \n${JSON.stringify(defaultReceipts, null, 2)}`)
    if (defaultReceipts && defaultReceipts.length > 0) {
      sendReply(event, 'get-default-receipt-reply', defaultReceipts[0], null)
    } else {
      sendReply(event, 'get-default-receipt-reply', null, null)
    }
  }).catch(function (err) {
    console.error(err.message)
    sendReply(event, 'get-default-receipt-reply', null, err.message)
  })
})

ipcMain.on('create-default-receipt', function (event, defaultReceipt) {
  console.log(`Initiated create default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  delete defaultReceipt['_id']
  DefaultReceipt.deleteOne({}, function (err) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'create-default-receipt-reply', null, err.message)
    }
    var newDefaultReceipt = DefaultReceipt(defaultReceipt)
    newDefaultReceipt.save(function (err, createdDefaultReceipt) {
      if (err) {
        console.error(err.message)
        sendReply(event, 'create-default-receipt-reply', null, err.message)
      }
      console.log(`Successfully created default receipt: \n${createdDefaultReceipt}`)
      sendReply(event, 'create-default-receipt-reply', createdDefaultReceipt, null)
    })
  })
})

ipcMain.on('delete-default-receipt', function (event) {
  console.log('Initiated delete default receipt')
  DefaultReceipt.deleteOne({}, function (err, deletedDefaultReceipt) {
    if (err) {
      console.error(err.message)
      sendReply(event, 'delete-default-receipt-reply', null, err.message)
    }
    console.log('Successfully deleted default receipt')
    event.sender.send('delete-default-receipt-reply', deletedDefaultReceipt, null)
  })
})

function sendReply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
