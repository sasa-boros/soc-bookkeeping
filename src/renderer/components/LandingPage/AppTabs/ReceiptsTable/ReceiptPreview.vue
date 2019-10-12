<template>       
  <b-container fluid id="receipt-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/close.png" class="ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="outcomeInputFormGroup"><b-form-input id="outcomeInput" ref="outcomeInput" v-on:mouseleave="hideTooltip('outcomeInput')" v-model="form.outcome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingOutcome }" :disabled="defaultReceiptPreview" type="number" min="0" step="0.01"></b-form-input></b-form-group> и словима  <div class="outcomeAsTextDivWrapper" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" contenteditable="false" id="outcomeAsTextDivWrapper1">{{generatedOutcomeTextLine1}}</div>
      <br/><div class="outcomeAsTextDivWrapper" contenteditable="false" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" id="outcomeAsTextDivWrapper2">{{generatedOutcomeTextLine2}}</div>
      <br/>динара, примљених из благајне Српске православне црквене општине <b-form-group class="input-form-group" ref="churchMunicipalityInputFormGroup"><b-form-input id="churchMunicipalityInput" v-on:mouseleave="hideTooltip('churchMunicipalityInput')" v-model="form.churchMunicipality" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingChurchMunicipality }" type="text"></b-form-input></b-form-group><br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input id="townInput" v-on:mouseleave="hideTooltip('townInput')" v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingTown }" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input id="reasonInput" v-on:mouseleave="hideTooltip('reasonInput')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason }" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        П р и м и о,
                                                                                                          <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input disabled class="input-small" id="payedInput" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                        Да се исплати на терет расхода<span v-on:mouseleave="hideTooltip('dateInput')"><datepicker id="dateInput" ref="dateInput" v-model="form.date"  v-bind:class="{ 'is-invalid': shouldValidate && missingDate }" :language="calendarLanguages.srCYRL" input-class="datepickerInput" wrapper-class="datepickerWrapper" calendar-class="datepickerCalendar" v-on:input="checkMaxReceipts"></datepicker></span>
                                                                                                          Парт. <b-form-group class="input-form-group" ref="firstPartInputFormGroup"><span v-on:mouseleave="hideTooltip('firstPartSelect')"><b-form-select id="firstPartSelect" v-model="form.firstPartition" :disabled="defaultReceiptPreview" :options="part1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstPart && atLeastOnePartPosNotSet }" @blur.native="postDatepickerOnBlur"/></span></b-form-group> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup" id="firstPosSelectForm"><span v-on:mouseleave="hideTooltip('firstPosSelectForm')"><b-form-select id="firstPosSelect" v-model="form.firstPosition" :disabled="defaultReceiptPreview || missingFirstPart" :options="pos1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstPos && atLeastOnePartPosNotSet }"/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="firstOutcomeInputFormGroup" id="firstOutcomeInputForm"><span v-on:mouseleave="hideTooltip('firstOutcomeInputForm')"><b-form-input id="firstOutcomeInput" v-model="form.firstOutcome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstOutcome && atLeastOnePartPosNotSet }" :disabled="defaultReceiptPreview || missingFirstPart" type="number" min="0" step="0.01"></b-form-input></span></b-form-group>
                 Исплатио благајник,                                                      Парт. <b-form-group class="input-form-group" ref="secondPartInputFormGroup"><span v-on:mouseleave="hideTooltip('secondPartSelect')"><b-form-select id="secondPartSelect" v-model="form.secondPartition" :disabled="defaultReceiptPreview" :options="part2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondPart && atLeastOnePartPosNotSet }"/></span></b-form-group> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup" id="secondPosSelectForm"><span v-on:mouseleave="hideTooltip('secondPosSelectForm')"><b-form-select id="secondPosSelect" v-model="form.secondPosition" :disabled="defaultReceiptPreview || missingSecondPart" :options="pos2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondPos && atLeastOnePartPosNotSet }"/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="secondOutcomeInputFormGroup" id="secondOutcomeInputForm"><span v-on:mouseleave="hideTooltip('secondOutcomeInputForm')"><b-form-input id="secondOutcomeInput" v-model="form.secondOutcome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondOutcome && atLeastOnePartPosNotSet }" :disabled="defaultReceiptPreview || missingSecondPart" type="number" min="0" step="0.01"></b-form-input></span></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input v-model="form.received" class="input-small" id="receivedInput" type="text" @blur.native="postDatepickerDefaultOnBlur"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalOutcomeInputFormGroup" id="totalOutcomeInputForm"><span v-on:mouseleave="hideTooltip('totalOutcomeInputForm')"><b-form-input id="totalOutcomeInput" disabled v-model="form.outcome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && ( missingTotalOutcome || totalOutcomeNotValid ) }" type="number" min="0" step="0.01"></b-form-input></span></b-form-group>
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>
      </div>
      <div id="downloadPrintBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('receiptDownloadBtn')" ref="receiptDownloadBtn" id="receiptDownloadBtn" @click.stop="downloadReceipt()" variant="link" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }">
          <img src="~@/assets/download.png" class="ignoreInPrint">
        </b-button>
        &nbsp;
        <b-button v-on:mouseleave="hideTooltip('receiptPrintBtn')" ref="receiptPrintBtn" id="receiptPrintBtn" @click.stop="printReceipt()" variant="link" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultReceiptPreview }">
          <img src="~@/assets/print.png" class="ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('receiptSaveBtn')" ref="receiptSaveBtn" id="receiptSaveBtn" type="submit" variant="link" class="ignoreInPrint btn-lg">
          <img src="~@/assets/save.png" class="ignoreInPrint">
        </b-button>
        <b-button v-on:mouseleave="hideTooltip('receiptClearBtn')" ref="receiptClearBtn" id="receiptClearBtn" @click.stop="clearForm()" variant="link" class="ignoreInPrint btn-lg">
          <img src="~@/assets/clear.png" class="ignoreInPrint">
        </b-button>
      </div>
    </b-form>

    <b-tooltip target="outcomeInput" triggers="hover" placement="top" ref="outcomeInputTooltip" :disabled.sync="disableOutcomeTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>

    <b-tooltip target="townInput" triggers="hover" placement="top" ref="townInputTooltip" :disabled.sync="disableTownTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>

    <b-tooltip target="churchMunicipalityInput" triggers="hover" placement="top" ref="churchMunicipalityInputTooltip" :disabled.sync="disableChurchMunicipalityTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>

    <b-tooltip target="reasonInput" triggers="hover" placement="top" ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip">
      <div class="tooltipInnerText">
        {{phrases.enterValue}}
      </div>
    </b-tooltip>


    <b-tooltip target="firstPartSelect" triggers="hover" placement="top" ref="firstPartInputTooltip" :disabled.sync="disableFirstPartTooltip">
      <div class="tooltipInnerText">
        {{phrases.atLeastOnePartPosOutcome}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstPosSelectForm" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip">
      <div class="tooltipInnerText">
        {{firstPosTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstOutcomeInputForm" triggers="hover" placement="top" ref="firstOutcomeInputTooltip" :disabled.sync="disableFirstOutcomeTooltip">
      <div class="tooltipInnerText">
        {{firstOutcomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="secondPartSelect" triggers="hover" placement="top" ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip">
      <div class="tooltipInnerText">
        {{phrases.atLeastOnePartPosOutcome}}
      </div>
    </b-tooltip>

    <b-tooltip target="secondPosSelectForm" triggers="hover" placement="top" ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip">
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
  const { numberToSerbianDinars, getCodeCombinations, mapReceiptToReceiptForm, mapReceiptFormToReceipt, saveAs } = require('../../../../utils/utils')
  const i18n = require('../../../../translations/i18n')

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
        outcomeCodeCombinations: null,
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
          ok: i18n.getTranslation('Ok'),
          download: i18n.getTranslation('Download'),
          permissionDenied: i18n.getTranslation('Permission denied.'),
          maxNumberOfReceiptsReached: i18n.getTranslation('Maximum number of receipts reached for this month and year (27). Choose another date.'),
          receiptPdf: i18n.getTranslation('receipt.pdf')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        }
      }
    },
    created () {
      if(this.receiptPreview) {
        var receipt = JSON.parse(JSON.stringify(this.receipt));
        this.form = mapReceiptToReceiptForm(receipt);
        if (!this.form.isValid) {
          this.shouldValidate = true;
        }
      } else {
        var defaultReceipt = JSON.parse(JSON.stringify(this.defaultReceipt))
        defaultReceipt._id = undefined;
        this.form = mapReceiptToReceiptForm(defaultReceipt);
      } 
      const self = this;
      outcomeCodeController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodes = (res.data || [])
          self.outcomeCodeCombinations = getCodeCombinations(self.outcomeCodes)
        } else {
          self.openErrorModal(res.err)
        }
      })
    },
    watch: {
      'form.firstPartition' : function (newValue) {
        /* If new value is null, i.e. the part is reset, reset the outcome too */
        if (!newValue || newValue.toString().trim() === '') {
          this.form.firstPosition = null
          this.form.firstOutcome = null
          return;
        }
        if (!this.outcomeCodeCombinations) {
          return;
        }
        const allowedPosValues = this.outcomeCodeCombinations[newValue]
        if (!allowedPosValues || allowedPosValues.indexOf(this.form.firstPosition) === -1) {
          /* Pos value needs to be reset since it is not allowed with the new part */
          this.form.firstPosition = null
        }
      },
      'form.secondPartition' : function (newValue) {
        /* If new value is null, i.e. the part is reset, reset the outcome too */
        if (!newValue || newValue.toString().trim() === '') {
          this.form.secondPosition = null
          this.form.secondOutcome = null
          return;
        }
        if (!this.outcomeCodeCombinations) {
          return;
        }
        const allowedPosValues = this.outcomeCodeCombinations[newValue]
        if (!allowedPosValues || allowedPosValues.indexOf(this.form.secondPosition) === -1) {
          /* Pos value needs to be reset since it is not allowed with the new part */
          this.form.secondPosition = null
        }
      }
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
            var generatedText = numberToSerbianDinars(this.form.outcome)
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
      firstPosTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosOutcome
        }
      },
      firstOutcomeTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosOutcome
        }
      },
      secondPosTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosOutcome
        }
      },
      secondOutcomeTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosOutcome
        }
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
      disableTownTooltip: {
        get: function () {
          return !this.missingTown || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.townInputTooltip.$emit('close')
          }
        }
      },
      disableChurchMunicipalityTooltip: {
        get: function () {
          return !this.missingChurchMunicipality || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.churchMunicipalityInputTooltip.$emit('close')
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
          return !this.atLeastOnePartPosNotSet || !this.missingFirstOutcome || !this.shouldValidate
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
          return !this.atLeastOnePartPosNotSet || !this.missingSecondOutcome || !this.shouldValidate
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
      part1Options: function () {
        if (!this.outcomeCodeCombinations) {
          return [];
        }
        var keys = Object.keys(this.outcomeCodeCombinations);
        var index = keys.indexOf(this.form.secondPartition);
        if (index != -1) {
            keys.splice(index, 1);
        }
        keys.unshift('');
        return keys;
      },
      part2Options: function () {
        if (!this.outcomeCodeCombinations) {
          return [];
        }
        var keys = Object.keys(this.outcomeCodeCombinations);
        var index = keys.indexOf(this.form.firstPartition);
        if (index != -1) {
            keys.splice(index, 1);
        }
        keys.unshift('');
        return keys;
      },
      pos1Options: function () {
        if (!this.outcomeCodeCombinations) {
          return []
        }
        return this.outcomeCodeCombinations[this.form.firstPartition]
      },
      pos2Options: function () {
        if (!this.outcomeCodeCombinations) {
          return []
        }
        return this.outcomeCodeCombinations[this.form.secondPartition]
      },
      missingReason: function () {
        return !this.form.reason || this.form.reason.toString().trim() === ''
      },
      missingTown: function () {
        return !this.form.town || this.form.town.toString().trim() === ''
      },
      missingChurchMunicipality: function () {
        return !this.form.churchMunicipality || this.form.churchMunicipality.toString().trim() === ''
      },
      missingOutcome: function () {
        return !this.form.outcome || this.form.outcome.toString().trim() === ''
      },
      missingFirstPart: function () {
        return !this.form.firstPartition || this.form.firstPartition.toString().trim() === ''
      },
      missingFirstPos: function () {
          return !this.form.firstPosition
      },
      missingFirstOutcome: function () {
        return !this.form.firstOutcome || this.form.firstOutcome.toString().trim() === ''
      },
      missingSecondPart: function () {
        return !this.form.secondPartition || this.form.secondPartition.toString().trim() === ''
      },
      missingSecondPos: function () {
          return !this.form.secondPosition
      },
      missingSecondOutcome: function () {
        return !this.form.secondOutcome || this.form.secondOutcome.toString().trim() === ''
      },
      missingTotalOutcome: function () {
        return !this.form.outcome || this.form.outcome.toString().trim() === ''
      },
      totalOutcomeNotValid: function () {
        if (this.form.outcome) {
          const totalOutcome = parseFloat(this.form.outcome)
          const firstOutcome = this.missingFirstOutcome ? 0 : parseFloat(this.form.firstOutcome)
          const secondOutcome = this.missingSecondOutcome ? 0 : parseFloat(this.form.secondOutcome)
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
        // making this computed property react on changes
        this.form.firstPartition
        this.form.firstPosition
        this.form.firstOutcome
        this.form.secondPartition
        this.form.secondPosition
        this.form.secondOutcome
        /* True if not a single part-pos combination is set. At least one combination should be set. */
        const firstCombinationSet = !this.missingFirstPart && !this.missingFirstPos && !this.missingFirstOutcome
        const secondCombinationSet = !this.missingSecondPart && !this.missingSecondPos && !this.missingSecondOutcome

        return !firstCombinationSet && !secondCombinationSet
      }
    },
    methods: {
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
          if (receiptDate.getMonth() == formDate.getMonth() && receiptDate.getFullYear() == formDate.getFullYear()) {
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
        const self = this;
        if (this.defaultReceiptPreview) {
          defaultReceiptController.createDefaultReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then(function (res) {
            if (!res.err) {
              self.$emit('updateDefaultReceipt')
              self.closeModal();
            } else {
              self.openErrorModal(res.err)
            }
          })
        } else {
          this.shouldValidate = true;
          if (this.checkForm()) {
            if (this.receiptPreview) {
              receiptController.updateReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updateReceiptTable')
                  self.closeModal();
                } else {
                  self.openErrorModal(res.err)
                }
              })
            } else {
              receiptController.createReceipt(mapReceiptFormToReceipt(this.form, this.outcomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updateReceiptTable')
                  self.closeModal();
                } else {
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
        this.form.secondPartition = null;
        this.form.secondPosition = null;
        this.form.secondOutcome = null;
        this.form.outcome = null;
        this.form.outcomeAsText = null;
        this.form.churchMunicipality = null;
        this.form.town = null;
        this.form.reason = null;
        this.form.received = null;
      },
      checkForm () {
        if (this.missingOutcome ||
            this.missingReason ||
            this.missingTown ||
            this.missingChurchMunicipality ||
            this.missingDate ||
            this.atLeastOnePartPosNotSet ||
            this.totalOutcomeNotValid) {
          return false
        }
        return true
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
            saveAs('./receipt.pdf', this.phrases.receiptPdf, err => {
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
         // ensuring clean screen
        var paymentSlipSection = document.getElementById('print-payment-slip')
        if (paymentSlipSection) {
          document.body.removeChild(paymentSlipSection)
        }
        var annualReportSection = document.getElementById('print-annual-report')
        if (annualReportSection) {
          document.body.removeChild(annualReportSection)
        }
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
  }
  select {
    border-bottom: 1px solid black !important;
    border-radius: 0 !important;
    height: 20px;
    min-height: 20px;
  }
  #receipt-preview-container {
    width: 794px;
    height: 559px;
    position: relative;
  }
  .receipt-preview-text {
    white-space: pre;
    width: 670px;
    height: 520px;
    /*border-style: solid;
    border-color: blue;*/
    font-family: "Times New Roman";
    font-size: 90%;
    letter-spacing: 95%;
    color: #16264C;
    line-height: 2;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  h1 {
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    margin: 0px;
    padding: 0px;
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
    padding: 0px;
    color: black;
  }
  .select-small {
    border-style: none;
    font-weight: bold;
    display: inline;
    height: 15px;
    margin: 0px;
    padding: 0px;
    color: black;
  }
  .input-small::placeholder {
    border-style: none;
    font-weight: normal;
    color: #16264C;
  }
  .is-invalid {
    border: dotted 1px red;
    /* To keep selects from getting wider when invalid */
    padding-right: 0 !important;
  }
  .input-small.is-invalid {
    background-image: url('~@/assets/invalid-red.png') !important;
  }
  .select-small.is-invalid {
    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right .75rem center/8px 10px,url('~@/assets/invalid-red.png') no-repeat center right 1.75rem/1.125rem 1.125rem;
  }
  .custom-select:disabled {
    color: #6c757d;
    background-color: #e9ecef;
  }
  .line-spacing-small {
    line-height: 1.3;
  }
  #outcomeInput {
    width: 140px;
  }
  #outcomeAsTextInput {
    width: 410px;
  }
  #outcomeAsTextInputPt2 {
    width: 255px;
  }
  #townInput {
    width: 180px;
  }
  #churchMunicipalityInput {
    width: 235px;
  }
  #reasonInput {
    width: 430px;
  }
  #payedInput {
    width: 293px;
  }
  #receivedInput {
    width: 230px;
  }
  #firstPartSelect {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #firstPosSelect {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #secondPartSelect {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #secondPosSelect {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #firstOutcomeInput {
    width: 92px;
  }
  #secondOutcomeInput {
    width: 92px;
  }
  #divContentEditable {
    -ms-flow-into: article;
    -webkit-flow-into: article;
    display: inline;
    font-weight: bold;
    font-size: 110% !important;
    line-height: 2 !important;
    min-height: 4 !important;
    color: black;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
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
    margin-top: 5px;
    position: absolute;
    right: 5px;
  }
  #clearSaveBtnsDiv {
    position: absolute;
    bottom: 15px;
    right: 50px;
  }
  #downloadPrintBtnsDiv {
    position: absolute;
    bottom: 15px;
    left: 50px;
  }
  .displayNone {
    display:none;
  }
  .outcomeAsTextDivWrapper {
    display: inline;
    font-weight: bold;
    color: black;
    font-size: 110% !important;
    line-height: 2 !important;
    min-height: 4 !important;
    white-space: nowrap;
    border-bottom: solid;
    border-width: 1px;
    display: inline-block;
    margin: 0;
  }
  #outcomeAsTextDivWrapper1 {
    height: 25px;
    width: 405px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    margin-bottom: -2px;
  }
  #outcomeAsTextDivWrapper2 {
    height: 25px;
    width: 670px;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: -3px;
    margin-top: -2px;
  }
  .disabledTextDiv {
    background-color: #ededed;
    max-height: 15px;
  }
</style>

<style>
  .datepickerInput {
    display: inline;
    border-style: none;
    border-bottom: 1px solid black;
    text-align: center;

    white-space: nowrap;
    width: 95px;
    max-height: 15px;
    padding: 0px;
    font-size: 110%;
    margin: 0px;
    color: red;
    font-weight: bold;
    padding: 0px;
    color: black;
  }
  .is-invalid .datepickerInput {    
    background-image: url('~@/assets/invalid-red.png');
    background-repeat: no-repeat;
    background-position: center right calc(2.25rem / 4);
    background-size: calc(2.25rem / 2) calc(2.25rem / 2);
  }
  .datepickerWrapper {
    display: inline;
    white-space: normal;
    height: 15px;
    margin: 0px;
    padding: 0px;
    width: 95px;
  }
  .datepickerWrapper > div:first-child {
    display: inline;
    width: 95px;
    margin: 0px;
    padding: 0px;
  }
  .datepickerCalendar {
    font-size: 120%;
    white-space: normal;
    z-index: 100;
    -webkit-transform: scale(0.7, 0.7) translate(650px, -65px); /* Safari and Chrome */
  }
  /* To get calendar cells smaller to avoid save and clear buttons from covering the popup*/
  .vdp-datepicker__calendar .cell {
    height: 35px !important;
    line-height: 35px !important;
    padding: 0 !important;
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
  }
</style>
