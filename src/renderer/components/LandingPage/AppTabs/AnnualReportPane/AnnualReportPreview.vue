<template>
  <b-container fluid id="annual-report-preview">
    <br>
      <b-row>
        <b-col cols="3">
          <b-button id="annualReportDownloadBtn" ref="annualReportDownloadBtn" v-on:mouseleave="hideTooltip('annualReportDownloadBtn')" @click.stop="downloadAnnualReport()" variant="link" class="btn-lg float-left">
            <img src="~@/assets/download.png">
          </b-button>
          &nbsp;
          <b-button id="annualReportPrintBtn" ref="annualReportPrintBtn" v-on:mouseleave="hideTooltip('annualReportPrintBtn')" @click.stop="printAnnualReport()" variant="link" class="btn-lg float-left">
            <img src="~@/assets/print.png">
          </b-button>
        </b-col>
        <b-col cols="2">
          <div class="float-right pageCount">
            {{currentPage | formatPageCount}}/{{annualReportPages.length}}
          </div>
        </b-col>
        <b-col cols="2" class="text-center">
          <b-button id="decrementPageBtn" ref="decrementPageBtn" v-on:mouseleave="hideTooltip('decrementPageBtn')" variant="link" v-on:click='decrementPage'>
            <i class="arrow left"></i>
          </b-button>
          <b-button id="incrementPageBtn" ref="incrementPageBtn" v-on:mouseleave="hideTooltip('incrementPageBtn')" variant="link" v-on:click='incrementPage'>
            <i class="arrow right"></i>
          </b-button>
        </b-col>
        <b-col cols="5">
          <b-button @click.stop="closeModal()" variant="link" id="modalCancelBtn" class="btn-xs float-right">
            <img src="~@/assets/close.png">
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <div v-html="annualReportPages[currentPage-1]" id="page-display" v-bind:class="{ headline: isHeadline, incomePage: isIncomePage, outcomePage: isOutcomePage, sharesPage: isSharesPage, totalIncomePage: isTotalIncomePage, totalOutcomePage: isTotalOutcomePage, totalPage: isTotalPage }">
        </div>
      </b-row>
      <b-tooltip ref="annualReportPrintBtnTooltip" target="annualReportPrintBtn">
          <div class="tooltipInnerText">
            {{phrases.print}}
          </div>
      </b-tooltip>
      <b-tooltip ref="annualReportDownloadBtnTooltip" target="annualReportDownloadBtn">
          <div class="tooltipInnerText">
            {{phrases.download}}
          </div>
      </b-tooltip>
      <b-tooltip ref="decrementPageBtnTooltip" target="decrementPageBtn">
          <div class="tooltipInnerText">
            {{phrases.previousPage}}
          </div>
      </b-tooltip>
      <b-tooltip ref="incrementPageBtnTooltip" target="incrementPageBtn">
          <div class="tooltipInnerText">
            {{phrases.nextPage}}
          </div>
      </b-tooltip>
      <b-modal id="annual-report-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="annual-report-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
  </b-container>
</template>

<script>
import MessageConfirmDialog from '../../../MessageConfirmDialog'

const i18n = require('../../../../../translations/i18n');
const annualReportController = require('../../../../controllers/annualReportController')
const { saveAs } = require('../../../../utils/utils')

export default {
  props: {
    annualReportPages: {
      type: Array,
      default: []
    },
    parentModal: String
  },
  data () {
    return {
      phrases: {
        print: i18n.getTranslation('Print'),
        previousPage: i18n.getTranslation('Previous page'),
        nextPage: i18n.getTranslation('Next page'),
        ok: i18n.getTranslation('Ok'),
        download: i18n.getTranslation('Download'),
        permissionDenied: i18n.getTranslation('Permission denied.'),
        annualReportPdf: i18n.getTranslation('annual-report.pdf')
      },
      currentPage: 1,
      errorText: ""
    }
  },
  computed: {
    isHeadline: function () {
      if (this.currentPage == 1) {
        return true
      }
      return false
    }, 
    isIncomePage: function () {
      if ([2,4,6,8,10,12,14,16,18,20,22,24].includes(this.currentPage)) {
        return true
      }
      return false
    },
    isOutcomePage: function () {
      if ([3,5,7,9,11,13,15,17,19,21,23,25].includes(this.currentPage)) {
        return true
      }
      return false
    },
    isTotalIncomePage: function () {
      if (this.currentPage == 26) {
        return true
      }
      return false
    }, 
    isTotalOutcomePage: function () {
      if (this.currentPage == 27) {
        return true
      }
      return false
    },
    isSharesPage: function () {
      if (this.currentPage == 28) {
        return true
      }
      return false
    },
    isTotalPage: function () {
      if (this.currentPage == 29) {
        return true
      }
      return false
    }
  },
  created () {
      var vm = this;
      window.addEventListener('keyup', (event) => {
        if (event.keyCode == 37) { 
          this.decrementPage()
        } else if (event.keyCode == 39) {
          this.incrementPage()
        }
      });
  },
  filters: {
    formatPageCount (pageCount) {
      if (pageCount < 10) {
        return '0' + pageCount
      }
      return pageCount
    }
  },
  methods: {
    decrementPage() {
      if(this.currentPage == 1) {
        this.currentPage = 29;
      } else {
        this.currentPage--;
      }
    },
    incrementPage() {
      if(this.currentPage == 29) {
        this.currentPage = 1;
      } else {
        this.currentPage++;
      }
    },
    printAnnualReport () {
      const section = this.preparePrintSection()
      document.body.appendChild(section)
      try {
        window.print()
      } finally {
        document.body.removeChild(section)
      }
    },
    async downloadAnnualReport () {
      const section = this.preparePrintSection()
      document.body.appendChild(section)
      try {
        const res = await annualReportController.createAnnualReportPdf()
        if (!res.err) {
            const self = this
            saveAs('/annual-report.pdf', this.phrases.annualReportPdf, err => {
              if (err) {
                if (err.message.toLowerCase().indexOf('permission denied') != -1) {
                  self.openErrorModal(self.phrases.permissionDenied)
                } else {
                  self.openErrorModal(err.message)
                }
              }
            })
          } else {
            this.openErrorModal(res.err)       
          }
      } finally {
        document.body.removeChild(section)
      }
    },
    preparePrintSection () {
      // ensuring clean screen
      var paymentSlipSection = document.getElementById('print-payment-slip')
      if (paymentSlipSection) {
        document.body.removeChild(paymentSlipSection)
      }
      var receiptSection = document.getElementById('print-receipt')
      if (receiptSection) {
        document.body.removeChild(receiptSection)
      }
      var section = document.createElement('div')
      section.id = 'print-annual-report'
      section.innerHTML = ''
      this.annualReportPages.forEach((annualReportPage, index) => {
        var page = document.createElement('div')
        if(index == 28) {
          page.className = 'last-page'
        }
        page.innerHTML = annualReportPage
        section.appendChild(page)
      })
      return section
    },
    openErrorModal(error) {
      this.errorText = error
      this.$root.$emit('bv::show::modal', 'annual-report-error-modal')
    },
    hideTooltip (elementId) {
      if (elementId) {
        this.$root.$emit('bv::hide::tooltip', elementId)
      } else {
        this.$root.$emit('bv::hide::tooltip')
      }
    },
    closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
    }
  },
  components: { MessageConfirmDialog }
}
</script>

<style scoped>

.pageCount {
  position: relative;
  top: 7px;
}

.headline >>> #headline {
	transform: scale(0.6);
	position:relative;
  bottom: 120px;
  left:35px;
}

.incomePage >>> #income-page {
	transform: scale(0.5);
	position:relative;
	bottom: 250px;
	right: 407px;
}
.outcomePage >>> #outcome-page {
	transform: scale(0.5);
	position:relative;
	bottom: 255px;
	right: 449px;
}

.totalIncomePage >>> #total-income-page {
  transform: scale(0.5);
	position:relative;
	bottom: 215px;
	right: 400px;
}

.totalOutcomePage >>> #total-outcome-page {
  transform: scale(0.5);
	position:relative;
	bottom: 276px;
	right: 400px;
}

.sharesPage >>> #shares-page {
  transform: scale(0.5);
  position:relative;
  bottom: 230px;
  right: 390px;
}

.totalPage >>> #total-page {
	transform: scale(0.5);
	position:relative;
	bottom: 220px;
	right: 190px;
}

i {
  border: solid black;
  border-width: 0 5px 5px 0;
  display: inline-block;
  padding: 3px;
}

.right {
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
}

.left {
  transform: rotate(135deg);
  -webkit-transform: rotate(135deg);
}
</style>

<style>
  @media screen {
    #print-annual-report {
      display: none;
    }
  }
  @media print {
    * {
      visibility:hidden;
    }
    #print-annual-report, #print-annual-report * {
      visibility:visible;
    }
    #headline {
      position: relative;
      bottom: 1265px;
      left: 250px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
      page-break-after: always;
    }
    #income-page {
      page-break-before: always;
      position: relative;
      bottom:885px;
      left: 90px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #outcome-page {
      page-break-before: always;
      position: relative;
      bottom:850px;
      left: 90px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-income-page {
      page-break-before: always;
      position: relative;
      bottom: 885px;
      left: 50px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-outcome-page {
      page-break-before: always;
      position: relative;
      bottom: 885px;
      left: 50px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #shares-page {
      page-break-before: always;
      position: relative;
      bottom: 895px;
      left: 70px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    .last-page {
      position:relative; 
      top:435px;
    }
    #total-page {
      page-break-before: always;
      position: absolute;
      bottom:0px;
      left: 70px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
  }
</style>
