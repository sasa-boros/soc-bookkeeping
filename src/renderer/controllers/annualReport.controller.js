const { ipcRenderer } = require('electron')

function getIncomeCodes () {
  const INCOME_CODES = ipcRenderer.sendSync('get-income-codes')
  return INCOME_CODES
}

function getOutcomeCodes () {
  const OUTCOME_CODES = ipcRenderer.sendSync('get-outcome-codes')
  return OUTCOME_CODES
}

module.exports = {
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
