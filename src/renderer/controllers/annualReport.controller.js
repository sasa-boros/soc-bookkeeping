const {ipcRenderer} = require('electron')

function getIncomePartPos () {
  const INCOME_PART_POS = ipcRenderer.sendSync('get-income-part-pos')
  return INCOME_PART_POS
}

function getOutcomePartPos () {
    const OUTCOME_PART_POS = ipcRenderer.sendSync('get-outcome-part-pos')
    return OUTCOME_PART_POS
}