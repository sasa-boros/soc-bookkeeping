const {ipcMain} = require('electron')
const DefaultReceipt = require('../model/defaultReceipt')

ipcMain.on('get-default-receipt', (event) => {
  console.log('Initiated get default receipt')
  DefaultReceipt.find({}).exec().then((defaultReceipts) => {
    console.log(`Found: \n${JSON.stringify(defaultReceipts, null, 2)}`)
    if (defaultReceipts && defaultReceipts.length > 0) {
      reply(event, 'get-default-receipt-reply', defaultReceipts[0], null)
    } else {
      reply(event, 'get-default-receipt-reply', null, null)
    }
  }).catch((err) => {
    console.error(err.message)
    reply(event, 'get-default-receipt-reply', null, err.message)
  })
})

ipcMain.on('create-default-receipt', (event, defaultReceipt) => {
  console.log(`Initiated create default receipt: \n${JSON.stringify(defaultReceipt, null, 2)}`)
  delete defaultReceipt['_id']
  DefaultReceipt.deleteOne({}, (err) => {
    if (err) {
      console.error(err.message)
      reply(event, 'create-default-receipt-reply', null, err.message)
    }
    var newDefaultReceipt = DefaultReceipt(defaultReceipt)
    newDefaultReceipt.save((err, createdDefaultReceipt) => {
      if (err) {
        console.error(err.message)
        reply(event, 'create-default-receipt-reply', null, err.message)
      }
      console.log(`Successfully created default receipt: \n${createdDefaultReceipt}`)
      reply(event, 'create-default-receipt-reply', createdDefaultReceipt, null)
    })
  })
})

ipcMain.on('delete-default-receipt', (event) => {
  console.log('Initiated delete default receipt')
  DefaultReceipt.deleteOne({}, (err, deletedDefaultReceipt) => {
    if (err) {
      console.error(err.message)
      reply(event, 'delete-default-receipt-reply', null, err.message)
    }
    console.log('Successfully deleted default receipt')
    event.sender.send('delete-default-receipt-reply', deletedDefaultReceipt, null)
  })
})

function reply (event, target, data, error) {
  event.sender.send(target, JSON.stringify({error: error, data: data}))
}
