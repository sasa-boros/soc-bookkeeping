const { ipcRenderer } = require('electron')

function getReceipts() {
    const receipts = ipcRenderer.sendSync('get-receipts')
    return receipts
}

function createReceipt(receipt) {
    ipcRenderer.sendSync('create-receipt', receipt)
}
function updateReceipt(receipt) {
    ipcRenderer.sendSync('update-receipt', receipt)
}

function deleteReceipt(receiptId) {
    ipcRenderer.sendSync('delete-receipt', receiptId)
}

module.exports = {
    getReceipts: getReceipts,
    createReceipt: createReceipt,
    updateReceipt: updateReceipt,
    deleteReceipt: deleteReceipt
}