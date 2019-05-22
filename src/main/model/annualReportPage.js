const mongoose = require('mongoose')

const Schema = mongoose.Schema

const annualReportPageSchema = new Schema({
  ordinal: { type: Number },
  monthText: { type: String },
  paymentSlips: { type: Array },
  receipts: { type: Array },
  totalIncomePerCode: { type: Schema.Types.Mixed },
  totalOutcomePerCode: { type: Schema.Types.Mixed },
  totalIncome: { type: Schema.Types.Mixed },
  totalOutcome: { type: Schema.Types.Mixed },
  transferFromPreviousMonth: { type: Schema.Types.Mixed },
  transferToNextMonth: { type: Schema.Types.Mixed },
  total: { type: Schema.Types.Mixed }
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
