const annualReport = require('../../model/annualReport')

const assert = require('assert')

const mongoose = require('mongoose')

const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')

describe('Annual report test', function () {
    before(async function () {
        const properties = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '../../resources/soc_bookkeeping_properties.yml'), 'utf8'))
        await mongoose.connect(properties.dbUrl)
    })

    it('Should return valid annual report', async function () {
        annualReportObj = await annualReport.getAnnualReport(2018)
        console.log(annualReportObj)
        
        assert.equal(annualReportObj.year, 2018)
        assert.equal(annualReportObj.pages.length, 12)
    })
})