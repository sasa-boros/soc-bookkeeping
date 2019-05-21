const {Schema} = require('mongoose')
const Big = require('big.js')

const annualReportSchema = new Schema({
  year: { type: Number, default: 0 },
  pages: { type: Array, default: [] },
  totalIncomePerCode: { type: Schema.Types.Mixed, default: {} },
  totalOutcomePerCode: { type: Schema.Types.Mixed, default: {} },
  totalIncome: { type: Schema.Types.Mixed, default: Big(0.0) },
  totalOutcome: { type: Schema.Types.Mixed, default: Big(0.0) },
  total: { type: Schema.Types.Mixed, default: Big(0.0) }
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

module.exports = annualReportSchema
