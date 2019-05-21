const {ipcMain} = require('electron')
const PaymentSlip = require('../model/paymentSlip')

ipcMain.on('get-payment-slips', (event, year) => {
  console.log('Initiated get payment slips')
  PaymentSlip.find({
    'date':
    {
      '$gte': new Date(year, 0, 1),
      '$lt': new Date(year + 1, 0, 1)
    }
  }).exec().then((paymentSlips) => {
    console.log(`Found: \n${JSON.stringify(paymentSlips, null, 2)}`)
    reply(event, 'get-payment-slips-reply', paymentSlips, null)
  }).catch((err) => {
    console.error(err.message)
    reply(event, 'get-payment-slips-reply', null, err.message)
  })
})

ipcMain.on('create-payment-slip', (event, paymentSlip) => {
  console.log(`Initiated create payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  delete paymentSlip['_id']
  var newPaymentSlip = PaymentSlip(paymentSlip)
  newPaymentSlip.save((err, createdPaymentSlip) => {
    if (err) {
      console.error(err.message)
      reply(event, 'create-payment-slip-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log(`Successfully created payment slip: \n${createdPaymentSlip}`)
      reply(event, 'create-payment-slip-reply', createdPaymentSlip, null)
    })
  })
})

ipcMain.on('delete-payment-slip', (event, paymentSlipId) => {
  console.log(`Initiated delete payment slip with: ${paymentSlipId}`)
  PaymentSlip.findByIdAndRemove(paymentSlipId, (err, deletedPaymentSlip) => {
    if (err) {
      console.error(err.message)
      reply(event, 'delete-payment-slip-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log('Successfully deleted payment slip')
      reply(event, 'delete-payment-slip-reply', deletedPaymentSlip, null)
    })
  })
})

ipcMain.on('update-payment-slip', (event, paymentSlip) => {
  console.log(`Initiated update payment slip with: \n${JSON.stringify(paymentSlip, null, 2)}`)
  PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip, (err, updatedPaymentSlip) => {
    if (err) {
      console.error(err.message)
      reply(event, 'update-payment-slip-reply', null, err.message)
    }
    assignAnnualReportValues().then(() => {
      console.log(`Successfully updated payment slip: \n${updatedPaymentSlip}`)
      reply(event, 'update-payment-slip-reply', updatedPaymentSlip, null)
    })
  })
})

function assignAnnualReportValues () {
  return new Promise((resolve, reject) => {
    PaymentSlip
      .find({})
      .sort({ 'date': 1 })
      .exec()
      .then((paymentSlips) => {
        for (let i = 0; i < paymentSlips.length; i++) {
          const paymentSlip = paymentSlips[i]
          paymentSlip.ordinal = i + 1
          paymentSlip.annualReportPage = paymentSlip.date.getMonth() + 1
          PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip, (err) => {
            if (err) {
              console.error(err.message)
              reject(err)
            }
          })
        }
        resolve()
      })
      .catch((err) => {
        console.error(err.message)
        reject(err)
      })
  })
}

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
