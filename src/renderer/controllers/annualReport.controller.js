const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  return ipcRenderer.sendSync('get-annual-report', year)
}

function getIncomeCodes () {
  return ipcRenderer.sendSync('get-income-codes')
}

function getOutcomeCodes () {
  return ipcRenderer.sendSync('get-outcome-codes')
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
