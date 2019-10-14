const defaultReceiptDao = require('../dao/defaultReceiptDao')

async function getDefaultReceipt () {
  console.log('Getting default receipt')
  const defaultReceipt = await defaultReceiptDao.findOne({})
  console.log(`Returning default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  return defaultReceipt
}

async function createDefaultReceipt (defaultReceipt) {
  delete defaultReceipt._id
  console.log(`Creating default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  await defaultReceiptDao.removeAll()
  await defaultReceiptDao.insert(defaultReceipt)
  console.log('Successfully created default receipt')
}

async function deleteDefaultReceipt () {
  console.log('Deleting default receipt')
  await defaultReceiptDao.removeAll()
  console.log('Successfully deleted default receipt')
}

module.exports = {
  getDefaultReceipt: getDefaultReceipt,
  createDefaultReceipt: createDefaultReceipt,
  deleteDefaultReceipt: deleteDefaultReceipt
}
