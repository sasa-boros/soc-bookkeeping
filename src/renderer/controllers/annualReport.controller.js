const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-annual-report', year)
    ipcRenderer.on('get-annual-report-reply', function (event, data) {
      resolve(data)
    })
  })
}

function getIncomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-income-codes')
    ipcRenderer.on('get-income-codes-reply', function (event, data) {
      resolve(data)
    })
  })
}

function getOutcomeCodes () {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-outcome-codes')
    ipcRenderer.on('get-outcome-codes-reply', function (event, data) {
      resolve(data)
    })
  })
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
