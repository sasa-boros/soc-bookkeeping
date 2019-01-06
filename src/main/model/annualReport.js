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
// eslint-disable-next-line no-unused-vars
class AnnualReport {
  year;
  pages;
  totalsPerIncomeCodesMonthly;
  totalsPerIncomeCodes;
  totalsPerOutcomeCodesMonthly;
  totalsPerOutcomeCodes;
  total;
}
// eslint-disable-next-line no-unused-vars
class AnnualReportPage {
  ordinal;
  month;
  monthText;

  paymentSlips;
  receipts;
  incomeCodes;
  outcomeCodes;
  totalPerIncomeCodes;
  totalPerOutcomeCodes;

  incomeTransferFromPrevMonth;
  incomeTransferToNextMonth;
  total;
}
// eslint-disable-next-line no-unused-vars
class AnnualReportPaymentSlip {
  ordinal;
  paymentSlip;
}
// eslint-disable-next-line no-unused-vars
class AnnualReportReceipt {
  ordinal;
  paymentSlip;
}
// eslint-disable-next-line no-unused-vars
class AnnualReportCode {
  code;
  total;
}

function getAnnualReport (year, prevYearTransfer) {
  const paymentSlips = PaymentSlip.find(
    {
      'date':
      {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    }
  )
  const receipts = Receipt.find(
    {
      'date':
      {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1)
      }
    }

  )

  return { paymentSlips: paymentSlips, receipts: receipts }
}

module.exports = {
  INCOME_CODES: INCOME_CODES,
  OUTCOME_CODES: OUTCOME_CODES,
  getAnnualReport: getAnnualReport
}
