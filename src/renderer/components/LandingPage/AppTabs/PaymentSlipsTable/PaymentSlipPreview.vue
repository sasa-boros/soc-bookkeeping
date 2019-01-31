<template>       
  <b-container fluid id="payment-slip-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" v-if="show" no-validation>
      <b-button @click.stop="closeModal()" size="sm" variant="link" class="ignoreInPrint" id="modalCancelBtn">
        <img src="~@/assets/delete.png" class="btn-img ignoreInPrint">
      </b-button>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="amountInputFormGroup"><b-form-input ref="amountInput" v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="amountInput" :disabled="defaultPaymentSlipPreview" type="number" min="0" step=".01"></b-form-input></b-form-group> и словима  <div class="amountTextDivWrapper" v-bind:class="{'disabledTextDiv': defaultPaymentSlipPreview}" contenteditable="false" id="amountTextDivWrapper1">{{generatedAmountTextLine1}}</div>
      <br/><div class="amountTextDivWrapper" contenteditable="false" v-bind:class="{'disabledTextDiv': defaultPaymentSlipPreview}" id="amountTextDivWrapper2">{{generatedAmountTextLine2}}</div>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input v-model="form.payed" v-bind:class="{ 'is-invalid': attemptSubmit && missingPayed }" class="input-small" id="payedInput" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за <datepicker id="dateInput" ref="dateInput" v-model="form.date" v-bind:class="{ 'is-invalid': attemptSubmit && missingDate }" :language="calendarLanguages.srCYRL" input-class="datepickerInput" wrapper-class="datepickerWrapper" calendar-class="datepickerCalendar"></datepicker>г.
                                                                                                            Парт. <b-form-group class="input-form-group"><b-form-select v-model="form.firstPart" @change="onFirstPartChange()" id="part1Select" :disabled="defaultPaymentSlipPreview" :options="partOptions" size="sm" class="input-small" @blur.native="postDatepickerOnBlur"/></b-form-group> поз. <b-form-group class="input-form-group"><b-form-select v-model="form.firstPos" id="pos1Select" :disabled="defaultPaymentSlipPreview" :options="pos1Options" size="sm" class="input-small"/></b-form-group> дин. <b-form-group class="input-form-group" ref="firstAmountInputFormGroup"><b-form-input v-model="form.firstAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstAmount }" id="firstAmountInput" :disabled="defaultPaymentSlipPreview" type="number" min="0" step=".01"></b-form-input></b-form-group>
                  Примио благајник,                                                          Парт. <b-form-group class="input-form-group"><b-form-select v-model="form.secondPart" @change="onSecondPartChange()" id="part2Select" :disabled="defaultPaymentSlipPreview" :options="partOptions" size="sm" class="input-small"/></b-form-group> поз. <b-form-group class="input-form-group"><b-form-select v-model="form.secondPos" id="pos2Select" :disabled="defaultPaymentSlipPreview" :options="pos2Options" size="sm" class="input-small"/></b-form-group> дин. <b-form-group class="input-form-group" ref="secondAmountInputFormGroup"><b-form-input v-model="form.secondAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondAmount }" id="secondAmountInput" :disabled="defaultPaymentSlipPreview" type="number" min="0" step=".01"></b-form-input></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input v-model="form.received" v-bind:class="{ 'is-invalid': attemptSubmit && missingReceived }" class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                    Свега дин. <b-form-group class="input-form-group" ref="totalAmountInputFormGroup"><b-form-input v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="totalAmountInput" :disabled="defaultPaymentSlipPreview" type="number" min="0" step=".01"></b-form-input></b-form-group>
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input v-model="form.municipalityPresident" v-bind:class="{ 'is-invalid': attemptSubmit && missingMunicipalityPresident }" class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>


  



      

      </div>
      <div id="printBtnDiv">
        <b-button ref="paymentSlipPrintBtn" @click.stop="printPaymentSlip()" variant="secondary" class="ignoreInPrint" :class="{ 'displayNone' : defaultPaymentSlipPreview }">
          <img src="~@/assets/print.png" class="btn-img ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button ref="paymentSlipSaveBtn" type="submit" variant="secondary" class="ignoreInPrint">
          <img src="~@/assets/save1.png" class="btn-img ignoreInPrint">
        </b-button>
        <b-button ref="paymentSlipClearBtn" @click.stop="clearForm()" variant="secondary" class="ignoreInPrint">
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

      <b-tooltip ref="reasonInputTooltip" :disabled.sync="disableReasonTooltip" :target="() => $refs.reasonInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="payedInputTooltip" :disabled.sync="disablePayedTooltip" :target="() => $refs.payedInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="receivedInputTooltip" :disabled.sync="disableReceivedTooltip" :target="() => $refs.receivedInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="firstAmountInputTooltip" :disabled.sync="disableFirstAmountTooltip" :target="() => $refs.firstAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="secondAmountInputTooltip" :disabled.sync="disableSecondAmountTooltip" :target="() => $refs.secondAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="totalAmountInputTooltip" :disabled.sync="disableTotalAmountTooltip" :target="() => $refs.totalAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip ref="municipalityPresidentInputTooltip" :disabled.sync="disableMunicipalityPresidentTooltip" :target="() => $refs.municipalityPresidentInputFormGroup">
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

      <b-tooltip ref="paymentSlipPrintBtnTooltip" :target="() => $refs.paymentSlipPrintBtn">
        <div class="tooltipInnerText">
          {{phrases.print}}
        </div>
      </b-tooltip>

      <b-tooltip ref="paymentSlipSaveBtnTooltip" :target="() => $refs.paymentSlipSaveBtn">
        <div class="tooltipInnerText">
          {{phrases.save}}
        </div>
      </b-tooltip>

      <b-tooltip ref="paymentSlipClearBtnTooltip" :target="() => $refs.paymentSlipClearBtn">
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
  const paymentSlipsController = require('../../../../controllers/paymentSlip.controller')
  const annualReportController = require('../../../../controllers/annualReport.controller')
  const { numberToSerbianDinars, getLastNYears, getCodeCombinations, showErrorDialog } = require('../../../../utils/utils')
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
      defaultPaymentSlipPreview: {
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
        outcomeCodeCombinations: {
          '': ['']
        },
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date')
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

      annualReportController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodeCombinations = getCodeCombinations(Object.keys(res.data))
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
      }
    },
    computed: {
      ...mapState(
        {
          defaultForm: state => state.DefaultValues.defaultPaymentSlip,
          emptyForm: state => state.DefaultValues.emptyPaymentSlip
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
      disablePayedTooltip: {
        get: function () {
          return !this.missingPayed || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.payedInputTooltip.$emit('close')
          }
        }
      },
      disableReceivedTooltip: {
        get: function () {
          return !this.missingReceived || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.receivedInputTooltip.$emit('close')
          }
        }
      },
      disableFirstAmountTooltip: {
        get: function () {
          return !this.missingFirstAmount || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.firstAmountInputTooltip.$emit('close')
          }
        }
      },
      disableSecondAmountTooltip: {
        get: function () {
          return !this.missingSecondAmount || !this.attemptSubmit
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
      disableMunicipalityPresidentTooltip: {
        get: function () {
          return !this.missingMunicipalityPresident || !this.attemptSubmit
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.municipalityPresidentInputTooltip.$emit('close')
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
        return Object.keys(this.outcomeCodeCombinations)
      },
      pos1Options: function () {
        return this.outcomeCodeCombinations[this.form.firstPart]
      },
      pos2Options: function () {
        return this.outcomeCodeCombinations[this.form.secondPart]
      },
      missingReason: function () {
        return !this.form || !this.form.reason || this.form.reason.toString().trim() === ''
      },
      missingTown: function () {
        return !this.form || !this.form.town || this.form.town.toString().trim() === ''
      },
      missingAmount: function () {
        return !this.form || !this.form.amount || this.form.amount.toString().trim() === ''
      },
      missingPayed: function () {
        return !this.form || !this.form.payed || this.form.payed.toString().trim() === ''
      },
      missingReceived: function () {
        return !this.form || !this.form.received || this.form.received.toString().trim() === ''
      },
      missingFirstAmount: function () {
        return !this.form || !this.form.firstAmount || this.form.firstAmount.toString().trim() === ''
      },
      missingSecondAmount: function () {
        return !this.form || !this.form.secondAmount || this.form.secondAmount.toString().trim() === ''
      },
      missingTotalAmount: function () {
        return !this.form || !this.form.amount || this.form.amount.toString().trim() === ''
      },
      missingMunicipalityPresident: function () {
        return !this.form || !this.form.municipalityPresident || this.form.municipalityPresident.toString().trim() === ''
      },
      missingDate: function () {
        return !this.form || !this.form.date
      },
      missingAnnualReportPage: function () {
        return !this.form || !this.form.annualReportPage
      },
      missingOrdinal: function () {
        return !this.form || !this.form.ordinal
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
        if (this.defaultPaymentSlipPreview) {
          /* Set the default values for payment slips */
          this.$store.dispatch('SET_DEFAULT_PAYMENT_SLIP', this.form)
          if (this.parentModal) {
            this.$root.$emit('bv::hide::modal', this.parentModal)
          }
        } else {
          this.setAttemptSubmit(true)
          if (this.checkForm()) {
            if (this.form._id) {
              /* Update the item */
              paymentSlipsController.updatePaymentSlip(this.form).then((res) => {
                if (!res.err) {
                  this.$root.$emit('bv::refresh::table', 'payment-slips-table')
                } else {
                  showErrorDialog(res.err)
                }
              })
            } else {
              /* Create new item */
              paymentSlipsController.createPaymentSlip(this.form).then((res) => {
                if (!res.err) {
                  this.$root.$emit('bv::refresh::table', 'payment-slips-table')
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
            !this.form.payed ||
            !this.form.received ||
            !this.form.firstAmount ||
            !this.form.secondAmount ||
            !this.form.municipalityPresident ||
            !this.form.date) {
          return false
        }
        return true
      },
      resetForm () {
        this.form = JSON.parse(JSON.stringify(this.defaultForm))
        this.setAttemptSubmit(false)
      },
      onFirstPartChange () {
        this.form.firstPos = ''
      },
      onSecondPartChange () {
        this.form.secondPos = ''
      },
      printPaymentSlip () {
        const modal = document.getElementById('payment-slip-preview-container')
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
    /* Immitate the underline in the real payment slip */
    border-bottom: 1px solid black !important;
    border-radius: 0 !important;
  }
  .tooltipInnerText {
    font-size: 95%;
    line-height: 1;
    margin: 1px;
  }
  #payment-slip-preview-container{
    width: 794px;
    height: 559px;
    border-style: solid;
    border-width: thin;
    position: relative;
  }
  .payment-slip-preview-text{
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
  h1{
    text-align: center;
    font-weight: bold;
    font-size: 25px;
    margin: 0px;
    padding: 0px;
  }
  .input-form-group{
    display: inline;
    height: 15px;
    margin: 0px;
    padding: 0px;
  }
  .input-small{
    border-style: none;
    font-weight: bold;
    display: inline;
    height: 15px;
    margin: 0px;
    padding: 0px;
    color: black;
  }
  .input-small::placeholder{
    border-style: none;
    font-weight: normal;
    color: #16264C;
  }
  .is-invalid {
    border: dotted 1px red;
  }
  .line-spacing-small {
    line-height: 1.3;
  }
  #amountInput{
    width: 140px;
  }
  #amountTextInput{
    width: 410px;
  }
  #amountTextInputPt2{
    width: 255px;
  }
  #townInput{
    width: 180px;
  }
  #reasonInput{
    width: 430px;
  }
  #payedInput{
    width: 288px;
  }
  #receivedInput{
    width: 255px;
  }
  #yearSelect{
    width: 95px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #part1Select{
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #pos1Select{
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #part2Select{
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #pos2Select{
    width: 50px;
    padding-left:5px;
    margin-bottom: 8px;
  }
  #firstAmountInput{
    width: 85px;
  }
  #secondAmountInput{
    width: 85px;
  }
  #divContentEditable{
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
  #totalAmountInput{
    width: 100px;
  }
  #annualReportPageInput{
    width: 35px;
  }
  #ordinalInput{
    width: 40px;
  }
  #municipalityPresidentInput{
    width: 235px;
  }
  #modalCancelBtn{
    margin-top: 5px;
    position: absolute;
    right: 5px;
  }
  #clearSaveBtnsDiv{
    position: absolute;
    bottom: 15px;
    right: 50px;
  }
  #printBtnDiv{
    position: absolute;
    bottom: 15px;
    left: 50px;
  }
  .displayNone{
    display:none;
  }
  .amountTextDivWrapper{
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
  #amountTextDivWrapper1{
    height: 25px;
    width: 405px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    margin-bottom: -2px;
  }
  #amountTextDivWrapper2{
    height: 25px;
    width: 670px;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: -3px;
    margin-top: -2px;
  }
  .disabledTextDiv{
    background-color: #ededed;
    max-height: 15px;
  }
</style>

<style>
  .datepickerInput{
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
  .datepickerWrapper{
    display: inline;
    white-space: normal;
    height: 15px;
    margin: 0px;
    padding: 0px;
    width: 95px;
  }
  .datepickerWrapper > div:first-child{
    display: inline;
    width: 95px;
    margin: 0px;
    padding: 0px;
  }
  .datepickerCalendar{
    font-size: 120%;
    white-space: normal;
    z-index: 100;
    -webkit-transform: scale(0.7, 0.7) translate(650px, -65px); /* Safari and Chrome */
  }
  /* To get calendar cells smaller to avoid save and clear buttons from covering the popup*/
  .vdp-datepicker__calendar .cell{
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
