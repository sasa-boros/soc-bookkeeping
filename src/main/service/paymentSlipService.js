const paymentSlipDao = require('../dao/paymentSlipDao')
const { app } = require('electron')
const fs = require('fs')
const path = require('path')

async function arePaymentSlipsValid () {
  console.log('Checking if all payment slips are valid')
  const paymentSlips = await paymentSlipDao.findAll()
  var result = true
  for (let i=0; i < paymentSlips.length; i++) {
    if (!paymentSlips[i].isValid) {
      result = false
      break
    }
  }
  console.log(`Returning valid payment slips check result: \n${JSON.stringify(result, null, 2)}`)
  return result
}

async function getPaymentSlips (year) {
  console.log(`Getting payment slips for year ${year}`)
  var paymentSlips
  if (year) {
    paymentSlips = await paymentSlipDao.findBetweenDates(new Date(year, 0, 1), new Date(year + 1, 0, 1))
  } else {
    paymentSlips = await paymentSlipDao.findAll()
  }
  console.log(`Returning payment slips: \n${JSON.stringify(paymentSlips, null, 2)}`)
  return paymentSlips
}

async function createPaymentSlip (paymentSlip) {
  delete paymentSlip._id
  paymentSlip.date = new Date(paymentSlip.date)
  console.log(`Creating payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  paymentSlip.isValid = true
  await paymentSlipDao.insert(paymentSlip)
  await assignAnnualReportValues()
  console.log('Successfully created payment slip')
}

async function deletePaymentSlip (paymentSlipId) {
  console.log(`Deleting payment slip with id ${paymentSlipId}`)
  await paymentSlipDao.removeById(paymentSlipId)
  await assignAnnualReportValues()
  console.log('Successfully deleted payment slip')
}

async function deletePaymentSlips (paymentSlipsIds) {
  console.log(`Deleting payment slips with ids ${paymentSlipsIds}`)
  await paymentSlipDao.removeManyByIds(paymentSlipsIds)
  await assignAnnualReportValues()
  console.log('Successfully deleted payment slips')
}

async function updatePaymentSlip (paymentSlip) {
  console.log(`Updating payment slip: \n${JSON.stringify(paymentSlip, null, 2)}`)
  paymentSlip.isValid = true
  paymentSlip.date = new Date(paymentSlip.date)
  await paymentSlipDao.updateById(paymentSlip._id, paymentSlip)
  await assignAnnualReportValues()
  console.log('Successfully updated payment slip')
}

async function assignAnnualReportValues () {
  let paymentSlips = await paymentSlipDao.findAllSortByDateAsc()
  var perYearOrdinal = {}
  for (let i = 0; i < paymentSlips.length; i++) {
    const paymentSlip = paymentSlips[i]
    const year = paymentSlip.date.getYear()
    if(perYearOrdinal[year]) {
      perYearOrdinal[year] += 1
    } else {
      perYearOrdinal[year] = 1
    }
    paymentSlip.ordinal = perYearOrdinal[year]
    paymentSlip.annualReportPage = paymentSlip.date.getMonth() + 1
    await paymentSlipDao.updateById(paymentSlip._id, paymentSlip, true)
  }
}

async function createPaymentSlipPdf (webContents) {
  webContents.printToPDF(pdfSettings(), function(err, data) {
    if (err) {
      throw new Error('Failed creating payment slip pdf')
    }
    try {
      fs.writeFileSync(path.join(app.getPath('userData'), '/payment-slip.pdf'), data);
    } catch(err) {
      throw new Error('Failed creating payment slip pdf')
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
  arePaymentSlipsValid: arePaymentSlipsValid,
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip,
  deletePaymentSlips: deletePaymentSlips,
  updatePaymentSlip: updatePaymentSlip,
  createPaymentSlipPdf: createPaymentSlipPdf
}
