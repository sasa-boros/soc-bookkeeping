const dbPath = '/bookkeeping_db'

const config = {
  db: {
    collections: {
      paymentSlips: `${dbPath}/paymentSlips`,
      receipts: `${dbPath}/receipts`,
      defaultPaymentSlips: `${dbPath}/defaultPaymentSlips`,
      defaultReceipts: `${dbPath}/defaultReceipts`,
      incomeCodes: `${dbPath}/incomeCodes`,
      outcomeCodes: `${dbPath}/outcomeCodes`,
      settings: `${dbPath}/settings`
    }
  }
}

module.exports = config
