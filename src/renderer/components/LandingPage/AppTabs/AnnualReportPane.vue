<template>
  <b-container fluid>    
    <h3>Дневник благајне</h3>
    
      <b-button variant="primary" @click.stop="print()">
        print
      </b-button>
      за годину 
      <b-form-group>
        <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
      </b-form-group>
      <b-button type="submit" v-on:click="createAnnualReport">
        <img src="~@/assets/accounting.png" class="btn-img-sm">
      </b-button>
  </b-container>
</template>

<script>
  import AnnualReportFirstPage from './AnnualReportPane/AnnualReportFirstPage'
  import AnnualReportManual from './AnnualReportPane/AnnualReportManual'
  const annualReportController = require('../../../controllers/annualReportController')
  const i18n = require('../../../translations/i18n')
  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')
  const { ipcRenderer } = require('electron')
  const XlsxPopulate = require('xlsx-populate');
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const outcomeCodeController = require('../../../controllers/outcomeCodeController')

  export default {
    data () {
      return {
        yearToFilter: (new Date()).getFullYear(),
        phrases: {
          createAnnualReport: i18n.getTranslation('Create annual report')
        }
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
        annualReportController.getAnnualReport(this.yearToFilter).then(function (res) {
          if (!res.err) {
            self.populateExcel(res.data);
          } else {
            showErrorDialog(res.err);
          }
        })
      },
      populateExcel(annualReport) {
        const self = this
        function compareCodes( codeA, codeB ) {
          if ((codeA.partition.toString() + codeA.position.toString()) < (codeB.partition.toString() + codeB.position.toString())) {
            return -1;
          }
          if ((codeA.partition.toString() + codeA.position.toString()) > (codeB.partition.toString() + codeB.position.toString())) {
            return 1;
          }
          return 0;
        }
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        XlsxPopulate.fromFileAsync("static/annualReport.xlsx")
          .then(async function(workbook) {
            var incomeCodes = await incomeCodeController.getIncomeCodes();
            incomeCodes = self.uniqueArray(incomeCodes);
            incomeCodes.sort(compareCodes);
            var outcomeCodes = await outcomeCodeController.getOutcomeCodes();
            outcomeCodes = self.uniqueArray(outcomeCodes);
            outcomeCodes.sort(compareCodes);
            
            for(let i=0; i<annualReport.pages.length; i++) {
                const incomeSheet = workbook.sheet(i);
                const outcomeSheet = workbook.sheet(i+1);
                const incomeAnnualReportPage = annualReport.pages()[i];
                const outcomeAnnualReportPage = annualReport.pages()[i+1];
                
                incomeSheet.cell('A1').value(i18n.getTranslation('page') + ' ' + (i + 1));
                incomeSheet.cell('O1').value(i18n.getTranslation('in month') + ' ' + i18n.getTranslation(monthNames[i] + '.lokativ'));
                outcomeSheet.cell('A1').value(annualReport.year + '. ' + i18n.getTranslation('year.genitiv'));
                outcomeSheet.cell('P1').value(i18n.getTranslation('page') + ' ' + (i + 1));

                var columnsPerIncomeCodes = {}
                var columnsPerOutcomeCodes = {}

                var column = 'D';
                for(let j=0; j<incomeCodes.length; j++) {
                  let incomeCodeText = incomeCodes[j].partition + '/' + incomeCodes[j].position;
                  incomeSheet.cell(column+'4').value(incomeCodeText);
                  incomeSheet.cell(column+'5').value(incomeCodes[j].description);
                  columnsPerIncomeCodes[incomeCodeText] = column;
                  column++;
                }
                var column = 'D';
                for(let j=0; j<outcomeCodes.length; j++) {
                  let outcomeCodeText = outcomeCodes[j].partition + '/' + outcomeCodes[j].position;
                  outcomeSheet.cell(column+'4').value(outcomeCodeText);
                  outcomeSheet.cell(column+'5').value(outcomeCodes[j].description);
                  columnsPerOutcomeCodes[outcomeCodeText] = column;
                  column++;
                }
                var row = 6;
                for(let j=0; j<incomeAnnualReportPage.paymentSlips.length; j++) {
                  let paymentSlip = incomeAnnualReportPage.paymentSlips[j];
                  incomeSheet.cell('A'+row).value(paymentSlip.ordinal);
                  incomeSheet.cell('B'+row).value(paymentSlip.date.getDate());
                  incomeSheet.cell('C'+row).value(paymentSlip.reason);
                  for(let k=0; k<paymentSlip.incomesPerCode.length; k++) {
                    let incomeCodeText = paymentSlip.incomesPerCode[k].incomeCode.partition + '/' + paymentSlip.incomesPerCode[k].incomeCode.position;
                    incomeSheet.cell(columnsPerIncomeCodes[incomeCodeText] + row).value(paymentSlip.incomesPerCode[k].amount);
                  }
                  row++;
                }
                var row = 6;
                for(let j=0; j<outcomeAnnualReportPage.receipts.length; j++) {
                  let receipt = outcomeAnnualReportPage.receipts[j];
                  outcomeSheet.cell('A'+row).value(receipt.ordinal);
                  outcomeSheet.cell('B'+row).value(receipt.date.getDate());
                  outcomeSheet.cell('C'+row).value(receipt.reason);
                  for(let k=0; k<receipt.outcomesPerCode.length; k++) {
                    let outcomeCodeText = receipt.outcomesPerCode[k].outcomeCode.partition + '/' + receipt.outcomesPerCode[k].outcomeCode.position;
                    outcomeSheet.cell(columnsPerOutcomeCodes[outcomeCodeText] + row).value(receipt.outcomesPerCode[k].amount);
                  }
                  row++;
                }
                incomeSheet.cell('S33').value(incomeAnnualReportPage.totalIncome);
                incomeSheet.cell('S35').value(incomeAnnualReportPage.transferFromPreviousMonth);
                incomeSheet.cell('S36').value(incomeAnnualReportPage.total);
                outcomeSheet.cell('T33').value(outcomeAnnualReportPage.totalOutcome);
                outcomeSheet.cell('T34').value(outcomeAnnualReportPage.transferToNextMonth);
                outcomeSheet.cell('T35').value(outcomeAnnualReportPage.total);
            }
            const totalIncomeSheet = workbook.sheet(24);
            const totalOutcomeSheet = workbook.sheet(25);

            totalOutcomeSheet.cell('A2').value(i18n.getTranslation('year.akuzativ') + ' ' + annualReport.year + '. ' + i18n.getTranslation('by partition and position'));

            var columnsPerIncomeCodes = {}
            var columnsPerOutcomeCodes = {}
            var column = 'B';
            for(let i=0; i<incomeCodes.length; i++) {
              let incomeCodeText = incomeCodes[i].partition + '/' + incomeCodes[i].position;
              totalIncomeSheet.cell(column+'4').value(incomeCodeText);
              totalIncomeSheet.cell(column+'5').value(incomeCodes[i].description);
              columnsPerIncomeCodes[incomeCodeText] = column;
              column++;
            }
            var column = 'B';
            for(let i=0; i<outcomeCodes.length; i++) {
              let outcomeCodeText = outcomeCodes[i].partition + '/' + outcomeCodes[i].position;
              totalOutcomeSheet.cell(column+'4').value(outcomeCodeText);
              totalOutcomeSheet.cell(column+'5').value(outcomeCodes[i].description);
              columnsPerOutcomeCodes[outcomeCodeText] = column;
              column++;
            }
            var row = 7;
            for(let i=0; i<annualReport.pages.length; i++) {
              for(let j=0; j<annualReport.pages[i].totalIncomePerCode.length; j++) {
                let incomeCodeText = annualReport.pages[i].totalIncomePerCode[j].incomeCode.partition + '/' + annualReport.pages[i].totalIncomePerCode[j].incomeCode.position;
                totalIncomeSheet.cell(columnsPerIncomeCodes[incomeCodeText] + row).value(annualReport.pages[i].totalIncomePerCode[j].amount)
              }
              for(let j=0; j<annualReport.pages[i].totalOutcomePerCode.length; j++) {
                let outcomeCodeText = annualReport.pages[i].totalOutcomePerCode[j].outcomeCode.partition + '/' + annualReport.pages[i].totalOutcomePerCode[j].outcomeCode.position;
                totalOutcomeSheet.cell(columnsPerOutcomeCodes[outcomeCodeText] + row).value(annualReport.pages[i].totalOutcomePerCode[j].amount)
              }
              row++;
            }
            for(let i=0; i<annualReport.totalIncomePerCode.length; i++) {
                let incomeCodeText = annualReport.totalIncomePerCode[i].incomeCode.partition + '/' + annualReport.totalIncomePerCode[i].incomeCode.position;
                totalIncomeSheet.cell(columnsPerIncomeCodes[incomeCodeText] + '19').value(annualReport.totalIncomePerCode[i].amount)
            }
            for(let i=0; i<annualReport.totalOutcomePerCode.length; i++) {
              let outcomeCodeText = annualReport.totalOutcomePerCode[i].outcomeCode.partition + '/' + annualReport.totalOutcomePerCode[i].outcomeCode.position;
              totalOutcomeSheet.cell(columnsPerOutcomeCodes[outcomeCodeText] + '19').value(annualReport.totalOutcomePerCode[i].amount)
            }

            totalOutcomeSheet.cell('R24').value(annualReport.totalIncome);
            totalOutcomeSheet.cell('R25').value(annualReport.totalOutcome);
            totalOutcomeSheet.cell('R26').value(annualReport.total);
            
            return workbook.toFileAsync("static/out.xlsx");
          });
      },
      uniqueArray(arr) {
        function onlyUnique(value, index, self) { 
          return self.indexOf(value) === index;
        }
        return arr.filter( onlyUnique );
      },
      print: function () {
        ipcRenderer.send('printPDF', '')
      }
    },
    components: { AnnualReportFirstPage, AnnualReportManual }
  }
</script>

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