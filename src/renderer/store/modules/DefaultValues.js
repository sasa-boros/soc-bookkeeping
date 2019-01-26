const paymentSlipsController = require('../../controllers/paymentSlip.controller')
const receiptsController = require('../../controllers/receipt.controller')

const state = {
  defaultPaymentSlip: {
    amount: null,
    amountText: null,
    reason: null,
    town: null,
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
  },
  defaultReceipt: {
    amount: null,
    amountText: null,
    reason: null,
    churchMunicipality: null,
    town: null,
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
}

const mutations = {
  SET_DEFAULT_PAYMENT_SLIP (state, newPaymentSlip) {
    state.defaultPaymentSlip = newPaymentSlip
  },
  SET_DEFAULT_RECEIPT (state, newReceipt) {
    state.defaultReceipt = newReceipt
  }
}

const actions = {
  LOAD_DEFAULT_PAYMENT_SLIP ({ commit }) {
    paymentSlipsController.getDefaultPaymentSlip().then(function (res) {
      if (!res.err) {
        const defaultPaymentSlipFromDB = res.data
        if (defaultPaymentSlipFromDB) {
          defaultPaymentSlipFromDB._id = null
          defaultPaymentSlipFromDB.created_at = null
          defaultPaymentSlipFromDB.updated_at = null
          commit('SET_DEFAULT_PAYMENT_SLIP', defaultPaymentSlipFromDB)
        }
      }
    })
  },
  LOAD_DEFAULT_RECEIPT ({ commit }) {
    receiptsController.getDefaultReceipt().then(function (res) {
      if (!res.err) {
        const defaultReceiptFromDB = res.data
        if (defaultReceiptFromDB) {
          defaultReceiptFromDB._id = null
          defaultReceiptFromDB.created_at = null
          defaultReceiptFromDB.updated_at = null
          commit('SET_DEFAULT_RECEIPT', defaultReceiptFromDB)
        }
      }
    })
  },
  SET_DEFAULT_PAYMENT_SLIP ({ commit }, paymentSlip) {
    paymentSlipsController.createDefaultPaymentSlip(paymentSlip).then(function (res) {
      if (!res.err) {
        paymentSlip._id = null
        paymentSlip.created_at = null
        paymentSlip.updated_at = null
        commit('SET_DEFAULT_PAYMENT_SLIP', paymentSlip)
      }
    })
  },
  SET_DEFAULT_RECEIPT ({ commit }, receipt) {
    receiptsController.createDefaultReceipt(receipt).then(function (res) {
      if (!res.err) {
        receipt._id = null
        receipt.created_at = null
        receipt.updated_at = null
        commit('SET_DEFAULT_RECEIPT', receipt)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
