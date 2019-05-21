'use strict'

const { app, BrowserWindow } = require('electron')
const mongoose = require('mongoose')
const path = require('path')
const config = require('../config/config')

// eslint-disable-next-line no-unused-vars
const annualReportRouter = require('./router/annualReportRouter')
// eslint-disable-next-line no-unused-vars
const defaultPaymentSlipRouter = require('./router/defaultPaymentSlipRouter')
// eslint-disable-next-line no-unused-vars
const defaultReceiptRouter = require('./router/defaultReceiptRouter')
// eslint-disable-next-line no-unused-vars
const incomeCodeRouter = require('./router/incomeCodeRouter')
// eslint-disable-next-line no-unused-vars
const outcomeCodeRouter = require('./router/outcomeCodeRouter')
// eslint-disable-next-line no-unused-vars
const paymentSlipRouter = require('./router/paymentSlipRouter')
// eslint-disable-next-line no-unused-vars
const receiptRouter = require('./router/receiptRouter')

// connecting to database
mongoose.connect(config.dbUrl, { useNewUrlParser: true })

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
    useContentSize: true
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
