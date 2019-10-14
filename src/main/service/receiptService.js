const receiptDao = require('../dao/receiptDao')

const fs = require('fs')

async function areReceiptsValid () {
  console.log('Checking if all receipts are valid')
  const receipts = await receiptDao.findAll()
  var result = true
  for (let i=0; i < receipts.length; i++) {
    if (!receipts[i].isValid) {
      result = false
      break
    }
  }
  console.log(`Returning valid receipts check result: \n${JSON.stringify(result, null, 2)}`)
  return result
}

async function getReceipts (year) {
  console.log(`Getting receipts for year ${year}`)
  var receipts
  if (year) {
    receipts = await receiptDao.findBetweenDates(new Date(year, 0, 1), new Date(year + 1, 0, 1))
  } else {
    receipts = await receiptDao.findAll()
  }
  console.log(`Returning receipts: \n${JSON.stringify(receipts, null, 2)}`)
  return receipts
}

async function createReceipt (receipt) {
  delete receipt._id
  receipt.date = new Date(receipt.date)
  console.log(`Creating receipt: \n${JSON.stringify(receipt, null, 2)}`)
  receipt.isValid = true
  await receiptDao.insert(receipt)
  await assignAnnualReportValues()
  console.log('Successfully created receipt')
}

async function deleteReceipt (receiptId) {
  console.log(`Deleting receipt with id ${receiptId}`)
  await receiptDao.removeById(receiptId)
  await assignAnnualReportValues()
  console.log('Successfully deleted receipt')
}

async function deleteReceipts (receiptsIds) {
  console.log(`Deleting receipts with ids ${receiptsIds}`)
  await receiptDao.removeManyByIds(receiptsIds)
  await assignAnnualReportValues()
  console.log('Successfully deleted receipts')
}

async function updateReceipt (receipt) {
  console.log(`Updating receipt: \n${JSON.stringify(receipt, null, 2)}`)
  receipt.isValid = true
  receipt.date = new Date(receipt.date)
  await receiptDao.updateById(receipt._id, receipt)
  await assignAnnualReportValues()
  console.log('Successfully updated receipt')
}

async function assignAnnualReportValues () {
  let receipts = await receiptDao.findAllSortByDateAsc()
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i]
    receipt.ordinal = i + 1
    receipt.annualReportPage = receipt.date.getMonth() + 1
    await receiptDao.updateById(receipt._id, receipt)
  }
}

async function createReceiptPdf (webContents) {
  webContents.printToPDF(pdfSettings(), function(err, data) {
    if (err) {
      console.error(err)
      throw new Error('Failed creating receipt pdf')
    }
    try {
      fs.writeFileSync('./receipt.pdf', data);
    } catch (err){
      console.error(err)
      throw new Error('Failed creating receipt pdf')
    }
  })
}

function pdfSettings () {
  var settings = {
      landscape: false,
      marginsType: 0,
      printBackground: false,
      printSelectionOnly: false,
      pageSize: "A4",
  };
  return settings;
}

module.exports = {
  areReceiptsValid: areReceiptsValid,
  getReceipts: getReceipts,
  createReceipt: createReceipt,
  deleteReceipt: deleteReceipt,
  deleteReceipts: deleteReceipts,
  updateReceipt: updateReceipt,
  createReceiptPdf: createReceiptPdf
}
