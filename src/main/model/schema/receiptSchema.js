const {Schema} = require('mongoose')

const receiptSchema = new Schema({
  ordinal: { type: Number },
  annualReportPage: { type: Number },
  date: { type: Date },
  amount: { type: Number },
  amountText: { type: String },
  churchMunicipality: { type: String },
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
  municipalityPresident: { type: String }
})

receiptSchema.pre('save', (next) => {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

receiptSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

module.exports = receiptSchema
