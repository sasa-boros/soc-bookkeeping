const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const paymentSlipSchema = new Schema({
  amount: {type: Number},
  amountText: {type: String},
  town: {type: String},
  reason: {type: String},
  payed: {type: String},
  received: {type: String},
  firstPart: {type: String},
  firstPos: {type: String},
  firstAmount: {type: Number},
  secondPart: {type: String},
  secondPos: {type: String},
  secondAmount: {type: Number},
  reportPage: {type: Number},
  ordinal: {type: Number},
  municipalityPresident: {type: String}
})

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)

module.exports = PaymentSlip
