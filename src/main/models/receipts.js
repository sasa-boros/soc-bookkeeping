const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create a schema
const receiptSchema = new Schema({
  createdAt: {type: Date},
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
  municipalityPresident: {type: String},
  created_at: {type: Date},
  updated_at: {type: Date}
})

receiptSchema.pre('save', function (next) {
  var currentDate = new Date()

  this.updated_at = currentDate
  this.created_at = currentDate

  next()
})

receiptSchema.pre('findOneAndUpdate', function () {
  var currentDate = new Date()

  this.updated_at = currentDate
})

const Receipt = mongoose.model('receipts', receiptSchema)

module.exports = Receipt
