const mongoose = require('mongoose')
const Schema = mongoose.Schema

const receiptSchema = new Schema({
  ordinal: {type: Number},
  annualReportPage: {type: Number},
  date: { type: Date },
  createdAt: { type: Date },
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
  municipalityPresident: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date }
})

receiptSchema.statics.reorderByDate = function (date) {
  this.find({
    'date':
    {
      '$gte': new Date(date.getFullYear(), date.getMonth(), 1),
      '$lt': new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  }).sort({'date': 1}).exec().then(function (receipts) {
    for (let i; i < receipts.length; i++) {
      const receipt = receipts[i]

      receipt.ordinal = i + 1
      receipt.annualReportPage = date.getMonth() + 1
      Receipt.findOneAndUpdate({_id: receipt._id}, receipt, function (err) {
        if (err) {
          console.error(err.message)
          throw err
        }
      })
    }
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
}

receiptSchema.pre('save', function (next) {
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

const Receipt = mongoose.model('receipts', receiptSchema)

module.exports = Receipt
