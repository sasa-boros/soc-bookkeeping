const { ipcRenderer } = require('electron')

function getAnnualReport (year) {
  return new Promise(function (resolve) {
    ipcRenderer.send('get-annual-report', year)
    ipcRenderer.once('get-annual-report-reply', (event, res) => {
      resolve(JSON.parse(res))
    })
  })
}

module.exports = {
  getAnnualReport: getAnnualReport
}
