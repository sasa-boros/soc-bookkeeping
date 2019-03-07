<template>
  <b-container fluid id="printPageContainer">
    <div id="print">
      <div class="page-break-div">      
        <annual-report-first-page year='2019' church='church'></annual-report-first-page>
      </div>
      <div class="page-break-div"> 
        <annual-report-manual></annual-report-manual>
      </div>
      <div class="page-break-div"> 
        asdasdasdas
      </div>
      <div class="page-break-div"> 
        kkasdaapppp
      </div>
    </div>
  </b-container fluid>
</template>

<script>
  import AnnualReportFirstPage from './LandingPage/AppTabs/AnnualReportPane/AnnualReportFirstPage'
  import AnnualReportManual from './LandingPage/AppTabs/AnnualReportPane/AnnualReportManual'
  const ipcRenderer = require('electron').ipcRenderer

  ipcRenderer.on('printPDF', (event, content) => {
    // document.body.innerHTML = content
    ipcRenderer.send('readyToPrintPDF')
  })

  export default {
    name: 'annual-report-print-page',
    components: { AnnualReportFirstPage, AnnualReportManual }
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
