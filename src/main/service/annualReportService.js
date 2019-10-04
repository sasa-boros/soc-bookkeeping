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
      calculateIncome(paymentSlips, annualReportPage, annualReport)
    }
    if (receipts) {
      calculateOutcome(receipts, annualReportPage, annualReport)
    }
    if (i !== 0) {
      annualReportPage.transferFromPreviousMonth = annualReport.pages[i - 1].transferToNextMonth
    }
    annualReportPage.total = annualReportPage.totalIncome.plus(annualReportPage.transferFromPreviousMonth)
    annualReportPage.transferToNextMonth = annualReportPage.total.minus(annualReportPage.totalOutcome)

    annualReport.pages.push(annualReportPage)
  }
  annualReport.total = annualReport.totalIncome.minus(annualReport.totalOutcome)

  transformBigsToNumbers(annualReport);
  console.log(`Returning annual report: \n${JSON.stringify(annualReport, null, 2)}`)
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

function calculateIncome (paymentSlips, annualReportPage, annualReport) {
  paymentSlips.forEach((paymentSlip) => {
    paymentSlip.incomePerCode.forEach((incomePerCode) => {
      annualReportPage.totalIncome = annualReportPage.totalIncome.plus(incomePerCode.income)
      const pageTotalIncomePerCode = annualReportPage.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (pageTotalIncomePerCode) {
        pageTotalIncomePerCode.income = pageTotalIncomePerCode.income.plus(Big(incomePerCode.income))
      } else {
        annualReportPage.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, income: Big(incomePerCode.income) })
      }
      const reportTotalIncomePerCode = annualReport.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (reportTotalIncomePerCode) {
        reportTotalIncomePerCode.income = reportTotalIncomePerCode.income.plus(Big(incomePerCode.income))
      } else {
        annualReport.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, income: Big(incomePerCode.income) })
      }
    })
    annualReportPage.paymentSlips.push(paymentSlip)
  })
  annualReport.totalIncome = annualReport.totalIncome.plus(annualReportPage.totalIncome)
}

function calculateOutcome (receipts, annualReportPage, annualReport) {
  receipts.forEach((receipt) => {
    receipt.outcomePerCode.forEach((outcomePerCode) => {
      annualReportPage.totalOutcome = annualReportPage.totalOutcome.plus(outcomePerCode.outcome)
      const pageTotalOutcomePerCode = annualReportPage.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (pageTotalOutcomePerCode) {
        pageTotalOutcomePerCode.outcome = pageTotalOutcomePerCode.outcome.plus(Big(outcomePerCode.outcome))
      } else {
        annualReportPage.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, outcome: Big(outcomePerCode.outcome) })
      }
      const reportTotalOutcomePerCode = annualReport.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (reportTotalOutcomePerCode) {
        reportTotalOutcomePerCode.outcome = reportTotalOutcomePerCode.outcome.plus(Big(outcomePerCode.outcome))
      } else {
        annualReport.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, outcome: Big(outcomePerCode.outcome) })
      }
    })

    annualReportPage.receipts.push(receipt)
  })
  annualReport.totalOutcome = annualReport.totalOutcome.plus(annualReportPage.totalOutcome)
}

function transformBigsToNumbers(annualReport) {
  for(let i=0; i<annualReport.pages.length; i++) {
    const page = annualReport.pages[i];
    for(let j=0; j<page.totalIncomePerCode.length; j++) {
      page.totalIncomePerCode[j].income = parseFloat(page.totalIncomePerCode[j].income);
    }
    for(let j=0; j<page.totalOutcomePerCode.length; j++) {
      page.totalOutcomePerCode[j].outcome = parseFloat(page.totalOutcomePerCode[j].outcome);
    }
    page.totalIncome = parseFloat(page.totalIncome);
    page.totalOutcome = parseFloat(page.totalOutcome);
    page.transferFromPreviousMonth = parseFloat(page.transferFromPreviousMonth);
    page.transferToNextMonth = parseFloat(page.transferToNextMonth);
    page.total = parseFloat(page.total);
  }
  for(let i=0; i<annualReport.totalIncomePerCode.length; i++) {
    annualReport.totalIncomePerCode[i].income = parseFloat(annualReport.totalIncomePerCode[i].income);
  }
  for(let i=0; i<annualReport.totalOutcomePerCode.length; i++) {
    annualReport.totalOutcomePerCode[i].outcome = parseFloat(annualReport.totalOutcomePerCode[i].outcome);
  }
  annualReport.totalIncome = parseFloat(annualReport.totalIncome);
  annualReport.totalOutcome = parseFloat(annualReport.totalOutcome);
  annualReport.total = parseFloat(annualReport.total);
}

module.exports = {
  getAnnualReport: getAnnualReport
}
