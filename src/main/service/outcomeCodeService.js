const outcomeCodeDao = require('../dao/outcomeCodeDao')
const receiptDao = require('../dao/receiptDao')

async function getOutcomeCodes () {
  console.log('Getting all outcome codes')
  var outcomeCodes = await outcomeCodeDao.findAll()
  console.log(`Returning outcome codes: \n${JSON.stringify(outcomeCodes, null, 2)}`)
  return outcomeCodes
}

async function createOutcomeCode (outcomeCode) {
  delete outcomeCode._id
  console.log(`Creating outcome code: \n${JSON.stringify(outcomeCode, null, 2)}`)
  await outcomeCodeDao.insert(outcomeCode)
  console.log('Successfully created outcome code')
}

async function deleteOutcomeCode (outcomeCodeId) {
  console.log(`Deleting outcome code with id ${JSON.stringify(outcomeCodeId)}`)
  const deletedOutcomeCode = await outcomeCodeDao.findById(outcomeCodeId)
  await outcomeCodeDao.removeById(outcomeCodeId)
  await makeReceiptsInvalid(deletedOutcomeCode)
  console.log('Successfully deleted outcome code')
}

async function updateOutcomeCode (outcomeCode) {
  console.log(`Updating outcome code: \n${JSON.stringify(outcomeCode, null, 2)}`)
  await outcomeCodeDao.updateById(outcomeCode._id, outcomeCode)
  console.log('Successfully updated outcome code')
}

async function makeReceiptsInvalid (deletedOutcomeCode) {
  console.log('Making associated receipts invalid')
  let receipts = await receiptDao.findAll()
  receipts.forEach(async receipt => {
    if (!receipt.outcomePerCode) {
      return
    }
    var filteredOutcomesPerCode = receipt.outcomePerCode.filter(outcomePerCode => {
      if (outcomePerCode.outcomeCode.partition == deletedOutcomeCode.partition && outcomePerCode.outcomeCode.position == deletedOutcomeCode.position) {
        return false
      }
      return true
    })
    if (!filteredOutcomesPerCode || filteredOutcomesPerCode.length != receipt.outcomePerCode.length) {
      receipt.isValid = false
      receipt.outcomePerCode = []
      console.log(`Receipt with id ${receipt._id} is no longer valid`)
      await receiptDao.updateById(receipt._id, receipt, true)
    }
  })
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes,
  createOutcomeCode: createOutcomeCode,
  deleteOutcomeCode: deleteOutcomeCode,
  updateOutcomeCode: updateOutcomeCode
}
