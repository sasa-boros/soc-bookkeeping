const fs = require('fs');
const os = require('os')
const path = require('path');
const elerem = require('electron').remote
const app = elerem.app
const dialog = elerem.dialog
const AutoNumeric = require('autonumeric')

const amountNumberOptions = {
  decimalCharacter : ',',
  digitGroupSeparator : '.',
  maximumValue: 99999999999,
  minimumValue: 0,
  decimalPlacesShownOnFocus: 2,
  modifyValueOnWheel: false
}

const partitionPositionNumberOptions = {
  vMin: 0, 
  vMax: 99,
  decimalPlaces: 0,
  digitGroupSeparator: '',
  modifyValueOnWheel: false
}

function asFloat (formattedNumberAsString, numberOptions) {
  if (!formattedNumberAsString || formattedNumberAsString.trim() == '') {
    return null
  }
  return parseFloat(AutoNumeric.unformat(formattedNumberAsString, numberOptions))
}

function asInt (formattedNumberAsString, numberOptions) {
  if (!formattedNumberAsString || formattedNumberAsString.trim() == '') {
    return null
  }
  return parseInt(AutoNumeric.unformat(formattedNumberAsString, numberOptions))
}

function asFormatedString (n, numberOptions) {
  if(n == null || n == undefined) {
    return null
  }
  return AutoNumeric.format(n.toString(), numberOptions)
}

function numberToSerbianDinars (n) {
  if (!n || isNaN(n) || n.toString().trim() === '') {
    return null
  }
  var nFloored = Math.floor(n)
  var flooredAndDecimalStrings = n.toString().split('.')
  var flooredString = flooredAndDecimalStrings[0]
  if(flooredString == '') {
    flooredString = '0'
  }
  var decimalString
  var unitsMale
  var unitsFemale
  var tens
  var hundreds
  var scales
  var start
  var end
  var chunks = []
  var chunksLen
  var chunk
  var ints
  var i
  var word
  var words
  var paras = ''
  var dinars = ''
  /* Array of units as words */
  unitsMale = ['', 'један', 'два', 'три', 'четири', 'пет', 'шест', 'седам', 'осам', 'девет', 'десет', 'једанаест', 'дванаест', 'тринаест', 'четрнаест', 'петнаест', 'шеснаест', 'седамнаест', 'осамнаест', 'деветнаест']
  unitsFemale = ['', 'једна', 'две', 'три', 'четири', 'пет', 'шест', 'седам', 'осам', 'девет', 'десет', 'једанаест', 'дванаест', 'тринаест', 'четрнаест', 'петнаест', 'шеснаест', 'седамнаест', 'осамнаест', 'деветнаест']

  /* Array of tens as words */
  tens = ['', '', 'двадесет', 'тридесет', 'четрдесет', 'педесет', 'шездесет', 'седамдесет', 'осамдесет', 'деведесет']

  /* Array of tens as words */
  hundreds = ['', 'сто', 'двестa', 'тристa', 'четиристо', 'петсто', 'шестсто', 'седамсто', 'осамсто', 'деветсто']

  /* Array of scales as words */
  scales = ['', 'хиљад', 'милион', 'милијард', 'билион', 'билијард', 'трилион', 'трилијард', 'квадрилион', 'квадрилијард']

  if (parseInt(flooredString) === 0) {
    dinars = 'нула динара'
  } else {
    /* Split user arguemnt into 3 digit chunks from right to left */
    start = flooredString.length
    while (start > 0) {
      end = start
      chunks.push(flooredString.slice((start = Math.max(0, start - 3)), end))
    }

    /* Check if function has enough scale words to be able to stringify the user argument */
    chunksLen = chunks.length
    if (chunksLen > scales.length) {
      return null
    }

    /* Stringify each integer in each chunk */
    words = []
    var femaleScale = false
    for (i = 0; i < chunksLen; i++) {
      chunk = parseInt(chunks[i])
      femaleScale = (i % 2 === 1)
      if (chunk) {
        /* Split chunk into array of individual integers */
        ints = chunks[i].split('').reverse().map(parseFloat)

        /* If tens integer is 1, i.e. 10, then add 10 to units integer */
        if (ints[1] === 1) {
          ints[0] += 10
        }

        /* Add scale word if chunk is not zero and array item exists */
        if ((word = scales[i])) {
          if (femaleScale) {
            /* If scales finishes with 2,3,4
              for example: dve hiljade, tri milijarde, cetiri bilijarde */
            if (ints[0] === 2 || ints[0] === 3 || ints[0] === 4) {
              word += 'е'
            } else {
              /* If scales are thousands or scale finishes with 1
                for example: jedna hiljada, osam hiljada, jedna milijarda */
              if (i === 1 || ints[0] === 1) {
                word += 'а'
              } else {
                /* for example: osam milijardi, sto petnaest bilijardi */
                word += 'и'
              }
            }
          } else {
            /* for example: jedan trilion, dva trilionA, dvadesset trilionA */
            if (ints[0] !== 1) {
              word += 'а'
            }
          }
          words.push(word)
        }

        /* Add unit word if array item exists */
        if (femaleScale) {
          if ((word = unitsFemale[ints[0]])) {
            words.push(word)
          }
        } else {
          if ((word = unitsMale[ints[0]])) {
            words.push(word)
          }
        }

        /* Add tens word if array item exists */
        if ((word = tens[ints[1]])) {
          /* If units of the chunk are between 0 and 9, add an and */
          if (ints[0] > 0 && ints[0] <= 9) {
            words.push('и')
          }
          words.push(word)
        }

        /* Add hundreds word if array item exists */
        if ((word = hundreds[ints[2]])) {
          words.push(word)
        }
      }
    }
    var dinarWord = ' динар'
    if ((nFloored % 10 !== 1) || (nFloored % 100 === 11)) {
      dinarWord += 'а'
    }
    dinars = words.reverse().join(' ') + dinarWord
  }

  if (flooredAndDecimalStrings.length > 1) {
    decimalString = flooredAndDecimalStrings[1].substring(0, 2)
    if (decimalString.length === 1) {
      decimalString += '0'
    }
    ints = decimalString.split('').reverse().map(parseFloat)

    /* If tens integer is 1, i.e. 10, then add 10 to units integer */
    if (ints[1] === 1) {
      ints[0] += 10
    }

    /* Add tens word if array item exists */
    if ((word = tens[ints[1]])) {
      paras = paras + ' ' + word
      /* If units of the chunk are between 0 and 9, add an and */
      if (ints[0] > 0 && ints[0] <= 9) {
        paras += ' и'
      }
    }
    /* Add unit word if array item exists */
    if ((word = unitsFemale[ints[0]])) {
      paras = paras + ' ' + word
    }
    if (paras !== '') {
      paras += ' пар'
      if (ints[0] === 2 || ints[0] === 3 || ints[0] === 4) {
        paras += 'е'
      } else {
        paras += 'a'
      }
    }
  }
  return dinars + ((paras !== '') ? ', ' : '') + paras
}

function getCodeCombinations (codes) {
  codes.sort(compareCodes)
  var parts = {}
  if (codes) {
    codes.forEach(function (code) {
      const part = code.partition
      const pos = code.position
      if (!parts[part]) {
        parts[part] = []
      }
      parts[part].push(pos)
    })
  }
  return parts
}

function mapCodeToCodeForm (code) {
  const codeForm = {};
  codeForm._id = code._id;
  codeForm.partition = asFormatedString(code.partition, partitionPositionNumberOptions)
  codeForm.position = asFormatedString(code.position, partitionPositionNumberOptions)
  codeForm.description = code.description
  return codeForm;
}

function mapCodeFormToCode (codeForm) {
  const code = {};
  code._id = codeForm._id;
  code.partition = asInt(codeForm.partition, partitionPositionNumberOptions)
  code.position = asInt(codeForm.position, partitionPositionNumberOptions)
  code.description = codeForm.description
  return code;
}

function mapPaymentSlipToPaymentSlipForm (paymentSlip) {
  const paymentSlipForm = {};
  paymentSlipForm._id = paymentSlip._id;
  paymentSlipForm.createdAt = paymentSlip.createdAt;
  paymentSlipForm.updatedAt = paymentSlip.updatedAt;
  paymentSlipForm.isValid = paymentSlip.isValid;
  paymentSlipForm.ordinal =  paymentSlip.ordinal;
  paymentSlipForm.annualReportPage = paymentSlip.annualReportPage;
  paymentSlipForm.date = paymentSlip.date;
  // ensures reactivity
  paymentSlipForm.firstPartition = null;
  paymentSlipForm.firstPosition = null;
  paymentSlipForm.firstIncome = null;
  paymentSlipForm.secondPartition = null;
  paymentSlipForm.secondPosition = null;
  paymentSlipForm.secondIncome = null;
  if (paymentSlip.incomePerCode && paymentSlip.incomePerCode.length > 0) {
    paymentSlipForm.firstPartition = paymentSlip.incomePerCode[0].incomeCode.partition;
    paymentSlipForm.firstPosition = paymentSlip.incomePerCode[0].incomeCode.position;
    paymentSlipForm.firstIncome = asFormatedString(paymentSlip.incomePerCode[0].income, amountNumberOptions);
    if(paymentSlip.incomePerCode.length > 1) {
      paymentSlipForm.secondPartition = paymentSlip.incomePerCode[1].incomeCode.partition;
      paymentSlipForm.secondPosition = paymentSlip.incomePerCode[1].incomeCode.position;
      paymentSlipForm.secondIncome = asFormatedString(paymentSlip.incomePerCode[1].income, amountNumberOptions);
    }
  }
  paymentSlipForm.income = asFormatedString(paymentSlip.income, amountNumberOptions);
  paymentSlipForm.incomeAsText = numberToSerbianDinars(paymentSlip.income);
  paymentSlipForm.town = paymentSlip.town;
  paymentSlipForm.reason = paymentSlip.reason;
  paymentSlipForm.payed = paymentSlip.payed;

  return paymentSlipForm;
}

function mapPaymentSlipFormToPaymentSlip(paymentSlipForm, incomeCodes) {
  var paymentSlip = {};
  paymentSlip._id = paymentSlipForm._id;
  paymentSlip.createdAt = paymentSlipForm.createdAt;
  paymentSlip.updatedAt = paymentSlipForm.updatedAt;
  paymentSlip.isValid = paymentSlipForm.isValid;
  paymentSlip.date = paymentSlipForm.date;
  paymentSlip.income = asFloat(paymentSlipForm.income, amountNumberOptions);
  paymentSlip.town = paymentSlipForm.town;
  paymentSlip.reason = paymentSlipForm.reason;
  paymentSlip.payed = paymentSlipForm.payed;
  paymentSlip.incomePerCode = [];
  const firstIncomeCode = incomeCodes.find(incomeCode => {
    return incomeCode.partition == paymentSlipForm.firstPartition && incomeCode.position == paymentSlipForm.firstPosition;
  })
  const secondIncomeCode = incomeCodes.find(incomeCode => {
    return incomeCode.partition == paymentSlipForm.secondPartition && incomeCode.position == paymentSlipForm.secondPosition;
  })
  if (firstIncomeCode && paymentSlipForm.firstIncome) {
    paymentSlip.incomePerCode.push({incomeCode: firstIncomeCode, income: asFloat(paymentSlipForm.firstIncome, amountNumberOptions)});
  }
  if (secondIncomeCode && paymentSlipForm.secondIncome) {
    paymentSlip.incomePerCode.push({incomeCode: secondIncomeCode, income: asFloat(paymentSlipForm.secondIncome, amountNumberOptions)});
  }
  return paymentSlip;
}

function mapReceiptToReceiptForm (receipt) {
    const receiptForm = {};
    receiptForm._id = receipt._id;
    receiptForm.createdAt = receipt.createdAt;
    receiptForm.updatedAt = receipt.updatedAt;
    receiptForm.isValid = receipt.isValid;
    receiptForm.ordinal =  receipt.ordinal;
    receiptForm.annualReportPage = receipt.annualReportPage;
    receiptForm.date = receipt.date;
    receiptForm.isValid = receipt.isValid;
    // ensures reactivity
    receiptForm.firstPartition = null;
    receiptForm.firstPosition = null;
    receiptForm.firstOutcome = null;
    receiptForm.secondPartition = null;
    receiptForm.secondPosition = null;
    receiptForm.secondOutcome = null;
    if (receipt.outcomePerCode && receipt.outcomePerCode.length > 0) {
      receiptForm.firstPartition = receipt.outcomePerCode[0].outcomeCode.partition;
      receiptForm.firstPosition = receipt.outcomePerCode[0].outcomeCode.position;
      receiptForm.firstOutcome = asFormatedString(receipt.outcomePerCode[0].outcome, amountNumberOptions);
      if(receipt.outcomePerCode.length > 1) {
        receiptForm.secondPartition = receipt.outcomePerCode[1].outcomeCode.partition;
        receiptForm.secondPosition = receipt.outcomePerCode[1].outcomeCode.position;
        receiptForm.secondOutcome = asFormatedString(receipt.outcomePerCode[1].outcome, amountNumberOptions);
      } 
    }
    receiptForm.outcome = asFormatedString(receipt.outcome, amountNumberOptions);
    receiptForm.outcomeAsText = numberToSerbianDinars(receipt.outcome);
    receiptForm.churchMunicipality = receipt.churchMunicipality;
    receiptForm.town = receipt.town;
    receiptForm.reason = receipt.reason;
    receiptForm.received = receipt.received;

    return receiptForm;
}

function mapReceiptFormToReceipt (receiptForm, outcomeCodes) {
    var receipt = {};
    receipt._id = receiptForm._id;
    receipt.createdAt = receiptForm.createdAt;
    receipt.updatedAt = receiptForm.updatedAt;
    receipt.isValid = receiptForm.isValid;
    receipt.date = receiptForm.date;
    receipt.outcome = asFloat(receiptForm.outcome, amountNumberOptions);
    receipt.churchMunicipality = receiptForm.churchMunicipality;
    receipt.town = receiptForm.town;
    receipt.reason = receiptForm.reason;
    receipt.received = receiptForm.received;
    receipt.outcomePerCode = [];
    const firstOutcomeCode = outcomeCodes.find(outcomeCode => {
      return outcomeCode.partition == receiptForm.firstPartition && outcomeCode.position == receiptForm.firstPosition;
    })
    const secondOutcomeCode = outcomeCodes.find(outcomeCode => {
      return outcomeCode.partition == receiptForm.secondPartition && outcomeCode.position == receiptForm.secondPosition;
    })
    if (firstOutcomeCode && receiptForm.firstOutcome) {
      receipt.outcomePerCode.push({outcomeCode: firstOutcomeCode, outcome: asFloat(receiptForm.firstOutcome, amountNumberOptions)});
    }
    if (secondOutcomeCode && receiptForm.secondOutcome) {
      receipt.outcomePerCode.push({outcomeCode: secondOutcomeCode, outcome: asFloat(receiptForm.secondOutcome, amountNumberOptions)});
    }
    return receipt;
}

function compareCodes( codeA, codeB ) {
  return codeA.partition - codeB.partition || codeA.position - codeB.position;
}

function saveAs (pathToFile, fileName, callback) {
  const localPath = path.join(os.homedir(), 'Desktop', fileName)
  const userChosenPath = dialog.showSaveDialog({ defaultPath: localPath })
  const fullPathToFile = path.join(app.getPath('userData'), pathToFile)
  if (userChosenPath) {
    fs.rename(fullPathToFile, userChosenPath, err => {
      if (err) {
        if (err.code === 'EXDEV') {
            copy(fullPathToFile, userChosenPath, callback);
        } else {
            callback(err);
        }
        return;
      }
      callback();
    })
  }
}

function copy(pathToFile, userChosenPath, callback) {
  var readStream = fs.createReadStream(pathToFile);
  var writeStream = fs.createWriteStream(userChosenPath);

  readStream.on('error', callback);
  writeStream.on('error', callback);

  readStream.on('close', function () {
      fs.unlink(pathToFile, callback);
  });

  readStream.pipe(writeStream);
}

module.exports = {
  amountNumberOptions: amountNumberOptions,
  partitionPositionNumberOptions: partitionPositionNumberOptions,
  asFloat: asFloat,
  asInt: asInt,
  asFormatedString: asFormatedString,
  numberToSerbianDinars: numberToSerbianDinars,
  getCodeCombinations: getCodeCombinations,
  mapCodeToCodeForm: mapCodeToCodeForm,
  mapCodeFormToCode: mapCodeFormToCode,
  mapPaymentSlipToPaymentSlipForm: mapPaymentSlipToPaymentSlipForm,
  mapPaymentSlipFormToPaymentSlip: mapPaymentSlipFormToPaymentSlip,
  mapReceiptToReceiptForm, mapReceiptToReceiptForm,
  mapReceiptFormToReceipt: mapReceiptFormToReceipt,
  compareCodes: compareCodes,
  saveAs: saveAs
}
