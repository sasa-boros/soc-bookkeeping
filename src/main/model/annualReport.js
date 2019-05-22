const mongoose = require('mongoose')

const Schema = mongoose.Schema

const annualReportSchema = new Schema({
  year: { type: Number },
  pages: { type: Array },
  totalIncomePerCode: { type: Schema.Types.Mixed },
  totalOutcomePerCode: { type: Schema.Types.Mixed },
  totalIncome: { type: Schema.Types.Mixed },
  totalOutcome: { type: Schema.Types.Mixed },
  total: { type: Schema.Types.Mixed }
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
