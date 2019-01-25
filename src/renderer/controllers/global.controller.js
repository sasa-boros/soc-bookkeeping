const { ipcRenderer } = require('electron')

ipcRenderer.on('error', function (event, error) {
  // handle error event (or not)
  
})