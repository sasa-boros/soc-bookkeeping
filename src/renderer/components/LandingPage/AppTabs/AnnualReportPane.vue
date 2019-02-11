<template>
  <b-container fluid>    
    <h3>Дневник благајне</h3>
    <b-form inline @submit="annualReportCreateSubmit" no-validation> 
      Српске православне цркве  
      <b-form-group>
        <b-form-input v-model="church" size="sm" class="my-0"/>
      </b-form-group>
      за годину 
      <b-form-group>
        <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
      </b-form-group>
      <b-button type="submit" variant="secondary" ref="generateReportBtn">
        <img src="~@/assets/accounting.png" class="btn-img-sm">
      </b-button>
    </b-form>

    <div v-if="showReportData" class="reportPagesDiv" @keyup.arrow-left.exact="decresePageIndex" @keyup.arrow-right.exact="increasePageIndex">
      <annual-report-first-page v-if="pageRendered === 0" :year='yearToFilter' :church='church'></annual-report-first-page>
      <annual-report-manual v-if="pageRendered === 1"></annual-report-manual>
      <b-button variant="link" class="arrowBtn" id="arrowBtnLeft" @click.stop="decresePageIndex()">
        <img src="~@/assets/left-arrow-blue.png" class="btn-img">
      </b-button>
      <b-button variant="link" class="arrowBtn" id="arrowBtnRight" @click.stop="increasePageIndex()">
        <img src="~@/assets/right-arrow-blue.png" class="btn-img">
      </b-button>
    </div>
    
    <b-tooltip ref="generateReportBtnTooltip" :target="() => $refs.generateReportBtn">
      <div class="tooltipInnerText">
        {{phrases.generateAnnualReport}}
      </div>
    </b-tooltip>
  </b-container>
</template>

<script>
  import AnnualReportFirstPage from './AnnualReportPane/AnnualReportFirstPage'
  import AnnualReportManual from './AnnualReportPane/AnnualReportManual'
  const annualReportController = require('../../../controllers/annualReport.controller')
  const i18n = require('../../../translations/i18n')
  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')

  export default {
    data () {
      return {
        reportData: {},
        showReportData: false,
        pageRendered: 0,
        yearToFilter: (new Date()).getFullYear(),
        church: '',
        phrases: {
          generateAnnualReport: i18n.getTranslation('Generate annual report')
        }
      }
    },
    computed: {
      yearOptions: function () {
        return getLastNYears(50)
      }
    },
    methods: {
      annualReportCreateSubmit: function (evt) {
        evt.preventDefault()
        const self = this
        annualReportController.getAnnualReport(this.yearToFilter).then(function (res) {
          if (!res.err) {
            self.reportData = res.data
            self.showReportData = true
          } else {
            showErrorDialog(res.err)
          }
        })
      },
      decresePageIndex: function () {
        if (this.pageRendered > 0) {
          this.pageRendered--
        }
      },
      increasePageIndex: function () {
        if (this.reportData && this.pageRendered < this.reportData.pages.length - 1) {
          this.pageRendered++
        }
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