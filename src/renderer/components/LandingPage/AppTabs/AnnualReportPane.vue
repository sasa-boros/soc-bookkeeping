<template>
  <b-container fluid v-show="noYearsBooked">
     <br>
    <b-row class="text-center">
      <b-col>
        Дневник благајне српске православне цркве у&nbsp;&nbsp;
        <b-form-input id="churchInput" type="text" v-model="church" v-on:keypress="limitInputPerSize"/>
        &nbsp;&nbsp;
        за годину&nbsp;&nbsp;
        <b-form-select v-model="year" id="yearSelect" ref="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
      </b-col> 
    </b-row>
    <b-row>Буџетом предвиђено:</b-row>
    <br>
    <div class="predictedAllowedDivWrapper">
      <div class="predictedAllowedDiv" v-for="(ipcp, index) in annualReportData.incomePerCodePredicted" v-bind:key="'ic' + index">
        <span><label :for="'ic'+ipcp.incomeCode._id">{{ipcp.incomeCode.partition + "/" + ipcp.incomeCode.position + "   " + (ipcp.incomeCode.description ? ipcp.incomeCode.description : '')}}</label></span>
        <b-form-input :id="'ic'+ipcp.incomeCode._id" type="text" v-model="ipcp.income" v-on:keypress="limitInputPerSize" class="amountInput"/>
      </div>
    </div>
    <b-row>Буџетом одобрено:</b-row>
    <br>
    <div class="predictedAllowedDivWrapper">
      <div class="predictedAllowedDiv" v-for="(opcp, index) in annualReportData.outcomePerCodeAllowed" v-bind:key="'oc' + index">
        <span><label :for="'oc'+opcp.outcomeCode._id">{{opcp.outcomeCode.partition + "/" + opcp.outcomeCode.position + "   " + (opcp.outcomeCode.description ? opcp.outcomeCode.description : '')}}</label></span>
        <b-form-input :id="'oc'+opcp.outcomeCode._id" type="text" v-model="opcp.outcome" v-on:keypress="limitInputPerSize" class="amountInput"/>
      </div>
    </div>
    <b-row class="text-center">
      <b-col>
        Прикажи дневник благајне:
        <b-button id="annualReportBtn" ref="annualReportBtn" v-on:mouseleave="hideTooltip('annualReportBtn')" type="submit" v-on:click="createAnnualReport" variant="light" class="btn-xs">
          <img src="~@/assets/annual-report.png">
        </b-button>
      </b-col>
    </b-row>

    <!-- Annual report preview modal -->
    <div>
    <b-modal hide-footer hide-header id="annual-report-preview-modal" size="ar">
      <annual-report-preview :annualReportPages='annualReportPages' parentModal="annual-report-preview-modal"></annual-report-preview>
    </b-modal>
    </div>
    <b-tooltip target="annualReportBtn" triggers="hover" placement="top" ref="annualReportBtnTooltip" v-on:hide.prevent>
        {{phrases.showAnnualReport}}
    </b-tooltip>

    <b-modal id="annual-report-preview-failed-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('annualReportPreviewFailedModal')">
        <message-confirm-dialog ref="annualReportPreviewFailedModal" parentModal="annual-report-preview-failed-modal" type="warning" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>

    <b-modal id="annual-report-pane-error-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('annualReportPaneErrorModal')">
        <message-confirm-dialog ref="annualReportPaneErrorModal" parentModal="annual-report-pane-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import AnnualReportPreview from './AnnualReportPane/AnnualReportPreview'
  import MessageConfirmDialog from '../../MessageConfirmDialog'
  import { EventBus } from '../../../eventbus/event-bus.js';
  
  const annualReportController = require('../../../controllers/annualReportController')
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const outcomeCodeController = require('../../../controllers/outcomeCodeController')
  const i18n = require('../../../../translations/i18n')
  const { ipcRenderer } = require('electron')

  export default {
    data () {
      return {
        phrases: {
          showAnnualReport: i18n.getTranslation('Show annual report'),
          invalidPaymentSlipsOrReceiptsFound: i18n.getTranslation('Invalid payment slips or receipts found'),
          ok: i18n.getTranslation('Ok')
        },
        year: null,
        church: null,
        annualReportData: {
          incomePerCodePredicted: [],
          outcomePerCodeAllowed: [],
          transferFromPreviousYear: null,
          shareValueDepreciatedDuringYear: null,
          realEstateBuildingsValue: null,
          realEstateLandValue: null
        },
        annualReportPages: [],
        errorText: ""
      }
    },
    mounted () {
      if (this.year) {
        this.loadAnnualReport()
      }
      const self = this
      EventBus.$on('updateAnnualReportPane', () => {
        if (self.year) {
          self.loadAnnualReport()
        }
      })
    },
    computed: {
      ...mapState(
        {
          yearOptions: function (state) {
            var bookedYears = state.CommonValues.bookedYears
            if (bookedYears && bookedYears.length > 0) {
              this.year = bookedYears[0]
            }
            return bookedYears
          }
        }
      ),
      noYearsBooked: function() {
        return this.yearOptions && this.yearOptions.length > 0
      }
    },
    methods: {
      loadAnnualReport() {
        this.annualReportData = {
          incomePerCodePredicted: [],
          outcomePerCodeAllowed: [],
          transferFromPreviousYear: null,
          shareValueDepreciatedDuringYear: null,
          realEstateBuildingsValue: null,
          realEstateLandValue: null
        }
        const self = this
        annualReportController.getAnnualReportData(this.year).then(function (res) {
          if (!res.err) {
            if (res.data) {
              self.annualReportData = res.data
            } else {
              self.createAnnualReportData()
            }
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      async createAnnualReportData () {
        var incomeCodes = []
        var outcomeCodes = []
        const incomeCodesRes = await incomeCodeController.getIncomeCodes()
        if (!incomeCodesRes.err) {
          incomeCodes = incomeCodesRes.data ? incomeCodesRes.data : []
        } else {
          self.openErrorModal(incomeCodesRes.err)
        }
        const outcomeCodesRes = await outcomeCodeController.getOutcomeCodes()
        if (!outcomeCodesRes.err) {
          outcomeCodes = outcomeCodesRes.data ? outcomeCodesRes.data : []
        } else {
          self.openErrorModal(outcomeCodesRes.err)
        }
        for (let i=0; i < incomeCodes.length; i++) {
          const incomeCode = incomeCodes[i]
          this.annualReportData.incomePerCodePredicted.push({incomeCode: incomeCode, income: null})
        }
        for (let i=0; i < outcomeCodes.length; i++) {
          const outcomeCode = outcomeCodes[i]
          this.annualReportData.outcomePerCodeAllowed.push({outcomeCode: outcomeCode, outcome: null})
        }
      },
      limitInputPerSize (evt) {
        if (evt.target.scrollWidth > evt.target.clientWidth) {
          evt.preventDefault()
        } 
      },
      focusModalCloseButton (modalRef) {
        this.$refs[modalRef].$refs.closeButton.focus()
      },
      createAnnualReport: function () {
        const self = this
        annualReportController.getAnnualReport(this.year).then(function (res) {
          if (!res.err) {
             annualReportController.getAnnualReportPages(res.data).then(function (res) {
               if (!res.err) {
                 self.annualReportPages = res.data ? res.data : []
                 self.hideTooltip('annualReportBtn')
                 self.openAnnualReportPreviewModal()
               } else {
                 self.openErrorModal(res.err)
                }
             })
          } else {
            if (res.err == 'Invalid payment slips or receipts found') {
              self.openAnnualReportPreviewFailedModal(self.phrases.invalidPaymentSlipsOrReceiptsFound)
            } else {
              self.openErrorModal(res.err)
            }
          }
        })
      },
      hideTooltip (elementId) {
        if (elementId) {
          this.$root.$emit('bv::hide::tooltip', elementId)
        } else {
          this.$root.$emit('bv::hide::tooltip')
        }
      },
      openAnnualReportPreviewFailedModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'annual-report-preview-failed-modal')
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'annual-report-pane-error-modal')
      },
      openAnnualReportPreviewModal() {
        this.$root.$emit('bv::show::modal', 'annual-report-preview-modal')
      }
    },
    components: { AnnualReportPreview, MessageConfirmDialog }
  }
</script>

<style>
  .modal .modal-ar {
    max-width: 1173px;
    width: 1173px;
    max-height:844px;
    height:844px;
    overflow: hidden;
  }
</style>

<style scoped>
input {
  text-align: center;
  font-family: "Times New Roman";
  font-size: 90%;
  letter-spacing: 95%;
  height:15px;
  font-weight: bold;
  border-bottom: .5pt solid black !important;
  border-radius: 0 !important;
}
#churchInput {
  width: 230px;
  max-width: 355px;
  border-style: none;
  display:inline;
}
.predictedAllowedDivWrapper {
  display: inline;
}
.predictedAllowedDiv {
  width: 105px; 
  max-width: 105px;
  height: 150px !important; 
  min-height: 150px !important;
  text-overflow: ellipsis;
  white-space:pre-wrap; 
  word-wrap:break-word;
  hyphens:auto;
  float:left;
}
.amountInput {
  width: 105px;
  max-width: 105px;
  border-style: none;
}
#yearSelect {
  width: 95px;
  padding-left:5px;
  margin-bottom: 8px;
}
</style>