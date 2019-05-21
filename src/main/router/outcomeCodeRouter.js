const {ipcMain} = require('electron')
// const {PaymentCode} = require('../model/incomeCode')

const OUTCOME_CODES = {
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

ipcMain.on('get-outcome-codes', (event) => {
  console.log('Initiated get outcome codes')
  console.log(`Found: \n${JSON.stringify(OUTCOME_CODES, null, 2)}`)
  reply(event, 'get-outcome-codes-reply', OUTCOME_CODES, null)
})

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
