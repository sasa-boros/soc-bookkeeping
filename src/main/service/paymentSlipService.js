const { PaymentSlip } = require('../model/paymentSlip')

function getPaymentSlips (year) {
  return new Promise((resolve, reject) => {
    console.log(`Getting payment slips for year ${year}`)
    PaymentSlip
      .find({
        'date':
        {
          '$gte': new Date(year, 0, 1),
          '$lt': new Date(year + 1, 0, 1)
        }
      })
      .exec()
      .then((paymentSlips) => {
        console.log(`Returning: \n${JSON.stringify(paymentSlips, null, 2)}`)
        resolve(paymentSlips)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function createPaymentSlip (paymentSlip) {
  return new Promise((resolve, reject) => {
    console.log(`Creating payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
    delete paymentSlip['_id']
    var newPaymentSlip = PaymentSlip(paymentSlip)
    newPaymentSlip
      .save((err, createdPaymentSlip) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${createdPaymentSlip}`)
            resolve(createdPaymentSlip)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

function deletePaymentSlip (paymentSlipId) {
  return new Promise((resolve, reject) => {
    console.log(`Deleting payment slip by id ${paymentSlipId}`)
    PaymentSlip
      .findByIdAndRemove(paymentSlipId, (err, deletedPaymentSlip) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${deletedPaymentSlip}`)
            resolve(deletedPaymentSlip)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

function updatePaymentSlip (paymentSlip) {
  return new Promise((resolve, reject) => {
    console.log(`Updating payment slip by: \n${JSON.stringify(paymentSlip, null, 2)}`)
    PaymentSlip
      .findByIdAndUpdate(paymentSlip._id, paymentSlip, (err, updatedPaymentSlip) => {
        if (err) {
          reject(err)
        }
        assignAnnualReportValues()
          .then(() => {
            console.log(`Returning: \n${updatedPaymentSlip}`)
            resolve(updatedPaymentSlip)
          })
          .catch((err) => {
            reject(err)
          })
      })
  })
}

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
              reject(err)
            }
          })
        }
        resolve()
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  updatePaymentSlip: updatePaymentSlip
}
