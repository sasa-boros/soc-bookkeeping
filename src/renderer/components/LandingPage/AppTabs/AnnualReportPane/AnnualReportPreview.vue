<template>
  <b-container fluid id="annual-report-preview">
    <br>
      <b-row>
        <b-col cols="3">
          <span v-on:mouseleave="hideTooltip('annualReportDownloadDropdown')">
            <b-dropdown id="annualReportDownloadDropdown" variant="link">
              <template v-slot:button-content>
                <img src="~@/assets/download.png">
              </template>
              <b-dropdown-item class="dropdownOption" v-on:click="downloadAnnualReportPage">{{phrases.downloadPage}}</b-dropdown-item>
              <b-dropdown-item class="dropdownOption" v-on:click="downloadAnnualReport">{{phrases.downloadWholeAnnualReport}}</b-dropdown-item>
            </b-dropdown>
          </span>
          <span v-on:mouseleave="hideTooltip('annualReportPrintDropdown')">
            <b-dropdown id="annualReportPrintDropdown" variant="link">
              <template v-slot:button-content>
                <img src="~@/assets/print.png">
              </template>
              <b-dropdown-item v-on:click="printAnnualReportPage">{{phrases.printPage}}</b-dropdown-item>
              <b-dropdown-item v-on:click="printAnnualReport">{{phrases.printWholeAnnualReport}}</b-dropdown-item>
            </b-dropdown>
          </span>
          &nbsp;
        </b-col>
        <b-col cols="2">
          <div class="float-right pageCount">
            {{currentPage | formatPageCount}}/{{annualReportPages.length}}
          </div>
        </b-col>
        <b-col cols="2" class="text-center">
          <b-button id="decrementPageBtn" ref="decrementPageBtn" v-on:mouseleave="hideTooltip('decrementPageBtn')" variant="light" v-on:click='decrementPage'>
            <i class="arrow left"></i>
          </b-button>
          <b-button id="incrementPageBtn" ref="incrementPageBtn" v-on:mouseleave="hideTooltip('incrementPageBtn')" variant="light" v-on:click='incrementPage'>
            <i class="arrow right"></i>
          </b-button>
        </b-col>
        <b-col>
          <b-button @click.stop="closeModal()" variant="link" id="modalCancelBtn" class="btn-xs float-right">
            <img src="~@/assets/close.png">
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <div v-html="annualReportPages[currentPage-1]" id="page-display" class="headline manualPage incomePage outcomePage sharesPage totalIncomePage totalOutcomePage totalPage">
        </div>
      </b-row>
      <b-tooltip ref="annualReportPrintDropdownTooltip" triggers="hover" target="annualReportPrintDropdown" v-on:hide.prevent>
        {{phrases.print}}
      </b-tooltip>
      <b-tooltip ref="annualReportDownloadDropdownTooltip" triggers="hover" target="annualReportDownloadDropdown" v-on:hide.prevent>
        {{phrases.download}}
      </b-tooltip>
      <b-tooltip ref="decrementPageBtnTooltip" triggers="hover" target="decrementPageBtn" v-on:hide.prevent>
        {{phrases.previousPage}}
      </b-tooltip>
      <b-tooltip ref="incrementPageBtnTooltip" triggers="hover" target="incrementPageBtn" v-on:hide.prevent>
        {{phrases.nextPage}}
      </b-tooltip>
      
      <b-modal id="annual-report-error-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('annualReportErrorModal')">
        <message-confirm-dialog ref="annualReportErrorModal" parentModal="annual-report-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
  </b-container>
</template>

<script>
import MessageConfirmDialog from '../../../MessageConfirmDialog'

const i18n = require('../../../../../translations/i18n');
const annualReportController = require('../../../../controllers/annualReportController')
const { saveAs } = require('../../../../utils/utils')
const Mousetrap = require('mousetrap');

const printStyle = `
<style>
@media screen {
    #print-annual-report {
      display: none;
    }
  }
  @media print {
    #app {
      display:none;
    }
    #print-annual-report, #print-annual-report * {
      visibility:visible;
    }
    #headline {
      position: relative;
      top: 300px;
      left: 260px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #manual-page {
      page-break-before: always;
      position: relative;
      top: 720px;
      left: 65px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #income-page {
      page-break-before: always;
      position: relative;
      top: 725px;
      left: 98px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #outcome-page {
      page-break-before: always;
      position: relative;
      top: 715px;
      left: 99px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-income-page {
      page-break-before: always;
      position: relative;
      top: 670px;
      left: 63px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-outcome-page {
      page-break-before: always;
      position: relative;
      top: 670px;
      left: 62px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #shares-page {
      page-break-before: always;
      position: relative;
      top: 680px;
      left: 77px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-page {
      page-break-before: always;
      position: relative;
      top: 475px;
      left: 72px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
  }
  </style>
`
const printPageStyle = `
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
      page-break-before: always;
      position: absolute;
      bottom:1375px;
      left: 370px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #manual-page {
      page-break-before: always;
      position: absolute;
      bottom:995px;
      left: -425px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #income-page {
      page-break-before: always;
      position: absolute;
      bottom:955px;
      left: -355px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #outcome-page {
      page-break-before: always;
      position: absolute;
      bottom:950px;
      left: -350px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-income-page {
      page-break-before: always;
      position: absolute;
      bottom:1120px;
      left: -466px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-outcome-page {
      page-break-before: always;
      position: absolute;
      bottom:1003px;
      left: -370px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #shares-page {
      page-break-before: always;
      position: absolute;
      bottom:1082px;
      left: -413px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-page {
      page-break-before: always;
      position: absolute;
      bottom:1190px;
      left: -146px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
  }
  </style>
`
const downloadStyle = `
<style>
@media screen {
    #print-annual-report {
      display: none;
    }
  }
  @media print {
    #app {
      display:none;
    }
    #print-annual-report, #print-annual-report * {
      visibility:visible;
    }
    #headline {
      position: relative;
      top: 300px;
      left: 260px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #manual-page {
      page-break-before: always;
      position: relative;
      top: 720px;
      left: 65px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #income-page {
      page-break-before: always;
      position: relative;
      top: 725px;
      left: 98px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #outcome-page {
      page-break-before: always;
      position: relative;
      top: 715px;
      left: 99px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-income-page {
      page-break-before: always;
      position: relative;
      top: 670px;
      left: 63px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-outcome-page {
      page-break-before: always;
      position: relative;
      top: 670px;
      left: 62px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #shares-page {
      page-break-before: always;
      position: relative;
      top: 680px;
      left: 77px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-page {
      page-break-before: always;
      position: relative;
      top: 475px;
      left: 72px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
  }
  </style>
`

const downloadPageStyle = `
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
      page-break-before: always;
      position: absolute;
      bottom:1395px;
      left: 370px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #manual-page {
      page-break-before: always;
      position: absolute;
      bottom:1015px;
      left: -435px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #income-page {
      page-break-before: always;
      position: absolute;
      bottom:975px;
      left: -360px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #outcome-page {
      page-break-before: always;
      position: absolute;
      bottom:965px;
      left: -350px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-income-page {
      page-break-before: always;
      position: absolute;
      bottom:1145px;
      left: -473px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-outcome-page {
      page-break-before: always;
      position: absolute;
      bottom:1023px;
      left: -380px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #shares-page {
      page-break-before: always;
      position: absolute;
      bottom:1102px;
      left: -420px;
      transform: scale(0.78) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
    #total-page {
      page-break-before: always;
      position: absolute;
      bottom:1203px;
      left: -155px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0 1;
    }
  }
  </style>
`

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
        download: i18n.getTranslation('Download'),
        downloadPage: i18n.getTranslation('Download page'),
        downloadWholeAnnualReport: i18n.getTranslation('Download whole annual report'),
        print: i18n.getTranslation('Print'),
        printPage: i18n.getTranslation('Print page'),
        printWholeAnnualReport: i18n.getTranslation('Print whole annual report'),
        previousPage: i18n.getTranslation('Previous page'),
        nextPage: i18n.getTranslation('Next page'),
        ok: i18n.getTranslation('Ok'),
        permissionDenied: i18n.getTranslation('Permission denied.'),
        annualReportFileName: i18n.getTranslation('annual-report'),
        annualReportPageFileName: i18n.getTranslation('annual-report-page')
      },
      currentPage: 1,
      errorText: "",
      printSection: null,
      printPageSections: [],
      downloadSection: null,
      downloadPageSections: [],
      alreadyPressed: false
    }
  },
  created () {
    this.printSection = this.preparePrintSection(printStyle, null)
    this.downloadSection = this.preparePrintSection(downloadStyle, null)
    const self = this
    this.annualReportPages.forEach((annualReportPage, index) => {
      self.printPageSections.push(self.preparePrintSection(printPageStyle, index))
      self.downloadPageSections.push(self.preparePrintSection(downloadPageStyle, index))
    })
  },
  mounted () {
    this.bindKeys()
  },
  beforeDestroy () {
    this.unbindKeys()
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
    focusModalCloseButton (modalRef) {
      this.$refs[modalRef].$refs.closeButton.focus()
    },
    bindKeys() {
      const self = this
      Mousetrap.bind(['command+p', 'ctrl+p'], function(e) {
        self.printAnnualReport()
        return false;
      });
      Mousetrap.bind(['command+d', 'ctrl+d'], function(e) {
        self.downloadAnnualReport()
        return false;
      });
      Mousetrap.bind('left', function(e) {
        self.decrementPage()
        return false;
      });
      Mousetrap.bind('right', function(e) {
        self.incrementPage()
        return false;
      });
      Mousetrap.prototype.stopCallback = function () {
        return false;
      }
    },
    unbindKeys() {
      Mousetrap.unbind(['command+p', 'ctrl+p']);
      Mousetrap.unbind(['command+d', 'ctrl+d']);
      Mousetrap.unbind('left');
      Mousetrap.unbind('right');
    },
    decrementPage() {
      if(this.currentPage == 1) {
        this.currentPage = this.annualReportPages.length;
      } else {
        this.currentPage--;
      }
    },
    incrementPage() {
      if(this.currentPage == this.annualReportPages.length) {
        this.currentPage = 1;
      } else {
        this.currentPage++;
      }
    },
    printAnnualReport () {
      if (this.alreadyPressed) {
        return
      }
      document.body.appendChild(this.printSection)
      try {
        this.alreadyPressed = true
        window.print()
      } finally {
        this.alreadyPressed = false
        document.body.removeChild(this.printSection)
      }
    },
    printAnnualReportPage () {
      if (this.alreadyPressed) {
        return
      }
      document.body.appendChild(this.printPageSections[this.currentPage-1])
      try {
        this.alreadyPressed = true
        window.print()
      } finally {
        this.alreadyPressed = false
        document.body.removeChild(this.printPageSections[this.currentPage-1])
      }
    },
    async downloadAnnualReport () {
      if (this.alreadyPressed) {
        return
      }
      document.body.appendChild(this.downloadSection)
      try {
        this.alreadyPressed = true
        const res = await annualReportController.createAnnualReportPdf()
        if (!res.err) {
            const self = this
            saveAs('/annual-report.pdf', this.phrases.annualReportFileName + '.pdf', err => {
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
        this.alreadyPressed = false
        document.body.removeChild(this.downloadSection)
      }
    },
    async downloadAnnualReportPage () {
      if (this.alreadyPressed) {
        return
      }
      this.hideTooltip('')
      document.body.appendChild(this.downloadPageSections[this.currentPage-1])
      try {
        this.alreadyPressed = true
        const res = await annualReportController.createAnnualReportPdf()
        if (!res.err) {
            const self = this
            saveAs('/annual-report.pdf', this.phrases.annualReportPageFileName + '-' + this.currentPage + '.pdf', err => {
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
        this.alreadyPressed = false
        document.body.removeChild(this.downloadPageSections[this.currentPage-1])
      }
    },
    preparePrintSection (style, pageIndex) {
      var section = document.createElement('div')
      section.id = 'print-annual-report'
      section.innerHTML = style
      if (pageIndex != null) {
        var page = document.createElement('div')
        page.innerHTML = this.annualReportPages[pageIndex]
        section.appendChild(page)
      } else {
        this.annualReportPages.forEach((annualReportPage, index) => {
          var page = document.createElement('div')
          if(index == this.annualReportPages.length-1) {
            page.className = 'last-page'
          } 
          page.innerHTML = annualReportPage
          section.appendChild(page)
        })
      }
  
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
  bottom:50px;
  left:310px;
}

.manualPage >>> #manual-page {
	transform: scale(0.6);
	position:relative;
  bottom:220px;
  right:363px;
}

.incomePage >>> #income-page {
	transform: scale(0.6);
	position:relative;
	bottom: 200px;
	right: 366px;
}
.outcomePage >>> #outcome-page {
	transform: scale(0.6);
	position:relative;
	bottom: 205px;
	right: 366px;
}

.totalIncomePage >>> #total-income-page {
  transform: scale(0.6);
	position:relative;
	bottom: 162px;
	right: 316px;
}

.totalOutcomePage >>> #total-outcome-page {
  transform: scale(0.6);
	position:relative;
	bottom: 211px;
	right: 313px;
}

.sharesPage >>> #shares-page {
  transform: scale(0.6);
  position:relative;
  bottom: 169px;
  right: 320px;
}

.totalPage >>> #total-page {
	transform: scale(0.6);
	position:relative;
	bottom: 173px;
	right: 120px;
}

i {
  border: solid #514A4A;
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
