const mongoose = require('mongoose')

const Schema = mongoose.Schema

const paymentSlipSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  createdAt: {type: Date},
  updatedAt: {type: Date},
  income: { type: Number },
  town: { type: String },
  reason: { type: String },
  payed: { type: String },
  incomePerCode: { type: Array }
})

paymentSlipSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updatedAt = currentDate
  this.createdAt = currentDate
  next()
})

paymentSlipSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updatedAt = currentDate
  next()
})

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)
const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = {
  PaymentSlip: PaymentSlip,
  DefaultPaymentSlip: DefaultPaymentSlip
}
