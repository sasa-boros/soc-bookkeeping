const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const config = require('../../config/config')

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
  return this.find({
    'date':
    {
      '$gte': new Date(date.getFullYear(), date.getMonth(), 1),
      '$lt': new Date(date.getFullYear(), date.getMonth() + 1, 1)
    }
  }).sort({'date': 1}).exec().then(async function (receipts) {
    for (let i = 0; i < receipts.length; i++) {
      const receipt = receipts[i]

      receipt.ordinal = i + 1
      receipt.annualReportPage = date.getMonth() + 1
      await updateReceipt(receipt)
    }
    return receipts
  }).catch((err) => {
    console.error(err.message)
    throw err
  })
}

async function updateReceipt (receipt) {
  Receipt.findOneAndUpdate({_id: receipt._id}, receipt, function (err) {
    if (err) {
      console.error(err.message)
      throw err
    }
  })
}

receiptSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate

  next()
})

receiptSchema.plugin(encrypt, { secret: config.encryptionSecret, excludeFromEncryption: ['created_at', 'updated_at'] })

receiptSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate

  next()
})

const Receipt = mongoose.model('receipts', receiptSchema)
const DefaultReceipt = mongoose.model('defaultReceipts', receiptSchema)

module.exports = {
  Receipt: Receipt,
  DefaultReceipt: DefaultReceipt
}
