const { ipcRenderer } = require('electron')

function getIncomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-income-codes')
    ipcRenderer.once('get-income-codes-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createIncomeCodes (incomeCodes) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-income-codes', incomeCodes)
    ipcRenderer.once('create-income-codes-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  createIncomeCodes: createIncomeCodes
}
