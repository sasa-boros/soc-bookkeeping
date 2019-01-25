const {ipcMain} = require('electron')
const {PaymentSlip, DefaultPaymentSlip} = require('./model/paymentSlip')
const {Receipt, DefaultReceipt} = require('./model/receipt')
const annualReport = require('./model/annualReport')

ipcMain.on('get-income-codes', function (event) {
  console.log('Initiated get income codes')
  console.log(`Found: \n${JSON.stringify(annualReport.INCOME_CODES, null, 2)}`)
  event.sender.send('get-income-codes-reply', {error: null, data: annualReport.INCOME_CODES})
})

ipcMain.on('get-outcome-codes', function (event) {
  console.log('Initiated get outcome codes')
  console.log(`Found: \n${JSON.stringify(annualReport.OUTCOME_CODES, null, 2)}`)
  event.sender.send('get-outcome-codes-reply', {error: null, data: annualReport.OUTCOME_CODES})
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
    event.sender.send('get-payment-slips-reply', {error: null, data: paymentSlips})
  }).catch((err) => {
    console.error(err.message)
    event.sender.send('get-payment-slips-reply', {error: err.message, data: null})
  })
})

ipcMain.on('create-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated create payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  var newPaymentSlip = PaymentSlip(paymentSlip)
  newPaymentSlip.save(async function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('create-payment-slip-reply', {error: err.message, data: null})
    }
    await PaymentSlip.reorderByDate(newPaymentSlip.date)
    console.log(`Successfully created payment slip: \n${newPaymentSlip}`)
    event.sender.send('create-payment-slip-reply', {error: null, data: newPaymentSlip})
  })
})

ipcMain.on('delete-payment-slip', function (event, paymentSlipId) {
  console.log(`Initiated delete payment slip with: ${paymentSlipId}`)
  PaymentSlip.findOneAndRemove({_id: paymentSlipId}, async function (err, deletedPaymentSlip) {
    if (err) {
      console.error(err.message)
      event.sender.send('delete-payment-slip-reply', {error: err.message, data: null})
    }
    await PaymentSlip.reorderByDate(deletedPaymentSlip.date)
    console.log('Successfully deleted payment slip')
    event.sender.send('delete-payment-slip-reply', {error: null, data: deletedPaymentSlip})
  })
})

ipcMain.on('update-payment-slip', function (event, paymentSlip) {
  console.log(`Initiated update payment slip with: \n${JSON.stringify(paymentSlip, null, 2)}`)
  PaymentSlip.findOneAndUpdate({_id: paymentSlip._id}, paymentSlip, async function (err, updatedPaymentSlip) {
    if (err) {
      console.error(err.message)
      event.sender.send('update-payment-slip-reply', {error: err.message, data: null})
    }
    await PaymentSlip.reorderByDate(updatedPaymentSlip.date)
    console.log(`Successfully updated payment slip: \n${updatedPaymentSlip}`)
    event.sender.send('update-payment-slip-reply', {error: null, data: updatedPaymentSlip})
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
    event.sender.send('get-receipts-reply', {error: null, data: receipts})
  }).catch((err) => {
    console.error(err.message)
    event.sender.send('get-receipts-reply', {error: err.message, data: null})
  })
})

ipcMain.on('create-receipt', function (event, receipt) {
  console.log(`Initiated create receipt: \n${JSON.stringify(receipt, null, 2)}`)
  var newReceipt = Receipt(receipt)
  newReceipt.save(async function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('create-receipt-reply', {error: err.message, data: null})
    }
    await Receipt.reorderByDate(newReceipt.date)
    console.log(`Successfully created receipt: \n${newReceipt}`)
    event.sender.send('create-receipt-reply', {error: null, data: newReceipt})
  })
})

ipcMain.on('delete-receipt', function (event, receiptId) {
  console.log(`Initiated delete receipt with: ${receiptId}`)
  Receipt.findOneAndRemove({_id: receiptId}, async function (err, deletedReceipt) {
    if (err) {
      console.error(err.message)
      event.sender.send('delete-receipt-reply', {error: err.message, data: null})
    }
    await Receipt.reorderByDate(deletedReceipt.date)
    console.log('Successfully deleted receipt')
    event.sender.send('delete-receipt-reply', {error: null, data: deletedReceipt})
  })
})

ipcMain.on('update-receipt', function (event, receipt) {
  console.log(`Initiated update receipt with: \n${JSON.stringify(receipt, null, 2)}`)
  Receipt.findOneAndUpdate({_id: receipt._id}, receipt, async function (err, updatedReceipt) {
    if (err) {
      console.error(err.message)
      event.sender.send('update-receipt-reply', {error: err.message, data: null})
    }
    await Receipt.reorderByDate(updatedReceipt.date)
    console.log(`Successfully updated receipt: \n${updatedReceipt}`)
    event.sender.send('update-receipt-reply', {error: null, data: updatedReceipt})
  })
})

ipcMain.on('get-annual-report', async function (event, year) {
  console.log('Initiated get annual report')
  const generatedAnnualReport = await annualReport.getAnnualReport(year)
  console.log(`Found: \n${JSON.stringify(generatedAnnualReport, null, 2)}`)
  event.sender.send('get-annual-report-reply', {error: null, data: generatedAnnualReport})
})

ipcMain.on('get-default-payment-slip', function (event) {
  console.log('Initiated get default payment slip')
  DefaultPaymentSlip.find({}).exec().then(function (defaultPaymentSlips) {
    console.log(`Found: \n${JSON.stringify(defaultPaymentSlips, null, 2)}`)
    if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
      event.sender.send('get-default-payment-slip-reply', {error: null, data: defaultPaymentSlips[0]})
    } else {
      event.sender.send('get-default-payment-slip-reply', {error: null, data: null})
    }
  }).catch((err) => {
    console.error(err.message)
    event.sender.send('get-default-payment-slip-reply', {error: err.message, data: null})
  })
})

ipcMain.on('create-default-payment-slip', function (event, defaultPaymentSlip) {
  console.log(`Initiated create default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
  DefaultPaymentSlip.remove({}, function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('create-default-payment-slip-reply', {error: err.message, data: null})
    }
    var newDefaultPaymentSlip = DefaultPaymentSlip(defaultPaymentSlip)
    newDefaultPaymentSlip.save(function (err) {
      if (err) {
        console.error(err.message)
        event.sender.send('create-default-payment-slip-reply', {error: err.message, data: null})
      }
      console.log(`Successfully created default payment slip: \n${newDefaultPaymentSlip}`)
      event.sender.send('create-default-payment-slip-reply', {error: null, data: newDefaultPaymentSlip})
    })
  })
})

ipcMain.on('delete-default-payment-slip', function (event) {
  console.log('Initiated delete default payment slip')
  DefaultPaymentSlip.remove({}, function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('delete-default-payment-slip-reply', {error: err.message, data: null})
    }
    console.log('Successfully deleted default payment slip')
    event.sender.send('delete-default-payment-slip-reply', {error: null, data: null})
  })
})

ipcMain.on('get-default-receipt', function (event) {
  console.log('Initiated get default receipt')
  DefaultReceipt.find({}).exec().then(function (defaultReceipts) {
    console.log(`Found: \n${JSON.stringify(defaultReceipts, null, 2)}`)
    if (defaultReceipts && defaultReceipts.length > 0) {
      event.sender.send('get-default-receipt-reply', {error: null, data: defaultReceipts[0]})
    } else {
      event.sender.send('get-default-receipt-reply', {error: null, data: null})
    }
  }).catch((err) => {
    console.error(err.message)
    event.sender.send('get-default-receipt-reply', {error: err.message, data: null})
  })
})

ipcMain.on('create-default-receipt', function (event, defaultReceipt) {
  console.log(`Initiated create default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  DefaultReceipt.remove({}, function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('create-default-receipt-reply', {error: err.message, data: null})
    }
    var newDefaultReceipt = DefaultReceipt(defaultReceipt)
    newDefaultReceipt.save(function (err) {
      if (err) {
        console.error(err.message)
        event.sender.send('create-default-receipt-reply', {error: err.message, data: null})
      }
      console.log(`Successfully created default receipt: \n${newDefaultReceipt}`)
      event.sender.send('create-default-receipt-reply', {error: null, data: newDefaultReceipt})
    })
  })
})

ipcMain.on('delete-default-receipt', function (event) {
  console.log('Initiated delete default receipt')
  DefaultReceipt.remove({}, function (err) {
    if (err) {
      console.error(err.message)
      event.sender.send('delete-default-receipt-reply', {error: err.message, data: null})
    }
    console.log('Successfully deleted default receipt')
    event.sender.send('delete-default-receipt-reply', {error: null, data: null})
  })
})
