const {Schema} = require('mongoose')
const Big = require('big.js')

const annualReportPageSchema = new Schema({
  ordinal: { type: Number, default: 0 },
  monthText: { type: String, default: '' },
  paymentSlips: { type: Array, default: [] },
  receipts: { type: Array, default: [] },
  totalIncomePerCode: { type: Schema.Types.Mixed, default: {} },
  totalOutcomePerCode: { type: Schema.Types.Mixed, default: {} },
  totalIncome: { type: Schema.Types.Mixed, default: Big(0.0) },
  totalOutcome: { type: Schema.Types.Mixed, default: Big(0.0) },
  transferFromPreviousMonth: { type: Schema.Types.Mixed, default: Big(0.0) },
  transferToNextMonth: { type: Schema.Types.Mixed, default: Big(0.0) },
  total: { type: Schema.Types.Mixed, default: Big(0.0) }
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

module.exports = annualReportPageSchema
