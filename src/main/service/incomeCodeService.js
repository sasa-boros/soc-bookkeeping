const incomeCodeDao = require('../dao/incomeCodeDao')
const paymentSlipDao = require('../dao/paymentSlipDao')
const defaultPaymentSlipDao = require('../dao/defaultPaymentSlipDao')

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
  await updatePaymentSlips(deletedIncomeCode)
  console.log('Successfully deleted income code')
}

async function updateIncomeCode (incomeCode) {
  console.log(`Updating income code: \n${JSON.stringify(incomeCode, null, 2)}`)
  await incomeCodeDao.updateById(incomeCode._id, incomeCode)
  console.log('Successfully updated income code')
}

async function updatePaymentSlips (deletedIncomeCode) {
  console.log('Making associated payment slips invalid and updating default')
  let paymentSlips = await paymentSlipDao.findAll()
  for (let i=0; i<paymentSlips.length; i++) {
    let paymentSlip = paymentSlips[i]
    if (!paymentSlip.incomePerCode) {
      continue
    }
    let incomePerCodeIndex = paymentSlip.incomePerCode.findIndex(incomePerCode => {
      return incomePerCode.incomeCode.partition == deletedIncomeCode.partition && incomePerCode.incomeCode.position == deletedIncomeCode.position
    })
    if (incomePerCodeIndex != -1) {
      paymentSlip.isValid = false
      paymentSlip.incomePerCode.splice(incomePerCodeIndex, 1)
      console.error(JSON.stringify(paymentSlip))
      if (paymentSlip.incomePerCode.length == 0) {
        paymentSlip.incomePerCode = null
      }
      await paymentSlipDao.updateById(paymentSlip._id, paymentSlip, true)
      console.log(`Payment slip with id ${paymentSlip._id} is no longer valid`)
    }
  }
  let defaultPaymentSlip = await defaultPaymentSlipDao.findOne()
  if (defaultPaymentSlip && defaultPaymentSlip.incomePerCode) {
    let incomePerCodeIndex = defaultPaymentSlip.incomePerCode.findIndex(incomePerCode => {
      return incomePerCode.incomeCode.partition == deletedIncomeCode.partition && incomePerCode.incomeCode.position == deletedIncomeCode.position
    })
    if (incomePerCodeIndex != -1) {
      defaultPaymentSlip.incomePerCode.splice(incomePerCodeIndex, 1)
      console.error(JSON.stringify(defaultPaymentSlip))
      if (defaultPaymentSlip.incomePerCode.length == 0) {
        defaultPaymentSlip.incomePerCode = null
      }
      delete defaultPaymentSlip._id
      await defaultPaymentSlipDao.removeAll()
      await defaultPaymentSlipDao.insert(defaultPaymentSlip)
      console.log(`Default payment slip is updated`)
    }
  }
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  createIncomeCode: createIncomeCode,
  deleteIncomeCode: deleteIncomeCode,
  updateIncomeCode: updateIncomeCode
}
