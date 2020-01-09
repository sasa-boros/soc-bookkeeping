<template>       
  <b-container fluid id="receipt-preview-container" v-on:keyup.tab.exact="tabPressedHandler" v-on:keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form ref="form" @submit="onSubmit" novalidate no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/close.png" class="ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
        <br/>На дин. <b-form-input disabled id="outcomeInput" ref="outcomeInput" v-model="form.outcome" class="input-small numberInput" type="text"></b-form-input> и словима <b-form-input disabled class="input-small" id="outcomeAsText1" v-model="generatedOutcomeTextLine1"></b-form-input>
        <br/><b-form-input disabled class="input-small" id="outcomeAsText2" v-model="generatedOutcomeTextLine2"></b-form-input>
        <br/>динара, примљених из благајне Српске православне црквене општине <b-form-input id="churchMunicipalityInput" v-on:keypress="limitInputPerSize" v-model="form.churchMunicipality" class="input-small" type="text"></b-form-input>
        <br/>у <b-form-input id="townInput" v-on:keypress="limitInputPerSize" v-model="form.town" class="input-small" type="text"></b-form-input> на име <b-form-input id="reasonInput" :autofocus="!receiptPreview" :disabled="defaultReceiptPreview" v-on:keypress="limitInputPerSize" v-on:mouseleave="disableReasonTooltip ? null : hideTooltip('reasonInput')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason }" type="text" v-on:blur.native="preDatepickerOnBlur"></b-form-input>
        <br/><span v-on:mouseleave="disableDateTooltip ? null : hideTooltip('dateInput')"><datepicker id="dateInput" ref="dateInput" v-model="form.date" :input-class="{ 'is-invalid-date': shouldValidate && missingDate, 'disabledDatepicker': defaultReceiptPreview, 'receiptDatepickerInput': true }" :language="calendarLanguages.srCYRL" :disabled="defaultReceiptPreview" wrapper-class="receiptDatepickerWrapper" calendar-class="receiptDatepickerCalendar"></datepicker> год.</span>                                                                                                                 Примио,
у <b-form-input id="townPayedInput" v-on:keypress="limitInputPerSize" v-model="form.townPayed" class="input-small" type="text" v-on:blur.native="postDatepickerOnBlur"></b-form-input>&nbsp;                            <b-form-input v-on:keypress="limitInputPerSize" :disabled="defaultReceiptPreview" v-model="form.received" class="input-small" id="receivedInput" type="text"></b-form-input>
        <br/>                                                                                                         Да се исплати на терет расхода <b-form-input disabled id="yearInput" ref="yearInput" class="input-small" v-model="year"></b-form-input> год.
                                                                                           <span class="partText">Парт. </span><b-form-input id="firstPartInput" :disabled="defaultReceiptPreview" type="text" v-model="formatedFirstPart" v-bind:class="{ 'is-invalid': !disableFirstPartTooltip}" class="input-small" tabindex="-1"/><span v-on:mouseleave="disableFirstPartTooltip ? null : hideTooltip('firstPartPosSelect')"><b-dropdown :disabled="defaultReceiptPreview" id="firstPartPosSelect" :no-caret="true" class="ignoreInPrint" variant="link"><b-dropdown-item class="partPosOption" v-on:click="setSelectedFirstPartPos(option.value)" v-for="(option, index) in firstPartPosOptions" v-bind:key="index"><span v-html="option.html"></span></b-dropdown-item></b-dropdown></span> поз. <span v-on:mouseleave="disableFirstPosTooltip ? null : hideTooltip('firstPosInputWrapper')" id="firstPosInputWrapper"><b-form-input id="firstPosInput" v-model="form.firstPosition" v-bind:class="{ 'is-invalid': !disableFirstPosTooltip}" class="input-small" disabled/></span> дин. <span v-on:mouseleave="disableFirstOutcomeTooltip ? null : hideTooltip('firstOutcomeInputWrapper')" id="firstOutcomeInputWrapper"><b-form-input id="firstOutcomeInput" v-model="form.firstOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableFirstOutcomeTooltip }" :disabled="missingFirstPart" type="text"></b-form-input></span>
                 Исплатио благајник,                                       <span class="partText">Парт. </span><b-form-input id="secondPartInput" type="text" :disabled="defaultReceiptPreview" v-model="formatedSecondPart" v-bind:class="{ 'is-invalid': !disableSecondPartTooltip}" class="input-small" tabindex="-1"/><span v-on:mouseleave="disableSecondPartTooltip ? null : hideTooltip('secondPartPosSelect')"><b-dropdown :disabled="defaultReceiptPreview" id="secondPartPosSelect" :no-caret="true" class="ignoreInPrint" variant="link"><b-dropdown-item class="partPosOption" v-on:click="setSelectedSecondPartPos(option.value)" v-for="(option, index) in secondPartPosOptions" v-bind:key="index"><span v-html="option.html"></span></b-dropdown-item></b-dropdown></span> поз. <span v-on:mouseleave="disableSecondPosTooltip ? null : hideTooltip('secondPosInputWrapper')" id="secondPosInputWrapper"><b-form-input id="secondPosInput" v-model="form.secondPosition" v-bind:class="{ 'is-invalid': !disableSecondPosTooltip }" class="input-small" disabled/></span> дин. <span v-on:mouseleave="disableSecondOutcomeTooltip ? null : hideTooltip('secondOutcomeInputWrapper')" id="secondOutcomeInputWrapper"><b-form-input v-model="form.secondOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableSecondOutcomeTooltip }" id="secondOutcomeInput" :disabled="missingSecondPart" type="text"></b-form-input></span>
                                                           
    <br/><b-form-input disabled class="input-small" id="payedInput" type="text"></b-form-input>                                                                            Свега дин. <span id="totalOutcomeInputWrapper"><b-form-input id="totalOutcomeInput" disabled v-model="form.outcome" class="input-small numberInput" type="text"></b-form-input></span>
                                                                                                                                                
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

    <b-tooltip boundary='window' target="reasonInput" triggers="hover" placement="top" ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip" v-on:hide.prevent>
      {{phrases.enterReason}}
    </b-tooltip>

    <b-tooltip boundary='window' target="firstPartPosSelect" triggers="hover" placement="top" ref="firstPartInputTooltip" :disabled.sync="disableFirstPartTooltip" v-on:hide.prevent>
      {{firstPartTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="firstPosInputWrapper" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip" v-on:hide.prevent>
      {{firstPartTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="firstOutcomeInputWrapper" triggers="hover" placement="top" ref="firstOutcomeInputTooltip" :disabled.sync="disableFirstOutcomeTooltip" v-on:hide.prevent>
      {{firstOutcomeTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="secondPartPosSelect" triggers="hover" placement="top" ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip" v-on:hide.prevent>
      {{secondPartTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="secondPosInputWrapper" triggers="hover" placement="top" ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip" v-on:hide.prevent>
      {{secondPosTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="secondOutcomeInputWrapper" triggers="hover" placement="top" ref="secondOutcomeInputTooltip" :disabled.sync="disableSecondOutcomeTooltip" v-on:hide.prevent>
      {{secondOutcomeTooltipText}}
    </b-tooltip>

    <b-tooltip boundary='window' target="dateInput" triggers="hover" placement="top" ref="dateInputTooltip" :disabled.sync="disableDateTooltip" v-on:hide.prevent>
      {{phrases.pickDate}}
    </b-tooltip>

    <b-tooltip boundary='window' target="annualReportPageInputWrapper" triggers="hover" placement="top" ref="annualReportPageInputTooltip" :disabled.sync="defaultReceiptPreview" v-on:hide.prevent>
      {{phrases.automaticallyGeneratedAfterSave}}
    </b-tooltip>

    <b-tooltip boundary='window' target="ordinalInputWrapper" triggers="hover" placement="top" ref="ordinalInputTooltip" :disabled.sync="defaultReceiptPreview" v-on:hide.prevent>
      {{phrases.automaticallyGeneratedAfterSave}}
    </b-tooltip>

    <b-tooltip boundary='window' target="receiptDownloadBtn" triggers="hover" placement="top" ref="receiptDownloadBtnTooltip" v-on:hide.prevent>
      {{phrases.download}}
    </b-tooltip>

    <b-tooltip boundary='window' target="receiptPrintBtn" triggers="hover" placement="top" ref="receiptPrintBtnTooltip" v-on:hide.prevent>
      {{phrases.print}}
    </b-tooltip>

    <b-tooltip boundary='window' target="receiptSaveBtn" triggers="hover" placement="top" ref="receiptSaveBtnTooltip" v-on:hide.prevent>
      {{phrases.save}}
    </b-tooltip>

    <b-tooltip boundary='window' target="receiptClearBtn" triggers="hover" placement="top" ref="receiptClearBtnTooltip" v-on:hide.prevent>
      {{phrases.clear}}
    </b-tooltip>

    <b-modal no-close-on-backdrop id="receipt-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('receiptPreviewErrorModal')">
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
  const { asRoman, numberToSerbianDinars, getCodeCombinations, mapReceiptToReceiptForm, mapReceiptFormToReceipt, saveAs, asFloat, asFormatedString, amountNumberOptions, largeAmountNumberOptions } = require('../../../../utils/utils')
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
          ok: i18n.getTranslation('Ok'),
          download: i18n.getTranslation('Download'),
          receiptFileName: i18n.getTranslation('receipt'),
          automaticallyGeneratedAfterSave: i18n.getTranslation('Automatically generated after save'),
          saveError: i18n.getTranslation('Failed saving error'),
          unexistingPartitionAndPosition: i18n.getTranslation('Unexisting partition and position')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        },
        firstOutcomeInputAutonumeric: null,
        secondOutcomeInputAutonumeric: null,
        alreadyPressed: false,
        disablePrintAndDownload: true,
        tooltipTimeouts: [],
        formatedFirstPart: null,
        formatedSecondPart: null,
        commonData: null
      }
    },
    created () {
      this.loadAnnualReportCommon()
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
      this.formatedFirstPart = asRoman(this.form.firstPartition)
      this.$watch('form.firstPartition', () => {
        self.formatedFirstPart = asRoman(self.form.firstPartition)
      })
      this.formatedSecondPart = asRoman(this.form.secondPartition)
      this.$watch('form.secondPartition', () => {
        self.formatedSecondPart = asRoman(self.form.secondPartition)
      })
      this.$watch('form.firstOutcome', () => {
        self.calculateTotalOutcome()
      })
      this.$watch('form.secondOutcome', () => {
        self.calculateTotalOutcome()
      })
    },
    mounted () {
      this.firstOutcomeInputAutonumeric = new AutoNumeric('#firstOutcomeInput', amountNumberOptions)
      this.secondOutcomeInputAutonumeric = new AutoNumeric('#secondOutcomeInput', amountNumberOptions)
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
            var generatedText = numberToSerbianDinars(asFloat(this.form.outcome, largeAmountNumberOptions))
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
        if (this.invalidFirstCode) {
          return this.phrases.unexistingPartitionAndPosition
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      firstPosTooltipText: function () {
        if (this.invalidFirstCode) {
          return this.phrases.unexistingPartitionAndPosition
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      firstOutcomeTooltipText: function () {
        if(!this.missingFirstPart) {
          return this.phrases.enterAmount
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      secondPosTooltipText: function () {
        if (this.invalidSecondCode) {
          return this.phrases.unexistingPartitionAndPosition
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      secondPartTooltipText: function () {
        if (this.invalidSecondCode) {
          return this.phrases.unexistingPartitionAndPosition
        }
        return this.phrases.atLeastOnePartPosAmount
      },
      secondOutcomeTooltipText: function () {
        if(!this.missingSecondPart) {
          return this.phrases.enterAmount
        }
        return this.phrases.atLeastOnePartPosAmount
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
          return ((!this.atLeastOnePartPosNotSet || !this.missingFirstPart) && !this.invalidFirstCode) || !this.shouldValidate
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
          return ((!this.atLeastOnePartPosNotSet || !this.missingFirstPos) && !this.invalidFirstCode) || !this.shouldValidate
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
          return ((!this.atLeastOnePartPosNotSet || !this.missingSecondPart) && !this.invalidSecondCode) || !this.shouldValidate
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
          return ((!this.atLeastOnePartPosNotSet || !this.missingSecondPos) && !this.invalidSecondCode) || !this.shouldValidate
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
        if(this.form.secondPartition || this.form.secondPartition == 0) {
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
        if(this.form.firstPartition || this.form.firstPartition == 0) {
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
      missingFirstPart: function () {
        return !(this.form.firstPartition || this.form.firstPartition == 0) || this.form.firstPartition.toString().trim() === ''
      },
      missingFirstPos: function () {
        return !(this.form.firstPosition || this.form.firstPosition == 0)
      },
      missingFirstOutcome: function () {
        return !this.form.firstOutcome || this.form.firstOutcome.trim() === ''
      },
      missingSecondPart: function () {
        return !(this.form.secondPartition || this.form.secondPartition == 0) || this.form.secondPartition.toString().trim() === ''
      },
      missingSecondPos: function () {
        return !(this.form.secondPosition || this.form.secondPosition == 0)
      },
      missingSecondOutcome: function () {
        return !this.form.secondOutcome || this.form.secondOutcome.trim() === ''
      },
      invalidFirstCode: function () {
        return this.form.firstCodeValid == false
      },
      invalidSecondCode: function () {
        return this.form.secondCodeValid == false
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
        if (this.missingReason ||
            this.missingDate ||
            this.atLeastOnePartPosNotSet ||
            (!this.missingFirstPart && this.missingFirstOutcome) ||
            (!this.missingSecondPart && this.missingSecondOutcome) ||
            this.invalidFirstCode ||
            this.invalidSecondCode) {
          return false
        }
        return true
      }
    },
    methods: {
      calculateTotalOutcome () {
        const firstOutcome = this.missingFirstOutcome ? Big(0.0) : Big(asFloat(this.form.firstOutcome, amountNumberOptions))
        const secondOutcome = this.missingSecondOutcome ? Big(0.0) : Big(asFloat(this.form.secondOutcome, amountNumberOptions))
        if (firstOutcome.eq(Big(0.0)) && secondOutcome.eq(Big(0.0))) {
          this.form.outcome = null
        } else {
          this.form.outcome = asFormatedString(parseFloat(firstOutcome.plus(secondOutcome)), largeAmountNumberOptions)
        }
      },
      tabPressedHandler (evt) {
        if (this.preDatepickerJustBlurred) {
          /* Manually put focus on the datepicker object */
          this.$refs.dateInput.showCalendar()
          evt.preventDefault()
        }
        this.postDatepickerJustBlurred = false
        this.preDatepickerJustBlurred = false
      },
      shiftTabPressedHandler (evt) {
        if (this.postDatepickerJustBlurred) {
          /* Manually put focus on the datepicker object */
          this.$refs.dateInput.showCalendar()
          evt.preventDefault()
        }
        this.postDatepickerJustBlurred = false
        this.preDatepickerJustBlurred = false
      },
      preDatepickerOnBlur (evt) {
        this.preDatepickerJustBlurred = true
      },
      postDatepickerOnBlur (evt) {
        this.postDatepickerJustBlurred = true
      },
      loadAnnualReportCommon () {
        const self = this
        annualReportController.getAnnualReportCommonData().then((res) => {
          if (!res.err) {
            if(!self.receiptPreview) {
              self.form.churchMunicipality = res.data ? res.data.churchMunicipality : null
              self.form.town = res.data ? res.data.churchTown : null
              self.form.townPayed = self.form.town
            }
            self.commonData = res.data
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
        this.outcomeCodes.forEach(oc => {
          options.push({html: '<span class="partPosOptionText">' + asRoman(oc.partition) + '/' + oc.position + '</span><span class="descriptionOptionText">' + (oc.description ? oc.description : '') + '</span>', value: oc.partition + '/' + oc.position})
        })
        return options
      },
      setSelectedFirstPartPos (selectedPartPos) {
        if (selectedPartPos) {
          const partPos = selectedPartPos.split('/')
          this.form.firstPartition = partPos[0]
          this.form.firstPosition = partPos[1]
          this.form.firstCodeValid = true
        } else {
          this.form.firstPartition = null
          this.form.firstPosition = null
          this.form.firstOutcome = null
          this.form.firstCodeValid = true
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
          this.form.secondCodeValid = true
        } else {
          this.form.secondPartition = null
          this.form.secondPosition = null
          this.form.secondOutcome = null
          this.form.secondCodeValid = true
          if (this.secondOutcomeInputAutonumeric) {
            this.secondOutcomeInputAutonumeric.clear()
          }
        }
      },
      limitInputPerSize(evt) {
        if (evt.key == 'Enter') {
          return
        }
        const highlightedText = window.getSelection().toString()
        if (evt.target.scrollWidth > evt.target.clientWidth && (!highlightedText || highlightedText == '')) {
          evt.preventDefault()
        } 
      },
      showInvalidTooltips () {
        if (this.missingReason) {
          this.showTooltip('reasonInput')
        } else if (this.missingDate) {
          this.showTooltip('dateInput')
        } else if (this.atLeastOnePartPosNotSet) {
          this.showTooltip('firstPartPosSelect')
        } else if (!this.missingFirstPart && this.missingFirstOutcome) {
          this.showTooltip('firstOutcomeInputWrapper')
        } else if (!this.missingSecondPart && this.missingSecondOutcome) {
          this.showTooltip('secondOutcomeInputWrapper')
        } else if (this.invalidFirstCode) {
          this.showTooltip('firstPartPosSelect')
        } else if (this.invalidSecondCode) {
          this.showTooltip('secondPartPosSelect')
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
        this.form.firstCodeValid = null
        this.firstOutcomeInputAutonumeric.clear()
        this.form.secondPartition = null
        this.form.secondPosition = null
        this.form.secondOutcome = null
        this.form.secondCodeValid = null
        this.secondOutcomeInputAutonumeric.clear()
        this.form.outcome = null
        this.form.outcomeAsText = null
        this.form.reason = null
        this.form.received = null
        this.form.churchMunicipality = this.commonData ? this.commonData.churchMunicipality : null
        this.form.town = this.commonData ? this.commonData.churchTown : null
        this.form.townPayed = this.form.town
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
            const date = new Date(this.form.date)
            saveAs('/receipt.pdf', this.phrases.receiptFileName + '-' + date.getUTCDate()  + '-' + (date.getUTCMonth() +1) + '-' + date.getUTCFullYear() + '.pdf', err => {
              if (err) {
                self.openErrorModal(self.phrases.saveError)
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
    }, filters: {
      asRomanNumber(num) {
        console.log(num)
        return asRoman(num)
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
    color: black;
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
    height: 20px;
    margin: 0px;
    color: black;
  }
  .select-small {
    border-style: none;
    font-weight: bold;
    display: inline;
    margin: 0px;
    padding: 0px;
    height: 20px;
    max-height: 20px;
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
    width: 236px;
  }
  #firstPartPosSelect {
    width: 50px;
    height: 20px;
  }
  #secondPartPosSelect {
    width: 50px;
    height: 20px;
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
    padding:0px;
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
    padding:0px;
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

  .partPosOption {
    overflow: hidden;
  }

  .partPosOption >>> .partPosOptionText {
    float:left;
    min-width:80px;
    width:80px;
  }

  .partPosOption >>> .descriptionOptionText {
    overflow: auto;
    margin-right: 80px;
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
    max-height: 20px;
    padding: 0px;
    margin: 0px;
    font-weight: bold;
    color: black;
  }
  .disabledDatepicker .receiptDatepickerInput {
    background-color: rgb(235, 236, 238);
  }
  .is-invalid-date {   
    outline: dotted 2px red !important;
    background-image: url('~@/assets/invalid-red.png');
    background-repeat: no-repeat;
    background-position: center right calc(2.25rem / 4);
    background-size: calc(2.25rem / 2) calc(2.25rem / 2);
  }
  .receiptDatepickerWrapper {
    display: inline;
    white-space: normal;
    height: 20px;
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

   .receiptDatepickerCalendar span:hover  {
    border: rgb(208, 226, 247) !important;
    background-color:  rgb(208, 226, 247) !important;
  }
  .receiptDatepickerCalendar span.selected  {
    border: rgb(208, 226, 247) !important;
    background-color:  rgb(208, 226, 247) !important;
  }

   .receiptDatepickerCalendar div span:hover  {
    border: rgb(208, 226, 247) !important;
    background-color:  rgb(208, 226, 247) !important;
  }
     
  .receiptDatepickerCalendar header span:hover  {
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
