<template>
  <b-container fluid>    
      <b-row class="text-center">
        <b-col>
          <b-button type="submit" v-on:click="createAnnualReport" ref="annualReportBtn">
            <img src="~@/assets/accounting.png" class="btn-img-sm">
          </b-button>
        </b-col>
        <b-col cols="10">
          <b-form-group>
            <b-form-select v-model="year" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
          </b-form-group>
        </b-col>
      </b-row>

      <!-- Annual report preview modal -->
      <div>
      <b-modal hide-footer hide-header id="annual-report-preview-modal" size="ar">
        <annual-report-preview :annualReportPages='annualReportPages' parentModal="annual-report-preview-modal"></annual-report-preview>
      </b-modal>
      </div>
      <b-tooltip ref="annualReportBtnTooltip" :target="() => $refs.annualReportBtn">
        <div class="tooltipInnerText">
          {{phrases.showAnnualReport}}
        </div>
      </b-tooltip>
  </b-container>
</template>

<script>
  import AnnualReportPreview from './AnnualReportPreview'
  const annualReportController = require('../../../controllers/annualReportController')
  const i18n = require('../../../translations/i18n')
  const { getLastNYears, showErrorDialog, compareCodes } = require('../../../utils/utils')
  const { ipcRenderer } = require('electron')
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const outcomeCodeController = require('../../../controllers/outcomeCodeController')
  const fs = require('fs');
  const util = require('util');
  const readFile = util.promisify(fs.readFile);
  const Mustache = require('mustache');

  export default {
    data () {
      return {
        year: (new Date()).getFullYear(),
        phrases: {
          showAnnualReport: i18n.getTranslation('Show annual report')
        },
        publicPath: process.env.BASE_URL,
        monthNames:["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        annualReportPages: []
      }
    },
    computed: {
      yearOptions: function () {
        return getLastNYears(50)
      }
    },
    methods: {
      createAnnualReport: function () {
        const self = this
        annualReportController.getAnnualReport(this.year).then(async function (res) {
          if (!res.err) {
            await self.populateAnnualReportHtmlPages(res.data);
            self.openAnnualReportPreviewModal();
          } else {
            showErrorDialog(res.err);
          }
        })
      },
      async populateAnnualReportHtmlPages(annualReport) {
        const self = this;
        this.annualReportPages = [];
        await this.populateHeadline(annualReport);

        const incomeCodes = await this.getIncomeCodes();
        const outcomeCodes = await this.getOutcomeCodes();
        const incomePageTemplate = await readFile("./static/annual-report/income-page.html", { encoding: 'utf8'})
        const outcomePageTemplate = await readFile("./static/annual-report/outcome-page.html", { encoding: 'utf8'});
        for(let i=0; i<annualReport.pages.length; i++) {
          await this.populateIncomeOutcomePage(annualReport, annualReport.pages[i], incomeCodes, outcomeCodes, new String(incomePageTemplate).toString(), new String(outcomePageTemplate).toString());
        }
        await this.populateTotalIncomeOutcomePage(annualReport, incomeCodes, outcomeCodes);
        await this.populateSharesPage(annualReport);
        await this.populateTotalPage(annualReport);
      },
      async getIncomeCodes () {
        const incomeCodesRes = await incomeCodeController.getIncomeCodes();
        if(incomeCodesRes.err) {
          showErrorDialog(incomeCodesRes.err);
          return;
        }
        var incomeCodes = incomeCodesRes.data;
        incomeCodes.sort(compareCodes);
        return incomeCodes;
      },
      async getOutcomeCodes () {
        const outcomeCodesRes = await outcomeCodeController.getOutcomeCodes();
        if(outcomeCodesRes.err) {
          showErrorDialog(outcomeCodesRes.err);
          return;
        }
        var outcomeCodes = outcomeCodesRes.data;
        outcomeCodes.sort(compareCodes);
        return outcomeCodes;
      },
      async populateHeadline(annualReport) {
        const headlineContext = {};
        headlineContext.year = annualReport.year;

        const headline = await readFile("./static/annual-report/headline.html", { encoding: 'utf8'});
        Mustache.parse(headline);   // optional, speeds up future uses
        this.annualReportPages.push(Mustache.render(headline, headlineContext));
      },
      async populateIncomeOutcomePage (annualReport, annualReportPage, incomeCodes, outcomeCodes, incomePageTemplate, outcomePageTemplate) {
        var incomePageContext = {};
        var outcomePageContext = {};

        incomePageContext.page = annualReportPage.ordinal;
        incomePageContext.monthLokativ = i18n.getTranslation(this.monthNames[annualReportPage.ordinal-1] + '.lokativ');
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
            incomePageContext[colsPerIncomeCodes[incomeCodeText] + row] = incomePerCode.income;
          });
          // payment slip total income
          incomePageContext['S'+row] = paymentSlip.income
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
            outcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + row] = outcomePerCode.outcome;
          });
          // receipt total outcome
          outcomePageContext['S'+row] = receipt.outcome
          row++;
        });
        // total per income code
        annualReportPage.totalIncomePerCode.forEach(totalIncomePerCode => {
          let incomeCodeText = totalIncomePerCode.incomeCode.partition + '/' + totalIncomePerCode.incomeCode.position;
          incomePageContext[colsPerIncomeCodes[incomeCodeText] + 40] = totalIncomePerCode.income;
        });
        // total per outcome code
        annualReportPage.totalOutcomePerCode.forEach(totalOutcomePerCode => {
          let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
          outcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + 40] = totalOutcomePerCode.outcome;
        });
        // total incomes and outcomes per page
        incomePageContext['S40'] = annualReportPage.totalIncome;
        incomePageContext['S41'] = annualReportPage.transferFromPreviousMonth;
        incomePageContext['S42'] = annualReportPage.total;
        outcomePageContext['S40'] = annualReportPage.totalOutcome;
        outcomePageContext['S41'] = annualReportPage.transferToNextMonth;
        outcomePageContext['S42'] = annualReportPage.total;

        Mustache.parse(incomePageTemplate);   // optional, speeds up future uses
        Mustache.parse(outcomePageTemplate);
        this.annualReportPages.push(Mustache.render(incomePageTemplate, incomePageContext));
        this.annualReportPages.push(Mustache.render(outcomePageTemplate, outcomePageContext));
      },
      async populateTotalIncomeOutcomePage(annualReport, incomeCodes, outcomeCodes) {
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
            totalIncomePageContext[colsPerIncomeCodes[incomeCodeText] + row] = totalIncomePerCode.income;
          })
          page.totalOutcomePerCode.forEach(totalOutcomePerCode => {
            let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
            totalOutcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + row] = totalOutcomePerCode.outcome;
          });
          totalIncomePageContext['R'+row] = page.totalIncome;
          totalOutcomePageContext['R'+row] = page.totalOutcome;
          row++;
        });
        annualReport.totalIncomePerCode.forEach(totalIncomePerCode => {
          let incomeCodeText = totalIncomePerCode.incomeCode.partition + '/' + totalIncomePerCode.incomeCode.position;
          totalIncomePageContext[colsPerIncomeCodes[incomeCodeText] + '19'] = totalIncomePerCode.income;
        });
        annualReport.totalOutcomePerCode.forEach(totalOutcomePerCode => {
          let outcomeCodeText = totalOutcomePerCode.outcomeCode.partition + '/' + totalOutcomePerCode.outcomeCode.position;
          totalOutcomePageContext[colsPerOutcomeCodes[outcomeCodeText] + row] = totalOutcomePerCode.outcome;
        });
        totalOutcomePageContext['Q24'] = annualReport.totalIncome;
        totalOutcomePageContext['Q25'] = annualReport.totalOutcome;
        totalOutcomePageContext['Q26'] = annualReport.total;

        const totalIncomePageTemplate = await readFile("./static/annual-report/total-income-page.html", { encoding: 'utf8'})
        const totalOutcomePageTemplate = await readFile("./static/annual-report/total-outcome-page.html", { encoding: 'utf8'});
        Mustache.parse(totalIncomePageTemplate);   // optional, speeds up future uses
        Mustache.parse(totalOutcomePageTemplate);
        this.annualReportPages.push(Mustache.render(totalIncomePageTemplate, totalIncomePageContext));
        this.annualReportPages.push(Mustache.render(totalOutcomePageTemplate, totalOutcomePageContext));
      },
      async populateTotalPage(annualReport) {
        const totalPageContext = {};

        totalPageContext.year = annualReport.year;
        totalPageContext['E5'] = annualReport.total;

        const totalPageTemplate = await readFile("./static/annual-report/total-page.html", { encoding: 'utf8'});
        Mustache.parse(totalPageTemplate);   // optional, speeds up future uses
        this.annualReportPages.push(Mustache.render(totalPageTemplate, totalPageContext));
      },
      async populateSharesPage(annualReport) {
        this.annualReportPages.push(await readFile("./static/annual-report/shares-page.html", { encoding: 'utf8'}));
      },
      openAnnualReportPreviewModal() {
        this.$root.$emit('bv::show::modal', 'annual-report-preview-modal')
      }
    },
    components: { AnnualReportPreview }
  }
</script>

<style>
  .modal .modal-ar {
    max-width: 830px;
    width: 830px;
    max-height: 550px;
    height: 550px;
    overflow: hidden;
  }
</style>

<style scoped>

#yearSelect {
  width: 95px;
  padding-left:5px;
  margin-bottom: 8px;
}
.reportPagesDiv {
  position: relative;
  border: solid 1px;
  border-color: #ddeeee;
  background-color: #ddeeee;
  margin-top: 10px;
  width: 1201px;
  height: 852px;
  padding: 5px;
}
.arrowBtn {
  position: absolute;
  bottom: 50%;
}
.btn-img {
  width: 50%;
  height: auto;
}
.btn-img-sm {
  width: 30%;
  height: auto;
}
#arrowBtnRight {
  right: -30px;
}
#arrowBtnLeft {
  left: -30px;
}

.pageDivv{
  border-style: solid;
  border-color: #ddeeee;
  border-radius: 10px;
  border-width: 1px;
  margin: 10px;
  padding: 10px;
  background-color: #ddeeee;
}
.itemsDiv{
  min-height: 5px;
}
.lighterDiv{
  background-color: #eeffff;
}
.itemsList{
  padding-left: 20px;
}
</style>