const mongoose = require('mongoose')
const paymentSlipSchema = require('./schema/paymentSlipSchema')

const PaymentSlip = mongoose.model('paymentSlips', paymentSlipSchema)

module.exports = PaymentSlip
