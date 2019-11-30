<template>       
  <b-container fluid id="receipt-preview-container">
    <b-form ref="form" @submit="onSubmit" novalidate no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/close.png" class="ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
        <br/>На дин. <b-form-input :disabled="defaultReceiptPreview" id="outcomeInput" ref="outcomeInput" v-on:mouseleave="disableOutcomeTooltip ? null : hideTooltip('outcomeInput')" v-model="form.outcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': shouldValidate && missingOutcome }" type="text" :autofocus="!receiptPreview"></b-form-input> и словима <b-form-input disabled class="input-small" id="outcomeAsText1" v-model="generatedOutcomeTextLine1"></b-form-input>
        <br/><b-form-input disabled class="input-small" id="outcomeAsText2" v-model="generatedOutcomeTextLine2"></b-form-input>
        <br/>динара, примљених из благајне Српске православне црквене општине <b-form-input id="churchMunicipalityInput" v-on:keypress="limitInputPerSize" v-model="form.churchMunicipality" class="input-small" type="text"></b-form-input>
        <br/>у <b-form-input id="townInput" v-on:keypress="limitInputPerSize" v-model="form.town" class="input-small" type="text"></b-form-input> на име <b-form-input id="reasonInput" :disabled="defaultReceiptPreview" v-on:keypress="limitInputPerSize" v-on:mouseleave="disableReasonTooltip ? null : hideTooltip('reasonInput')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason }" type="text"></b-form-input>
        <br/><span v-on:mouseleave="disableDateTooltip ? null : hideTooltip('dateInput')"><datepicker id="dateInput" ref="dateInput" v-model="form.date"  v-bind:class="{ 'is-invalid': shouldValidate && missingDate, 'disabledDatepicker': defaultReceiptPreview }" :language="calendarLanguages.srCYRL" :disabled="defaultReceiptPreview" input-class="receiptDatepickerInput" wrapper-class="receiptDatepickerWrapper" calendar-class="receiptDatepickerCalendar"></datepicker> год.</span>                                                                                                                 Примио,
у <b-form-input id="townPayedInput" v-on:keypress="limitInputPerSize" v-model="form.townPayed" class="input-small" type="text"></b-form-input>&nbsp;                            <b-form-input v-on:keypress="limitInputPerSize" :disabled="defaultReceiptPreview" v-model="form.received" class="input-small" id="receivedInput" type="text"></b-form-input>
        <br/>                                                                                                         Да се исплати на терет расхода <b-form-input disabled id="yearInput" ref="yearInput" class="input-small" v-model="year"></b-form-input> год.
                                                                                           <span class="partText">Парт. </span><b-form-input id="firstPartInput" :disabled="defaultReceiptPreview" type="text" v-model="form.firstPartition" v-bind:class="{ 'is-invalid': !disableFirstPartTooltip}" class="input-small" tabindex="-1"/><span v-on:mouseleave="disableFirstPartTooltip ? null : hideTooltip('firstPartPosSelect')"><b-dropdown :disabled="defaultReceiptPreview" id="firstPartPosSelect" :no-caret="true" class="ignoreInPrint" variant="link"><b-dropdown-item v-on:click="setSelectedFirstPartPos(option.value)" v-for="(option, index) in firstPartPosOptions" v-bind:key="index"><span v-html="option.html"></span></b-dropdown-item></b-dropdown></span> поз. <span v-on:mouseleave="disableFirstPosTooltip ? null : hideTooltip('firstPosInputWrapper')" id="firstPosInputWrapper"><b-form-input id="firstPosInput" v-model="form.firstPosition" v-bind:class="{ 'is-invalid': !disableFirstPosTooltip}" class="input-small" disabled/></span> дин. <span v-on:mouseleave="disableFirstOutcomeTooltip ? null : hideTooltip('firstOutcomeInputWrapper')" id="firstOutcomeInputWrapper"><b-form-input id="firstOutcomeInput" v-model="form.firstOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableFirstOutcomeTooltip }" :disabled="missingFirstPart" type="text"></b-form-input></span>
                Исплатио благајник,                                        <span class="partText">Парт. </span><b-form-input id="secondPartInput" type="text" :disabled="defaultReceiptPreview" v-model="form.secondPartition" v-bind:class="{ 'is-invalid': !disableSecondPartTooltip}" class="input-small" tabindex="-1"/><span v-on:mouseleave="disableSecondPartTooltip ? null : hideTooltip('secondPartPosSelect')"><b-dropdown :disabled="defaultReceiptPreview" id="secondPartPosSelect" :no-caret="true" class="ignoreInPrint" variant="link"><b-dropdown-item v-on:click="setSelectedSecondPartPos(option.value)" v-for="(option, index) in secondPartPosOptions" v-bind:key="index"><span v-html="option.html"></span></b-dropdown-item></b-dropdown></span> поз. <span v-on:mouseleave="disableSecondPosTooltip ? null : hideTooltip('secondPosInputWrapper')" id="secondPosInputWrapper"><b-form-input id="secondPosInput" v-model="form.secondPosition" v-bind:class="{ 'is-invalid': !disableSecondPosTooltip }" class="input-small" disabled/></span> дин. <span v-on:mouseleave="disableSecondOutcomeTooltip ? null : hideTooltip('secondOutcomeInputWrapper')" id="secondOutcomeInputWrapper"><b-form-input v-model="form.secondOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableSecondOutcomeTooltip }" id="secondOutcomeInput" :disabled="missingSecondPart" type="text"></b-form-input></span>
                                                           
      <br/><b-form-input disabled class="input-small" id="payedInput" type="text"></b-form-input>                                                                              Свега дин. <span v-on:mouseleave="disableTotalOutcomeTooltip ? null : hideTooltip('totalOutcomeInputWrapper')" id="totalOutcomeInputWrapper"><b-form-input id="totalOutcomeInput" disabled v-model="form.outcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableTotalOutcomeTooltip }" type="text"></b-form-input></span>
                                                                                                                                                
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
Књижено у Дн. бл. стр. <span v-on:mouseleave="hideTooltip('annualReportPageInputWrapper')" id="annualReportPageInputWrapper"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></span> р. бр. <span v-on:mouseleave="hideTooltip('ordinalInputWrapper')" id="ordinalInputWrapper"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></span>.                                        <b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input>
      </div>
      <div id="downloadPrintBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('receiptDownloadBtn')" ref="receiptDownloadBtn" id="receiptDownloadBtn" @click.stop="downloadReceipt()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }" :disabled="disablePrintAndDownload">
          <img src="~@/assets/download.png" class="ignoreInPrint">
        </b-button>
        &nbsp;
        <b-button v-on:mouseleave="hideTooltip('receiptPrintBtn')" ref="receiptPrintBtn" id="receiptPrintBtn" @click.stop="printReceipt()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }" :disabled="disablePrintAndDownload">
          <img src="~@/assets/print.png" class="ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('receiptSaveBtn')" ref="receiptSaveBtn" id="receiptSaveBtn" type="submit" variant="light" class="ignoreInPrint btn-lg">
          <img src="~@/assets/save.png" class="ignoreInPrint">
        </b-button>
        <b-button v-on:mouseleave="hideTooltip('receiptClearBtn')" ref="receiptClearBtn" id="receiptClearBtn" @click.stop="clearForm()" variant="light" class="ignoreInPrint btn-lg">
          <img src="~@/assets/clear.png" class="ignoreInPrint">
        </b-button>
      </div>
    </b-form>

    <b-tooltip target="outcomeInput" triggers="hover" placement="top" ref="outcomeInputTooltip" :disabled.sync="disableOutcomeTooltip" v-on:hide.prevent>
      {{phrases.enterAmount}}
    </b-tooltip>

    <b-tooltip target="reasonInput" triggers="hover" placement="top" ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip" v-on:hide.prevent>
      {{phrases.enterReason}}
    </b-tooltip>

    <b-tooltip target="firstPartPosSelect" triggers="hover" placement="top" ref="firstPartInputTooltip" :disabled.sync="disableFirstPartTooltip" v-on:hide.prevent>
      {{phrases.atLeastOnePartPosAmount}}
    </b-tooltip>

    <b-tooltip target="firstPosInputWrapper" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip" v-on:hide.prevent>
      {{firstPartTooltipText}}
    </b-tooltip>

    <b-tooltip target="firstOutcomeInputWrapper" triggers="hover" placement="top" ref="firstOutcomeInputTooltip" :disabled.sync="disableFirstOutcomeTooltip" v-on:hide.prevent>
      {{firstOutcomeTooltipText}}
    </b-tooltip>

    <b-tooltip target="secondPartPosSelect" triggers="hover" placement="top" ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip" v-on:hide.prevent>
      {{secondPartTooltipText}}
    </b-tooltip>

    <b-tooltip target="secondPosInputWrapper" triggers="hover" placement="top" ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip" v-on:hide.prevent>
        {{secondPosTooltipText}}
    </b-tooltip>

    <b-tooltip target="secondOutcomeInputWrapper" triggers="hover" placement="top" ref="secondOutcomeInputTooltip" :disabled.sync="disableSecondOutcomeTooltip" v-on:hide.prevent>
      {{secondOutcomeTooltipText}}
    </b-tooltip>

    <b-tooltip target="totalOutcomeInputWrapper" triggers="hover" placement="top" ref="totalOutcomeInputTooltip" :disabled.sync="disableTotalOutcomeTooltip" v-on:hide.prevent>
      {{totalOutcomeTooltipText}}
    </b-tooltip>

    <b-tooltip target="dateInput" triggers="hover" placement="top" ref="dateInputTooltip" :disabled.sync="disableDateTooltip" v-on:hide.prevent>
      {{phrases.pickDate}}
    </b-tooltip>

    <b-tooltip target="annualReportPageInputWrapper" triggers="hover" placement="top" ref="annualReportPageInputTooltip" :disabled.sync="defaultReceiptPreview" v-on:hide.prevent>
      {{phrases.automaticallyGeneratedAfterSave}}
    </b-tooltip>

    <b-tooltip target="ordinalInputWrapper" triggers="hover" placement="top" ref="ordinalInputTooltip" :disabled.sync="defaultReceiptPreview" v-on:hide.prevent>
      {{phrases.automaticallyGeneratedAfterSave}}
    </b-tooltip>

    <b-tooltip target="receiptDownloadBtn" triggers="hover" placement="top" ref="receiptDownloadBtnTooltip" v-on:hide.prevent>
      {{phrases.download}}
    </b-tooltip>

    <b-tooltip target="receiptPrintBtn" triggers="hover" placement="top" ref="receiptPrintBtnTooltip" v-on:hide.prevent>
      {{phrases.print}}
    </b-tooltip>

    <b-tooltip target="receiptSaveBtn" triggers="hover" placement="top" ref="receiptSaveBtnTooltip" v-on:hide.prevent>
      {{phrases.save}}
    </b-tooltip>

    <b-tooltip target="receiptClearBtn" triggers="hover" placement="top" ref="receiptClearBtnTooltip" v-on:hide.prevent>
      {{phrases.clear}}
    </b-tooltip>

    <b-modal id="receipt-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('receiptPreviewErrorModal')">
        <message-confirm-dialog ref="receiptPreviewErrorModal" parentModal="receipt-preview-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  import MessageConfirmDialog from '../../../MessageConfirmDialog'
  
  const annualReportController = require('../../../../controllers/annualReportController')
  const outcomeCodeController = require('../../../../controllers/outcomeCodeController')
  const receiptController = require('../../../../controllers/receiptController')
  const defaultReceiptController = require('../../../../controllers/defaultReceiptController')
  const { numberToSerbianDinars, getCodeCombinations, mapReceiptToReceiptForm, mapReceiptFormToReceipt, saveAs, asFloat, amountNumberOptions } = require('../../../../utils/utils')
  const i18n = require('../../../../../translations/i18n')
  const AutoNumeric = require('autonumeric')
  const Mousetrap = require('mousetrap')
  const Big = require('big.js')

  export default {
    store: store,
    props: {
      receipt: {
        type: Object,
        default: null
      },
      receiptPreview: {
        type: Boolean,
        default: false
      },
      defaultReceiptPreview: {
        type: Boolean,
        default: false
      },
      parentModal: {
        type: String,
        default: null
      }
    },
    data () {
      return {
        form: null,
        shouldValidate: false,
        preDatepickerJustBlurred: false,
        postDatepickerJustBlurred: false,
        outcomeCodes: null,
        errorText: "",
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          enterAmount: i18n.getTranslation('Enter amount'),
          enterReason: i18n.getTranslation('Enter reason'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosAmount: i18n.getTranslation('Enter at least one partition, position, amount'),
          needsToBeEqualToSum: i18n.getTranslation('Needs to equal to sum of amount by partitions and position'),
          ok: i18n.getTranslation('Ok'),
          download: i18n.getTranslation('Download'),
          permissionDenied: i18n.getTranslation('Permission denied.'),
          receiptFileName: i18n.getTranslation('receipt'),
          automaticallyGeneratedAfterSave: i18n.getTranslation('Automatically generated after save')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        },
        outcomeInputAutonumeric: null,
        firstOutcomeInputAutonumeric: null,
        secondOutcomeInputAutonumeric: null,
        totalOutcomeInputAutonumeric: null,
        alreadyPressed: false,
        disablePrintAndDownload: true,
        tooltipTimeouts: []
      }
    },
    created () {
      if(this.receiptPreview) {
        var receipt = JSON.parse(JSON.stringify(this.receipt));
        this.form = mapReceiptToReceiptForm(receipt);
        if (!this.form.isValid) {
          this.shouldValidate = true;
        } else {
          this.disablePrintAndDownload = false
        }
      } else {
        var defaultReceipt = JSON.parse(JSON.stringify(this.defaultReceipt))
        defaultReceipt._id = undefined;
        this.form = mapReceiptToReceiptForm(defaultReceipt);
        this.loadAnnualReportCommon()
      } 
      const self = this;
      outcomeCodeController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodes = res.data ? res.data : []
        } else {
          self.openErrorModal(res.err)
        }
      })
      const unwatch = this.$watch('form', () => {
        self.disablePrintAndDownload = true
        unwatch()
      }, {deep: true})
    },
    mounted () {
      this.outcomeInputAutonumeric = new AutoNumeric('#outcomeInput', amountNumberOptions)
      this.firstOutcomeInputAutonumeric = new AutoNumeric('#firstOutcomeInput', amountNumberOptions)
      this.secondOutcomeInputAutonumeric = new AutoNumeric('#secondOutcomeInput', amountNumberOptions)
      this.totalOutcomeInputAutonumeric = new AutoNumeric('#totalOutcomeInput', amountNumberOptions)
      this.bindKeys()
    },
    beforeDestroy () {
      this.unbindKeys()
    },
    computed: {
      ...mapState(
        {
          defaultReceipt: state => state.CommonValues.defaultReceipt
        }
      ),
      generatedOutcomeText: {
        get: function () {
          var placeholder = ''
          if (this.form) {
            var generatedText = numberToSerbianDinars(asFloat(this.form.outcome, amountNumberOptions))
            if (!generatedText) {
              return placeholder
            } else {
              this.form.outcomeAsText = generatedText
              return generatedText
            }
          } else {
            return placeholder
          }
        },
        set: function (newValue) {
        }
      },
      generatedOutcomeTextLine1: {
        get: function () {
          if (this.generatedOutcomeText.length <= 52) {
            return this.generatedOutcomeText
          }
          const firstSubstring = this.generatedOutcomeText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedOutcomeText.substring(0, spaceInd)
          } else {
            return this.generatedOutcomeText.substring(0, 52)
          }
        },
        set: function (newValue) {
        }
      },
      generatedOutcomeTextLine2: {
        get: function () {
          if (this.generatedOutcomeText.length <= 52) {
            return ''
          }
          const firstSubstring = this.generatedOutcomeText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedOutcomeText.substring(spaceInd)
          } else {
            return this.generatedOutcomeText.substring(52)
          }
        },
        set: function (newValue) {
        }
      },
      year: {
        get: function () {
          if (this.form.date) {
            return new Date(this.form.date).getUTCFullYear()
          } 
          return null
        },
        set: function (newValue) {
        }
      },
      firstPartTooltipText: function () {
        return this.phrases.atLeastOnePartPosAmount
      },
      firstPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosAmount
      },
      firstOutcomeTooltipText: function () {
        if(!this.missingFirstPart) {
          return this.phrases.enterAmount
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      secondPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosAmount
      },
      secondPartTooltipText: function () {
        return this.phrases.atLeastOnePartPosAmount
      },
      secondOutcomeTooltipText: function () {
        if(!this.missingSecondPart) {
          return this.phrases.enterAmount
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      totalOutcomeTooltipText: function () {
        if (this.totalOutcomeNotValid) {
          return this.phrases.needsToBeEqualToSum
        } else {
          return this.phrases.enterValue
        }
      },
      disableOutcomeTooltip: {
        get: function () {
          return !this.missingOutcome || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('outcomeInput')
          }
        }
      },
      disableReasonTooltip: {
        get: function () {
          return !this.missingReason || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('reasonInput')
          }
        }
      },
      disableFirstPartTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.missingFirstPart || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('firstPartPosSelect')
          }
        }
      },
      disableFirstPosTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.missingFirstPos || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('firstPosInputWrapper')
          }
        }
      },
      disableFirstOutcomeTooltip: {
        get: function () {
          if (this.atLeastOnePartPosNotSet && this.shouldValidate) {
            return false
          }
          if (!this.missingFirstPart && this.missingFirstOutcome && this.shouldValidate) {
            return false
          }
          return true
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('firstOutcomeInputWrapper')
          }
        }
      },
      disableSecondPartTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.missingSecondPart || !this.shouldValidate 
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('secondPartPosSelect')
          }
        }
      },
      disableSecondPosTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.missingSecondPos || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('secondPosInputWrapper')
          }
        }
      },
      disableSecondOutcomeTooltip: {
        get: function () {
          if (this.atLeastOnePartPosNotSet && this.shouldValidate) {
            return false
          }
          if (!this.missingSecondPart && this.missingSecondOutcome && this.shouldValidate) {
            return false
          }
          return true
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('secondOutcomeInputWrapper')
          }
        }
      },
      disableTotalOutcomeTooltip: {
        get: function () {
          return !this.totalOutcomeNotValid || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('totalOutcomeInputWrapper')
          }
        }
      },
      disableDateTooltip: {
        get: function () {
          return !this.missingDate || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.hideTooltip('dateInput')
          }
        }
      },
      firstPartPosOptions: function() {
        var options = this.getInitialPartPosOptions()
        if(this.form.secondPartition) {
          for (let i=0; i<options.length; i++) {
            if (options[i].value == (this.form.secondPartition + '/' + this.form.secondPosition)) {
              options.splice(i, 1)
              break
            }
          }
        }
        return options
      },
      secondPartPosOptions: function() {
        var options = this.getInitialPartPosOptions()
        if(this.form.firstPartition) {
          for (let i=0; i<options.length; i++) {
            if (options[i].value == (this.form.firstPartition + '/' + this.form.firstPosition)) {
              options.splice(i, 1)
              break
            }
          }
        }
        return options
      },
      missingReason: function () {
        return !this.form.reason || this.form.reason.toString().trim() === ''
      },
      missingOutcome: function () {
        return !this.form.outcome || this.form.outcome.trim() === ''
      },
      missingFirstPart: function () {
        return !this.form.firstPartition || this.form.firstPartition.toString().trim() === ''
      },
      missingFirstPos: function () {
          return !this.form.firstPosition
      },
      missingFirstOutcome: function () {
        return !this.form.firstOutcome || this.form.firstOutcome.trim() === ''
      },
      missingSecondPart: function () {
        return !this.form.secondPartition || this.form.secondPartition.toString().trim() === ''
      },
      missingSecondPos: function () {
          return !this.form.secondPosition
      },
      missingSecondOutcome: function () {
        return !this.form.secondOutcome || this.form.secondOutcome.trim() === ''
      },
      missingTotalOutcome: function () {
        return !this.form.outcome || this.form.outcome.trim() === ''
      },
      totalOutcomeNotValid: function () {
        if (this.form.outcome) {
          const totalOutcome = Big(asFloat(this.form.outcome, amountNumberOptions))
          const firstOutcome = this.missingFirstOutcome ? Big(0.0) : Big(asFloat(this.form.firstOutcome, amountNumberOptions))
          const secondOutcome = this.missingSecondOutcome ? Big(0.0) : Big(asFloat(this.form.secondOutcome, amountNumberOptions))
          if (!firstOutcome.plus(secondOutcome).eq(totalOutcome)) {
            return true
          }
        }
        return false
      },
      missingDate: function () {
        return !this.form.date
      },
      atLeastOnePartPosNotSet: function () {
        const firstCombinationNotSet = this.missingFirstPart || this.missingFirstPos || this.missingFirstOutcome
        const secondCombinationNotSet = this.missingSecondPart || this.missingSecondPos || this.missingSecondOutcome
        return firstCombinationNotSet && secondCombinationNotSet
      },
      validForm: function () {
        if (this.missingOutcome ||
            this.missingReason ||
            this.missingDate ||
            this.atLeastOnePartPosNotSet ||
            (!this.missingFirstPart && this.missingFirstOutcome) ||
            (!this.missingSecondPart && this.missingSecondOutcome) ||
            this.totalOutcomeNotValid) {
          return false
        }
        return true
      }
    },
    methods: {
      loadAnnualReportCommon () {
        const self = this
        annualReportController.getAnnualReportCommonData().then((res) => {
          if (!res.err) {
            self.form.churchMunicipality = res.data ? res.data.churchMunicipality : null
            self.form.town = res.data ? res.data.churchTown : null
            self.form.townPayed = self.form.town
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      focusModalCloseButton (modalRef) {
        this.$refs[modalRef].$refs.closeButton.focus()
      },
      bindKeys() {
        const self = this
        if (!this.defaultReceiptPreview) {
          Mousetrap.bind(['command+p', 'ctrl+p'], function(e) {
             if (!self.disablePrintAndDownload) {
               self.printReceipt()
             }
            return false
          })
          Mousetrap.bind(['command+d', 'ctrl+d'], function(e) {
            if (!self.disablePrintAndDownload) {
              self.downloadReceipt()
            }
            return false
          })
        }
        Mousetrap.bind(['command+e', 'ctrl+e'], function(e) {
          self.clearForm()
          return false
        })
        Mousetrap.bind(['command+s', 'ctrl+s'], function(e) {
          self.$refs.receiptSaveBtn.click()
          return false
        })
        Mousetrap.prototype.stopCallback = function () {
          return false;
        }
      },
      unbindKeys() {
        if (!this.defaultReceiptPreview) {
          Mousetrap.unbind(['command+p', 'ctrl+p'])
          Mousetrap.unbind(['command+d', 'ctrl+d'])
        }
        Mousetrap.unbind(['command+e', 'ctrl+e'])
        Mousetrap.unbind(['command+s', 'ctrl+s'])
      },
      getInitialPartPosOptions() {
        if (!this.outcomeCodes) {
          return []
        }
        var options = []
        options.push({html: '&nbsp', value: null})
        this.outcomeCodes.forEach(ic => {
          let padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          let paddingCount = ic.partition.toString().length + ic.position.toString().length
          if (paddingCount == 3) {
            padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          } else if(paddingCount == 4) {
            padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          }
          options.push({html: ic.partition + '/' + ic.position + (ic.description ? padding + ic.description : ''), value: ic.partition + '/' + ic.position})
        })
        return options
      },
      setSelectedFirstPartPos (selectedPartPos) {
        if (selectedPartPos) {
          const partPos = selectedPartPos.split('/')
          this.form.firstPartition = partPos[0]
          this.form.firstPosition = partPos[1]
        } else {
          this.form.firstPartition = null
          this.form.firstPosition = null
          this.form.firstOutcome = null
          if (this.firstOutcomeInputAutonumeric) {
            this.firstOutcomeInputAutonumeric.clear()
          }
        }
      },
      setSelectedSecondPartPos (selectedPartPos) {
        if (selectedPartPos) {
          const partPos = selectedPartPos.split('/')
          this.form.secondPartition = partPos[0]
          this.form.secondPosition = partPos[1]
        } else {
          this.form.secondPartition = null
          this.form.secondPosition = null
          this.form.secondOutcome = null
          if (this.secondOutcomeInputAutonumeric) {
            this.secondOutcomeInputAutonumeric.clear()
          }
        }
      },
      limitInputPerSize(evt) {
        if (evt.target.scrollWidth > evt.target.clientWidth) {
          evt.preventDefault()
        } 
      },
      showInvalidTooltips () {
        if (this.missingOutcome) {
          this.showTooltip('outcomeInput')
        } else if (this.missingReason) {
          this.showTooltip('reasonInput')
        } else if (this.missingDate) {
          this.showTooltip('dateInput')
        } else if (this.atLeastOnePartPosNotSet) {
          this.showTooltip('firstPartPosSelect')
        } else if (!this.missingFirstPart && this.missingFirstOutcome) {
          this.showTooltip('firstOutcomeInputWrapper')
        } else if (!this.missingSecondPart && this.missingSecondOutcome) {
          this.showTooltip('secondOutcomeInputWrapper')
        } else if (this.totalOutcomeNotValid) {
          this.showTooltip('totalOutcomeInputWrapper')
        }
      },
      showTooltip (elementId) {
        this.$root.$emit('bv::show::tooltip', elementId)
        clearTimeout(this.tooltipTimeouts[elementId])
        const self = this
        this.tooltipTimeouts[elementId] = setTimeout(() => {
          self.$root.$emit('bv::hide::tooltip', elementId)
        }, 2500)
      },
      hideTooltip (elementId) {
        this.$root.$emit('bv::hide::tooltip', elementId)
      },
      onSubmit (evt) {
        evt.preventDefault()
        if(this.alreadyPressed) {
          return
        }
        const self = this;
        if (this.defaultReceiptPreview) {
          this.alreadyPressed = true
          defaultReceiptController.createDefaultReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then(function (res) {
            if (!res.err) {
              self.$emit('updateDefaultReceipt')
              self.closeModal();
            } else {
              self.alreadyPressed = false
              self.openErrorModal(res.err)
            }
          })
        } else {
          this.shouldValidate = true;
          if (!this.validForm) {
            this.showInvalidTooltips()
            return
          }
          if (this.receiptPreview) {
            this.alreadyPressed = true
            receiptController.updateReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes, true)).then((res) => {
              if (!res.err) {
                self.$emit('updateReceiptTable')
                self.closeModal();
              } else {
                self.alreadyPressed = false
                self.openErrorModal(res.err)
              }
            })
          } else {
            this.alreadyPressed = true
            receiptController.createReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes, true)).then((res) => {
              if (!res.err) {
                self.$emit('updateReceiptTable')
                self.closeModal();
              } else {
                self.alreadyPressed = false
                self.openErrorModal(res.err)
              }
            })
          }
        }
      },
      clearForm () {
        this.form.ordinal = null
        this.form.annualReportPage = null
        this.form.date = null
        this.form.firstPartition = null
        this.form.firstPosition = null
        this.form.firstOutcome = null
        this.firstOutcomeInputAutonumeric.clear()
        this.form.secondPartition = null
        this.form.secondPosition = null
        this.form.secondOutcome = null
        this.secondOutcomeInputAutonumeric.clear()
        this.form.outcome = null
        this.outcomeInputAutonumeric.clear()
        this.form.outcomeAsText = null
        this.form.churchMunicipality = null
        this.form.town = null
        this.form.reason = null
        this.form.townPayed = null
        this.form.received = null
        this.totalOutcomeInputAutonumeric.clear()
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'receipt-preview-error-modal')
      },
      printReceipt () {
        if (this.alreadyPressed) {
          return
        }
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          this.alreadyPressed = true
          window.print()
        } finally {
          this.alreadyPressed = false
          document.body.removeChild(section)
        }
      },
      async downloadReceipt () {
        if (this.alreadyPressed) {
          return
        }
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          this.alreadyPressed = true
          const res = await receiptController.createReceiptPdf()
          if (!res.err) {
            const self = this
            saveAs('/receipt.pdf', this.phrases.receiptFileName + '.pdf', err => {
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
        }
        finally {
          this.alreadyPressed = false
          document.body.removeChild(section)
        }
      },
      preparePrintSection () {
        const modal = document.getElementById('receipt-preview-container')
        const cloned = modal.cloneNode(true)
        var section = document.createElement('div')
        section.id = 'print-receipt'
        section.innerHTML = ''
        section.appendChild(cloned)

        return section
      },
      closeModal () {
          this.$root.$emit('bv::hide::modal', this.parentModal)
      }
    },
    components: { Datepicker, MessageConfirmDialog }
  }
</script>

<style scoped>
  input {
    text-align: center;
    /* Immitate the underline in the real receipt */
    border-bottom: .5pt solid black !important;
    border-radius: 0 !important;
    font-family: "Times New Roman";
    font-size: 90%;
    letter-spacing: 95%;
  }
  select {
    text-align-last:left;
    font-family: "Times New Roman";
    font-size: 90%;
    letter-spacing: 95%;
    -webkit-appearance: none;
    -webkit-border-radius: 0px;
  }
  #receipt-preview-container {
    width: 794px;
    height: 559px;
    position:relative;
  }
  .receipt-preview-text {
    white-space: pre;
    width: 670px;
    height: 520px;
    /*border-style: solid;
    border-color: blue;*/
    color: #16264C;
    line-height: 2;
    margin: 0;
    position: relative;
    left: 49px;
    top: 20px;
  }
  h1 {
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    margin: 0px;
    padding: 0px;
    font-family: "Times New Roman";
    letter-spacing: 95%;
  }
  .input-small {
    border-style: none;
    font-weight: bold;
    display: inline;
    height: 15px;
    margin: 0px;
    color: black;
  }
  .select-small {
    border-style: none;
    font-weight: bold;
    display: inline;
    margin: 0px;
    padding: 0px;
    height: 15px;
    max-height: 15px;
    color: black;
  }
  #yearInput {
    width: 70px;
  }
  #outcomeInput {
    width: 140px;
  }
  #outcomeAsTextInput {
    width: 411px;
  }
  #outcomeAsTextInputPt2 {
    width: 255px;
  }
  #churchMunicipalityInput {
    width: 235px;
  }
  #townInput {
    width: 320px;
  }
  #reasonInput {
    width: 290px;
  }
  #receivedInput {
    width: 235px;
  }
  #townPayedInput {
    width: 320px;
  }
  #payedInput {
    width: 230px;
  }
  #firstPartPosSelect {
    width: 50px;
  }
  #secondPartPosSelect {
    width: 50px;
  }
  .partText {
    position: relative;
    left: 50px;
  }
  #firstPartInput {
    width: 50px;
    position:relative;
    left:50px;
    pointer-events: none;
    z-index: 1;
  }
  #firstPosInput {
    width: 50px;
  }
  #secondPartInput {
    width: 50px;
    position:relative;
    left:50px;
    pointer-events: none;
    z-index: 1;
  }
  #secondPosInput {
    width: 50px;
  }
  #firstOutcomeInput {
    width: 90px;
  }
  #secondOutcomeInput {
    width: 90px;
  }
  #totalOutcomeInput {
    width: 90px;
  }
  #annualReportPageInput {
    width: 50px;
  }
  #ordinalInput {
    width: 50px;
  }
  #municipalityPresidentInput {
    width: 235px;
  }
  #modalCancelBtn {
    position: absolute;
    right: 3%;
    top:4%;
  }
  #clearSaveBtnsDiv {
    position: absolute;
    bottom: 0%;
    right: 7.5%;
  }
  #downloadPrintBtnsDiv {
    position: absolute;
    bottom: 0%;
    left: 7.5%;
  }
  .displayNone {
    display:none;
  }
  .outcomeAsTextDivWrapper {
    display: inline;
    font-weight: bold;
    color: black;
    white-space: nowrap;
    border-bottom: solid;
    border-width: 1px;
    display: inline-block;
    margin: 0;
  }
  #outcomeAsText1 {
    width: 410px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  }
  #outcomeAsText2 {
    width: 670px;
    white-space: nowrap;
    overflow: hidden;
  }
</style>

<style>
  .receiptDatepickerInput {
    display: inline;
    border-style: none;
    border-bottom: .5pt solid black;
    text-align: center;

    white-space: nowrap;
    width: 94px;
    max-height: 15px;
    padding: 0px;
    margin: 0px;
    font-weight: bold;
    color: black;
  }
  .disabledDatepicker .receiptDatepickerInput {
    background-color: rgb(235, 236, 238);
  }
  .is-invalid .receiptDatepickerInput {    
    background-image: url('~@/assets/invalid-red.png');
    background-repeat: no-repeat;
    background-position: center right calc(2.25rem / 4);
    background-size: calc(2.25rem / 2) calc(2.25rem / 2);
  }
  .receiptDatepickerWrapper {
    display: inline;
    white-space: normal;
    height: 15px;
    margin: 0px;
    padding: 0px;
    width: 95px;
  }
  .receiptDatepickerWrapper > div:first-child {
    display: inline;
    width: 95px;
    margin: 0px;
    padding: 0px;
  }
  .receiptDatepickerCalendar {
    font-size: 120%;
    white-space: normal;
    z-index: 100;
    -webkit-transform: scale(0.7, 0.7) translate(-70px, -70px); /* Safari and Chrome */
  }

   .receiptDatepickerCalendar div span:hover  {
    border: rgb(208, 226, 247) !important;
    background-color:  rgb(208, 226, 247) !important;
  }
  .receiptDatepickerCalendar div span.selected  {
    border: rgb(208, 226, 247) !important;
    background-color:  rgb(208, 226, 247) !important;
  }

  @media screen {
    #print-receipt {
      display: none;
    }
  }
  @media print {
    #print-receipt, #print-receipt * {
      visibility:visible;
    }
    #print-receipt {
      position: absolute;
      top:0px;
      left:0px;
    }
    #receipt-preview-container {
      top:150px;
      left:210px;
      transform: scale(1.5);
    }
    .ignoreInPrint {
      visibility:hidden !important;
    }
    input {
      padding:0px !important;
    }
  }
</style>
