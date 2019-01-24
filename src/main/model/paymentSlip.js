const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paymentSlipSchema = new Schema({
  ordinal: {type: Number},
  annualReportPage: {type: Number},
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
  this.find({
    'date':
    {
      '$gte': new Date(date.getFullYear(), date.getMonth(), 1),
      '$lt': new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  }).sort({'date': 1}).exec().then(function (paymentSlips) {
    for (let i; i < paymentSlips.length; i++) {
      const paymentSlip = paymentSlips[i]

      paymentSlip.ordinal = i + 1
      paymentSlip.annualReportPage = date.getMonth() + 1
      PaymentSlip.findOneAndUpdate({_id: paymentSlip._id}, paymentSlip, function (err) {
        if (err) {
          console.error(err.message)
          throw err
        }
      })
    }
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
}

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

module.exports = PaymentSlip
