const incomeCodeDao = require('../dao/incomeCodeDao')
const paymentSlipDao = require('../dao/paymentSlipDao')

async function getIncomeCodes () {
  console.log('Getting all income codes')
  var incomeCodes = await incomeCodeDao.findAll()
  console.log(`Returning income codes: \n${JSON.stringify(incomeCodes, null, 2)}`)
  return incomeCodes
}

async function createIncomeCode (incomeCode) {
  delete incomeCode._id
  console.log(`Creating income code: \n${JSON.stringify(incomeCode, null, 2)}`)
  await incomeCodeDao.insert(incomeCode)
  console.log('Successfully created income code')
}

async function deleteIncomeCode (incomeCodeId) {
  console.log(`Deleting income code with id ${JSON.stringify(incomeCodeId)}`)
  const deletedIncomeCode = await incomeCodeDao.findById(incomeCodeId)
  await incomeCodeDao.removeById(incomeCodeId)
  await makePaymentSlipsInvalid(deletedIncomeCode)
  console.log('Successfully deleted income code')
}

async function updateIncomeCode (incomeCode) {
  console.log(`Updating income code: \n${JSON.stringify(incomeCode, null, 2)}`)
  await incomeCodeDao.updateById(incomeCode._id, incomeCode)
  console.log('Successfully updated income code')
}

async function makePaymentSlipsInvalid (deletedIncomeCode) {
  console.log('Making associated payment slips invalid')
  let paymentSlips = await paymentSlipDao.findAll()
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
      await paymentSlipDao.updateById(paymentSlip._id, paymentSlip, true)
    }
  })
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  createIncomeCode: createIncomeCode,
  deleteIncomeCode: deleteIncomeCode,
  updateIncomeCode: updateIncomeCode
}
