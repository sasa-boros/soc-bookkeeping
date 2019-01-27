const mongoose = require('mongoose')
const { assignAnnualReportValues, preSave, preFindOneAndUpdate } = require('./bkEntity')
// const encrypt = require('mongoose-encryption')
// const config = require('../../config/config')

const Schema = mongoose.Schema

const receiptSchema = new Schema({
  ordinal: {type: Number},
  annualReportPage: {type: Number},
  date: { type: Date },
  createdAt: { type: Date },
  amount: { type: Number },
  amountText: { type: String },
  churchMunicipality: { type: String },
  town: { type: String },
  reason: { type: String },
  payed: { type: String },
  received: { type: String },
  firstPart: { type: String },
  firstPos: { type: String },
  firstAmount: { type: Number },
  secondPart: { type: String },
  secondPos: { type: String },
  secondAmount: { type: Number },
  municipalityPresident: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date }
})

receiptSchema.statics.assignAnnualReportValues = assignAnnualReportValues

receiptSchema.pre('save', function (next) {
  preSave(this)
  next()
})

receiptSchema.pre('findOneAndUpdate', function (next) {
  preFindOneAndUpdate(this)
  next()
})

// receiptSchema.plugin(encrypt, { secret: config.encryptionSecret, excludeFromEncryption: ['created_at', 'updated_at'] })

const Receipt = mongoose.model('receipts', receiptSchema)
const DefaultReceipt = mongoose.model('defaultReceipts', receiptSchema)

module.exports = {
  Receipt: Receipt,
  DefaultReceipt: DefaultReceipt
}
