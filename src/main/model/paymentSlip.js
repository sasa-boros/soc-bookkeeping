const mongoose = require('mongoose')
var encrypt = require('mongoose-encryption')

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

paymentSlipSchema.statics.reorderByDate = function (date) {
  return this.find({
    'date':
    {
      '$gte': new Date(date.getFullYear(), date.getMonth(), 1),
      '$lt': new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  }).sort({ 'date': 1 }).exec().then(async function (paymentSlips) {
    for (let i = 0; i < paymentSlips.length; i++) {
      const paymentSlip = paymentSlips[i]

      paymentSlip.ordinal = i + 1
      paymentSlip.annualReportPage = date.getMonth() + 1
      await updatePaymentSlip(paymentSlip)
    }
    return paymentSlips
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
}

async function updatePaymentSlip (paymentSlip) {
  PaymentSlip.findOneAndUpdate({ _id: paymentSlip._id }, paymentSlip, function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
  })
}

paymentSlipSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate

  next()
})

userSchema.plugin(encrypt, { secret: process.env.PROPERTIES.encryptionSecret, excludeFromEncryption: ['created_at', 'updated_at']})

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
