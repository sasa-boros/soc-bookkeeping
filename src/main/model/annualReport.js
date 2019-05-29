const mongoose = require('mongoose')

const Schema = mongoose.Schema

const annualReportSchema = new Schema({
  year: { type: Number },
  pages: { type: Array },
  totalIncomePerCode: { type: Array },
  totalOutcomePerCode: { type: Array },
  totalIncome: { type: Schema.Types.Mixed }, // BIG
  totalOutcome: { type: Schema.Types.Mixed }, // BIG
  total: { type: Schema.Types.Mixed } // BIG
})

annualReportSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

annualReportSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

const AnnualReport = mongoose.model('annualReports', annualReportSchema)

module.exports = {
  AnnualReport: AnnualReport
}
