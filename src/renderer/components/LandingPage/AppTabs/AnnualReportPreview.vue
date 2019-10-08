<template>
  <b-container fluid id="annual-report-preview">
      <b-row class="text-center">
        <b-col>
          <b-button ref="annualReportPrintBtn" @click.stop="printAnnualReport()" variant="secondary">
            <img src="~@/assets/print.png" class="btn-lg">
          </b-button>
        </b-col>
        <b-col cols="8">
          <b-button v-on:click='decrementPage'>
            <i class="arrow left"></i>
          </b-button>
          <b-button v-on:click='incrementPage'>
            <i class="arrow right"></i>
          </b-button>
        </b-col>
        <b-col>
          <b-button @click.stop="closeModal()" variant="link" id="modalCancelBtn">
            <img src="~@/assets/delete.png" class="btn-lg">
          </b-button>
        </b-col>
      </b-row>
      <b-row>
        <div v-html="annualReportPages[currentPage-1]" id="page-display" v-bind:class="{ headline: isHeadline, incomePage: isIncomePage, outcomePage: isOutcomePage, sharesPage: isSharesPage, totalIncomePage: isTotalIncomePage, totalOutcomePage: isTotalOutcomePage, totalPage: isTotalPage }">
        </div>
      </b-row>
      <b-tooltip ref="annualReportPrintBtnTooltip" :target="() => $refs.annualReportPrintBtn">
          <div class="tooltipInnerText">
            {{phrases.print}}
          </div>
      </b-tooltip>
  </b-container>
</template>

<script>

const i18n = require('../../../translations/i18n');

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
        print: i18n.getTranslation('Print')
      },
      currentPage: 1
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
      var section = document.createElement('div')
      section.id = 'print-annual-report'
      document.body.appendChild(section)
      try {
        section.innerHTML = ''
        this.annualReportPages.forEach((annualReportPage, index) => {
          var page = document.createElement('div')
          if(index == 28) {
            page.className = 'last-page'
          }
          page.innerHTML = annualReportPage
          section.appendChild(page)
        })
        window.print()
      } finally {
        document.body.removeChild(section)
      }
    },
    closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
    }
  }
}
</script>

<style scoped>

.headline >>> #headline {
	transform: scale(0.4);
	position:relative;
	bottom: 240px;
	right: 50px;
}

.incomePage >>> #income-page {
	transform: scale(0.4);
	position:relative;
	bottom: 300px;
	right: 450px;
}
.outcomePage >>> #outcome-page {
	transform: scale(0.4);
	position:relative;
	bottom: 305px;
	right: 450px;
}

.totalIncomePage >>> #total-income-page {
  transform: scale(0.4);
	position:relative;
	bottom: 250px;
	right: 485px;
}

.totalOutcomePage >>> #total-outcome-page {
  transform: scale(0.4);
	position:relative;
	bottom: 298px;
	right: 485px;
}

.sharesPage >>> #shares-page {
  transform: scale(0.4);
  position:relative;
  bottom: 270px;
  right: 520px;
}

.totalPage >>> #total-page {
	transform: scale(0.4);
	position:relative;
	bottom: 270px;
	right: 275px;
}

i {
  border: solid white;
  border-width: 0 3px 3px 0;
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
      bottom: 1300px;
      left: 250px;
      transform: rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
      page-break-after: always;
    }
    #income-page {
      page-break-before: always;
      position: relative;
      bottom:930px;
      left: 100px;
      transform: scale(0.85) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #outcome-page {
      page-break-before: always;
      position: relative;
      bottom:930px;
      left: 100px;
      transform: scale(0.85) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-income-page {
      page-break-before: always;
      position: relative;
      bottom: 900px;
      left: 50px;
      transform: scale(0.85) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #total-outcome-page {
      page-break-before: always;
      position: relative;
      bottom: 900px;
      left: 50px;
      transform: scale(0.85) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    #shares-page {
      page-break-before: always;
      position: relative;
      bottom: 870px;
      left: 70px;
      transform: scale(0.8) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
    .last-page {
      position:relative; 
      top:450px;
    }
    #total-page {
      page-break-before: always;
      position: absolute;
      bottom: 0;
      left: 70px;
      transform: scale(0.9) rotate(270deg) translate(-276mm, 0);
      transform-origin: 0 0;
    }
  }
</style>
