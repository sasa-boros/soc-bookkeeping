// const {PaymentCode} = require('../model/incomeCode')

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

function getIncomeCodes () {
  return new Promise((resolve) => {
    console.log('Getting income codes')
    console.log(`Returning: \n${JSON.stringify(CODES, null, 2)}`)
    resolve(CODES)
  })
}

module.exports = {
  getIncomeCodes: getIncomeCodes
}
