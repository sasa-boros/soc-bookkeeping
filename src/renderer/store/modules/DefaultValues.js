const defaultPaymentSlipController = require('../../controllers/defaultPaymentSlipController')
const defaultReceiptController = require('../../controllers/defaultReceiptController')
// const { showErrorDialog } = require('../../utils/utils')

const state = {
  emptyPaymentSlipForm: {
    ordinal: null,
    annualReportPage: null,
    date: null,
    firstPart: '',
    firstPos: '',
    firstIncome: null,
    secondPart: '',
    secondPos: '',
    secondIncome: null,
    income: null,
    incomeAsText: null,
    town: null,
    reason: null,
    payed: null
  },
  emptyReceiptForm: {
    ordinal: null,
    annualReportPage: null,
    date: null,
    firstPart: '',
    firstPos: '',
    firstOutcome: null,
    secondPart: '',
    secondPos: '',
    secondOutcome: null,
    outcome: null,
    outcomeAsText: null,
    churchMunicipality: null,
    town: null,
    reason: null,
    received: null
  },
  paymentSlipForm: {
    ordinal: null,
    annualReportPage: null,
    date: null,
    firstPart: '',
    firstPos: '',
    firstIncome: null,
    secondPart: '',
    secondPos: '',
    secondIncome: null,
    income: null,
    incomeAsText: null,
    town: null,
    reason: null,
    payed: null
  },
  receiptForm: {
    ordinal: null,
    annualReportPage: null,
    date: null,
    firstPart: '',
    firstPos: '',
    firstOutcome: null,
    secondPart: '',
    secondPos: '',
    secondOutcome: null,
    outcome: null,
    outcomeAsText: null,
    churchMunicipality: null,
    town: null,
    reason: null,
    received: null
  }
}

const mutations = {
  SET_DEFAULT_PAYMENT_SLIP (state, paymentSlip) {
    state.paymentSlipForm.date = paymentSlip.date
    state.paymentSlipForm.town = paymentSlip.town
    state.paymentSlipForm.reason = paymentSlip.reason
    state.paymentSlipForm.payed = paymentSlip.payed
  },
  SET_DEFAULT_RECEIPT (state, receipt) {
    state.receiptForm.date = receipt.date
    state.receiptForm.churchMunicipality = receipt.churchMunicipality
    state.receiptForm.town = receipt.town
    state.receiptForm.reason = receipt.reason
    state.receiptForm.received = receipt.received
  }
}

const actions = {
  LOAD_DEFAULT_PAYMENT_SLIP ({ commit }) {
    defaultPaymentSlipController.getDefaultPaymentSlip().then(function (res) {
      if (!res.err) {
        const defaultPaymentSlipFromDB = res.data
        if (defaultPaymentSlipFromDB) {
          defaultPaymentSlipFromDB._id = null
          commit('SET_DEFAULT_PAYMENT_SLIP', defaultPaymentSlipFromDB)
        }
      } else {
        // showErrorDialog(res.err)
      }
    })
  },
  LOAD_DEFAULT_RECEIPT ({ commit }) {
    defaultReceiptController.getDefaultReceipt().then(function (res) {
      if (!res.err) {
        const defaultReceiptFromDB = res.data
        if (defaultReceiptFromDB) {
          defaultReceiptFromDB._id = null
          commit('SET_DEFAULT_RECEIPT', defaultReceiptFromDB)
        }
      } else {
        // showErrorDialog(res.err)
      }
    })
  },
  SET_DEFAULT_PAYMENT_SLIP ({ commit }, paymentSlip) {
    defaultPaymentSlipController.createDefaultPaymentSlip(paymentSlip).then(function (res) {
      if (!res.err) {
        paymentSlip._id = null
        commit('SET_DEFAULT_PAYMENT_SLIP', paymentSlip)
      } else {
        // showErrorDialog(res.err)
      }
    })
  },
  SET_DEFAULT_RECEIPT ({ commit }, receipt) {
    defaultReceiptController.createDefaultReceipt(receipt).then(function (res) {
      if (!res.err) {
        receipt._id = null
        commit('SET_DEFAULT_RECEIPT', receipt)
      } else {
        // showErrorDialog(res.err)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
