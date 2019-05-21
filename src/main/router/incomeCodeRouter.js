const {ipcMain} = require('electron')
// const {PaymentCode} = require('../model/incomeCode')

const INCOME_CODES = {
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

ipcMain.on('get-income-codes', (event) => {
  console.log('Initiated get income codes')
  console.log(`Found: \n${JSON.stringify(INCOME_CODES, null, 2)}`)
  reply(event, 'get-income-codes-reply', INCOME_CODES, null)
})

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
