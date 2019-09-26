const { PaymentSlip } = require('../model/paymentSlip')
const { Receipt } = require('../model/receipt')
const { AnnualReportPage } = require('../model/annualReportPage')
const { AnnualReport } = require('../model/annualReport')
const Big = require('big.js')

async function getAnnualReport (year) {
  console.log(`Getting annual report for year ${year}`)

  const annualReport = initAnnualReport()
  annualReport.year = year
  for (let i = 0; i < 12; i++) {
    const annualReportPage = initAnnualReportPage()
    annualReportPage.ordinal = i + 1

    const paymentSlips = await getEntitiesByDate(PaymentSlip, new Date(year, i, 1), new Date(year, i + 1, 1), true)
    const receipts = await getEntitiesByDate(Receipt, new Date(year, i, 1), new Date(year, i + 1, 1), true)
    if (paymentSlips) {
      calculateIncomes(paymentSlips, annualReportPage, annualReport)
    }
    if (receipts) {
      calculateOutcomes(receipts, annualReportPage, annualReport)
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

function initAnnualReport () {
  var annualReport = AnnualReport()
  annualReport.pages = []
  annualReport.totalIncomePerCode = []
  annualReport.totalOutcomePerCode = []
  annualReport.totalIncome = Big(0.0)
  annualReport.totalOutcome = Big(0.0)
  annualReport.total = Big(0.0)
  return annualReport
}

function initAnnualReportPage () {
  var annualReportPage = AnnualReportPage()
  annualReportPage.paymentSlips = []
  annualReportPage.receipts = []
  annualReportPage.totalIncomePerCode = []
  annualReportPage.totalOutcomePerCode = []
  annualReportPage.totalIncome = Big(0.0)
  annualReportPage.totalOutcome = Big(0.0)
  annualReportPage.transferFromPreviousMonth = Big(0.0)
  annualReportPage.transferToNextMonth = Big(0.0)
  annualReportPage.total = Big(0.0)
  return annualReportPage
}

async function getEntitiesByDate (entity, startDate, endDate, isSorted) {
  if (isSorted) {
    return entity.find({ 'date': { '$gte': startDate, '$lt': endDate } }).sort({ 'date': 1 }).exec()
  } else {
    return entity.find({ 'date': { '$gte': startDate, '$lt': endDate } }).exec()
  }
}

function calculateIncomes (paymentSlips, annualReportPage, annualReport) {
  paymentSlips.forEach((paymentSlip) => {
    paymentSlip.incomePerCode.forEach((incomePerCode) => {
      annualReportPage.totalIncome = annualReportPage.totalIncome.plus(incomePerCode.amount)
      const pageTotalIncomePerCode = annualReportPage.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (pageTotalIncomePerCode) {
        pageTotalIncomePerCode.amount = pageTotalIncomePerCode.amount.plus(Big(incomePerCode.amount))
      } else {
        annualReportPage.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, amount: Big(incomePerCode.amount) })
      }
      const reportTotalIncomePerCode = annualReport.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (reportTotalIncomePerCode) {
        reportTotalIncomePerCode.amount = reportTotalIncomePerCode.amount.plus(Big(incomePerCode.amount))
      } else {
        annualReport.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, amount: Big(incomePerCode.amount) })
      }
    })
    annualReportPage.paymentSlips.push(paymentSlip)
  })
  annualReport.totalIncome = annualReport.totalIncome.plus(annualReportPage.totalIncome)
}

function calculateOutcomes (receipts, annualReportPage, annualReport) {
  receipts.forEach((receipt) => {
    receipt.outcomePerCode.forEach((outcomePerCode) => {
      annualReportPage.totalOutcome = annualReportPage.totalOutcome.plus(outcomePerCode.amount)
      const pageTotalOutcomePerCode = annualReportPage.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (pageTotalOutcomePerCode) {
        pageTotalOutcomePerCode.amount = pageTotalOutcomePerCode.amount.plus(Big(outcomePerCode.amount))
      } else {
        annualReportPage.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, amount: Big(outcomePerCode.amount) })
      }
      const reportTotalOutcomePerCode = annualReport.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (reportTotalOutcomePerCode) {
        reportTotalOutcomePerCode.amount = reportTotalOutcomePerCode.amount.plus(Big(outcomePerCode.amount))
      } else {
        annualReport.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, amount: Big(outcomePerCode.amount) })
      }
    })

    annualReportPage.receipts.push(receipt)
  })
  annualReport.totalOutcome = annualReport.totalOutcome.plus(annualReportPage.totalOutcome)
}

module.exports = {
  getAnnualReport: getAnnualReport
}
