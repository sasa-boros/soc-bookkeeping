const { DefaultReceipt } = require('../model/receipt')

async function getDefaultReceipt () {
  console.log('Getting default receipt')
  let defaultReceipts = await DefaultReceipt.find({}).exec()
  if (defaultReceipts && defaultReceipts.length > 0) {
    console.log(`Returning: \n${JSON.stringify(defaultReceipts[0], null, 2)}`)
    return defaultReceipts[0]
  } else {
    console.log('Returning: null')
    return null
  }
}

async function createDefaultReceipt (defaultReceipt) {
  console.log(`Creating default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  await DefaultReceipt.deleteOne({}).exec()
  await DefaultReceipt(defaultReceipt).save()
  const defaultReceiptFromDb = await getDefaultReceipt()
  return defaultReceiptFromDb
  console.log('Successfully created default receipt')
}

async function deleteDefaultReceipt () {
  console.log('Deleting default receipt')
  await DefaultReceipt.deleteOne({}).exec()
  console.log('Successfully deleted default receipt')
}

module.exports = {
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt,
  deleteDefaultReceipt: deleteDefaultReceipt
}
