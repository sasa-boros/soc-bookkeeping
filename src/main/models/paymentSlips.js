var paymentSlips = [
  {id: 1, item: 'apple', price: 8},
  {id: 2, item: 'pear', price: 48},
  {id: 3, item: 'plum', price: 56},
  {id: 4, item: 'orange', price: 72},
  {id: 5, item: 'lemon', price: 4},
  {id: 6, item: 'banana', price: 9}
  /*
  {id: 12, item: '1pear', price: 48},
  {id: 13, item: '1plum', price: 56},
  {id: 14, item: '1orange', price: 72},
  {id: 15, item: '1lemon', price: 4},
  {id: 16, item: '1banana', price: 9},
  {id: 22, item: '2pear', price: 48},
  {id: 23, item: '2plum', price: 56},
  {id: 24, item: '2orange', price: 72},
  {id: 25, item: '2lemon', price: 4},
  {id: 26, item: '2banana', price: 9},
  {id: 32, item: '33pear', price: 48},
  {id: 33, item: '3plum', price: 56},
  {id: 34, item: '3orange', price: 72},
  {id: 35, item: '3lemon', price: 4},
  {id: 36, item: '3banana', price: 9}
  */
]

function getPaymentSlips () {
  return paymentSlips
}

function createPaymentSlip (newSlip) {
  var newId = assignNewId()
  newSlip.id = newId
  paymentSlips.push(newSlip)
  return true
}

function deletePaymentSlip (slipId) {
  var index = paymentSlips.findIndex(function (o) {
    return o.id === slipId
  })
  if (index !== -1) paymentSlips.splice(index, 1)
  return true
}

function assignNewId () {
  var newId = -1
  paymentSlips.forEach(element => {
    if (newId < element.id) {
      newId = element.id
    }
  })
  return newId + 1
}

module.exports = {
  getPaymentSlips: getPaymentSlips,
  createPaymentSlip: createPaymentSlip,
  deletePaymentSlip: deletePaymentSlip
}
