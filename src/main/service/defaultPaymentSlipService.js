const { DefaultPaymentSlip } = require('../model/paymentSlip')

async function getDefaultPaymentSlip () {
  console.log('Getting default payment slip')
  let defaultPaymentSlips = await DefaultPaymentSlip.find({}).exec()
  if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
    console.log(`Returning: \n${JSON.stringify(defaultPaymentSlips[0], null, 2)}`)
    return defaultPaymentSlips[0]
  } else {
    console.log('Returning: null')
    return null
  }
}

async function createDefaultPaymentSlip (defaultPaymentSlip) {
  console.log(`Creating default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
  await DefaultPaymentSlip.deleteOne({}).exec()
  await DefaultPaymentSlip(defaultPaymentSlip).save()
  console.log('Successfully created default payment slip')
}

async function deleteDefaultPaymentSlip () {
  console.log('Deleting default payment slip')
  await DefaultPaymentSlip.deleteOne({}).exec()
  console.log('Successfully deleted default payment slip')
}

module.exports = {
  getDefaultPaymentSlip: getDefaultPaymentSlip,
  createDefaultPaymentSlip: createDefaultPaymentSlip,
  deleteDefaultPaymentSlip: deleteDefaultPaymentSlip
}
