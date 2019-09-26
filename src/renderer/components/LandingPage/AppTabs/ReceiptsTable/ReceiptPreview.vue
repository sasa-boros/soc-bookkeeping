<template>       
  <b-container fluid id="receipt-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" v-if="show" no-validation>
      <b-button @click.stop="closeModal()" size="sm" variant="link" class="ignoreInPrint" id="modalCancelBtn">
        <img src="~@/assets/delete.png" class="btn-img ignoreInPrint">
      </b-button>
      <div class="receipt-preview-text">
        <h1> ПРИЗНАНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="outcomeInputFormGroup"><b-form-input ref="outcomeInput" v-model="form.outcome" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingOutcome }" id="outcomeInput" :disabled="defaultReceiptPreview" type="number" min="0" step=".01"></b-form-input></b-form-group> и словима  <div class="outcomeAsTextDivWrapper" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" contenteditable="false" id="outcomeAsTextDivWrapper1">{{generatedOutcomeTextLine1}}</div>
      <br/><div class="outcomeAsTextDivWrapper" contenteditable="false" v-bind:class="{'disabledTextDiv': defaultReceiptPreview}" id="outcomeAsTextDivWrapper2">{{generatedOutcomeTextLine2}}</div>
      <br/>динара, примљених из благајне Српске православне црквене општине <b-form-group class="input-form-group" ref="churchMunicipalityInputFormGroup"><b-form-input v-model="form.churchMunicipality" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingChurchMunicipality }" id="churchMunicipalityInput" type="text"></b-form-input></b-form-group><br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        П р и м и о,
                                                                                                          <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input disabled class="input-small" id="payedInput" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                        Да се исплати на терет расхода<datepicker id="dateInput" ref="dateInput" v-model="form.date" v-bind:class="{ 'is-invalid': attemptSubmit && missingDate }" :language="calendarLanguages.srCYRL" input-class="datepickerInput" wrapper-class="datepickerWrapper" calendar-class="datepickerCalendar"></datepicker>
                                                                                                          Парт. <b-form-group class="input-form-group" ref="firstPartInputFormGroup"><b-form-select v-model="form.firstPart" id="part1Select" :disabled="defaultReceiptPreview" :options="partOptions" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstPart && atLeastOnePartPosNotSet }" @blur.native="postDatepickerOnBlur"/></b-form-group> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup"><b-form-select v-model="form.firstPos" id="pos1Select" :disabled="defaultReceiptPreview || missingFirstPart" :options="pos1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstPos && atLeastOnePartPosNotSet }"/></b-form-group> дин. <b-form-group class="input-form-group" ref="firstOutcomeInputFormGroup"><b-form-input v-model="form.firstOutcome" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstOutcome && atLeastOnePartPosNotSet }" id="firstOutcomeInput" :disabled="defaultReceiptPreview || missingFirstPart" type="number" min="0" step=".01"></b-form-input></b-form-group>
                 Исплатио благајник,                                                      Парт. <b-form-group class="input-form-group" ref="secondPartInputFormGroup"><b-form-select v-model="form.secondPart" id="part2Select" :disabled="defaultReceiptPreview" :options="partOptions" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondPart && atLeastOnePartPosNotSet }"/></b-form-group> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup"><b-form-select v-model="form.secondPos" id="pos2Select" :disabled="defaultReceiptPreview || missingSecondPart" :options="pos2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondPos && atLeastOnePartPosNotSet }"/></b-form-group> дин. <b-form-group class="input-form-group" ref="secondOutcomeInputFormGroup"><b-form-input v-model="form.secondOutcome" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondOutcome && atLeastOnePartPosNotSet }" id="secondOutcomeInput" :disabled="defaultReceiptPreview || missingSecondPart" type="number" min="0" step=".01"></b-form-input></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input v-model="form.received" class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalOutcomeInputFormGroup"><b-form-input disabled v-model="form.outcome" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && ( missingTotalOutcome || totalOutcomeNotValid ) }" id="totalOutcomeInput" :disabled="defaultReceiptPreview" type="number" min="0" step=".01"></b-form-input></b-form-group>
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
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
              
      <b-tooltip ref="outcomeInputTooltip" :disabled.sync="disableOutcomeTooltip" :target="() => $refs.outcomeInputFormGroup">
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
          {{phrases.atLeastOnePartPosOutcome}}
        </div>
      </b-tooltip>

      <b-tooltip ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip" :target="() => $refs.firstPosInputFormGroup">
        <div class="tooltipInnerText">
          {{firstPosTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="firstOutcomeInputTooltip" :disabled.sync="disableFirstOutcomeTooltip" :target="() => $refs.firstOutcomeInputFormGroup">
        <div class="tooltipInnerText">
          {{firstOutcomeTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip" :target="() => $refs.secondPartInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.atLeastOnePartPosOutcome}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip" :target="() => $refs.secondPosInputFormGroup">
        <div class="tooltipInnerText">
          {{secondPosTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondOutcomeInputTooltip" :disabled.sync="disableSecondOutcomeTooltip" :target="() => $refs.secondOutcomeInputFormGroup">
        <div class="tooltipInnerText">
          {{secondOutcomeTooltipText}}
        </div>
      </b-tooltip>


      <b-tooltip ref="totalOutcomeInputTooltip" :disabled.sync="disableTotalOutcomeTooltip" :target="() => $refs.totalOutcomeInputFormGroup">
        <div class="tooltipInnerText">
          {{totalOutcomeTooltipText}}
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
  import store from '@/store'
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  const outcomeCodeController = require('../../../../controllers/outcomeCodeController')
  const receiptController = require('../../../../controllers/receiptController')
  const { numberToSerbianDinars, getLastNYears, getCodeCombinations, showErrorDialog } = require('../../../../utils/utils')
  const i18n = require('../../../../translations/i18n')

  export default {
    store: store,
    props: {
      item: {
        type: Object,
        default: function () {
          return {
            ordinal: null,
            annualReportPage: null,
            date: null,
            firstPart: null,
            firstPos: null,
            firstOutcome: null,
            secondPart: null,
            secondPos: null,
            secondOutcome: null,
            outcome: null,
            outcomeAsText: null,
            churchMunicipality: null,
            town: null,
            reason: null,
            received: null
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
        outcomeCodes: null,
        outcomeCodeCombinations: null,
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosOutcome: i18n.getTranslation('Enter at least one partition, position, outcome'),
          enterPartition: i18n.getTranslation('Enter partition'),
          needsToBeEqualToSum: i18n.getTranslation('Needs to equal to sum of outcomes by partitions and position')
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

      outcomeCodeController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodes = (res.data || [])
          self.outcomeCodeCombinations = getCodeCombinations(self.outcomeCodes)
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
        if (this.outcomeCodeCombinations) {
          const allowedPosValues = this.outcomeCodeCombinations[newValue]
          if (!allowedPosValues || allowedPosValues.indexOf(this.form.firstPos) === -1) {
            /* Pos value needs to be reset since it is not allowed with the new part */
            this.form.firstPos = ''
          }
        }
        /* If new value is null, i.e. the part is reset, reset the outcome too */
        if (!newValue) {
          this.form.firstOutcome = null
        }
      },
      'form.secondPart': function (newValue) {
        if (this.outcomeCodeCombinations) {
          const allowedPosValues = this.outcomeCodeCombinations[newValue]
          if (!allowedPosValues || allowedPosValues.indexOf(this.form.secondPos) === -1) {
            /* Pos value needs to be reset since it is not allowed with the new part */
            this.form.secondPos = ''
          }
        }
        /* If new value is null, i.e. the part is reset, reset the outcome too */
        if (!newValue) {
          this.form.secondOutcome = null
        }
      }
    },
    computed: {
      ...mapState(
        {
          defaultForm: state => state.DefaultValues.receiptForm,
          emptyForm: state => state.DefaultValues.emptyReceiptForm
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
          return !this.missingOutcome || !this.attemptSubmit
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
      disableFirstOutcomeTooltip: {
        get: function () {
          if (this.missingFirstPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingFirstOutcome || !this.attemptSubmit
          }
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
      disableSecondOutcomeTooltip: {
        get: function () {
          if (this.missingSecondPart) {
            /* If missing part, pos is disabled, so show the tooltip */
            return false
          } else {
            return !this.atLeastOnePartPosNotSet || !this.missingSecondOutcome || !this.attemptSubmit
          }
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
          return (!this.missingTotalOutcome && !this.totalOutcomeNotValid) || !this.attemptSubmit
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
        if (!this.outcomeCodeCombinations) {
          return []
        }
        var keys = Object.keys(this.outcomeCodeCombinations)
        return keys
      },
      pos1Options: function () {
        if (!this.outcomeCodeCombinations) {
          return []
        }
        return this.outcomeCodeCombinations[this.form.firstPart]
      },
      pos2Options: function () {
        if (!this.outcomeCodeCombinations) {
          return []
        }
        return this.outcomeCodeCombinations[this.form.secondPart]
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
      missingOutcome: function () {
        return !this.form || !this.form.outcome || this.form.outcome.toString().trim() === ''
      },
      missingFirstPart: function () {
        return !this.form || !this.form.firstPart
      },
      missingFirstPos: function () {
        /* OutcomeCodeCombinations may not be ready right away */
        if (this.outcomeCodeCombinations) {
          /* Empty string is not considered missing if it is an allowed pos for a given part */
          const allowedPosValues = this.outcomeCodeCombinations[this.form.firstPart]
          return !this.form || !allowedPosValues || (allowedPosValues.indexOf(this.form.firstPos) === -1)
        } else {
          return false
        }
      },
      missingFirstOutcome: function () {
        return !this.form || !this.form.firstOutcome || this.form.firstOutcome.toString().trim() === ''
      },
      missingSecondPart: function () {
        return !this.form || !this.form.secondPart
      },
      missingSecondPos: function () {
        /* OutcomeCodeCombinations may not be ready right away */
        if (this.outcomeCodeCombinations) {
          /* Empty string is not considered missing if it is an allowed pos for a given part */
          const allowedPosValues = this.outcomeCodeCombinations[this.form.secondPart]
          return !this.form || !allowedPosValues || (allowedPosValues.indexOf(this.form.secondPos) === -1)
        } else {
          return false
        }
      },
      missingSecondOutcome: function () {
        return !this.form || !this.form.secondOutcome || this.form.secondOutcome.toString().trim() === ''
      },
      missingTotalOutcome: function () {
        return !this.form || !this.form.outcome || this.form.outcome.toString().trim() === ''
      },
      totalOutcomeNotValid: function () {
        if (this.form && this.form.outcome) {
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
        const firstCombinationSet = !this.missingFirstPart && !this.missingFirstPos && !this.missingFirstOutcome
        const secondCombinationSet = !this.missingSecondPart && !this.missingSecondPos && !this.missingSecondOutcome

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
        const receipt = this.createReceiptObj()
        if (this.defaultReceiptPreview) {
          /* Set the default values for receipts */
          this.$store.dispatch('SET_DEFAULT_RECEIPT', receipt)
          if (this.parentModal) {
            this.$root.$emit('bv::hide::modal', this.parentModal)
          }
        } else {
          this.setAttemptSubmit(true)
          if (this.checkForm()) {
            if (this.form._id) {
              /* Update the item */
              receiptController.updateReceipt(receipt).then((res) => {
                if (!res.err) {
                  this.$root.$emit('bv::refresh::table', 'receipts-table')
                } else {
                  showErrorDialog(res.err)
                }
              })
            } else {
              /* Create new item */
              receiptController.createReceipt(receipt).then((res) => {
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
      createReceiptObj () {
        var receipt = {}
        receipt.date = this.form.date
        receipt.outcome = this.form.outcome
        receipt.outcomeAsText = this.generatedOutcomeText
        receipt.churchMunicipality = this.form.churchMunicipality
        receipt.town = this.form.town
        receipt.reason = this.form.reason
        receipt.received = this.form.received
        receipt.outcomesPerCode = []
        const firstOutcomeCode = this.outcomeCodes.find(outcomeCode => {
          return outcomeCode.partition === this.form.firstPart && outcomeCode.position === this.form.firstPos
        })
        const secondOutcomeCode = this.outcomeCodes.find(outcomeCode => {
          return outcomeCode.partition === this.form.secondPart && outcomeCode.position === this.form.secondPos
        })
        if (firstOutcomeCode.length > 0) {
          receipt.outcomesPerCode.push({outcomeCode: firstOutcomeCode, outcome: this.form.firstOutcome})
        }
        if (secondOutcomeCode.length > 0) {
          receipt.outcomesPerCode.push({outcomeCode: secondOutcomeCode, outcome: this.form.secondOutcome})
        }
        return receipt
      },
      resetModal () {
        this.resetForm()
        /* Focus the first input field */
        console.log(this.$refs.outcomeInput)
        // this.$refs.outcomeInput.focus()
        /* Trick to reset/clear native browser form validation state */
        this.show = false
        this.$nextTick(() => { this.show = true })
      },
      clearForm () {
        this.form = JSON.parse(JSON.stringify(this.emptyForm))
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
  #printBtnDiv {
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
      /*
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
