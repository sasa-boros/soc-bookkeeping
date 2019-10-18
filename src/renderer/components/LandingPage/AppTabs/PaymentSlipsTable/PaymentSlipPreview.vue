<template>       
  <b-container fluid id="payment-slip-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form ref="form" @submit="onSubmit" novalidate no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/close.png" class="ignoreInPrint">
      </b-button>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="incomeInputFormGroup"><b-form-input id="incomeInput" ref="incomeInput"  v-on:mouseleave="hideTooltip('incomeInput')" v-model="form.income" class="input-small number-input" v-bind:class="{ 'is-invalid': shouldValidate && missingIncome }" :disabled="defaultPaymentSlipPreview" type="text" :autofocus="!paymentSlipPreview"></b-form-input></b-form-group> и словима  <b-form-input type="text" disabled class="input-small" id="incomeAsTextDivWrapper1" v-model="generatedIncomeTextLine1"></b-form-input>
      <br/><b-form-input disabled class="input-small" id="incomeAsTextDivWrapper2" v-model="generatedIncomeTextLine2"></b-form-input>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input id="townInput" v-on:keypress="limitTownInput" ref="townInput" v-model="form.town" class="input-small" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input id="reasonInput" v-on:keypress="limitReasonInput" ref="reasonInput" v-on:mouseleave="hideTooltip('reasonInput')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason}" type="text"  @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>
      <div class="mt-2">на дан <span v-on:mouseleave="hideTooltip('dateInput')"><datepicker id="dateInput" ref="dateInput" v-model="form.date"  v-bind:class="{ 'is-invalid': shouldValidate && missingDate, 'disabledDatepicker': defaultPaymentSlipPreview }" :language="calendarLanguages.srCYRL" input-class="paymentSlipDatepickerInput" wrapper-class="paymentSlipDatepickerWrapper" calendar-class="paymentSlipDatepickerCalendar" v-on:input="checkMaxPaymentSlips" :disabled="defaultPaymentSlipPreview"></datepicker></span> г.                                                                                          У п л а т и о,
                                                                                                        <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input id="payedInput" v-on:keypress="limitPayedInput" ref="payedInput" v-on:mouseleave="hideTooltip('payedInput')" v-model="form.payed" class="input-small" type="text" @blur.native="postDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                      Књижити у корист буџета за                  <b-form-input disabled id="yearInput" ref="yearInput" class="input-small" v-model="year"></b-form-input> г.
                                                                                          <span class="partText">Парт. </span><b-form-group class="input-form-group" ref="firstPartInputFormGroup"><span v-on:mouseleave="hideTooltip('firstPartInput')"><b-form-input id="firstPartInput" type="text" v-model="form.firstPartition" v-bind:class="{ 'is-invalid': !disableFirstPartTooltip}" class="input-small" :disabled="defaultPaymentSlipPreview" tabIndex="-1"/></span></b-form-group><span v-on:mouseleave="hideTooltip('firstPartPosSelect')"><b-form-select id="firstPartPosSelect" v-model="selectedFirstPartPos" v-on:change="onFirstPartPosChange" :options="firstPartPosOptions" :disabled="defaultPaymentSlipPreview" size="sm" class="select-small ignoreInPrint"><template v-slot:first><option :value="null"></option></template></b-form-select></span> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup" id="firstPosInputForm"><span v-on:mouseleave="hideTooltip('firstPosInputForm')"><b-form-input id="firstPosInput" v-model="form.firstPosition" v-bind:class="{ 'is-invalid': !disableFirstPosTooltip}" class="input-small" disabled/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="firstIncomeInputFormGroup" id="firstIncomeInputForm"><span v-on:mouseleave="hideTooltip('firstIncomeInputForm')"><b-form-input id="firstIncomeInput" v-model="form.firstIncome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableFirstIncomeTooltip }" :disabled="defaultPaymentSlipPreview || missingFirstPart" type="text"></b-form-input></span></b-form-group>
                  Примио благајник,                                        <span class="partText">Парт. </span><b-form-group class="input-form-group" ref="secondPartInputFormGroup"><span v-on:mouseleave="hideTooltip('secondPartInput')"><b-form-input id="secondPartInput" type="text" v-model="form.secondPartition" v-bind:class="{ 'is-invalid': !disableSecondPartTooltip}" class="input-small" :disabled="defaultPaymentSlipPreview" tabIndex="-1"/></span></b-form-group><span v-on:mouseleave="hideTooltip('secondPartPosSelect')"><b-form-select id="secondPartPosSelect" v-model="selectedSecondPartPos" v-on:change="onSecondPartPosChange" :options="secondPartPosOptions" :disabled="defaultPaymentSlipPreview" size="sm" class="select-small ignoreInPrint"><template v-slot:first><option :value="null"></option></template></b-form-select></span> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup" id="secondPosInputForm"><span v-on:mouseleave="hideTooltip('secondPosInputForm')"><b-form-input id="secondPosInput" v-model="form.secondPosition" v-bind:class="{ 'is-invalid': !disableSecondPosTooltip }" class="input-small" disabled/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="secondIncomeInputFormGroup" id="secondIncomeInputForm"><span v-on:mouseleave="hideTooltip('secondIncomeInputForm')"><b-form-input v-model="form.secondIncome" class="input-small numberInput" v-bind:class="{ 'is-invalid': !disableSecondIncomeTooltip }" id="secondIncomeInput" :disabled="defaultPaymentSlipPreview || missingSecondPart" type="text"></b-form-input></span></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input disabled class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalIncomeInputFormGroup" id="totalIncomeInputForm"><span v-on:mouseleave="hideTooltip('totalIncomeInputForm')"><b-form-input id="totalIncomeInput" disabled v-model="form.income" class="input-small numberInput" v-bind:class="{ 'is-invalid': shouldValidate && ( missingTotalIncome || totalIncomeNotValid ) }"></b-form-input></span></b-form-group>
      <div class="my-0">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>

      </div>
      <div id="downloadPrintBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('paymentSlipDownloadBtn')" ref="paymentSlipDownloadBtn" id="paymentSlipDownloadBtn" @click.stop="downloadPaymentSlip()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultPaymentSlipPreview }" :disabled="!validForm && shouldValidate">
          <img src="~@/assets/download.png" class="ignoreInPrint">
        </b-button>
        &nbsp;
        <b-button v-on:mouseleave="hideTooltip('paymentSlipPrintBtn')" ref="paymentSlipPrintBtn" id="paymentSlipPrintBtn" @click.stop="printPaymentSlip()" variant="light" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultPaymentSlipPreview }" :disabled="!validForm && shouldValidate">
          <img src="~@/assets/print.png" class="ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button v-on:mouseleave="hideTooltip('paymentSlipSaveBtn')" ref="paymentSlipSaveBtn" id="paymentSlipSaveBtn" type="submit" variant="light" class="ignoreInPrint btn-lg" @blur="postDatepickerDefaultOnBlur">
          <img src="~@/assets/save.png" class="ignoreInPrint">
        </b-button>
        <b-button v-on:mouseleave="hideTooltip('paymentSlipClearBtn')" ref="paymentSlipClearBtn" id="paymentSlipClearBtn" @click.stop="clearForm()" variant="light" class="ignoreInPrint btn-lg">
          <img src="~@/assets/clear.png" class="ignoreInPrint">
        </b-button>
      </div>
    </b-form>

    <b-tooltip target="incomeInput" triggers="hover" placement="top" ref="incomeInputTooltip" :disabled.sync="disableIncomeTooltip">
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
        {{firstPartTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstPosInputForm" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip">
      <div class="tooltipInnerText">
        {{firstPosTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="firstIncomeInputForm" triggers="hover" placement="top" ref="firstIncomeInputTooltip" :disabled.sync="disableFirstIncomeTooltip">
      <div class="tooltipInnerText">
        {{firstIncomeTooltipText}}
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

    <b-tooltip target="secondIncomeInputForm" triggers="hover" placement="top" ref="secondIncomeInputTooltip" :disabled.sync="disableSecondIncomeTooltip">
      <div class="tooltipInnerText">
        {{secondIncomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="totalIncomeInputForm" triggers="hover" placement="top" ref="totalIncomeInputTooltip" :disabled.sync="disableTotalIncomeTooltip">
      <div class="tooltipInnerText">
        {{totalIncomeTooltipText}}
      </div>
    </b-tooltip>

    <b-tooltip target="dateInput" triggers="hover" placement="top" ref="dateInputTooltip" :disabled.sync="disableDateTooltip">
      <div class="tooltipInnerText">
        {{phrases.pickDate}}
      </div>
    </b-tooltip>

    <b-tooltip target="paymentSlipDownloadBtn" triggers="hover" placement="top" ref="paymentSlipDownloadBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.download}}
      </div>
    </b-tooltip>

    <b-tooltip target="paymentSlipPrintBtn" triggers="hover" placement="top" ref="paymentSlipPrintBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.print}}
      </div>
    </b-tooltip>

    <b-tooltip target="paymentSlipSaveBtn" triggers="hover" placement="top"  ref="paymentSlipSaveBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.save}}
      </div>
    </b-tooltip>

    <b-tooltip target="paymentSlipClearBtn" triggers="hover" placement="top" ref="paymentSlipClearBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.clear}}
      </div>
    </b-tooltip>
    <b-modal id="payment-slip-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="payment-slip-preview-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  import MessageConfirmDialog from '../../../MessageConfirmDialog'
  const incomeCodeController = require('../../../../controllers/incomeCodeController')
  const paymentSlipController = require('../../../../controllers/paymentSlipController')
  const defaultPaymentSlipController = require('../../../../controllers/defaultPaymentSlipController')
  const { numberToSerbianDinars, compareCodes, mapPaymentSlipToPaymentSlipForm, mapPaymentSlipFormToPaymentSlip, saveAs, asFloat, amountNumberOptions } = require('../../../../utils/utils')
  const i18n = require('../../../../../translations/i18n')
  const AutoNumeric = require('autonumeric')
  const _ = require('lodash')

  export default {
    store: store,
    props: {
      paymentSlip: {
        type: Object,
        default: null,
      },
      paymentSlipPreview: {
        type: Boolean,
        default: false
      },
      defaultPaymentSlipPreview: {
        type: Boolean,
        default: false
      },
      existingPaymentSlips: {
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
        incomeCodes: null,
        incomeCodeCombinations: null,
        errorText: "",
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosIncome: i18n.getTranslation('Enter at least one partition, position, income'),
          enterPartition: i18n.getTranslation('Enter partition'),
          needsToBeEqualToSum: i18n.getTranslation('Needs to equal to sum of incomes by partitions and position'),
          enterIncome:i18n.getTranslation('Enter income'),
          ok: i18n.getTranslation('Ok'),
          maxNumberOfPaymentSlipsReached: i18n.getTranslation('Maximum number of payment slips reached for this month and year (27). Choose another date.'),
          download: i18n.getTranslation('Download'),
          permissionDenied: i18n.getTranslation('Permission denied.'),
          paymentSlipPdf: i18n.getTranslation('payment-slip.pdf'),
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        },
        incomeInputAutonumeric: null,
        firstIncomeInputAutonumeric: null,
        secondIncomeInputAutonumeric: null,
        totalIncomeInputAutonumeric: null,
        townInputElement: null,
        reasonInputElement: null,
        payedInputElement: null,
        selectedFirstPartPos: null,
        selectedSecondPartPos: null
      }
    },
    created () {
      if(this.paymentSlipPreview) {
        var paymentSlip = JSON.parse(JSON.stringify(this.paymentSlip));
        this.form = mapPaymentSlipToPaymentSlipForm(paymentSlip);
        if (!this.form.isValid) {
          this.shouldValidate = true;
        }
        this.selectedFirstPartPos = this.form.firstPartition + '/' + this.form.firstPosition
        this.selectedSecondPartPos = this.form.secondPartition + '/' + this.form.secondPosition
      } else {
        var defaultPaymentSlip = JSON.parse(JSON.stringify(this.defaultPaymentSlip));
        defaultPaymentSlip._id = undefined;
        this.form = mapPaymentSlipToPaymentSlipForm(defaultPaymentSlip);
      }
      const self = this;
      incomeCodeController.getIncomeCodes().then(function (res) {
        if (!res.err) {
          self.incomeCodes = (res.data.sort(compareCodes) || [])
        } else {
          self.openErrorModal(res.err)
        }
      })
      document.addEventListener('keyup', function (evt) {
        if (evt.keyCode === 13) {
          const saveBtn = document.getElementById('paymentSlipSaveBtn')
          if (saveBtn) {
            saveBtn.click()
          }
        }
      })
    },
    mounted () {
      this.incomeInputAutonumeric = new AutoNumeric('#incomeInput', amountNumberOptions)
      this.firstIncomeInputAutonumeric = new AutoNumeric('#firstIncomeInput', amountNumberOptions)
      this.secondIncomeInputAutonumeric = new AutoNumeric('#secondIncomeInput', amountNumberOptions)
      this.totalIncomeInputAutonumeric = new AutoNumeric('#totalIncomeInput', amountNumberOptions)
      this.townInputElement = document.getElementById('townInput')
      this.reasonInputElement = document.getElementById('reasonInput')
      this.payedInputElement = document.getElementById('payedInput')
    },
    computed: {
      ...mapState(
        {
          defaultPaymentSlip: state => state.CommonValues.defaultPaymentSlip
        }
      ),
      generatedIncomeText: {
        get: function () {
          var placeholder = ''
          if (this.form) {
            var generatedText = numberToSerbianDinars(asFloat(this.form.income, amountNumberOptions))
            if (!generatedText) {
              return placeholder
            } else {
              this.form.incomeAsText = generatedText
              return generatedText
            }
          } else {
            return placeholder
          }
        },
        set: function (newValue) {
        }
      },
      generatedIncomeTextLine1: {
        get: function () {
          if (this.generatedIncomeText.length <= 52) {
            return this.generatedIncomeText
          }
          const firstSubstring = this.generatedIncomeText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedIncomeText.substring(0, spaceInd)
          } else {
            return this.generatedIncomeText.substring(0, 52)
          }
        },
        set: function (newValue) {
        }
      },
      generatedIncomeTextLine2: {
        get: function () {
          if (this.generatedIncomeText.length <= 52) {
            return ''
          }
          const firstSubstring = this.generatedIncomeText.substring(0, 52)
          const spaceInd = firstSubstring.lastIndexOf(' ')
          if (spaceInd !== -1) {
            return this.generatedIncomeText.substring(spaceInd)
          } else {
            return this.generatedIncomeText.substring(52)
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
        return this.phrases.atLeastOnePartPosIncome
      },
      firstPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosIncome
      },
      firstIncomeTooltipText: function () {
        if(!this.missingFirstPart) {
          return this.phrases.enterIncome
        }
        return this.phrases.atLeastOnePartPosIncome
      },
      secondPosTooltipText: function () {
        return this.phrases.atLeastOnePartPosIncome
      },
      secondPartTooltipText: function () {
        return this.phrases.atLeastOnePartPosIncome
      },
      secondIncomeTooltipText: function () {
        if(!this.missingSecondPart) {
          return this.phrases.enterIncome
        }
        return this.phrases.atLeastOnePartPosIncome
      },
      totalIncomeTooltipText: function () {
        if (this.totalIncomeNotValid) {
          return this.phrases.needsToBeEqualToSum
        } else {
          return this.phrases.enterValue
        }
      },
      disableIncomeTooltip: {
        get: function () {
          return !this.missingIncome || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.incomeInputTooltip.$emit('close')
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
      disableFirstIncomeTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.firstIncomeInputTooltip.$emit('close')
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
      disableSecondIncomeTooltip: {
        get: function () {
          return !this.atLeastOnePartPosNotSet || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.secondIncomeInputTooltip.$emit('close')
          }
        }
      },
      disableTotalIncomeTooltip: {
        get: function () {
          return (!this.missingTotalIncome && !this.totalIncomeNotValid) || !this.shouldValidate
        },
        set: function (newValue) {
          /* If tooltip is going to get disabled, make sure it is closed before disabling it, because otherwise it will stay opened until enabled */
          if (newValue) {
            this.$refs.totalIncomeInputTooltip.$emit('close')
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
      missingIncome: function () {
        return !this.form.income || this.form.income.trim() === ''
      },
      missingFirstPart: function () {
        return !this.form.firstPartition || this.form.firstPartition.toString().trim() === ''
      },
      missingFirstPos: function () {
          return !this.form.firstPosition
      },
      missingFirstIncome: function () {
        return !this.form.firstIncome || this.form.firstIncome.trim() === ''
      },
      missingSecondPart: function () {
        return !this.form.secondPartition || this.form.secondPartition.toString().trim() === ''
      },
      missingSecondPos: function () {
          return !this.form.secondPosition
      },
      missingSecondIncome: function () {
        return !this.form.secondIncome || this.form.secondIncome.trim() === ''
      },
      missingTotalIncome: function () {
        return !this.form.income || this.form.income.trim() === ''
      },
      totalIncomeNotValid: function () {
        if (!this.missingIncome) {
          const totalIncome = asFloat(this.form.income, amountNumberOptions)
          const firstIncome = this.missingFirstIncome ? 0 : asFloat(this.form.firstIncome, amountNumberOptions)
          const secondIncome = this.missingSecondIncome ? 0 : asFloat(this.form.secondIncome, amountNumberOptions)
          if (firstIncome + secondIncome !== totalIncome) {
            return true
          }
        }
        return false
      },
      missingDate: function () {
        return !this.form.date
      },
      atLeastOnePartPosNotSet: function () {
        const firstCombinationNotSet = this.missingFirstPart || this.missingFirstPos || this.missingFirstIncome
        const secondCombinationNotSet = this.missingSecondPart || this.missingSecondPos || this.missingSecondIncome
        return firstCombinationNotSet && secondCombinationNotSet
      },
      validForm: function () {
        if (this.missingIncome ||
            this.missingReason ||
            this.missingDate ||
            this.atLeastOnePartPosNotSet ||
            this.totalIncomeNotValid) {
          return false
        }
        return true
      }
    },
    methods: {
      getInitialPartPosOptions() {
        if (!this.incomeCodes) {
          return []
        }
        var options = []
        this.incomeCodes.forEach(ic => {
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
          this.form.firstIncome = null
          if (this.firstIncomeInputAutonumeric) {
            this.firstIncomeInputAutonumeric.clear()
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
          this.form.secondIncome = null
          if (this.secondIncomeInputAutonumeric) {
            this.secondIncomeInputAutonumeric.clear()
          }
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
      limitPayedInput(evt) {
      if (this.payedInputElement.scrollWidth > this.payedInputElement.clientWidth) {
          evt.preventDefault()
        } 
      },
      checkMaxPaymentSlips () {
        if (!this.form.date || !this.existingPaymentSlips) {
          return
        }
        // set date to null because of long processing
        const formDate = this.form.date
        this.$refs.dateInput.clearDate()
        this.form.date = null

        var countOfSameMonthAndYear = 0
        for (let i=0; i<this.existingPaymentSlips.length; i++) {
          const paymentSlipDate = new Date(this.existingPaymentSlips[i].date)
          if (paymentSlipDate.getUTCMonth() == formDate.getMonth() && paymentSlipDate.getUTCFullYear() == formDate.getFullYear()) {
            if (this.existingPaymentSlips[i]._id != this.form._id) {
              countOfSameMonthAndYear++
            }
            if (countOfSameMonthAndYear >= 27) {
              this.openErrorModal(this.phrases.maxNumberOfPaymentSlipsReached)
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
        if(this.defaultPaymentSlipPreview) {
          this.postDatepickerJustBlurred = true
        }
      },
      onSubmit (evt) {
        evt.preventDefault();
        const self = this;
        if (this.defaultPaymentSlipPreview) {
          defaultPaymentSlipController.createDefaultPaymentSlip(mapPaymentSlipFormToPaymentSlip(this.form, this.incomeCodes)).then(function (res) {
            if (!res.err) {
              self.$emit('updateDefaultPaymentSlip')
              self.closeModal();
            } else {
              self.openErrorModal(res.err)
            }
          })
        } else {
          this.shouldValidate = true;
          if (this.validForm) {
            if (this.paymentSlipPreview) {
              paymentSlipController.updatePaymentSlip(mapPaymentSlipFormToPaymentSlip(this.form, this.incomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updatePaymentSlipTable')
                  self.closeModal();
                } else {
                  self.openErrorModal(res.err)
                }
              })
            } else {
              paymentSlipController.createPaymentSlip(mapPaymentSlipFormToPaymentSlip(this.form, this.incomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updatePaymentSlipTable')
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
        this.form.firstIncome = null;
        this.firstIncomeInputAutonumeric.clear()
        this.form.secondPartition = null;
        this.form.secondPosition = null;
        this.form.secondIncome = null;
        this.secondIncomeInputAutonumeric.clear()
        this.form.income = null;
        this.incomeInputAutonumeric.clear()
        this.form.incomeAsText = null;
        this.form.town = null;
        this.form.reason = null;
        this.form.payed = null;
        this.totalIncomeInputAutonumeric.clear()
        this.selectedFirstPartPos = null
        this.selectedSecondPartPos = null
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'payment-slip-preview-error-modal')
      },
      printPaymentSlip () {
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          window.print()
        } finally {
          document.body.removeChild(section)
        }
      },
      async downloadPaymentSlip () {
        const section = this.preparePrintSection()
        document.body.appendChild(section)
        try {
          const res = await paymentSlipController.createPaymentSlipPdf()
          if (!res.err) {
            const self = this
            saveAs('/payment-slip.pdf', this.phrases.paymentSlipPdf, err => {
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
        } finally {
          document.body.removeChild(section)
        }
      },
      preparePrintSection () {
        const modal = document.getElementById('payment-slip-preview-container')
        const cloned = modal.cloneNode(true)
        var section = document.createElement('div')
        section.id = 'print-payment-slip'
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
    /* Immitate the underline in the real payment slip */
    border-bottom: 1px solid black !important;
    border-radius: 0 !important;
    text-align:center;
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
  #payment-slip-preview-container {
    width: 794px;
    height: 559px;
    position:relative;
  }
  .payment-slip-preview-text {
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
    font-family: "Times New Roman";
    letter-spacing: 95%;
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
  .custom-select:disabled {
    color: #6c757d;
    background-color: #e9ecef;
  }
  #incomeInput {
    width: 140px;
  }
  #incomeAsTextInput {
    width: 410px;
  }
  #incomeAsTextInputPt2 {
    width: 255px;
  }
  #townInput {
    width: 320px;
  }
  #reasonInput {
    width: 290px;
  }
  #payedInput {
    width: 300px;
  }
  #receivedInput {
    width: 230px;
  }
  #yearInput {
    width: 50px;
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
  #firstIncomeInput {
    width: 100px;
  }
  #secondIncomeInput {
    width: 100px;
  }
  #totalIncomeInput {
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
  .incomeAsTextDivWrapper {
    display: inline;
    font-weight: bold;
    color: black;
    white-space: nowrap;
    border-bottom: solid;
    border-width: 1px;
    display: inline-block;
    margin: 0;
  }
  #incomeAsTextDivWrapper1 {
    width: 406px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
  }
  #incomeAsTextDivWrapper2 {
    width: 670px;
    white-space: nowrap;
    overflow: hidden;
  }
</style>

<style>
  .paymentSlipDatepickerInput {
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
  .disabledDatepicker .paymentSlipDatepickerInput {
    background-color: rgb(235, 236, 238);
  }
  .is-invalid .paymentSlipDatepickerInput {    
    background-image: url('~@/assets/invalid-red.png');
    background-repeat: no-repeat;
    background-position: center right calc(2.25rem / 4);
    background-size: calc(2.25rem / 2) calc(2.25rem / 2);
  }
  .paymentSlipDatepickerWrapper {
    display: inline;
    white-space: normal;
    height: 15px;
    margin: 0px;
    padding: 0px;
    width: 95px;
  }
  .paymentSlipDatepickerWrapper > div:first-child {
    display: inline;
    width: 95px;
    margin: 0px;
    padding: 0px;
  }
  .paymentSlipDatepickerCalendar {
    font-size: 120%;
    white-space: normal;
    z-index: 100;
    -webkit-transform: scale(0.7, 0.7) translate(-70px, -70px); /* Safari and Chrome */
  }

  @media screen {
    #print-payment-slip {
      display: none;
    }
  }
  @media print {
    * {
      visibility:hidden;
    }
    #print-payment-slip, #print-payment-slip * {
      visibility:visible;
    }
    #print-payment-slip {
      position: absolute;
      top:0px;
      left:0px;
    }
    #payment-slip-preview-container {
      top:150px;
      left:200px;
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
