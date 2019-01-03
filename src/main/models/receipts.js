const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const receiptSchema = new Schema({
  amount: {type: Number},
  amountText: {type: String},
  churchMunicipality: {type: String},
  date: {type: Date},
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

const Receipt = mongoose.model('receipts', receiptSchema)

module.exports = Receipt
