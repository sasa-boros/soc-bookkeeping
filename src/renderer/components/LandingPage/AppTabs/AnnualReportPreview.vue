<template>
  <b-container fluid>
    <b-row class="text-center">
      <b-col>
        <b-button ref="annualReportPrintBtn" @click.stop="printAnnualReport()" variant="secondary" class="ignoreInPrint">
          <img src="~@/assets/print.png" class="btn-img ignoreInPrint">
        </b-button>
      </b-col>
      <b-col cols="8">
        <b-button v-on:click='decrementPage' class="ignoreInPrint">
          <i class="arrow left"></i>
        </b-button>
        <b-button v-on:click='incrementPage' class="ignoreInPrint">
          <i class="arrow right"></i>
        </b-button>
      </b-col>
      <b-col>
        <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint" id="modalCancelBtn">
          <img src="~@/assets/delete.png" class="btn-img ignoreInPrint">
        </b-button>
      </b-col>
    </b-row>
    <b-row>
      <div v-html="annualReportPages[currentPage-1]" id="page-display" class="ignoreInPrint">
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
  mounted () {
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
      var section = document.getElementById('print');

      if (!section) {
        section = document.createElement('div');
        section.id = 'print';
        document.body.appendChild(section);
      }
      section.innerHTML = '';
      this.annualReportPages.forEach(page => {
        var pageSection = document.createElement('div');
        section.appendChild(pageSection);
        pageSection.innerHTML = page;
      })
      window.print();
      document.body.removeChild(section);
    },
    closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
    }
  }
}
</script>

<style scoped>

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
    #print {
      display: none;
    }
  }
  @media print {
    * {
      visibility:hidden;
    }
    #print, #print * {
      visibility:visible;
    }
    #print {
      /*s
      position:absolute;
      left:0;
      top:0;
      */
    }
    .ignoreInPrint {
      visibility:hidden !important;
    }
  }
</style>