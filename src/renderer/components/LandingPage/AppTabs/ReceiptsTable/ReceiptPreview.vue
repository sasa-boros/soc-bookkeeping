<template>       
  <b-container fluid id="receipt-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" v-if="show" no-validation>
      <b-button @click.stop="closeModal()" size="sm" variant="link" class="ignoreInPrint" id="modalCancelBtn">
        <img src="~@/assets/delete.png" class="btn-img ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="amountInputFormGroup"><b-form-input ref="amountInput" v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="amountInput" :disabled="defaultReceiptPreview" type="number" min="0" step=".01"></b-form-input></b-form-group> и словима  <div class="amountTextDivWrapper" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" contenteditable="false" id="amountTextDivWrapper1">{{generatedAmountTextLine1}}</div>
      <br/><div class="amountTextDivWrapper" contenteditable="false" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" id="amountTextDivWrapper2">{{generatedAmountTextLine2}}</div>
      <br/>динара, примљених из благајне Српске православне црквене општине <b-form-group class="input-form-group" ref="churchMunicipalityInputFormGroup"><b-form-input v-model="form.churchMunicipality" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingChurchMunicipality }" id="churchMunicipalityInput" type="text"></b-form-input></b-form-group><br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        П р и м и о,
                                                                                                          <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input v-model="form.payed" class="input-small" id="payedInput" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                        Да се исплати на терет расхода<datepicker id="dateInput" ref="dateInput" v-model="form.date" v-bind:class="{ 'is-invalid': attemptSubmit && missingDate }" :language="calendarLanguages.srCYRL" input-class="datepickerInput" wrapper-class="datepickerWrapper" calendar-class="datepickerCalendar"></datepicker>
                                                                                                          Парт. <b-form-group class="input-form-group" ref="firstPartInputFormGroup"><b-form-select v-model="form.firstPart" id="part1Select" :disabled="defaultReceiptPreview" :options="partOptions" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstPart && atLeastOnePartPosNotSet }" @blur.native="postDatepickerOnBlur"/></b-form-group> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup"><b-form-select v-model="form.firstPos" id="pos1Select" :disabled="defaultReceiptPreview || missingFirstPart" :options="pos1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstPos && atLeastOnePartPosNotSet }"/></b-form-group> дин. <b-form-group class="input-form-group" ref="firstAmountInputFormGroup"><b-form-input v-model="form.firstAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstAmount && atLeastOnePartPosNotSet }" id="firstAmountInput" :disabled="defaultReceiptPreview || missingFirstPart" type="number" min="0" step=".01"></b-form-input></b-form-group>
                 Исплатио благајник,                                                      Парт. <b-form-group class="input-form-group" ref="secondPartInputFormGroup"><b-form-select v-model="form.secondPart" id="part2Select" :disabled="defaultReceiptPreview" :options="partOptions" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondPart && atLeastOnePartPosNotSet }"/></b-form-group> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup"><b-form-select v-model="form.secondPos" id="pos2Select" :disabled="defaultReceiptPreview || missingSecondPart" :options="pos2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondPos && atLeastOnePartPosNotSet }"/></b-form-group> дин. <b-form-group class="input-form-group" ref="secondAmountInputFormGroup"><b-form-input v-model="form.secondAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondAmount && atLeastOnePartPosNotSet }" id="secondAmountInput" :disabled="defaultReceiptPreview || missingSecondPart" type="number" min="0" step=".01"></b-form-input></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input v-model="form.received" class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalAmountInputFormGroup"><b-form-input v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="totalAmountInput" :disabled="defaultReceiptPreview" type="number" min="0" step=".01"></b-form-input></b-form-group>
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input v-model="form.municipalityPresident" class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>


  



      

      </div>
      <div id="printBtnDiv">
        <b-button ref="receiptPrintBtn" @click.stop="printReceipt()" variant="secondary" class="ignoreInPrint" :class="{ 'displayNone' : defaultReceiptPreview }">
          <img src="~@/assets/print.png" class="btn-img ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button ref="receiptSaveBtn" type="submit" variant="secondary" class="ignoreInPrint">
          <img src="~@/assets/save1.png" class="btn-img ignoreInPrint">
        </b-button>
        <b-button ref="receiptClearBtn" @click.stop="clearForm()" variant="secondary" class="ignoreInPrint">
          <img src="~@/assets/clear.png" class="btn-img ignoreInPrint">
        </b-button>
      </div>
              
      <b-tooltip ref="amountInputTooltip" :disabled.sync="disableAmountTooltip" :target="() => $refs.amountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="townInputTooltip" :disabled.sync="disableTownTooltip" :target="() => $refs.townInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="churchMunicipalityInputTooltip" :disabled.sync="disableChurchMunicipalityTooltip" :target="() => $refs.churchMunicipalityInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip" :target="() => $refs.reasonInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>


      <b-tooltip ref="firstPartInputTooltip" :disabled.sync="disableFirstPartTooltip" :target="() => $refs.firstPartInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.atLeastOnePartPosAmount}}
        </div>
      </b-tooltip>

      <b-tooltip ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip" :target="() => $refs.firstPosInputFormGroup">
        <div class="tooltipInnerText">
          {{firstPosTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="firstAmountInputTooltip" :disabled.sync="disableFirstAmountTooltip" :target="() => $refs.firstAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{firstAmountTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip" :target="() => $refs.secondPartInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.atLeastOnePartPosAmount}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip" :target="() => $refs.secondPosInputFormGroup">
        <div class="tooltipInnerText">
          {{secondPosTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondAmountInputTooltip" :disabled.sync="disableSecondAmountTooltip" :target="() => $refs.secondAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{secondAmountTooltipText}}
        </div>
      </b-tooltip>


      <b-tooltip ref="totalAmountInputTooltip" :disabled.sync="disableTotalAmountTooltip" :target="() => $refs.totalAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="dateInputTooltip" :disabled.sync="disableDateTooltip" :target="() => $refs.dateInput">
        <div class="tooltipInnerText">
          {{phrases.pickDate}}
        </div>
      </b-tooltip>

      <b-tooltip ref="annualReportPageInputTooltip" :disabled.sync="disableAnnualReportPageTooltip" :target="() => $refs.annualReportPageInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.willBeGenerated}}
        </div>
      </b-tooltip>

      <b-tooltip ref="ordinalInputTooltip" :disabled.sync="disableOrdinalTooltip" :target="() => $refs.ordinalInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.willBeGenerated}}
        </div>
      </b-tooltip>

      <b-tooltip ref="receiptPrintBtnTooltip" :target="() => $refs.receiptPrintBtn">
        <div class="tooltipInnerText">
          {{phrases.print}}
        </div>
      </b-tooltip>

      <b-tooltip ref="receiptSaveBtnTooltip" :target="() => $refs.receiptSaveBtn">
        <div class="tooltipInnerText">
          {{phrases.save}}
        </div>
      </b-tooltip>

      <b-tooltip ref="receiptClearBtnTooltip" :target="() => $refs.receiptClearBtn">
        <div class="tooltipInnerText">
          {{phrases.clear}}
        </div>
      </b-tooltip>
    </b-form>
  </b-container>
</template>

<script>
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  const receiptsController = require('../../../../controllers/receipt.controller')
  const annualReportController = require('../../../../controllers/annualReport.controller')
  const { numberToSerbianDinars, getLastNYears, getCodeCombinations, getCodeCombinationsForRendering, showErrorDialog } = require('../../../../utils/utils')
  const i18n = require('../../../../translations/i18n')

  export default {
    props: {
      item: {
        type: Object,
        default: function () {
          return {
            amount: null,
            reason: null,
            town: null,
            churchMunicipality: null,
            amountText: null,
            payed: null,
            received: null,
            firstPart: '',
            firstPos: '',
            firstAmount: null,
            secondPart: '',
            secondPos: '',
            secondAmount: null,
            annualReportPage: null,
            ordinal: null,
            municipalityPresident: null,
            date: null,
            created_at: null,
            updated_at: null
          }
        }
      },
      newlyOpened: {
        type: Boolean,
        default: true
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
        attemptSubmit: !this.newlyOpened,
        fresh: this.newlyOpened,
        show: true,
        yearSelected: null,
        preDatepickerJustBlurred: false,
        postDatepickerJustBlurred: false,
        incomeCodeCombinations: null,
        incomeCodeCombinationsForRendering: {
          '': ['']
        },
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosAmount: i18n.getTranslation('Enter at least one partition, position, amount'),
          enterPartition: i18n.getTranslation('Enter partition')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        }
      }
    },
    created () {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      const self = this

      annualReportController.getIncomeCodes().then(function (res) {
        if (!res.err) {
          self.incomeCodeCombinations = getCodeCombinations(Object.keys(res.data))
          self.incomeCodeCombinationsForRendering = getCodeCombinationsForRendering(Object.keys(res.data))
        } else {
          showErrorDialog(res.err)
        }
      })
    },
    watch: {
      item: function () {
        /* Deep clone the item using JSON parsing */
        if (this.item) {
          this.form = JSON.parse(JSON.stringify(this.item))
        } else {
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
        }
      },
      newlyOpened: function () {
        /* If the form is reseted from the parent component */
        if (this.newlyOpened) {
          this.attemptSubmit = false
          this.fresh = true
          this.resetModal()
          /* Needs to be stale, so that any reset from the parent will be detected */
          this.$emit('update:newlyOpened', false)
        }
      },
      'form.firstPart': function (newValue) {
        if (this.incomeCodeCombinations) {
          const allowedPosValues = this.incomeCodeCombinations[newValue]
          if (!allowedPosValues || allowedPosValues.indexOf(this.form.firstPos) === -1) {
            /* Pos value needs to be reset since it is not allowed with the new part */
            this.form.firstPos = ''
          }
        }
        /* If new value is null, i.e. the part is reset, reset the amount too */
        if (!newValue) {
          this.form.firstAmount = null
        }
      },
      'form.secondPart': function (newValue) {
        if (this.incomeCodeCombinations) {
          const allowedPosValues = this.incomeCodeCombinations[newValue]
          if (!allowedPosValues || allowedPosValues.indexOf(this.form.secondPos) === -1) {
            /* Pos value needs to be reset since it is not allowed with the new part */
            this.form.secondPos = ''
          }
        }
        /* If new value is null, i.e. the part is reset, reset the amount too */
        if (!newValue) {
          this.form.secondAmount = null
        }
      }
    },
    computed: {
      ...mapState(
        {
          defaultForm: state => state.DefaultValues.defaultReceipt,
          emptyForm: state => state.DefaultValues.emptyReceipt
        }
      ),
      generatedAmountText: {
        get: function () {
          var placeholder = ''
          if (this.form) {
            var generatedText = numberToSerbianDinars(this.form.amount)
            if (!generatedText) {
              return placeholder
            } else {
              this.form.amountText = generatedText
              return generatedText
            }
          } else {
            return placeholder
          }
        },
        set: function (newValue) {
        }
      },
      generatedAmountTextLine1: {
        get: function () {
          if (this.generatedAmountText.length <= 52) {
            return this.generatedAmountText
          }
          const firstSubstring = this.generatedAmountText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedAmountText.substring(0, spaceInd)
          } else {
            return this.generatedAmountText.substring(0, 52)
          }
        },
        set: function (newValue) {
        }
      },
      generatedAmountTextLine2: {
        get: function () {
          if (this.generatedAmountText.length <= 52) {
            return ''
          }
          const firstSubstring = this.generatedAmountText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedAmountText.substring(spaceInd)
          } else {
            return this.generatedAmountText.substring(52)
          }
        },
        set: function (newValue) {
        }
      },
      firstPosTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosAmount
        }
      },
      firstAmountTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosAmount
        }
      },
      secondPosTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosAmount
        }
      },
      secondAmountTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosAmount
        }
      },
      disableAmountTooltip: {
        get: function () {
          return !this.missingAmount || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.amountInputTooltip.$emit('close')
          }
        }
      },
      disableTownTooltip: {
        get: function () {
          return !this.missingTown || !this.attemptSubmit
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
          return !this.missingChurchMunicipality || !this.attemptSubmit
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
          return !this.missingReason || !this.attemptSubmit
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
          return !this.atLeastOnePartPosNotSet || !this.missingFirstPart || !this.attemptSubmit
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
          if (this.missingFirstPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingFirstPos || !this.attemptSubmit
          }
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.firstPosInputTooltip.$emit('close')
          }
        }
      },
      disableFirstAmountTooltip: {
        get: function () {
          if (this.missingFirstPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingFirstAmount || !this.attemptSubmit
          }
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.firstAmountInputTooltip.$emit('close')
          }
        }
      },
      disableSecondPartTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.missingSecondPart || !this.attemptSubmit
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
          if (this.missingSecondPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingSecondPos || !this.attemptSubmit
          }
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.secondPosInputTooltip.$emit('close')
          }
        }
      },
      disableSecondAmountTooltip: {
        get: function () {
          if (this.missingSecondPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingSecondAmount || !this.attemptSubmit
          }
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.secondAmountInputTooltip.$emit('close')
          }
        }
      },
      disableTotalAmountTooltip: {
        get: function () {
          return !this.missingTotalAmount || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.totalAmountInputTooltip.$emit('close')
          }
        }
      },
      disableDateTooltip: {
        get: function () {
          return !this.missingDate || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.dateInputTooltip.$emit('close')
          }
        }
      },
      disableAnnualReportPageTooltip: {
        get: function () {
          return !this.missingAnnualReportPage
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.annualReportPageInputTooltip.$emit('close')
          }
        }
      },
      disableOrdinalTooltip: {
        get: function () {
          return !this.missingOrdinal
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.ordinalInputTooltip.$emit('close')
          }
        }
      },
      yearOptions: function () {
        return getLastNYears(10)
      },
      partOptions: function () {
        const options = Object.keys(this.incomeCodeCombinationsForRendering)
        const i = options.indexOf('')
        if (i > -1) {
          options.splice(i)
          options.unshift('')
        }
        return options
      },
      pos1Options: function () {
        return this.incomeCodeCombinationsForRendering[this.form.firstPart]
      },
      pos2Options: function () {
        return this.incomeCodeCombinationsForRendering[this.form.secondPart]
      },
      missingReason: function () {
        return !this.form || !this.form.reason || this.form.reason.toString().trim() === ''
      },
      missingTown: function () {
        return !this.form || !this.form.town || this.form.town.toString().trim() === ''
      },
      missingChurchMunicipality: function () {
        return !this.form || !this.form.churchMunicipality || this.form.churchMunicipality.toString().trim() === ''
      },
      missingAmount: function () {
        return !this.form || !this.form.amount || this.form.amount.toString().trim() === ''
      },
      missingFirstPart: function () {
        return !this.form || !this.form.firstPart
      },
      missingFirstPos: function () {
        /* IncomeCodeCombinations may not be ready right away */
        if (this.incomeCodeCombinations) {
          /* Empty string is not considered missing if it is an allowed pos for a given part */
          const allowedPosValues = this.incomeCodeCombinations[this.form.firstPart]
          return !this.form || !allowedPosValues || (allowedPosValues.indexOf(this.form.firstPos) === -1)
        } else {
          return false
        }
      },
      missingFirstAmount: function () {
        return !this.form || !this.form.firstAmount || this.form.firstAmount.toString().trim() === ''
      },
      missingSecondPart: function () {
        return !this.form || !this.form.secondPart
      },
      missingSecondPos: function () {
        /* IncomeCodeCombinations may not be ready right away */
        if (this.incomeCodeCombinations) {
          /* Empty string is not considered missing if it is an allowed pos for a given part */
          const allowedPosValues = this.incomeCodeCombinations[this.form.secondPart]
          return !this.form || !allowedPosValues || (allowedPosValues.indexOf(this.form.secondPos) === -1)
        } else {
          return false
        }
      },
      missingSecondAmount: function () {
        return !this.form || !this.form.secondAmount || this.form.secondAmount.toString().trim() === ''
      },
      missingTotalAmount: function () {
        return !this.form || !this.form.amount || this.form.amount.toString().trim() === ''
      },
      missingDate: function () {
        return !this.form || !this.form.date
      },
      missingAnnualReportPage: function () {
        return !this.form || !this.form.annualReportPage
      },
      missingOrdinal: function () {
        return !this.form || !this.form.ordinal
      },
      atLeastOnePartPosNotSet: function () {
        /* True if not a single part-pos combination is set. At least one combination should be set. */
        const firstCombinationSet = !this.missingFirstPart && !this.missingFirstPos && !this.missingFirstAmount
        const secondCombinationSet = !this.missingSecondPart && !this.missingSecondPos && !this.missingSecondAmount

        return !firstCombinationSet && !secondCombinationSet
      }
    },
    methods: {
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
      setAttemptSubmit (val) {
        this.attemptSubmit = val
        /* Sync the prop used by the parent */
        this.$emit('update:newlyOpened', !val)
      },
      onSubmit (evt) {
        evt.preventDefault()
        if (this.defaultReceiptPreview) {
          /* Set the default values for receipts */
          this.$store.dispatch('SET_DEFAULT_RECEIPT', this.form)
          if (this.parentModal) {
            this.$root.$emit('bv::hide::modal', this.parentModal)
          }
        } else {
          this.setAttemptSubmit(true)
          if (this.checkForm()) {
            if (this.form._id) {
              /* Update the item */
              receiptsController.updateReceipt(this.form).then((res) => {
                if (!res.err) {
                  this.$root.$emit('bv::refresh::table', 'receipts-table')
                } else {
                  showErrorDialog(res.err)
                }
              })
            } else {
              /* Create new item */
              receiptsController.createReceipt(this.form).then((res) => {
                if (!res.err) {
                  this.$root.$emit('bv::refresh::table', 'receipts-table')
                } else {
                  showErrorDialog(res.err)
                }
              })
            }
            this.resetModal()
            if (this.parentModal) {
              this.$root.$emit('bv::hide::modal', this.parentModal)
            }
          }
        }
      },
      resetModal () {
        this.resetForm()
        /* Focus the first input field */
        console.log(this.$refs.amountInput)
        // this.$refs.amountInput.focus()
        /* Trick to reset/clear native browser form validation state */
        this.show = false
        this.$nextTick(() => { this.show = true })
      },
      clearForm () {
        this.form = JSON.parse(JSON.stringify(this.emptyForm))
      },
      checkForm () {
        if (!this.form.amount ||
            !this.form.reason ||
            !this.form.town ||
            !this.form.churchMunicipality ||
            this.atLeastOnePartPosNotSet ||
            !this.form.date) {
          return false
        }
        return true
      },
      resetForm () {
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.setAttemptSubmit(false)
      },
      printReceipt () {
        const modal = document.getElementById('receipt-preview-container')
        const cloned = modal.cloneNode(true)
        let section = document.getElementById('print')

        if (!section) {
          section = document.createElement('div')
          section.id = 'print'
          document.body.appendChild(section)
        }

        section.innerHTML = ''
        section.appendChild(cloned)
        window.print()
      },
      closeModal () {
        if (this.parentModal) {
          this.$root.$emit('bv::hide::modal', this.parentModal)
        }
        this.resetModal()
      }
    },
    components: { Datepicker }
  }
</script>

<style scoped>
  input {
    text-align: center;
    /* Immitate the underline in the real receipt */
    border-bottom: 1px solid black !important;
    border-radius: 0 !important;
  }
  .tooltipInnerText {
    font-size: 95%;
    line-height: 1;
    margin: 1px;
  }
  #receipt-preview-container {
    width: 794px;
    height: 559px;
    border-style: solid;
    border-width: thin;
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
  #amountInput {
    width: 140px;
  }
  #amountTextInput {
    width: 410px;
  }
  #amountTextInputPt2 {
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
  #yearSelect {
    width: 95px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #part1Select {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #pos1Select {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #part2Select {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #pos2Select {
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #firstAmountInput {
    width: 92px;
  }
  #secondAmountInput {
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
  #totalAmountInput {
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
  #printBtnDiv {
    position: absolute;
    bottom: 15px;
    left: 50px;
  }
  .displayNone {
    display:none;
  }
  .amountTextDivWrapper {
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
  #amountTextDivWrapper1 {
    height: 25px;
    width: 405px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    margin-bottom: -2px;
  }
  #amountTextDivWrapper2 {
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
      position:absolute;
      left:0;
      top:0;
    }
    .ignoreInPrint {
      visibility:hidden !important;
    }
  }
</style>
