const mongoose = require('mongoose')
const receiptSchema = require('./schema/receiptSchema')

const DefaultReceipt = mongoose.model('defaultReceipts', receiptSchema)

module.exports = DefaultReceipt
