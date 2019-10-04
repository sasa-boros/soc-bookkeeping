const { ipcRenderer } = require('electron')

function getOutcomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-outcome-codes')
    ipcRenderer.once('get-outcome-codes-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function createOutcomeCode (outcomeCode) {
  return new Promise(function (resolve) {
    ipcRenderer.send('create-outcome-code', outcomeCode)
    ipcRenderer.once('create-outcome-code-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function deleteOutcomeCode (outcomeCodeId) {
  return new Promise(function (resolve) {
    ipcRenderer.send('delete-outcome-code', outcomeCodeId)
    ipcRenderer.once('delete-outcome-code-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function updateOutcomeCode (outcomeCode) {
  return new Promise(function (resolve) {
    ipcRenderer.send('update-outcome-code', outcomeCode)
    ipcRenderer.once('update-outcome-code-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getOutcomeCodes: getOutcomeCodes,
  createOutcomeCode: createOutcomeCode,
  updateOutcomeCode: updateOutcomeCode,
  deleteOutcomeCode: deleteOutcomeCode
}
