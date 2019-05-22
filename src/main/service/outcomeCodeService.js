// const {PaymentCode} = require('../model/incomeCode')

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

function getOutcomeCodes () {
  return new Promise((resolve) => {
    console.log('Getting outcome codes')
    console.log(`Returning: \n${JSON.stringify(CODES, null, 2)}`)
    resolve(CODES)
  })
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes
}
