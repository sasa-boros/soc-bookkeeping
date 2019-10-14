const Big = require('big.js')

class AnnualReport {
  constructor() {
    this.year = null
    this.pages = []
    this.totalIncomePerCode = []
    this.totalOutcomePerCode = []
    this.totalIncome = Big(0.0)
    this.totalOutcome = Big(0.0)
    this.total = Big(0.0)
  }
}

module.exports = {
  AnnualReport: AnnualReport
}
