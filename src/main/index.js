'use strict'

import '../renderer/store'
const { app, BrowserWindow } = require('electron')
const Datastore = require('nedb')
const path = require('path')
const config = require('../../config/config')
const { ipcMain } = require('electron')

// loading ipc main router
require('./ipcRouter')

var db = {}
db.paymentSlips = new Datastore({ filename: path.resolve(config.db.path, 'paymentSlips.json'), autoload: true, timestampData: true });
db.receipts = new Datastore({ filename: path.resolve(config.db.path, 'receipts.json'), autoload: true, timestampData: true });
db.defaultPaymentSlips = new Datastore({ filename: path.resolve(config.db.path, 'defaultPaymentSlips.json'), autoload: true, timestampData: true });
db.defaultReceipts = new Datastore({ filename: path.resolve(config.db.path, 'defaultReceipts.json'), autoload: true, timestampData: true });
db.incomeCodes = new Datastore({ filename: path.resolve(config.db.path, 'incomeCodes.json'), autoload: true, timestampData: true });
db.outcomeCodes = new Datastore({ filename: path.resolve(config.db.path, 'outcomeCodes.json'), autoload: true, timestampData: true });

global.db = db

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/`
  : `file://${__dirname}/index.html`

function createWindow () {
  mainWindow = new BrowserWindow({
    useContentSize: true,
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
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
