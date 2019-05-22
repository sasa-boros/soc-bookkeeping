const { OutcomeCode } = require('../model/paymentCode')

// TO BE REMOVED
const CODES = {
  'I/1': 'плата пароху',
  'I/2': 'помоћ',
  'II/1': 'огрев, осветљење, телефон',
  'II/2': 'набавка свећа и др.',
  'II/3': 'канц. материјал',
  'II/4': '',
  'II/5': '',
  'II/6': 'набавка часописа, књига и радио Српски Сион',
  'II/7': '',
  'III/1-2': 'одржавање храма',
  'III/3': 'фонд самопомоћи',
  'III/4': 'ЦТ 4%',
  'III/5': 'провизија банке',
  'III/6': 'фонд 30% од земље',
  'III/7': 'паушал арх. намеснику',
  'IV': 'епарх. разрез'
}

// TO BE REMOVED
async function getOutcomeCodes () {
  console.log('Getting outcome codes')
  console.log(`Returning: \n${JSON.stringify(CODES, null, 2)}`)
  return CODES
}

/* USE AFTER FE HAS A WAY OF ADDING CODES
async function getOutcomeCodes () {
  console.log('Getting outcome codes')
  let outcomeCodes = await OutcomeCode.find({}).exec()
  console.log(`Returning: \n${JSON.stringify(outcomeCodes, null, 2)}`)
  return outcomeCodes
}
*/

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
