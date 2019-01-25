const paymentSlipsController = require('../controllers/paymentSlip.controller')
const receiptsController = require('../controllers/receipt.controller')

let defaultPaymentSlip = {
  amount: null,
  reason: null,
  town: null,
  amountText: null,
  payed: null,
  received: null,
  firstPart: '',
  firstPos: '',
  firstAmount: null,
  secondPart: '',
  secondPos: '',
  secondAmount: null,
  annualReportPage: null,
  ordinal: null,
  municipalityPresident: null,
  date: null,
  created_at: null,
  updated_at: null
}
let defaultReceipt = {
  amount: null,
  reason: null,
  churchMunicipality: null,
  town: null,
  amountText: null,
  payed: null,
  received: null,
  firstPart: '',
  firstPos: '',
  firstAmount: null,
  secondPart: '',
  secondPos: '',
  secondAmount: null,
  annualReportPage: null,
  ordinal: null,
  municipalityPresident: null,
  date: null,
  created_at: null,
  updated_at: null
}

function loadDefaultPaymentSlip () {
  const defaultPaymentSlipFromDB = paymentSlipsController.getDefaultPaymentSlip()
  if (defaultPaymentSlipFromDB) {
    defaultPaymentSlip = defaultPaymentSlipFromDB
    defaultPaymentSlip._id = null
    defaultPaymentSlip.created_at = null
    defaultPaymentSlip.updated_at = null
  }
}

function loadDefaultReceipt () {
  const defaultReceiptFromDB = receiptsController.getDefaultReceipt()
  if (defaultReceiptFromDB) {
    defaultReceipt = defaultReceiptFromDB
    defaultReceipt._id = null
    defaultReceipt.created_at = null
    defaultReceipt.updated_at = null
  }
}

function getDefaultPaymentSlip () {
  return defaultPaymentSlip
}

function getDefaultReceipt () {
  return defaultReceipt
}

function setDefaultPaymentSlip (paymentSlip) {
  paymentSlipsController.createDefaultPaymentSlip(paymentSlip)
  defaultPaymentSlip = paymentSlip
  defaultPaymentSlip._id = null
  defaultPaymentSlip.created_at = null
  defaultPaymentSlip.updated_at = null
}

function setDefaultReceipt (receipt) {
  receiptsController.createDefaultPaymentSlip(receipt)
  defaultReceipt = receipt
  defaultReceipt._id = null
  defaultReceipt.created_at = null
  defaultReceipt.updated_at = null
}

loadDefaultPaymentSlip()
loadDefaultReceipt()

module.exports = {
  setDefaultPaymentSlip: setDefaultPaymentSlip,
  getDefaultPaymentSlip: getDefaultPaymentSlip,
  setDefaultReceipt: setDefaultReceipt,
  getDefaultReceipt: getDefaultReceipt
}