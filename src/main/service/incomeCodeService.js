const { IncomeCode } = require('../model/paymentCode')
const { PaymentSlip } = require('../model/paymentSlip')

async function getIncomeCodes () {
  console.log('Getting all income codes')
  var incomeCodes = await IncomeCode.find({}).exec()
  console.log(`Returning income codes: \n${JSON.stringify(incomeCodes, null, 2)}`)
  return incomeCodes
}

async function createIncomeCode (incomeCode) {
  delete incomeCode._id
  console.log(`Creating income code: \n${JSON.stringify(incomeCode, null, 2)}`)
  await IncomeCode(incomeCode).save()
  console.log('Successfully created income code')
}

async function deleteIncomeCode (incomeCodeId) {
  console.log(`Deleting income code with id ${incomeCodeId}`)
  var deletedIncomeCode = await IncomeCode.findByIdAndRemove(incomeCodeId).exec()
  await makePaymentSlipsInvalid(deletedIncomeCode)
  console.log('Successfully deleted income code')
}

async function updateIncomeCode (incomeCode) {
  console.log(`Updating income code: \n${JSON.stringify(incomeCode, null, 2)}`)
  await IncomeCode.findByIdAndUpdate(incomeCode._id, incomeCode).exec()
  console.log('Successfully updated income code')
}

async function makePaymentSlipsInvalid (deletedIncomeCode) {
  console.log('Making associated payment slips invalid')
  let paymentSlips = await PaymentSlip.find({}).exec()
  paymentSlips.forEach(async paymentSlip => {
    if (!paymentSlip.incomePerCode) {
      return
    }
    var filteredIncomesPerCode = paymentSlip.incomePerCode.filter(incomePerCode => {
      if (incomePerCode.incomeCode.partition == deletedIncomeCode.partition && incomePerCode.incomeCode.position == deletedIncomeCode.position) {
        return false
      }
      return true
    })
    if (!filteredIncomesPerCode || filteredIncomesPerCode.length != paymentSlip.incomePerCode.length) {
      paymentSlip.isValid = false
      paymentSlip.incomePerCode = []
      console.log(`Payment slip with id ${paymentSlip._id} is no longer valid`)
      await PaymentSlip.findByIdAndUpdate(paymentSlip._id, paymentSlip).exec()
    }
  })
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  createIncomeCode: createIncomeCode,
  deleteIncomeCode: deleteIncomeCode,
  updateIncomeCode: updateIncomeCode
}
