const Big = require('big.js')

class AnnualReport {
  constructor() {
    this.year = null
    this.churchMunicipality = null
    // pages -> incomeOutcomePages
    this.incomeOutcomePages = []
    // total -> netIncome
    // premesteno sve globalno u totalIncomeOutcomePage
    this.totalIncomeOutcomePage = {
      totalIncomePerCode: [],
      totalOutcomePerCode: [],
      totalIncomePerCodePredicted: [],
      totalOutcomePerCodeAllowed: [],
      totalIncomePredicted: Big(0.0),
      totalOutcomeAllowed: Big(0.0),
      totalIncome: Big(0.0),
      totalOutcome: Big(0.0),
      netIncome: Big(0.0),
      transferFromPreviousYear: Big(0.0),
      transferToNextYear: Big(0.0)
    }
    this.sharesPage = {
      shares: [],
      savings: [],
      totalNominalValue: Big(0.0),
      depreciatedDuringYear: Big(0.0),
      nominalValueOnYearEnd: Big(0.0),
      totalSavingAmountAtYearStart: Big(0.0),
      totalSavingAmountDeposited: Big(0.0),
      totalSavingAmountPlusDeposited: Big(0.0),
      totalSavingAmountWithdrawn: Big(0.0),
      savingAmountOnYearEnd: Big(0.0)
    }
    this.totalPage = {
      inventory: [],
      debts: [],
      realEstateBuildingsValue: Big(0.0),
      realEstateLandValue: Big(0.0),
      totalInventoryValue: Big(0.0),
      totalDebt: Big(0.0),
      total: Big(0.0)
    }
  }
}

module.exports = {
  AnnualReport: AnnualReport
}
