const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-annual-report', year)
    ipcRenderer.once('get-annual-report-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function getIncomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-income-codes')
    ipcRenderer.once('get-income-codes-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

function getOutcomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-outcome-codes')
    ipcRenderer.once('get-outcome-codes-reply', function (event, res) {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
