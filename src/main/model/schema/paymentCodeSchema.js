const {Schema} = require('mongoose')

const paymentCodeSchema = new Schema({
  partition: {type: Number},
  position: {type: Number},
  description: { type: String },
  isTaxed: {type: Boolean}
})

paymentCodeSchema.pre('save', function (next) {
  const currentDate = new Date()
  this.updated_at = currentDate
  this.created_at = currentDate
  next()
})

paymentCodeSchema.pre('findOneAndUpdate', function (next) {
  const currentDate = new Date()
  this._update.updated_at = currentDate
  next()
})

module.exports = paymentCodeSchema
