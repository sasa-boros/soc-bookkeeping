const { IncomeCode } = require('../model/paymentCode')

// TO BE REMOVED
const CODES = {
  'I/1': 'парохијал',
  'I/2': 'иконе',
  'I/3': '',
  'II/1': '',
  'II/2': 'свеће',
  'II/3': '',
  'II/4': '',
  'II/5': '',
  'II/6': '',
  'III/1': '',
  'III/2': 'пренос готовине из прет. год.',
  'III/3': '',
  'III/4': '',
  'III/5': '',
  'IV': 'закуп земље'
}

// TO BE REMOVED
async function getIncomeCodes () {
  console.log('Getting income codes')
  console.log(`Returning: \n${JSON.stringify(CODES, null, 2)}`)
  return CODES
}

/* USE AFTER FE HAS A WAY OF ADDING CODES
async function getIncomeCodes () {
  console.log('Getting income codes')
  let incomeCodes = await IncomeCode.find({}).exec()
  console.log(`Returning: \n${JSON.stringify(incomeCodes, null, 2)}`)
  return incomeCodes
}
*/

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
