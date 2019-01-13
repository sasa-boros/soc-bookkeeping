const PaymentSlip = require('./paymentSlip')
const Receipt = require('./receipt')

const INCOME_CODES = {
  'I/1': 'парохијал',
  'I/2': 'иконе',
  'I/3': '',
  'II/1': '',
  'II/2': 'свеће',
  'II/3': '',
  'II/4': '',
  'II/5': '',
  'II/6': '',
  'III/1': '',
  'III/2': 'пренос готовине из прет. год.',
  'III/3': '',
  'III/4': '',
  'III/5': '',
  'IV': 'закуп земље'
}

const OUTCOME_CODES = {
  'I/1': 'плата пароху',
  'I/2': 'помоћ',
  'II/1': 'огрев, осветљење, телефон',
  'II/2': 'набавка свећа и др.',
  'II/3': 'канц. материјал',
  'II/4': '',
  'II/5': '',
  'II/6': 'набавка часописа, књига и радио Српски Сион',
  'II/7': '',
  'III/1-2': 'одржавање храма',
  'III/3': 'фонд самопомоћи',
  'III/4': 'ЦТ 4%',
  'III/5': 'провизија банке',
  'III/6': 'фонд 30% од земље',
  'III/7': 'паушал арх. намеснику',
  'IV': 'епарх. разрез'
}

class AnnualReport {

  constructor() {
    this.year = 0;
    this.pages = new Array();
    this.totalIncomePerCode = new Object();
    this.totalOutcomePerCode = new Object();
    this.totalIncome = 0;
    this.totalOutcome = 0;
    this.total = 0;
  }
}

class AnnualReportPage {

  constructor() {
    this.ordinal = 0;
    this.monthText = '';
  
    this.paymentSlips = new Object();
    this.receipts = new Object();
    this.totalIncomePerCode = new Object();
    this.totalOutcomePerCode = new Object();
    this.totalIncome = 0;
    this.totalOutcome = 0;
  
    this.transferFromPreviousMonth = 0;
    this.transferToNextMonth = 0;
    this.total = 0;
  }
}

const monthNames = ["Januaru", "Februaru", "Martu", "Aprilu", "Maju", "Junu",
  "Julu", "Avgustu", "Septembru", "Oktobru", "Novembru", "Decembru"
];

function getAnnualReport(year) {

  const annualReport = new AnnualReport()
  annualReport.year = year
  for (let i = 0; i < 12; i++) {
    const annualReportPage = new AnnualReportPage()
    annualReportPage.ordinal = i + 1
    const paymentSlips = PaymentSlip.find(
      {
        'date':
        {
          $gte: new Date(year, i),
          $lt: new Date(year, i + 1)
        }
      }).sort({ 'date': 1 })
    const receipts = Receipt.find(
      {
        'date':
        {
          $gte: new Date(year, i),
          $lt: new Date(year, i + 1)
        }
      }).sort({ 'date': 1 })
    annualReportPage.monthText = monthNames[new Date(year, i).getMonth()]
    if (paymentSlips) {
      for (let j = 0; j < paymentSlips.size(); j++) {
        const paymentSlip = paymentSlips[j]
        annualReportPage.paymentSlips[j + 1] = paymentSlip

        if (paymentSlip.firstPart && paymentSlip.firstPos && paymentSlip.firstAmount) {
          handleAnnualReportCodes(paymentSlip.firstPart, paymentSlip.firstPos, paymentSlip.firstAmount, annualReportPage.totalIncomePerCode)
        }
        if (paymentSlip.secondPart && paymentSlip.secondPos && paymentSlip.secondAmount) {
          handleAnnualReportCodes(paymentSlip.secondPart, paymentSlip.secondPos, paymentSlip.secondAmount, annualReportPage.totalIncomePerCode)
        }
      }
      for (code in annualReportPage.totalIncomePerCode) {
        annualReportPage.totalIncome += annualReportPage.totalIncomePerCode[code]
        if (annualReport.totalIncomePerCode[code]) {
          annualReport.totalIncomePerCode[code] += annualReportPage.totalIncome
        } else {
          annualReport.totalIncomePerCode[code] = annualReportPage.totalIncome
        }
      }

      annualReport.totalIncome += annualReportPage.totalIncome
    }
    if (receipts) {
      for (let j = 0; j < receipts.size(); j++) {
        const receipt = receipts[j]
        annualReportPage.receipts[j + 1] = receipt

        if (receipt.firstPart && receipt.firstPos && receipt.firstAmount) {
          handleAnnualReportCodes(receipt.firstPart, receipt.firstPos, receipt.firstAmount, annualReportPage.totalOutcomePerCode)
        }
        if (receipt.secondPart && receipt.secondPos && receipt.secondAmount) {
          handleAnnualReportCodes(receipt.secondPart, receipt.secondPos, receipt.secondAmount, annualReportPage.totalOutcomePerCode)
        }
      }

      for (code in annualReportPage.totalOutcomePerCode) {
        annualReportPage.totalOutcome += annualReportPage.totalOutcomePerCode[code]
        if (annualReport.totalOutcomePerCode[code]) {
          annualReport.totalOutcomePerCode[code] += annualReportPage.totalOutcome
        } else {
          annualReport.totalOutcomePerCode[code] = annualReportPage.totalOutcome
        }
      }

      annualReport.totalOutcome += annualReportPage.totalOutcome
    }

    if (i != 0) {
      annualReportPage.transferFromPreviousMonth = annualReport.pages[i - 1].transferToNextMonth
    }
    annualReportPage.total = annualReportPage.totalIncome + annualReportPage.transferFromPreviousMonth
    annualReportPage.transferToNextMonth = annualReportPage.total - annualReport.totalOutcome
    annualReport.pages.push(annualReportPage)
  }

  annualReport.total = annualReport.totalIncome - annualReport.totalOutcome

  console.log(annualReport)
  return annualReport
}

function handleAnnualReportCodes(part, pos, amount, totalPerCode) {
  const code = part + '/' + pos
  if (totalPerCode[code]) {
    totalPerCode[code] += amount
  } else {
    totalPerCode[code] = amount
  }
}

module.exports = {
  INCOME_CODES: INCOME_CODES,
  OUTCOME_CODES: OUTCOME_CODES,
  getAnnualReport: getAnnualReport
}
