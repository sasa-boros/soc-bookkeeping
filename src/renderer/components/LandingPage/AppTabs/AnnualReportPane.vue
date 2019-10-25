<template>
  <b-container fluid>
     <br>
    <b-row class="text-center" v-show="atLeastOnePaymentSlipOrReceipt">
      <b-col>
        {{phrases.showAnnualReport}}:
        &nbsp;&nbsp;
        <b-button id="annualReportBtn" ref="annualReportBtn" v-on:mouseleave="hideTooltip('annualReportBtn')" type="submit" v-on:click="createAnnualReport" variant="light" class="btn-xs">
          <img src="~@/assets/annual-report.png">
        </b-button>
        &nbsp;&nbsp;
        {{phrases.forYear}}:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <b-form-select v-model="year" id="yearSelect" ref="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
        </b-col>
    </b-row>
    <p v-show="!atLeastOnePaymentSlipOrReceipt" style="text-align:center">{{phrases.inputAtleastOne}}</p>

    <!-- Annual report preview modal -->
    <div>
    <b-modal hide-footer hide-header id="annual-report-preview-modal" size="ar">
      <annual-report-preview :annualReportPages='annualReportPages' parentModal="annual-report-preview-modal"></annual-report-preview>
    </b-modal>
    </div>
    <b-tooltip target="annualReportBtn" triggers="hover" placement="top" ref="annualReportBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.showAnnualReport}}
      </div>
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
  
  const annualReportController = require('../../../controllers/annualReportController')
  const i18n = require('../../../../translations/i18n')
  const { ipcRenderer } = require('electron')

  export default {
    data () {
      return {
        year: '',
        phrases: {
          showAnnualReport: i18n.getTranslation('Show annual report'),
          forYear: i18n.getTranslation('for year'),
          invalidPaymentSlipsOrReceiptsFound: i18n.getTranslation('Invalid payment slips or receipts found'),
          inputAtleastOne: i18n.getTranslation('To generate annual report input at least one payment slip or receipt'),
          ok: i18n.getTranslation('Ok')
        },
        annualReportPages: [],
        errorText: ""
      }
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
      atLeastOnePaymentSlipOrReceipt: function() {
        return this.yearOptions && this.yearOptions.length > 0
      }
    },
    methods: {
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
    max-width: 1000px;
    width: 1000px;
    max-height:707px;
    height: 707px;
    overflow: hidden;
  }
</style>

<style scoped>

#yearSelect {
  width: 95px;
  padding-left:5px;
  margin-bottom: 8px;
}
</style>