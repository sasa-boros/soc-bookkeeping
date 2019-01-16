const path = require('path')
const fs = require('fs')
let loadedLanguage

const fallbackLanguage = 'en-US'
const defaultLanguage = 'sr-RS'

/*

const electron = require('electron')
let app = electron.app ? electron.app : electron.remote.app
function loadLocaleLanguage () {
  if (fs.existsSync(path.join(__dirname, app.getLocale() + '.js'))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, app.getLocale() + '.js'), 'utf8'))
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, fallbackLanguage + '.js'), 'utf8'))
  }
}
*/

function loadDefaultLanguage () {
  if (fs.existsSync(path.join(__dirname, defaultLanguage + '.js'))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, defaultLanguage + '.js'), 'utf8'))
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, fallbackLanguage + '.js'), 'utf8'))
  }
}

function setLanguage (language) {
  if (fs.existsSync(path.join(__dirname, language + '.js'))) {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, language + '.js'), 'utf8'))
  } else {
    loadedLanguage = JSON.parse(fs.readFileSync(path.join(__dirname, fallbackLanguage + '.js'), 'utf8'))
  }
}

function getTranslation (phrase) {
  let translation = loadedLanguage[phrase]
  if (translation === undefined) {
    translation = phrase
  }
  return translation
}

loadDefaultLanguage()

module.exports = {
  setLanguage: setLanguage,
  getTranslation: getTranslation
}
