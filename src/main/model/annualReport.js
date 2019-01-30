const { PaymentSlip } = require('./paymentSlip')
const { Receipt } = require('./receipt')
const Big = require('big.js')
const i18n = require('../../renderer/translations/i18n')

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
  constructor () {
    this.year = 0
    this.pages = []
    this.totalIncomePerCode = {}
    this.totalOutcomePerCode = {}
    this.totalIncome = Big(0.0)
    this.totalOutcome = Big(0.0)
    this.total = Big(0.0)
  }
}

class AnnualReportPage {
  constructor () {
    this.ordinal = 0
    this.monthText = ''
    this.paymentSlips = []
    this.receipts = []
    this.totalIncomePerCode = {}
    this.totalOutcomePerCode = {}
    this.totalIncome = Big(0.0)
    this.totalOutcome = Big(0.0)
    this.transferFromPreviousMonth = Big(0.0)
    this.transferToNextMonth = Big(0.0)
    this.total = Big(0.0)
  }
}

const monthNames = [
  i18n.getTranslation('January.lokativ'),
  i18n.getTranslation('February.lokativ'),
  i18n.getTranslation('March.lokativ'),
  i18n.getTranslation('April.lokativ'),
  i18n.getTranslation('May.lokativ'),
  i18n.getTranslation('June.lokativ'),
  i18n.getTranslation('July.lokativ'),
  i18n.getTranslation('August.lokativ'),
  i18n.getTranslation('September.lokativ'),
  i18n.getTranslation('October.lokativ'),
  i18n.getTranslation('November.lokativ'),
  i18n.getTranslation('December.lokativ')
]

async function getAnnualReport (year) {
  const annualReport = new AnnualReport()
  annualReport.year = year
  for (let i = 0; i < 12; i++) {
    const annualReportPage = new AnnualReportPage()
    annualReportPage.ordinal = i + 1

    const receipts = await findAndSortBkEntitiesPerMonth(year, i, 1, Receipt)
    const paymentSlips = await findAndSortBkEntitiesPerMonth(year, i, 1, PaymentSlip)

    annualReportPage.monthText = monthNames[new Date(year, i).getMonth()]
    if (receipts) {
      for (let j = 0; j < receipts.length; j++) {
        const receipt = receipts[j]
        if (receipt.firstPart && receipt.firstPos && receipt.firstAmount) {
          calculateTotalsPerCode(receipt.firstPart, receipt.firstPos, receipt.firstAmount, annualReportPage.totalIncomePerCode)
        }
        if (receipt.secondPart && receipt.secondPos && receipt.secondAmount) {
          calculateTotalsPerCode(receipt.secondPart, receipt.secondPos, receipt.secondAmount, annualReportPage.totalIncomePerCode)
        }
        annualReportPage.receipts.push(receipt)
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
    if (paymentSlips) {
      for (let j = 0; j < paymentSlips.length; j++) {
        const paymentSlip = paymentSlips[j]
        if (paymentSlip.firstPart && paymentSlip.firstPos && paymentSlip.firstAmount) {
          calculateTotalsPerCode(paymentSlip.firstPart, paymentSlip.firstPos, paymentSlip.firstAmount, annualReportPage.totalOutcomePerCode)
        }
        if (paymentSlip.secondPart && paymentSlip.secondPos && paymentSlip.secondAmount) {
          calculateTotalsPerCode(paymentSlip.secondPart, paymentSlip.secondPos, paymentSlip.secondAmount, annualReportPage.totalOutcomePerCode)
        }
        annualReportPage.paymentSlips.push(paymentSlip)
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
  return annualReport
}

function findAndSortBkEntitiesPerMonth (year, monthOrdinal, sortingOrder, bkEntity) {
  return new Promise(function (resolve, reject) {
    bkEntity.find({
      'date': {
        '$gte': new Date(year, monthOrdinal, 1),
        '$lt': new Date(year, monthOrdinal + 1, 1)
      }
    })
      .sort({
        'date': sortingOrder
      })
      .exec()
      .then(function (bkEntities) {
        resolve(bkEntities)
      }).catch((err) => {
        console.error(err.message)
        reject(err)
      })
  })
}

function calculateTotalsPerCode (part, pos, amount, totalPerCode) {
  const code = part + '/' + pos
  if (totalPerCode[code]) {
    totalPerCode[code] = totalPerCode[code].plus(Big(amount))
  } else {
    totalPerCode[code] = Big(amount)
  }
}

module.exports = {
  INCOME_CODES: INCOME_CODES,
  OUTCOME_CODES: OUTCOME_CODES,
  getAnnualReport: getAnnualReport
}
