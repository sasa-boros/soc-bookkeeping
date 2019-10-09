const { PaymentSlip } = require('../model/paymentSlip')

async function arePaymentSlipsValid () {
  console.log('Checking if all payment slips are valid')
  const paymentSlips = await PaymentSlip.find({}).exec()
  var result = true
  for (let i=0; i < paymentSlips.length; i++) {
    if (!paymentSlips[i].isValid) {
      result = false
      break
    }
  }
  console.log(`Returning valid payment slips check result: \n${JSON.stringify(result, null, 2)}`)
  return result
}

async function getPaymentSlips (year) {
  console.log(`Getting payment slips for year ${year}`)
  var paymentSlips
  if (year) {
    paymentSlips = await PaymentSlip.find({ 'date': { '$gte': new Date(year, 0, 1), '$lt': new Date(year + 1, 0, 1) } }).exec()
  } else {
    paymentSlips = await PaymentSlip.find({}).exec()
  }
  console.log(`Returning payment slips: \n${JSON.stringify(paymentSlips, null, 2)}`)
  return paymentSlips
}

async function createPaymentSlip (paymentSlip) {
  delete paymentSlip._id
  console.log(`Creating payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  paymentSlip.isValid = true
  await PaymentSlip(paymentSlip).save()
  await assignAnnualReportValues()
  console.log('Successfully created payment slip')
}

async function deletePaymentSlip (paymentSlipId) {
  console.log(`Deleting payment slip with id ${paymentSlipId}`)
  await PaymentSlip.findByIdAndRemove(paymentSlipId).exec()
  await assignAnnualReportValues()
  console.log('Successfully deleted payment slip')
}

async function deletePaymentSlips (paymentSlipsIds) {
  console.log(`Deleting payment slips with ids ${paymentSlipsIds}`)
  await PaymentSlip.deleteMany({ _id: { $in : paymentSlipsIds }}).exec()
  await assignAnnualReportValues()
  console.log('Successfully deleted payment slips')
}

async function updatePaymentSlip (paymentSlip) {
  console.log(`Updating payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  paymentSlip.isValid = true
  await PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip).exec()
  await assignAnnualReportValues()
  console.log('Successfully updated payment slip')
}

async function assignAnnualReportValues () {
  let paymentSlips = await PaymentSlip.find({}).sort({ 'date': 1 }).exec()
  for (let i = 0; i < paymentSlips.length; i++) {
    const paymentSlip = paymentSlips[i]
    paymentSlip.ordinal = i + 1
    paymentSlip.annualReportPage = paymentSlip.date.getMonth() + 1
    await PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip).exec()
  }
}

module.exports = {
  arePaymentSlipsValid: arePaymentSlipsValid,
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  deletePaymentSlips: deletePaymentSlips,
  updatePaymentSlip: updatePaymentSlip
}
