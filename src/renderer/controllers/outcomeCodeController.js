const { ipcRenderer } = require('electron')

function getOutcomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-outcome-codes')
    ipcRenderer.once('get-outcome-codes-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createOutcomeCodes (outcomeCodes) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-outcome-codes', outcomeCodes)
    ipcRenderer.once('create-outcome-codes-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes,
  createOutcomeCodes: createOutcomeCodes
}
