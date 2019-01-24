const annualReport = require('../../model/annualReport')
const { ipcRenderer } = require('electron')

const assert = require('assert')
const mongoose = require('mongoose')

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

describe('Annual report test', function () {
    before(async function () {
        const properties = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../resources/soc_bookkeeping_properties.yml'), 'utf8'))
        await mongoose.connect(properties.dbUrl + "-test")

        /*
         {
      "amount": 1,
      "amountText": "jedan",
      "date": "2019-01-16T00:00:00.000Z",
      "firstAmount": 1,
      "firstPart": "I",
      "firstPos": "1",
      "municipalityPresident": "Predsednik",
      "payed": "Platio",
      "reason": "Razlog",
      "received": "Primio",
      "secondAmount": 0,
      "secondPart": "I",
      "secondPos": "1",
      "town": "sfa",
    }
    */

        ipcRenderer.sendSync('create-payment-slip', paymentSlip)
        ipcRenderer.sendSync('create-receipt', receipt)
    })

    it('Should return valid annual report', async function () {
        annualReportObj = await annualReport.getAnnualReport(2018)
        console.log(annualReportObj)

        assert.equal(annualReportObj.year, 2018)
        assert.equal(annualReportObj.pages.length, 12)
    })
})