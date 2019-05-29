const { IncomeCode } = require('../model/paymentCode')

async function getIncomeCodes () {
  console.log('Getting income codes')
  let incomeCodes = await IncomeCode.find({}).exec()
  console.log(`Returning: \n${JSON.stringify(incomeCodes, null, 2)}`)
  return incomeCodes
}

async function createIncomeCodes (incomeCodes) {
  console.log(`Creating income codes: \n${JSON.stringify(incomeCodes, null, 2)}`)
  await IncomeCode.remove({}).exec()
  for (let i = 0; i < incomeCodes.length; i++) {
    await IncomeCode(incomeCodes[i]).save()
  }
  console.log('Successfully created income codes')
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  createIncomeCodes: createIncomeCodes
}
