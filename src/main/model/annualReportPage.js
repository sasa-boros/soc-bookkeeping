const mongoose = require('mongoose')

const Schema = mongoose.Schema

const annualReportPageSchema = new Schema({
  ordinal: { type: Number },
  paymentSlips: { type: Array },
  receipts: { type: Array },
  totalIncomePerCode: { type: Array },
  totalOutcomePerCode: { type: Array },
  totalIncome: { type: Schema.Types.Mixed }, // BIG
  totalOutcome: { type: Schema.Types.Mixed }, // BIG
  transferFromPreviousMonth: { type: Schema.Types.Mixed }, // BIG
  transferToNextMonth: { type: Schema.Types.Mixed }, // BIG
  total: { type: Schema.Types.Mixed } // BIG
})

annualReportPageSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

annualReportPageSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

const AnnualReportPage = mongoose.model('annualReportPages', annualReportPageSchema)

module.exports = {
  AnnualReportPage: AnnualReportPage
}
