const mongoose = require('mongoose')
const paymentSlipSchema = require('./schema/paymentSlipSchema')

const DefaultPaymentSlip = mongoose.model('defaultPaymentSlips', paymentSlipSchema)

module.exports = DefaultPaymentSlip
