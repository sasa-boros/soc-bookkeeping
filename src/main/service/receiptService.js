const { Receipt } = require('../model/receipt')

async function getReceipts (year) {
  console.log(`Getting receipts for year ${year}`)
  var receipts
  if (year) {
    receipts = await Receipt.find({ 'date': { '$gte': new Date(year, 0, 1), '$lt': new Date(year + 1, 0, 1) } }).exec()
  } else {
    receipts = await Receipt.find({}).exec()
  }
  console.log(`Returning receipts: \n${JSON.stringify(receipts, null, 2)}`)
  return receipts
}

async function createReceipt (receipt) {
  delete receipt._id
  console.log(`Creating receipt: \n${JSON.stringify(receipt, null, 2)}`)
  await Receipt(receipt).save()
  await assignAnnualReportValues()
  console.log('Successfully created receipt')
}

async function deleteReceipt (receiptId) {
  console.log(`Deleting receipt with id ${receiptId}`)
  await Receipt.findByIdAndRemove(receiptId).exec()
  await assignAnnualReportValues()
  console.log('Successfully deleted receipt')
}

async function updateReceipt (receipt) {
  console.log(`Updating receipt: \n${JSON.stringify(receipt, null, 2)}`)
  await Receipt.findByIdAndUpdate(receipt._id, receipt).exec()
  await assignAnnualReportValues()
  console.log('Successfully updated receipt')
}

async function assignAnnualReportValues () {
  let receipts = await Receipt.find({}).sort({ 'date': 1 }).exec()
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i]
    receipt.ordinal = i + 1
    receipt.annualReportPage = receipt.date.getMonth() + 1
    await Receipt.findByIdAndUpdate(receipt._id, receipt).exec()
  }
}

module.exports = {
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  deleteReceipt: deleteReceipt,
  updateReceipt: updateReceipt
}
