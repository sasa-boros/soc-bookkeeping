const paymentSlipDao = require('../dao/paymentSlipDao')
const receiptDao = require('../dao/receiptDao')
const shareDao = require('../dao/shareDao')
const savingDao = require('../dao/savingDao')

async function getBookedYears () {
    console.log('Getting all booked years')

    var paymentSlips = await paymentSlipDao.findAll()
    var receipts = await receiptDao.findAll()
    var shares = await shareDao.findAll()
    var savings = await savingDao.findAll()

    var yearsSet = new Set()
    if (paymentSlips) {
        paymentSlips.forEach(paymentSlip => {
            yearsSet.add(paymentSlip.date.getFullYear())
        })
    }
    if (receipts) {
        receipts.forEach(receipt => {
            yearsSet.add(receipt.date.getFullYear())
        })
    }
    if (shares) {
        shares.forEach(share => {
            yearsSet.add(share.year.getFullYear())
        })
    }
    if (savings) {
        savings.forEach(saving => {
            yearsSet.add(saving.year.getFullYear())
        })
    }

    var years = Array.from(yearsSet).sort((a, b) => b - a)

    console.log(`Returning booked years: \n${JSON.stringify(years, null, 2)}`)
    return years
}

module.exports = {
    getBookedYears: getBookedYears
}