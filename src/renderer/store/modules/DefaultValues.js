const state = {
  defaultPaymentSlip: {},
  defaultReceipt: {}
}

const mutations = {
  SET_DEFAULT_PAYMENT_SLIP (state, paymentSlip) {
    state.defaultPaymentSlip = paymentSlip ? paymentSlip : {};
  },
  SET_DEFAULT_RECEIPT (state, receipt) {
    state.defaultReceipt = receipt ? receipt : {};
  }
}

const actions = {
  SET_DEFAULT_PAYMENT_SLIP ({ commit }, paymentSlip) {
        commit('SET_DEFAULT_PAYMENT_SLIP', paymentSlip);
  },
  SET_DEFAULT_RECEIPT ({ commit }, receipt) {
        commit('SET_DEFAULT_RECEIPT', receipt);
  }
}

export default {
  state,
  mutations,
  actions
}
