const { OutcomeCode } = require('../model/paymentCode')

async function getOutcomeCodes () {
  console.log('Getting outcome codes')
  let outcomeCodes = await OutcomeCode.find({}).exec()
  console.log(`Returning: \n${JSON.stringify(outcomeCodes, null, 2)}`)
  return outcomeCodes
}

async function createOutcomeCodes (outcomeCodes) {
  console.log(`Creating outcome codes: \n${JSON.stringify(outcomeCodes, null, 2)}`)
  await OutcomeCode.remove({}).exec()
  for (let i = 0; i < outcomeCodes.length; i++) {
    await OutcomeCode(outcomeCodes[i]).save()
  }
  console.log('Successfully created outcome codes')
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes,
  createOutcomeCodes: createOutcomeCodes
}
