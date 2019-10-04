const { OutcomeCode } = require('../model/paymentCode')
const { Receipt } = require('../model/receipt')

async function getOutcomeCodes () {
  console.log('Getting all outcome codes')
  var outcomeCodes = await OutcomeCode.find({}).exec()
  console.log(`Returning outcome codes: \n${JSON.stringify(outcomeCodes, null, 2)}`)
  return outcomeCodes
}

async function createOutcomeCode (outcomeCode) {
  delete outcomeCode._id
  console.log(`Creating outcome code: \n${JSON.stringify(outcomeCode, null, 2)}`)
  await OutcomeCode(outcomeCode).save()
  console.log('Successfully created outcome code')
}

async function deleteOutcomeCode (outcomeCodeId) {
  console.log(`Deleting outcome code with id ${outcomeCodeId}`)
  var deletedOutcomeCode = await OutcomeCode.findByIdAndRemove(outcomeCodeId).exec()
  await makeReceiptsInvalid(deletedOutcomeCode)
  console.log('Successfully deleted outcome code')
}

async function updateOutcomeCode (outcomeCode) {
  console.log(`Updating outcome code: \n${JSON.stringify(outcomeCode, null, 2)}`)
  await OutcomeCode.findByIdAndUpdate(outcomeCode._id, outcomeCode).exec()
  console.log('Successfully updated outcome code')
}

async function makeReceiptsInvalid (deletedOutcomeCode) {
  console.log('Making associated receipts invalid')
  let receipts = await Receipt.find({}).exec()
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
      await Receipt.findByIdAndUpdate(receipt._id, receipt).exec()
    }
  })
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes,
  createOutcomeCode: createOutcomeCode,
  deleteOutcomeCode: deleteOutcomeCode,
  updateOutcomeCode: updateOutcomeCode
}
