const mongoose = require('mongoose')

const Schema = mongoose.Schema

const paymentSlipSchema = new Schema({
  isValid: { type: Boolean, default: true },
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
  // if we are assigning annual report values we don't update 'updatedAt'
  if(!this._update.ordinal) {
    this._update.updatedAt = currentDate
  }
  next()
})

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)
const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = {
  PaymentSlip: PaymentSlip,
  DefaultPaymentSlip: DefaultPaymentSlip
}
