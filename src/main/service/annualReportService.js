const { PaymentSlip } = require('../model/paymentSlip')
const { Receipt } = require('../model/receipt')
const { AnnualReportPage } = require('../model/annualReportPage')
const { AnnualReport } = require('../model/annualReport')
const Big = require('big.js')

async function getAnnualReport (year) {
  console.log(`Getting annual report for year ${year}`)
  // init
  const annualReport = AnnualReport()
  annualReport.pages = []
  annualReport.totalIncomePerCode = {}
  annualReport.totalOutcomePerCode = {}
  annualReport.totalIncome = Big(0.0)
  annualReport.totalOutcome = Big(0.0)
  annualReport.total = Big(0.0)
  annualReport.year = year
  for (let i = 0; i < 12; i++) {
    // init
    const annualReportPage = AnnualReportPage()
    annualReportPage.ordinal = i + 1
    annualReportPage.paymentSlips = []
    annualReportPage.receipts = []
    annualReportPage.totalIncomePerCode = {}
    annualReportPage.totalOutcomePerCode = {}
    annualReportPage.totalIncome = Big(0.0)
    annualReportPage.totalOutcome = Big(0.0)
    annualReportPage.transferFromPreviousMonth = Big(0.0)
    annualReportPage.transferToNextMonth = Big(0.0)
    annualReportPage.total = Big(0.0)

    const paymentSlips = await findAndSortEntitiesPerMonth(PaymentSlip, year, i, 1)
    const receipts = await findAndSortEntitiesPerMonth(Receipt, year, i, 1)

    if (paymentSlips) {
      for (let j = 0; j < paymentSlips.length; j++) {
        const paymentSlip = paymentSlips[j]
        if (paymentSlip.firstPart && paymentSlip.firstPos && paymentSlip.firstAmount) {
          calculateTotalPayments(paymentSlip.firstPart, paymentSlip.firstPos, paymentSlip.firstAmount, annualReportPage.totalIncomePerCode)
        }
        if (paymentSlip.secondPart && paymentSlip.secondPos && paymentSlip.secondAmount) {
          calculateTotalPayments(paymentSlip.secondPart, paymentSlip.secondPos, paymentSlip.secondAmount, annualReportPage.totalIncomePerCode)
        }
        annualReportPage.paymentSlips.push(paymentSlip)
      }

      for (let code in annualReportPage.totalIncomePerCode) {
        annualReportPage.totalIncome = annualReportPage.totalIncome.plus(annualReportPage.totalIncomePerCode[code])
        if (annualReport.totalIncomePerCode[code]) {
          annualReport.totalIncomePerCode[code] = annualReport.totalIncomePerCode[code].plus(annualReportPage.totalIncomePerCode[code])
        } else {
          annualReport.totalIncomePerCode[code] = annualReportPage.totalIncomePerCode[code]
        }
      }
      annualReport.totalIncome = annualReport.totalIncome.plus(annualReportPage.totalIncome)
    }
    if (receipts) {
      for (let j = 0; j < receipts.length; j++) {
        const receipt = receipts[j]
        if (receipt.firstPart && receipt.firstPos && receipt.firstAmount) {
          calculateTotalPayments(receipt.firstPart, receipt.firstPos, receipt.firstAmount, annualReportPage.totalOutcomePerCode)
        }
        if (receipt.secondPart && receipt.secondPos && receipt.secondAmount) {
          calculateTotalPayments(receipt.secondPart, receipt.secondPos, receipt.secondAmount, annualReportPage.totalOutcomePerCode)
        }
        annualReportPage.receipts.push(receipt)
      }
      for (let code in annualReportPage.totalOutcomePerCode) {
        annualReportPage.totalOutcome = annualReportPage.totalOutcome.plus(annualReportPage.totalOutcomePerCode[code])
        if (annualReport.totalOutcomePerCode[code]) {
          annualReport.totalOutcomePerCode[code] = annualReport.totalOutcomePerCode[code].plus(annualReportPage.totalOutcomePerCode[code])
        } else {
          annualReport.totalOutcomePerCode[code] = annualReportPage.totalOutcomePerCode[code]
        }
      }
      annualReport.totalOutcome = annualReport.totalOutcome.plus(annualReportPage.totalOutcome)
    }

    if (i !== 0) {
      annualReportPage.transferFromPreviousMonth = annualReport.pages[i - 1].transferToNextMonth
    }
    annualReportPage.total = annualReportPage.totalIncome.plus(annualReportPage.transferFromPreviousMonth)
    annualReportPage.transferToNextMonth = annualReportPage.total.minus(annualReportPage.totalOutcome)

    annualReport.pages.push(annualReportPage)
  }
  annualReport.total = annualReport.totalIncome.minus(annualReport.totalOutcome)

  console.log(`Returning: \n${JSON.stringify(annualReport, null, 2)}`)
  return annualReport
}

function findAndSortEntitiesPerMonth (entity, year, monthOrdinal, sortingOrder) {
  return new Promise((resolve, reject) => {
    entity
      .find({
        'date': {
          '$gte': new Date(year, monthOrdinal, 1),
          '$lt': new Date(year, monthOrdinal + 1, 1)
        }
      })
      .sort({
        'date': sortingOrder
      })
      .exec()
      .then((entities) => {
        resolve(entities)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function calculateTotalPayments (part, pos, amount, totalPayments) {
  const code = part + '/' + pos
  if (totalPayments[code]) {
    totalPayments[code] = totalPayments[code].plus(Big(amount))
  } else {
    totalPayments[code] = Big(amount)
  }
}

module.exports = {
  getAnnualReport: getAnnualReport
}
