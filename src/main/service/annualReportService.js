const { AnnualReportPage } = require('../model/annualReportPage')
const { AnnualReport } = require('../model/annualReport')
const paymentSlipDao = require('../dao/paymentSlipDao')
const receiptDao = require('../dao/receiptDao')
const incomeCodeDao = require('../dao/incomeCodeDao')
const outcomeCodeDao = require('../dao/outcomeCodeDao')

const { app } = require('electron')
const Big = require('big.js')
const fs = require('fs');
const path = require('path')
const util = require('util');
const readFile = util.promisify(fs.readFile);
const Mustache = require('mustache');
const i18n = require('../../translations/i18n')
const AutoNumeric = require('autonumeric')

async function getAnnualReport (year) {
  console.log(`Getting annual report for year ${year}`)

  const annualReport = new AnnualReport()
  annualReport.year = year
  for (let i = 0; i < 12; i++) {
    const annualReportPage = new AnnualReportPage()
    annualReportPage.ordinal = i + 1

    const paymentSlips = await getEntitiesByDate(paymentSlipDao, new Date(year, i, 1), new Date(year, i + 1, 1), true)
    const receipts = await getEntitiesByDate(receiptDao, new Date(year, i, 1), new Date(year, i + 1, 1), true)
    
    var paymentSlipsValid = checkIfEntitiesAreValid(paymentSlips)
    var receiptsValid = checkIfEntitiesAreValid(receipts)

    if (!paymentSlipsValid && !receiptsValid) {
      throw new Error('Invalid payment slips and receipts found')
    } else if (!paymentSlipsValid) {
      throw new Error('Invalid payment slips found')
    } else if(!receiptsValid) {
      throw new Error('Invalid receipts found')
    }

    if (paymentSlips) {
      calculateIncome(paymentSlips, annualReportPage, annualReport)
    }
    if (receipts) {
      calculateOutcome(receipts, annualReportPage, annualReport)
    }
    if (i !== 0) {
      annualReportPage.transferFromPreviousMonth = annualReport.pages[i - 1].transferToNextMonth
    }
    annualReportPage.total = annualReportPage.totalIncome.plus(annualReportPage.transferFromPreviousMonth)
    annualReportPage.transferToNextMonth = annualReportPage.total.minus(annualReportPage.totalOutcome)

    annualReport.pages.push(annualReportPage)
  }
  annualReport.total = annualReport.totalIncome.minus(annualReport.totalOutcome)

  transformBigsToNumbers(annualReport);
  console.log(`Returning annual report: \n${JSON.stringify(annualReport, null, 2)}`)
  return annualReport
}

async function getEntitiesByDate (dao, startDate, endDate, isSorted) {
  if (isSorted) {
    return dao.findBetweenDatesSortAsc(startDate, endDate)
  } else {
    return dao.findBetweenDates(startDate, endDate)
  }
}

function checkIfEntitiesAreValid(entities) {
  if(!entities) {
    return true
  }
  for (let j=0; j < entities.length; j++) {
    if (!entities[j].isValid) {
      return false
    }
  }
  return true
}

function calculateIncome (paymentSlips, annualReportPage, annualReport) {
  paymentSlips.forEach((paymentSlip) => {
    paymentSlip.incomePerCode.forEach((incomePerCode) => {
      annualReportPage.totalIncome = annualReportPage.totalIncome.plus(incomePerCode.income)
      const pageTotalIncomePerCode = annualReportPage.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (pageTotalIncomePerCode) {
        pageTotalIncomePerCode.income = pageTotalIncomePerCode.income.plus(Big(incomePerCode.income))
      } else {
        annualReportPage.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, income: Big(incomePerCode.income) })
      }
      const reportTotalIncomePerCode = annualReport.totalIncomePerCode.find((element) => {
        return element.incomeCode.partition === incomePerCode.incomeCode.partition && element.incomeCode.position === incomePerCode.incomeCode.position
      })
      if (reportTotalIncomePerCode) {
        reportTotalIncomePerCode.income = reportTotalIncomePerCode.income.plus(Big(incomePerCode.income))
      } else {
        annualReport.totalIncomePerCode.push({ incomeCode: incomePerCode.incomeCode, income: Big(incomePerCode.income) })
      }
    })
    annualReportPage.paymentSlips.push(paymentSlip)
  })
  annualReport.totalIncome = annualReport.totalIncome.plus(annualReportPage.totalIncome)
}

function calculateOutcome (receipts, annualReportPage, annualReport) {
  receipts.forEach((receipt) => {
    receipt.outcomePerCode.forEach((outcomePerCode) => {
      annualReportPage.totalOutcome = annualReportPage.totalOutcome.plus(outcomePerCode.outcome)
      const pageTotalOutcomePerCode = annualReportPage.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (pageTotalOutcomePerCode) {
        pageTotalOutcomePerCode.outcome = pageTotalOutcomePerCode.outcome.plus(Big(outcomePerCode.outcome))
      } else {
        annualReportPage.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, outcome: Big(outcomePerCode.outcome) })
      }
      const reportTotalOutcomePerCode = annualReport.totalOutcomePerCode.find((element) => {
        return element.outcomeCode.partition === outcomePerCode.outcomeCode.partition && element.outcomeCode.position === outcomePerCode.outcomeCode.position
      })
      if (reportTotalOutcomePerCode) {
        reportTotalOutcomePerCode.outcome = reportTotalOutcomePerCode.outcome.plus(Big(outcomePerCode.outcome))
      } else {
        annualReport.totalOutcomePerCode.push({ outcomeCode: outcomePerCode.outcomeCode, outcome: Big(outcomePerCode.outcome) })
      }
    })

    annualReportPage.receipts.push(receipt)
  })
  annualReport.totalOutcome = annualReport.totalOutcome.plus(annualReportPage.totalOutcome)
}

function transformBigsToNumbers(annualReport) {
  for(let i=0; i<annualReport.pages.length; i++) {
    const page = annualReport.pages[i]
    for(let j=0; j<page.totalIncomePerCode.length; j++) {
      page.totalIncomePerCode[j].income = parseFloat(page.totalIncomePerCode[j].income)
    }
    for(let j=0; j<page.totalOutcomePerCode.length; j++) {
      page.totalOutcomePerCode[j].outcome = parseFloat(page.totalOutcomePerCode[j].outcome)
    }
    page.totalIncome = parseFloat(page.totalIncome)
    page.totalOutcome = parseFloat(page.totalOutcome)
    page.transferFromPreviousMonth = parseFloat(page.transferFromPreviousMonth);
    page.transferToNextMonth = parseFloat(page.transferToNextMonth)
    page.total = parseFloat(page.total)
  }
  for(let i=0; i<annualReport.totalIncomePerCode.length; i++) {
    annualReport.totalIncomePerCode[i].income = parseFloat(annualReport.totalIncomePerCode[i].income)
  }
  for(let i=0; i<annualReport.totalOutcomePerCode.length; i++) {
    annualReport.totalOutcomePerCode[i].outcome = parseFloat(annualReport.totalOutcomePerCode[i].outcome)
  }
  annualReport.totalIncome = parseFloat(annualReport.totalIncome)
  annualReport.totalOutcome = parseFloat(annualReport.totalOutcome)
  annualReport.total = parseFloat(annualReport.total)
}
const monthNames = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"
]

async function getAnnualReportPages (annualReport) {
  console.log('Getting annual report pages')
  const annualReportPages = []
  populateHeadline(annualReport, annualReportPages)

  var incomeCodes = await incomeCodeDao.findAll()
  incomeCodes.sort(compareCodes)
  var outcomeCodes = await outcomeCodeDao.findAll()
  outcomeCodes.sort(compareCodes)

  const incomePageTemplate = await readFile(path.join(__static, "/templates/annual-report/income-page.html"), { encoding: 'utf8'})
  const outcomePageTemplate = await readFile(path.join(__static, "/templates/annual-report/outcome-page.html"), { encoding: 'utf8'})
  for(let i=0; i<annualReport.pages.length; i++) {
    await populateIncomeOutcomePage(annualReport, annualReport.pages[i], incomeCodes, outcomeCodes, new String(incomePageTemplate).toString(), new String(outcomePageTemplate).toString(), annualReportPages)
  }
  await populateTotalIncomeOutcomePage(annualReport, incomeCodes, outcomeCodes, annualReportPages)
  await populateSharesPage(annualReport, annualReportPages)
  await populateTotalPage(annualReport, annualReportPages)

  console.log(`Returning annual report ${annualReportPages.length} pages`)
  return annualReportPages
}

function compareCodes( codeA, codeB ) {
  return codeA.partition - codeB.partition || codeA.position - codeB.position;
}

async function populateHeadline(annualReport, annualReportPages) {
  const headlineContext = {};
  headlineContext.year = annualReport.year;

  const headline = await readFile(path.join(__static, "/templates/annual-report/headline.html"), { encoding: 'utf8'});
  Mustache.parse(headline);   // optional, speeds up future uses
  annualReportPages.push(Mustache.render(headline, headlineContext));
}

async function populateIncomeOutcomePage (annualReport, annualReportPage, incomeCodes, outcomeCodes, incomePageTemplate, outcomePageTemplate, annualReportPages) {
  var incomePageContext = {};
  var outcomePageContext = {};

  incomePageContext.page = annualReportPage.ordinal;
  incomePageContext.monthLokativ = i18n.getTranslation(monthNames[annualReportPage.ordinal-1] + '.lokativ');
  outcomePageContext.page = annualReportPage.ordinal;
  outcomePageContext.year = annualReport.year;

  var colsPerIncomeCodes = {}
  var colsPerOutcomeCodes = {}

  var col = 'D';
  // income codes
  incomeCodes.forEach(incomeCode => {
    let incomeCodeText = incomeCode.partition + '/' + incomeCode.position;
    incomePageContext[col+'6'] = incomeCodeText;
    incomePageContext[col+'7'] = incomeCode.description;
    colsPerIncomeCodes[incomeCodeText] = col;
    col = String.fromCharCode(col.charCodeAt() + 1);
  });
  var col = 'D';
   // outcome codes
  outcomeCodes.forEach(outcomeCode => {
    let outcomeCodeText = outcomeCode.partition + '/' + outcomeCode.position;
    outcomePageContext[col+'6'] = outcomeCodeText;
    outcomePageContext[col+'7'] = outcomeCode.description;
    colsPerOutcomeCodes[outcomeCodeText] = col;
    col = String.fromCharCode(col.charCodeAt() + 1);
  });
  var row = 14;
  annualReportPage.paymentSlips.forEach(paymentSlip => {
    // payment slip ordinal/date(day)/reason
    incomePageContext['A'+row] = paymentSlip.ordinal;
    let date = new Date(paymentSlip.date).getUTCDate();
    incomePageContext['B'+row] = date ? date + '.' : date;
    incomePageContext['C'+row] = paymentSlip.reason;
    // payment slip income per code
    paymentSlip.incomePerCode.forEach(incomePerCode => {
      let incomeCodeText = incomePerCode.incomeCode.partition + '/' + incomePerCode.incomeCode.position;
      incomePageContext[colsPerIncomeCodes[incomeCodeText] + row] = formatAmount(incomePerCode.income);
    });
    // payment slip total income
    incomePageContext['S'+row] = formatAmount(paymentSlip.income)
    row++;
  });
  var row = 14;
  annualReportPage.receipts.forEach(receipt => {
     // receipt ordinal/date(day)/reason
    outcomePageContext['A'+row] = receipt.ordinal;
    let date = new Date(receipt.date).getUTCDate();
    outcomePageContext['B'+row] = date ? date + '.' : date;
    outcomePageContext['C'+row] = receipt.reason;
    // receipt outcome per code
    receipt.outcomePerCode.forEach(outcomePerCode => {
      let outcomeCodeText = outcomePerCode.outcomeCode.partition + '/' + outcomePerCode.outcomeCode.position;
      outcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + row] = formatAmount(outcomePerCode.outcome);
    });
    // receipt total outcome
    outcomePageContext['T'+row] = formatAmount(receipt.outcome)
    row++;
  });
  // total per income code
  annualReportPage.totalIncomePerCode.forEach(totalIncomePerCode => {
    let incomeCodeText = totalIncomePerCode.incomeCode.partition + '/' + totalIncomePerCode.incomeCode.position;
    incomePageContext[colsPerIncomeCodes[incomeCodeText] + 41] = formatAmount(totalIncomePerCode.income);
  });
  // total per outcome code
  annualReportPage.totalOutcomePerCode.forEach(totalOutcomePerCode => {
    let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
    outcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + 41] = formatAmount(totalOutcomePerCode.outcome);
  });
  // total incomes and outcomes per page
  incomePageContext['S41'] = formatAmount(annualReportPage.totalIncome);
  incomePageContext['S42'] = formatAmount(annualReportPage.transferFromPreviousMonth);
  incomePageContext['S43'] = formatAmount(annualReportPage.total);
  outcomePageContext['T41'] = formatAmount(annualReportPage.totalOutcome);
  outcomePageContext['T42'] = formatAmount(annualReportPage.transferToNextMonth);
  outcomePageContext['T43'] = formatAmount(annualReportPage.total);

  Mustache.parse(incomePageTemplate);
  Mustache.parse(outcomePageTemplate);
  annualReportPages.push(Mustache.render(incomePageTemplate, incomePageContext));
  annualReportPages.push(Mustache.render(outcomePageTemplate, outcomePageContext));
}

async function populateTotalIncomeOutcomePage(annualReport, incomeCodes, outcomeCodes, annualReportPages) {
  var totalIncomePageContext = {};
  var totalOutcomePageContext = {};

  totalOutcomePageContext.year = annualReport.year;

  var colsPerIncomeCodes = {}
  var colsPerOutcomeCodes = {}

  var col = 'B';
  // income codes
  incomeCodes.forEach(incomeCode => {
    let incomeCodeText = incomeCode.partition + '/' + incomeCode.position;
    totalIncomePageContext[col+'5'] = incomeCodeText;
    totalIncomePageContext[col+'6'] = incomeCode.description;
    colsPerIncomeCodes[incomeCodeText] = col;
    col = String.fromCharCode(col.charCodeAt() + 1);
  });
  var col = 'B';
  // outcome codes
  outcomeCodes.forEach(outcomeCode => {
    let outcomeCodeText = outcomeCode.partition + '/' + outcomeCode.position;
    totalOutcomePageContext[col+'5'] = outcomeCodeText;
    totalOutcomePageContext[col+'6'] = outcomeCode.description;
    colsPerOutcomeCodes[outcomeCodeText] = col;
    col = String.fromCharCode(col.charCodeAt() + 1);
  });
  // totals per code per page
  var row = 8;
  annualReport.pages.forEach((page) => {
    page.totalIncomePerCode.forEach(totalIncomePerCode => {
      let incomeCodeText = totalIncomePerCode.incomeCode.partition + '/' + totalIncomePerCode.incomeCode.position;
      totalIncomePageContext[colsPerIncomeCodes[incomeCodeText] + row] = formatAmount(totalIncomePerCode.income);
    })
    page.totalOutcomePerCode.forEach(totalOutcomePerCode => {
      let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
      totalOutcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + row] = formatAmount(totalOutcomePerCode.outcome);
    });
    totalIncomePageContext['Q'+row] = formatAmount(page.totalIncome);
    totalOutcomePageContext['Q'+row] = formatAmount(page.totalOutcome);
    row++;
  });
  annualReport.totalIncomePerCode.forEach(totalIncomePerCode => {
    let incomeCodeText = totalIncomePerCode.incomeCode.partition + '/' + totalIncomePerCode.incomeCode.position;
    totalIncomePageContext[colsPerIncomeCodes[incomeCodeText] + '20'] = formatAmount(totalIncomePerCode.income);
  });
  annualReport.totalOutcomePerCode.forEach(totalOutcomePerCode => {
    let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
    totalOutcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + '20'] = formatAmount(totalOutcomePerCode.outcome);
  });
  // totals
  totalIncomePageContext['Q20'] = formatAmount(annualReport.totalIncome);
  totalOutcomePageContext['Q20'] = formatAmount(annualReport.totalOutcome);
  totalOutcomePageContext['Q24'] = formatAmount(annualReport.totalIncome);
  totalOutcomePageContext['Q25'] = formatAmount(annualReport.totalOutcome);
  totalOutcomePageContext['Q26'] = formatAmount(annualReport.total);

  const totalIncomePageTemplate = await readFile(path.join(__static, "/templates/annual-report/total-income-page.html"), { encoding: 'utf8'})
  const totalOutcomePageTemplate = await readFile(path.join(__static, "/templates/annual-report/total-outcome-page.html"), { encoding: 'utf8'});
  Mustache.parse(totalIncomePageTemplate);   // optional, speeds up future uses
  Mustache.parse(totalOutcomePageTemplate);
  annualReportPages.push(Mustache.render(totalIncomePageTemplate, totalIncomePageContext));
  annualReportPages.push(Mustache.render(totalOutcomePageTemplate, totalOutcomePageContext));
}

async function populateTotalPage(annualReport, annualReportPages) {
  const totalPageContext = {};

  totalPageContext.year = annualReport.year;
  totalPageContext['E5'] = formatAmount(annualReport.total);

  const totalPageTemplate = await readFile(path.join(__static, "/templates/annual-report/total-page.html"), { encoding: 'utf8'});
  Mustache.parse(totalPageTemplate);   // optional, speeds up future uses
  annualReportPages.push(Mustache.render(totalPageTemplate, totalPageContext));
}

async function populateSharesPage(annualReport, annualReportPages) {
  annualReportPages.push(await readFile(path.join(__static, "/templates/annual-report/shares-page.html"), { encoding: 'utf8'}));
}

const amountNumberOptions = {
  decimalCharacter : ',',
  digitGroupSeparator : '.'
}

function formatAmount (n) {
  if(!n) {
    return null
  }
  return AutoNumeric.format(n.toString(), amountNumberOptions)
}

async function createAnnualReportPdf (webContents) {
  webContents.printToPDF(pdfSettings(), function(err, data) {
    if (err) {
      console.error(err)
      throw new Error('Failed creating annual report pdf')
    }
    try {
      fs.writeFileSync(path.join(app.getPath('userData'), '/annual-report.pdf'), data);
    } catch(err) {
      console.error(err)
      throw new Error('Failed creating annual report pdf')
    }
  })
}

function pdfSettings () {
  var settings = {
      landscape: false,
      marginsType: 0,
      printBackground: false,
      printSelectionOnly: false,
      pageSize: "A4",
  };
  return settings;
}

module.exports = {
  getAnnualReport: getAnnualReport,
  getAnnualReportPages: getAnnualReportPages,
  createAnnualReportPdf: createAnnualReportPdf
}
