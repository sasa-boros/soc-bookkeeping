const mongoose = require('mongoose')
const receiptSchema = require('./schema/receiptSchema')

const Receipt = mongoose.model('receipts', receiptSchema)

module.exports = Receipt
