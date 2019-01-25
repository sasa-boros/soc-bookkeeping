const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  ipcRenderer.send('get-annual-report', year)
}

function getIncomeCodes () {
  ipcRenderer.send('get-income-codes')
}

function getOutcomeCodes () {
  ipcRenderer.send('get-outcome-codes')
}

ipcRenderer.on('get-annual-report-reply', function (event, annualReport) {
  // update annual report on frontend
})

ipcRenderer.on('get-income-codes-reply', function (event, incomeCodes) {
  // update income codes on frontend
})

ipcRenderer.on('get-outcome-codes-reply', function (event, outcomeCodes) {
  // update outcome codes on frontend
})

module.exports = {
  getAnnualReport: getAnnualReport,
  getIncomeCodes: getIncomeCodes,
  getOutcomeCodes: getOutcomeCodes
}
