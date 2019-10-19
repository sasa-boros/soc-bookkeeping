<template>       
  <b-container fluid id="receipt-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" novalidate no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/close.png" class="ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="outcomeInputFormGroup"><b-form-input id="outcomeInput" ref="outcomeInput" v-on:mouseleave="hideTooltip('outcomeInput')" v-model="form.outcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': shouldValidate && missingOutcome }" :disabled="defaultReceiptPreview" type="text" :autofocus="!receiptPreview"></b-form-input></b-form-group> и словима  <b-form-input disabled class="input-small" id="outcomeAsTextDivWrapper1" v-model="generatedOutcomeTextLine1"></b-form-input>
      <br/><b-form-input disabled class="input-small" disable id="outcomeAsTextDivWrapper2" v-model="generatedOutcomeTextLine2"></b-form-input>
      <br/>динара, примљених из благајне Српске православне црквене општине <b-form-group class="input-form-group" ref="churchMunicipalityInputFormGroup"><b-form-input id="churchMunicipalityInput" v-on:keypress="limitChurchMunicipalityInput" v-model="form.churchMunicipality" class="input-small" type="text"></b-form-input></b-form-group><br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input id="townInput" v-on:keypress="limitTownInput" v-model="form.town" class="input-small" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input id="reasonInput" v-on:keypress="limitReasonInput" v-on:mouseleave="hideTooltip('reasonInput')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason }" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>
      <div class="mt-2">на дан <span v-on:mouseleave="hideTooltip('dateInput')"><datepicker id="dateInput" ref="dateInput" v-model="form.date"  v-bind:class="{ 'is-invalid': shouldValidate && missingDate, 'disabledDatepicker': defaultReceiptPreview }" :language="calendarLanguages.srCYRL" input-class="receiptDatepickerInput" wrapper-class="receiptDatepickerWrapper" calendar-class="receiptDatepickerCalendar" v-on:input="checkMaxReceipts" :disabled="defaultReceiptPreview"></datepicker></span> г.                                                                                         П р и м и о,
                                                                                                        <b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input v-on:keypress="limitReceivedInput" v-model="form.received" class="input-small" id="receivedInput" type="text" @blur.native="postDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                      Да се исплати на терет расхода              <b-form-input disabled id="yearInput" ref="yearInput" class="input-small" v-model="year"></b-form-input> г.
                                                                                          <span class="partText">Парт. </span><b-form-group class="input-form-group" ref="firstPartInputFormGroup"><span v-on:mouseleave="hideTooltip('firstPartInput')"><b-form-input id="firstPartInput" type="text" v-model="form.firstPartition" v-bind:class="{ 'is-invalid': !disableFirstPartTooltip}" class="input-small" :disabled="defaultReceiptPreview" tabIndex="-1"/></span></b-form-group><span v-on:mouseleave="hideTooltip('firstPartPosSelect')"><b-form-select id="firstPartPosSelect" v-model="selectedFirstPartPos" v-on:change="onFirstPartPosChange" :options="firstPartPosOptions" :disabled="defaultReceiptPreview" size="sm" class="select-small ignoreInPrint"><template v-slot:first><option :value="null"></option></template></b-form-select></span> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup" id="firstPosInputForm"><span v-on:mouseleave="hideTooltip('firstPosInputForm')"><b-form-input id="firstPosInput" v-model="form.firstPosition" v-bind:class="{ 'is-invalid': !disableFirstPosTooltip}" class="input-small" disabled/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="firstOutcomeInputFormGroup" id="firstOutcomeInputForm"><span v-on:mouseleave="hideTooltip('firstOutcomeInputForm')"><b-form-input id="firstOutcomeInput" v-model="form.firstOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableFirstOutcomeTooltip }" :disabled="defaultReceiptPreview || missingFirstPart" type="text"></b-form-input></span></b-form-group>
                  Примио благајник,                                        <span class="partText">Парт. </span><b-form-group class="input-form-group" ref="secondPartInputFormGroup"><span v-on:mouseleave="hideTooltip('secondPartInput')"><b-form-input id="secondPartInput" type="text" v-model="form.secondPartition" v-bind:class="{ 'is-invalid': !disableSecondPartTooltip}" class="input-small" :disabled="defaultReceiptPreview" tabIndex="-1"/></span></b-form-group><span v-on:mouseleave="hideTooltip('secondPartPosSelect')"><b-form-select id="secondPartPosSelect" v-model="selectedSecondPartPos" v-on:change="onSecondPartPosChange" :options="secondPartPosOptions" :disabled="defaultReceiptPreview" size="sm" class="select-small ignoreInPrint"><template v-slot:first><option :value="null"></option></template></b-form-select></span> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup" id="secondPosInputForm"><span v-on:mouseleave="hideTooltip('secondPosInputForm')"><b-form-input id="secondPosInput" v-model="form.secondPosition" v-bind:class="{ 'is-invalid': !disableSecondPosTooltip }" class="input-small" disabled/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="secondOutcomeInputFormGroup" id="secondOutcomeInputForm"><span v-on:mouseleave="hideTooltip('secondOutcomeInputForm')"><b-form-input v-model="form.secondOutcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableSecondOutcomeTooltip }" id="secondOutcomeInput" :disabled="defaultReceiptPreview || missingSecondPart" type="text"></b-form-input></span></b-form-group>
                                                           
      <br/><b-form-group  class="input-form-group" ref="payedInputFormGroup"><b-form-input disabled class="input-small" id="payedInput" type="text" @blur.native="postDatepickerDefaultOnBlur"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalOutcomeInputFormGroup" id="totalOutcomeInputForm"><span v-on:mouseleave="hideTooltip('totalOutcomeInputForm')"><b-form-input id="totalOutcomeInput" disabled v-model="form.outcome" class="input-small numberInput" v-bind:class="{ 'is-invalid': shouldValidate && ( missingTotalOutcome || totalOutcomeNotValid ) }" type="text"></b-form-input></span></b-form-group>
      <div class="my-0">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>
      </div>
      <div id="downloadPrintBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('receiptDownloadBtn')" ref="receiptDownloadBtn" id="receiptDownloadBtn" @click.stop="downloadReceipt()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }" :disabled="!validForm && shouldValidate">
          <img src="~@/assets/download.png" class="ignoreInPrint">
        </b-button>
        &nbsp;
        <b-button v-on:mouseleave="hideTooltip('receiptPrintBtn')" ref="receiptPrintBtn" id="receiptPrintBtn" @click.stop="printReceipt()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }" :disabled="!validForm && shouldValidate">
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

    <b-tooltip target="outcomeInput" triggers="hover" placement="top" ref="outcomeInputTooltip" :disabled.sync="disableOutcomeTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>

    <b-tooltip target="reasonInput" triggers="hover" placement="top" ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>


    <b-tooltip target="firstPartPosSelect" triggers="hover" placement="top" ref="firstPartInputTooltip" :disabled.sync="disableFirstPartTooltip">
      <div class="tooltipInnerText">
        {{phrases.atLeastOnePartPosOutcome}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstPosInputForm" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip">
      <div class="tooltipInnerText">
        {{firstPartTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstOutcomeInputForm" triggers="hover" placement="top" ref="firstOutcomeInputTooltip" :disabled.sync="disableFirstOutcomeTooltip">
      <div class="tooltipInnerText">
        {{firstOutcomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="secondPartPosSelect" triggers="hover" placement="top" ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip">
      <div class="tooltipInnerText">
        {{secondPartTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="secondPosInputForm" triggers="hover" placement="top" ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip">
      <div class="tooltipInnerText">
        {{secondPosTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="secondOutcomeInputForm" triggers="hover" placement="top" ref="secondOutcomeInputTooltip" :disabled.sync="disableSecondOutcomeTooltip">
      <div class="tooltipInnerText">
        {{secondOutcomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="totalOutcomeInputForm" triggers="hover" placement="top" ref="totalOutcomeInputTooltip" :disabled.sync="disableTotalOutcomeTooltip">
      <div class="tooltipInnerText">
        {{totalOutcomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="dateInput" triggers="hover" placement="top" ref="dateInputTooltip" :disabled.sync="disableDateTooltip">
      <div class="tooltipInnerText">
        {{phrases.pickDate}}
      </div>
    </b-tooltip>

    <b-tooltip target="receiptDownloadBtn" triggers="hover" placement="top" ref="receiptDownloadBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.download}}
      </div>
    </b-tooltip>

    <b-tooltip target="receiptPrintBtn" triggers="hover" placement="top" ref="receiptPrintBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.print}}
      </div>
    </b-tooltip>

    <b-tooltip target="receiptSaveBtn" triggers="hover" placement="top" ref="receiptSaveBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.save}}
      </div>
    </b-tooltip>

    <b-tooltip target="receiptClearBtn" triggers="hover" placement="top" ref="receiptClearBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.clear}}
      </div>
    </b-tooltip>
    <b-modal id="receipt-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="receipt-preview-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  import MessageConfirmDialog from '../../../MessageConfirmDialog'
  const outcomeCodeController = require('../../../../controllers/outcomeCodeController')
  const receiptController = require('../../../../controllers/receiptController')
  const defaultReceiptController = require('../../../../controllers/defaultReceiptController')
  const { numberToSerbianDinars, getCodeCombinations, mapReceiptToReceiptForm, mapReceiptFormToReceipt, saveAs, asFloat, amountNumberOptions, compareCodes } = require('../../../../utils/utils')
  const i18n = require('../../../../../translations/i18n')
  const AutoNumeric = require('autonumeric')
  const _ = require('lodash')

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
      existingReceipts: {
        type: Array,
        default: function () {
          return []
        }
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
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosOutcome: i18n.getTranslation('Enter at least one partition, position, outcome'),
          enterPartition: i18n.getTranslation('Enter partition'),
          needsToBeEqualToSum: i18n.getTranslation('Needs to equal to sum of outcomes by partitions and position'),
          enterOutcome:i18n.getTranslation('Enter outcome'),
          ok: i18n.getTranslation('Ok'),
          download: i18n.getTranslation('Download'),
          permissionDenied: i18n.getTranslation('Permission denied.'),
          maxNumberOfReceiptsReached: i18n.getTranslation('Maximum number of receipts reached for this month and year (27). Choose another date.'),
          receiptPdf: i18n.getTranslation('receipt.pdf'),
          chooseDifferentOutcomeCodes: i18n.getTranslation('Choose different outcome codes')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        },
        outcomeInputAutonumeric: null,
        firstOutcomeInputAutonumeric: null,
        secondOutcomeInputAutonumeric: null,
        totalOutcomeInputAutonumeric: null,
        churchMunicipalityInputElement: null,
        townInputElement: null,
        reasonInputElement: null,
        receivedInputElement: null,
        selectedFirstPartPos: null,
        selectedSecondPartPos: null,
        alreadySubmited: false
      }
    },
    created () {
      if(this.receiptPreview) {
        var receipt = JSON.parse(JSON.stringify(this.receipt));
        this.form = mapReceiptToReceiptForm(receipt);
        if (!this.form.isValid) {
          this.shouldValidate = true;
        }
        this.selectedFirstPartPos = this.form.firstPartition + '/' + this.form.firstPosition
        this.selectedSecondPartPos = this.form.secondPartition + '/' + this.form.secondPosition
      } else {
        var defaultReceipt = JSON.parse(JSON.stringify(this.defaultReceipt))
        defaultReceipt._id = undefined;
        this.form = mapReceiptToReceiptForm(defaultReceipt);
      } 
      const self = this;
      outcomeCodeController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodes = (res.data.sort(compareCodes) || [])
        } else {
          self.openErrorModal(res.err)
        }
      })
      document.addEventListener('keyup', function (evt) {
        if (evt.keyCode === 13) {
          const saveBtn = document.getElementById('receiptSaveBtn')
          if (saveBtn) {
            saveBtn.click()
          }
        }
      })
    },
    mounted () {
      this.outcomeInputAutonumeric = new AutoNumeric('#outcomeInput', amountNumberOptions)
      this.firstOutcomeInputAutonumeric = new AutoNumeric('#firstOutcomeInput', amountNumberOptions)
      this.secondOutcomeInputAutonumeric = new AutoNumeric('#secondOutcomeInput', amountNumberOptions)
      this.totalOutcomeInputAutonumeric = new AutoNumeric('#totalOutcomeInput', amountNumberOptions)
      this.churchMunicipalityInputElement = document.getElementById('churchMunicipalityInput')
      this.townInputElement = document.getElementById('townInput')
      this.reasonInputElement = document.getElementById('reasonInput')
      this.receivedInputElement = document.getElementById('receivedInput')
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
        return this.phrases.atLeastOnePartPosOutcome
      },
      firstPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosOutcome
      },
      firstOutcomeTooltipText: function () {
        if(!this.missingFirstPart) {
          return this.phrases.enterOutcome
        }
        return this.phrases.atLeastOnePartPosOutcome
      },
      secondPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosOutcome
      },
      secondPartTooltipText: function () {
        return this.phrases.atLeastOnePartPosOutcome
      },
      secondOutcomeTooltipText: function () {
        if(!this.missingSecondPart) {
          return this.phrases.enterOutcome
        }
        return this.phrases.atLeastOnePartPosOutcome
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
            this.$refs.outcomeInputTooltip.$emit('close')
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
            this.$refs.reasonInputTooltip.$emit('close')
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
            this.$refs.firstPartInputTooltip.$emit('close')
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
            this.$refs.firstPosInputTooltip.$emit('close')
          }
        }
      },
      disableFirstOutcomeTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.firstOutcomeInputTooltip.$emit('close')
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
            this.$refs.secondPartInputTooltip.$emit('close')
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
            this.$refs.secondPosInputTooltip.$emit('close')
          }
        }
      },
      disableSecondOutcomeTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.secondOutcomeInputTooltip.$emit('close')
          }
        }
      },
      disableTotalOutcomeTooltip: {
        get: function () {
          return (!this.missingTotalOutcome && !this.totalOutcomeNotValid) || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.totalOutcomeInputTooltip.$emit('close')
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
            this.$refs.dateInputTooltip.$emit('close')
          }
        }
      },
      firstPartPosOptions: function() {
        var options = this.getInitialPartPosOptions()
        if(this.selectedSecondPartPos) {
          for (let i=0; i<options.length; i++) {
            if (options[i].value == this.selectedSecondPartPos) {
              options.splice(i, 1)
              break
            }
          }
        }
        return options
      },
      secondPartPosOptions: function() {
        var options = this.getInitialPartPosOptions()
        if(this.selectedFirstPartPos) {
          for (let i=0; i<options.length; i++) {
            if (options[i].value == this.selectedFirstPartPos) {
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
          const totalOutcome = asFloat(this.form.outcome, amountNumberOptions)
          const firstOutcome = this.missingFirstOutcome ? 0 : asFloat(this.form.firstOutcome, amountNumberOptions)
          const secondOutcome = this.missingSecondOutcome ? 0 : asFloat(this.form.secondOutcome, amountNumberOptions)
          if (firstOutcome + secondOutcome !== totalOutcome) {
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
            this.totalOutcomeNotValid) {
          return false
        }
        return true
      }
    },
    methods: {
      getInitialPartPosOptions() {
        if (!this.outcomeCodes) {
          return []
        }
        var options = []
        this.outcomeCodes.forEach(ic => {
          let padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          let paddingCount = ic.partition.toString().length + ic.position.toString().length
          if (paddingCount == 3) {
            padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          } else if(paddingCount == 4) {
            padding = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
          }
          options.push({html: ic.partition + '/' + ic.position + (ic.description ? padding + ic.description : ''), value: ic.partition + '/' + ic.position})
        })
        return options
      },
      onFirstPartPosChange () {
        if (this.selectedFirstPartPos) {
          const partPos = this.selectedFirstPartPos.split('/')
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
      onSecondPartPosChange () {
        if (this.selectedSecondPartPos) {
          const partPos = this.selectedSecondPartPos.split('/')
          this.form.secondPartition = partPos[0]
          this.form.secondPosition = partPos[1]
          document.getElementById('secondPartPosSelect').nodeValue = partPos[0]
        } else {
          this.form.secondPartition = null
          this.form.secondPosition = null
          this.form.secondOutcome = null
          if (this.secondOutcomeInputAutonumeric) {
            this.secondOutcomeInputAutonumeric.clear()
          }
        }
      },
      limitChurchMunicipalityInput(evt) {
      if (this.churchMunicipalityInputElement.scrollWidth > this.churchMunicipalityInputElement.clientWidth) {
          evt.preventDefault()
        } 
      },
      limitTownInput(evt) {
      if (this.townInputElement.scrollWidth > this.townInputElement.clientWidth) {
          evt.preventDefault()
        } 
      },
      limitReasonInput(evt) {
      if (this.reasonInputElement.scrollWidth > this.reasonInputElement.clientWidth) {
          evt.preventDefault()
        } 
      },
      limitReceivedInput(evt) {
      if (this.receivedInputElement.scrollWidth > this.receivedInputElement.clientWidth) {
          evt.preventDefault()
        } 
      },
      checkMaxReceipts () {
        if (!this.form.date || !this.existingReceipts) {
          return
        }
        // set date to null because of long processing
        const formDate = this.form.date
        this.$refs.dateInput.clearDate()
        this.form.date = null

        var countOfSameMonthAndYear = 0
        for (let i=0; i<this.existingReceipts.length; i++) {
          const receiptDate = new Date(this.existingReceipts[i].date)
          if (receiptDate.getUTCMonth() == formDate.getMonth() && receiptDate.getUTCFullYear() == formDate.getFullYear()) {
            if (this.existingReceipts[i]._id != this.form._id) {
              countOfSameMonthAndYear++
            }
            if (countOfSameMonthAndYear >= 27) {
              this.openErrorModal(this.phrases.maxNumberOfReceiptsReached)
              return
            }
          }
        }
        this.form.date = formDate
      },
      hideTooltip (elementId) {
        if (elementId) {
          this.$root.$emit('bv::hide::tooltip', elementId)
        } else {
          this.$root.$emit('bv::hide::tooltip')
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
      postDatepickerDefaultOnBlur (evt) {
        if(this.defaultReceiptPreview) {
          this.postDatepickerJustBlurred = true
        }
      },
      onSubmit (evt) {
        evt.preventDefault()
        if(this.alreadySubmited) {
          return
        }
        const self = this;
        if (this.defaultReceiptPreview) {
          this.alreadySubmited = true
          defaultReceiptController.createDefaultReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then(function (res) {
            if (!res.err) {
              self.$emit('updateDefaultReceipt')
              self.closeModal();
            } else {
              self.alreadySubmited = false
              self.openErrorModal(res.err)
            }
          })
        } else {
          this.shouldValidate = true;
          if (this.validForm) {
            if (this.receiptPreview) {
              this.alreadySubmited = true
              receiptController.updateReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updateReceiptTable')
                  self.closeModal();
                } else {
                  self.alreadySubmited = false
                  self.openErrorModal(res.err)
                }
              })
            } else {
              this.alreadySubmited = true
              receiptController.createReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updateReceiptTable')
                  self.closeModal();
                } else {
                  self.alreadySubmited = false
                  self.openErrorModal(res.err)
                }
              })
            }
          }
        }
      },
      clearForm () {
        this.form.ordinal = null;
        this.form.annualReportPage = null;
        this.form.date = null;
        this.form.firstPartition = null;
        this.form.firstPosition = null;
        this.form.firstOutcome = null;
        this.firstOutcomeInputAutonumeric.clear()
        this.form.secondPartition = null;
        this.form.secondPosition = null;
        this.form.secondOutcome = null;
        this.secondOutcomeInputAutonumeric.clear()
        this.form.outcome = null;
        this.outcomeInputAutonumeric.clear()
        this.form.outcomeAsText = null;
        this.form.churchMunicipality = null;
        this.form.town = null;
        this.form.reason = null;
        this.form.received = null;
        this.totalOutcomeInputAutonumeric.clear()
        this.selectedFirstPartPos = null
        this.selectedSecondPartPos = null
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'receipt-preview-error-modal')
      },
      printReceipt () {
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          window.print()
        } finally {
          document.body.removeChild(section)
        }
      },
      async downloadReceipt () {
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          const res = await receiptController.createReceiptPdf()
          if (!res.err) {
            const self = this
            saveAs('/receipt.pdf', this.phrases.receiptPdf, err => {
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
    border-bottom: 1px solid black !important;
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
    left: 50px;
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
  .input-form-group {
    display: inline;
    height: 15px;
    margin: 0px;
    padding: 0px;
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
  .input-small::placeholder {
    border-style: none;
    font-weight: normal;
    color: #16264C;
  }
  .input-small.is-invalid {
    background-image: url('~@/assets/invalid-red.png') !important;
  }
  .select-small.is-invalid {
   background-image: url('~@/assets/invalid-red.png') !important;
  }
  .custom-select:disabled {
    color: #6c757d;
    background-color: #6c757d;
  }
  #yearInput {
    width: 50px;
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
    width: 300px;
  }
  #payedInput {
    width: 230px;
  }
  #firstPartPosSelect {
    width: 50px;
    padding: 2px 2px 2px 2px;
  }
  #secondPartPosSelect {
    width: 50px;
    padding: 2px 2px 2px 2px;
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
  }
  #firstPosInput {
    width: 50px;
  }
  #secondPartInput {
    width: 50px;
    position:relative;
    left:50px;
    pointer-events: none;
  }
  #secondPosInput {
    width: 50px;
  }
  #firstOutcomeInput {
    width: 100px;
  }
  #secondOutcomeInput {
    width: 100px;
  }
  #totalOutcomeInput {
    width: 100px;
  }
  #annualReportPageInput {
    width: 35px;
  }
  #ordinalInput {
    width: 40px;
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
    bottom: 1%;
    right: 9%;
  }
  #downloadPrintBtnsDiv {
    position: absolute;
    bottom: 1%;
    left: 10%;
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
  #outcomeAsTextDivWrapper1 {
    width: 405px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  }
  #outcomeAsTextDivWrapper2 {
    width: 670px;
    white-space: nowrap;
    overflow: hidden;
  }
</style>

<style>
  .receiptDatepickerInput {
    display: inline;
    border-style: none;
    border-bottom: 1px solid black;
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
