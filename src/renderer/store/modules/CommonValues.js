const state = {
  defaultPaymentSlip: {},
  defaultReceipt: {},
  yearsBooked: []
}

const mutations = {
  SET_DEFAULT_PAYMENT_SLIP (state, paymentSlip) {
    state.defaultPaymentSlip = paymentSlip ? paymentSlip : {};
  },
  SET_DEFAULT_RECEIPT (state, receipt) {
    state.defaultReceipt = receipt ? receipt : {};
  },
  SET_YEAR_OPTIONS (state, yearOptions) {
    state.yearOptions = yearOptions;
  }
}

const actions = {
  SET_DEFAULT_PAYMENT_SLIP ({ commit }, paymentSlip) {
        commit('SET_DEFAULT_PAYMENT_SLIP', paymentSlip);
  },
  SET_DEFAULT_RECEIPT ({ commit }, receipt) {
        commit('SET_DEFAULT_RECEIPT', receipt);
  },
  SET_YEAR_OPTIONS ({ commit }, yearOptions) {
    commit('SET_YEAR_OPTIONS', yearOptions);
  }
}

export default {
  state,
  mutations,
  actions
}
