const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-annual-report', year)
    ipcRenderer.once('get-annual-report-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

function getAnnualReportPages (annualReport) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-annual-report-pages', annualReport)
    ipcRenderer.once('get-annual-report-pages-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getAnnualReportPages: getAnnualReportPages
}
