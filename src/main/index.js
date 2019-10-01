'use strict'

import '../renderer/store'
const { app, BrowserWindow, ipcMain, shell } = require('electron')
const mongoose = require('mongoose')
const path = require('path')
const os = require('os')
const fs = require('fs')
const config = require('../config/config')

// loading ipc main router
require('./ipcRouter')

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
let workerWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    useContentSize: true,
    backgroundColor: 'white'
  })

  mainWindow.maximize()
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  workerWindow = new BrowserWindow()
  workerWindow.loadURL(winURL + '/#/annualReportPrint')
  // workerWindow.hide()
  workerWindow.on('closed', () => {
    workerWindow = null
  })
}

ipcMain.on('printPDF', (event, content) => {
  workerWindow.webContents.send('printPDF', content)
})

ipcMain.on('readyToPrintPDF', (event) => {
  const pdfPath = path.join(os.tmpdir(), 'print.pdf')
  const options = { landscape: true,
    printBackground: true,
    pageSize: 'A3',
    marginsType: 1 }

  workerWindow.webContents.printToPDF(options, function (error, data) {
    if (error) throw error
    fs.writeFile(pdfPath, data, function (error) {
      if (error) {
        throw error
      }
      shell.openItem(pdfPath)
      event.sender.send('wrote-pdf', pdfPath)
    })
  })
})

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
