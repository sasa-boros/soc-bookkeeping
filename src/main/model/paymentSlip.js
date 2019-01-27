const mongoose = require('mongoose')
const { assignAnnualReportValues, preSave, preFindOneAndUpdate } = require('./bkEntity')
// const encrypt = require('mongoose-encryption')
// const config = require('../../config/config')

const Schema = mongoose.Schema

const paymentSlipSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  amount: { type: Number },
  amountText: { type: String },
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

paymentSlipSchema.statics.assignAnnualReportValues = assignAnnualReportValues

paymentSlipSchema.pre('save', function (next) {
  preSave(this)
  next()
})

paymentSlipSchema.pre('findOneAndUpdate', function (next) {
  preFindOneAndUpdate(this)
  next()
})

// paymentSlipSchema.plugin(encrypt, { secret: config.encryptionSecret, excludeFromEncryption: ['created_at', 'updated_at'] })

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)
const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = {
  PaymentSlip: PaymentSlip,
  DefaultPaymentSlip: DefaultPaymentSlip
}
