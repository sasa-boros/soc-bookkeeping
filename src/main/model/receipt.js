const mongoose = require('mongoose')

const Schema = mongoose.Schema

const receiptSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  outcome: { type: Number },
  outcomeAsText: { type: String },
  churchMunicipality: { type: String },
  town: { type: String },
  reason: { type: String },
  received: { type: String },
  outcomesPerCode: { type: Array }
})

receiptSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

receiptSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

const Receipt = mongoose.model('receipts', receiptSchema)
const DefaultReceipt = mongoose.model('defaultReceipts', receiptSchema)

module.exports = {
  Receipt: Receipt,
  DefaultReceipt: DefaultReceipt
}
