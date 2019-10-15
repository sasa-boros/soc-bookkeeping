const { app, BrowserWindow } = require('electron')
const Datastore = require('nedb')
const path = require('path')
const config = require('./config')

// Connecting to neDB
var db = {}
db.paymentSlips = new Datastore({ filename:  path.join(app.getPath('userData'), config.db.collections.paymentSlips), autoload: true, timestampData: true })
db.receipts = new Datastore({ filename: path.join(app.getPath('userData'), config.db.collections.receipts), autoload: true, timestampData: true })
db.defaultPaymentSlips = new Datastore({ filename: path.join(app.getPath('userData'), config.db.collections.defaultPaymentSlips), autoload: true, timestampData: true })
db.defaultReceipts = new Datastore({ filename: path.join(app.getPath('userData'), config.db.collections.defaultReceipts), autoload: true, timestampData: true })
db.incomeCodes = new Datastore({ filename: path.join(app.getPath('userData'), config.db.collections.incomeCodes), autoload: true, timestampData: true })
db.outcomeCodes = new Datastore({ filename: path.join(app.getPath('userData'), config.db.collections.outcomeCodes), autoload: true, timestampData: true })
global.db = db

// Loading store
require('../renderer/store')
// Loading ipc main router
require('./ipcRouter')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
} 

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    huseContentSize: true,
    backgroundColor: 'white'
  })

  mainWindow.maximize()
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater }= require(''electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
