const mongoose = require('mongoose')
const paymentCodeSchema = require('./schema/paymentCodeSchema')

const OutcomeCode = mongoose.model('outcomeCodes', paymentCodeSchema)

module.exports = OutcomeCode
