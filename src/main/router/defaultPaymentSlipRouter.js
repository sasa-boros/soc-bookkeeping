const {ipcMain} = require('electron')
const DefaultPaymentSlip = require('../model/defaultPaymentSlip')

ipcMain.on('get-default-payment-slip', (event) => {
  console.log('Initiated get default payment slip')
  DefaultPaymentSlip.find({}).exec().then((defaultPaymentSlips) => {
    console.log(`Found: \n${JSON.stringify(defaultPaymentSlips, null, 2)}`)
    if (defaultPaymentSlips && defaultPaymentSlips.length > 0) {
      reply(event, 'get-default-payment-slip-reply', defaultPaymentSlips[0], null)
    } else {
      reply(event, 'get-default-payment-slip-reply', null, null)
    }
  }).catch((err) => {
    console.error(err.message)
    reply(event, 'get-default-payment-slip-reply', null, err.message)
  })
})

ipcMain.on('create-default-payment-slip', (event, defaultPaymentSlip) => {
  console.log(`Initiated create default payment slip: \n${JSON.stringify(defaultPaymentSlip, null, 2)}`)
  delete defaultPaymentSlip['_id']
  DefaultPaymentSlip.deleteOne({}, (err) => {
    if (err) {
      console.error(err.message)
      reply(event, 'create-default-payment-slip-reply', null, err.message)
    }
    var newDefaultPaymentSlip = DefaultPaymentSlip(defaultPaymentSlip)
    newDefaultPaymentSlip.save((err, createdDefaultPaymentSlip) => {
      if (err) {
        console.error(err.message)
        reply(event, 'create-default-payment-slip-reply', null, err.message)
      }
      console.log(`Successfully created default payment slip: \n${createdDefaultPaymentSlip}`)
      reply(event, 'create-default-payment-slip-reply', createdDefaultPaymentSlip, null)
    })
  })
})

ipcMain.on('delete-default-payment-slip', (event) => {
  console.log('Initiated delete default payment slip')
  DefaultPaymentSlip.deleteOne({}, (err, deletedDefaultPaymentSlip) => {
    if (err) {
      console.error(err.message)
      reply(event, 'delete-default-payment-slip-reply', null, err.message)
    }
    console.log('Successfully deleted default payment slip')
    reply(event, 'delete-default-payment-slip-reply', deletedDefaultPaymentSlip, null)
  })
})

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
