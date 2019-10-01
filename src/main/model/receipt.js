const mongoose = require('mongoose')

const Schema = mongoose.Schema

const receiptSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  createdAt: {type: Date},
  updatedAt: {type: Date},
  outcome: { type: Number },
  churchMunicipality: { type: String },
  town: { type: String },
  reason: { type: String },
  received: { type: String },
  outcomePerCode: { type: Array }
})

receiptSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updatedAt = currentDate
  this.createdAt = currentDate
  next()
})

receiptSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updatedAt = currentDate
  next()
})

const Receipt = mongoose.model('receipts', receiptSchema)
const DefaultReceipt = mongoose.model('defaultReceipts', receiptSchema)

module.exports = {
  Receipt: Receipt,
  DefaultReceipt: DefaultReceipt
}
