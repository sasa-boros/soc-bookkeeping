const mongoose = require('mongoose')
const annualReportSchema = require('./schema/annualReportSchema')

const AnnualReport = mongoose.model('annualReports', annualReportSchema)

module.exports = AnnualReport
