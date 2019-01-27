<template>
  <b-container fluid>    
    <b-form @submit="annualReportCreateSubmit" no-validation> 
      <b-form-group>
        <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
      </b-form-group>
      <b-button type="submit" variant="secondary">
       Get annual report
      </b-button>
      {{reportData}}
    </b-form>
  </b-container>
</template>

<script>
  const annualReportController = require('../../../controllers/annualReport.controller')
  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')

  export default {
    data () {
      return {
        reportData: null,
        yearToFilter: (new Date()).getFullYear()
      }
    },
    computed: {
      yearOptions: function () {
        return getLastNYears(50)
      }
    },
    methods: {
      annualReportCreateSubmit: function () {
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
</style>