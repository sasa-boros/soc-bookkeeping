const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  const annualReport = ipcRenderer.sendSync('get-annual-report')
  return annualReport
}

function getIncomeCodes () {
  const INCOME_CODES = ipcRenderer.sendSync('get-income-codes')
  return INCOME_CODES
}

function getOutcomeCodes () {
  const OUTCOME_CODES = ipcRenderer.sendSync('get-outcome-codes')
  return OUTCOME_CODES
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
