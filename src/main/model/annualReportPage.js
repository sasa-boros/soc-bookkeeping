const mongoose = require('mongoose')
const annualReportPageSchema = require('./schema/annualReportPageSchema')

const AnnualReportPage = mongoose.model('annualReportPages', annualReportPageSchema)

module.exports = AnnualReportPage
