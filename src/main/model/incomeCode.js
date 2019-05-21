const mongoose = require('mongoose')
const paymentCodeSchema = require('./schema/paymentCodeSchema')

const IncomeCode = mongoose.model('incomeCodes', paymentCodeSchema)

module.exports = IncomeCode
