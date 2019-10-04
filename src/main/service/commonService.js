const { PaymentSlip } = require('../model/paymentSlip')
const { Receipt } = require('../model/receipt')

async function getBookedYears () {
    console.log('Getting all booked years')

    var paymentSlips = await PaymentSlip.find({}, 'date -_id').exec()
    var receipts = await Receipt.find({}, 'date').exec()

    var yearsSet = new Set()
    paymentSlips.forEach(paymentSlip => {
        yearsSet.add(paymentSlip.date.getFullYear())
    })
    receipts.forEach(receipt => {
        yearsSet.add(receipt.date.getFullYear())
    })

    var years = Array.from(yearsSet).sort((a, b) => b - a)

    console.log(`Returning booked years: \n${JSON.stringify(years, null, 2)}`)
    return years
}

module.exports = {
    getBookedYears: getBookedYears
}