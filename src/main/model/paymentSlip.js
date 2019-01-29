const mongoose = require('mongoose')
const { assignAnnualReportValues, preSave, preFindOneAndUpdate } = require('./bkEntity')
// const CryptoJS = require('crypto-js')

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
  // Encrypt
  /* var ps = this._doc
  var psEncrypted = {}
  Object.keys(ps).forEach(function (key) {
    psEncrypted[key] = CryptoJS.AES.encrypt(JSON.stringify(ps[key]), 'secret key 123').toString()
  })
  this._doc = psEncrypted */
  next()
})

paymentSlipSchema.pre('findOneAndUpdate', function (next) {
  preFindOneAndUpdate(this)
  next()
})

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)
const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = {
  PaymentSlip: PaymentSlip,
  DefaultPaymentSlip: DefaultPaymentSlip
}
