<template>
  <b-container fluid id="printPageContainer">
    <div>
      <div class="page-break-div">      
        <annual-report-first-page :year='annualReportData.year' :church='church'></annual-report-first-page>
      </div>
      <div class="page-break-div"> 
        <annual-report-blank-page></annual-report-blank-page>
      </div>
      <div class="page-break-div">
        <annual-report-manual></annual-report-manual>
      </div>
      <div v-for="page in annualReportData.pages">
        <div class="page-break-div"> 
          <annual-report-receiving-page :pageData="page"></annual-report-receiving-page>
        </div>
      </div>
      <div class="page-break-div"> 
        {{annualReportData}}
      </div>
    </div>
  </b-container fluid>
</template>

<script>
  import { mapState } from 'vuex'
  import AnnualReportBlankPage from './LandingPage/AppTabs/AnnualReportPane/AnnualReportBlankPage'
  import AnnualReportFirstPage from './LandingPage/AppTabs/AnnualReportPane/AnnualReportFirstPage'
  import AnnualReportManual from './LandingPage/AppTabs/AnnualReportPane/AnnualReportManual'
  import AnnualReportReceivingPage from './LandingPage/AppTabs/AnnualReportPane/AnnualReportReceivingPage'
  import AnnualReportIssuingPage from './LandingPage/AppTabs/AnnualReportPane/AnnualReportIssuingPage'
  const ipcRenderer = require('electron').ipcRenderer

  ipcRenderer.on('printPDF', (event, content) => {
    // document.body.innerHTML = content
    ipcRenderer.send('readyToPrintPDF')
  })

  export default {
    name: 'annual-report-print-page',
    computed: {
      ...mapState(
        {
          annualReportData: state => state.AnnualReportValues.annualReportData,
          church: state => state.AnnualReportValues.church
        }
      )
    },
    components: { AnnualReportBlankPage, AnnualReportFirstPage, AnnualReportManual, AnnualReportReceivingPage, AnnualReportIssuingPage }
  }
</script>

<style>
#print{
}
#printPageContainer{
  margin: 0 !important;
  padding: 0 !important;
}
.page-break-div{
  break-after: page;
}
</style>
