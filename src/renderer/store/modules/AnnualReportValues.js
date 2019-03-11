import Vue from 'vue'

const state = {
  annualReport: {
    year: null,
    pages: null,
    totalIncomePerCode: null,
    totalOutcomePerCode: null,
    totalIncome: null,
    totalOutcome: null,
    total: null
  }
}

const mutations = {
  SET_ANNUAL_REPORT (state, newAnnualReport) {
    Vue.set(state.annualReport, 'year', newAnnualReport.year)
    Vue.set(state.annualReport, 'pages', newAnnualReport.pages)
    Vue.set(state.annualReport, 'totalIncomePerCode', newAnnualReport.totalIncomePerCode)
    Vue.set(state.annualReport, 'totalOutcomePerCode', newAnnualReport.totalOutcomePerCode)
    Vue.set(state.annualReport, 'totalIncome', newAnnualReport.totalIncome)
    Vue.set(state.annualReport, 'totalOutcome', newAnnualReport.totalOutcome)
    Vue.set(state.annualReport, 'total', newAnnualReport.total)
  }
}

const actions = {
  SET_ANNUAL_REPORT ({ commit }, annualReport) {
    commit('SET_ANNUAL_REPORT', annualReport)
  }
}

export default {
  state,
  mutations,
  actions
}
