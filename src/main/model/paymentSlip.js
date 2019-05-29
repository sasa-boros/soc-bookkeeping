const mongoose = require('mongoose')

const Schema = mongoose.Schema

const paymentSlipSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  income: { type: Number },
  incomeAsText: { type: String },
  town: { type: String },
  reason: { type: String },
  payed: { type: String },
  incomesPerCode: { type: Array }
})

paymentSlipSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

paymentSlipSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)
const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = {
  PaymentSlip: PaymentSlip,
  DefaultPaymentSlip: DefaultPaymentSlip
}
