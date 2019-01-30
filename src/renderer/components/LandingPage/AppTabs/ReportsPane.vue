<template>
  <b-container fluid>    
    <b-form @submit="annualReportCreateSubmit" no-validation> 
      <b-form-group>
        <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
      </b-form-group>
      <b-button type="submit" variant="secondary">
       Генериши дневник благајне
      </b-button>
      <div v-for="page in reportData.pages" class="pageDiv">
        <h5>У месецу {{page.monthText}}</h5>
        <h6> Свега: <em><b>{{page.total}}</b></em></h6>
        <b-row class="lighterDiv">
          <b-col>
            <div class="itemsDiv">
            <h6>Признанице:</h6>
              <ul class="itemsList">
                <li v-for="receipt in page.receipts">
                  <em><b>{{receipt.amount}}</b></em> дин, на име <em><b>{{receipt.reason}}</b></em>
                </li>
              </ul>
            </div>  
          </b-col>
          <b-col>
            <div class="itemsDiv">
            <h6>Уплатнице:</h6>
              <ul class="itemsList">
                <li v-for="paymentSlip in page.paymentSlips">
                  <em><b>{{paymentSlip.amount}}</b></em> дин, на име <em><b>{{paymentSlip.reason}}</b></em>
                </li>
              </ul>
            </div>
          </b-col>
        </b-row>
        <b-row class="darkerDiv">
          <b-col>
             Свега примања: <em><b>{{page.totalIncome}}</b></em>
            <br/>Пренос готовине из прошлог месеца: <em><b>{{page.transferFromPreviousMonth}}</b></em>
          </b-col>
          <b-col>
            Свега издавања: <em><b>{{page.totalOutcome}}</b></em>
            <br/>Пренос готовине у наредни месец: <em><b>{{page.transferToNextMonth}}</b></em>
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-container>
</template>

<script>
  const annualReportController = require('../../../controllers/annualReport.controller')
  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')

  export default {
    data () {
      return {
        reportData: {},
        yearToFilter: (new Date()).getFullYear()
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
          } else {
            showErrorDialog(res.err)
          }
        })
      }
    }
  }
</script>

<style scoped>
#yearSelect{
  width: 95px;
  padding-left:5px;
  margin-bottom: 8px;
}
.pageDiv{
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