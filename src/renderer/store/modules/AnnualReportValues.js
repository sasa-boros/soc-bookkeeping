import Vue from 'vue'

const state = {
  annualReportData: {
    year: null,
    pages: null,
    totalIncomePerCode: null,
    totalOutcomePerCode: null,
    totalIncome: null,
    totalOutcome: null,
    total: null
  },
  church: ''
}

const mutations = {
  SET_ANNUAL_REPORT (state, newAnnualReport) {
    Vue.set(state.annualReportData, 'year', newAnnualReport.year)
    Vue.set(state.annualReportData, 'pages', newAnnualReport.pages)
    Vue.set(state.annualReportData, 'totalIncomePerCode', newAnnualReport.totalIncomePerCode)
    Vue.set(state.annualReportData, 'totalOutcomePerCode', newAnnualReport.totalOutcomePerCode)
    Vue.set(state.annualReportData, 'totalIncome', newAnnualReport.totalIncome)
    Vue.set(state.annualReportData, 'totalOutcome', newAnnualReport.totalOutcome)
    Vue.set(state.annualReportData, 'total', newAnnualReport.total)
  },
  SET_CHURCH (state, newChurch) {
    state.church = newChurch
  }
}

const actions = {
  SET_ANNUAL_REPORT ({ commit }, annualReport) {
    commit('SET_ANNUAL_REPORT', annualReport)
  },
  SET_CHURCH ({commit}, church) {
    commit('SET_CHURCH', church)
  }
}

export default {
  state,
  mutations,
  actions
}
