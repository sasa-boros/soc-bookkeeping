<template>       
  <b-container fluid id="payment-slip-preview-container" @keyup.tab.exact="tabPressedHandler" @keyup.shift.tab.exact="shiftTabPressedHandler">
    <b-form @submit="onSubmit" no-validation>
      <b-button @click.stop="closeModal()" variant="link" class="ignoreInPrint btn-xs" id="modalCancelBtn">
        <img src="~@/assets/delete.png" class="ignoreInPrint">
      </b-button>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" ref="incomeInputFormGroup"><b-form-input v-on:mouseleave="$root.$emit('bv::hide::tooltip')" ref="incomeInput" v-model="form.income" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingIncome }" id="incomeInput" :disabled="defaultPaymentSlipPreview" type="number" min="0" step="1"></b-form-input></b-form-group> и словима  <div class="incomeAsTextDivWrapper" v-bind:class="{'disabledTextDiv': defaultPaymentSlipPreview}" contenteditable="false" id="incomeAsTextDivWrapper1">{{generatedIncomeTextLine1}}</div>
      <br/><div class="incomeAsTextDivWrapper" contenteditable="false" v-bind:class="{'disabledTextDiv': defaultPaymentSlipPreview}" id="incomeAsTextDivWrapper2">{{generatedIncomeTextLine2}}</div>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group" ref="townInputFormGroup"><b-form-input v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingTown }" id="townInput" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" ref="reasonInputFormGroup"><b-form-input v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingReason }" id="reasonInput" type="text"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-group class="input-form-group" ref="payedInputFormGroup"><b-form-input v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-model="form.payed" class="input-small" id="payedInput" type="text" @blur.native="preDatepickerOnBlur"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за <span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><datepicker id="dateInput" ref="dateInput" v-model="form.date" v-bind:class="{ 'is-invalid': shouldValidate && missingDate }" :language="calendarLanguages.srCYRL" input-class="datepickerInput" wrapper-class="datepickerWrapper" calendar-class="datepickerCalendar"></datepicker></span> г.
                                                                                                            Парт. <b-form-group class="input-form-group" ref="firstPartInputFormGroup"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-select v-model="form.firstPartition" id="firstPartSelect" :disabled="defaultPaymentSlipPreview" :options="part1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstPart && atLeastOnePartPosNotSet }" @blur.native="postDatepickerOnBlur"/></span></b-form-group> поз. <b-form-group class="input-form-group" ref="firstPosInputFormGroup" id="firstPosSelectForm"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-select v-model="form.firstPosition" id="firstPosSelect" :disabled="defaultPaymentSlipPreview || missingFirstPart" :options="pos1Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstPos && atLeastOnePartPosNotSet }"/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="firstIncomeInputFormGroup" id="firstIncomeInputForm"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-input v-model="form.firstIncome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingFirstIncome && atLeastOnePartPosNotSet }" id="firstIncomeInput" :disabled="defaultPaymentSlipPreview || missingFirstPart" type="number" min="0" step="1"></b-form-input></span></b-form-group>
                  Примио благајник,                                                          Парт. <b-form-group class="input-form-group" ref="secondPartInputFormGroup"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-select v-model="form.secondPartition" id="secondPartSelect" :disabled="defaultPaymentSlipPreview" :options="part2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondPart && atLeastOnePartPosNotSet }"/></span></b-form-group> поз. <b-form-group class="input-form-group" ref="secondPosInputFormGroup" id="secondPosSelectForm"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-select v-model="form.secondPosition" id="secondPosSelect" :disabled="defaultPaymentSlipPreview || missingSecondPart" :options="pos2Options" size="sm" class="select-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondPos && atLeastOnePartPosNotSet }"/></span></b-form-group> дин. <b-form-group class="input-form-group" ref="secondIncomeInputFormGroup" id="secondIncomeInputForm"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-input v-model="form.secondIncome" class="input-small" v-bind:class="{ 'is-invalid': shouldValidate && missingSecondIncome && atLeastOnePartPosNotSet }" id="secondIncomeInput" :disabled="defaultPaymentSlipPreview || missingSecondPart" type="number" min="0" step="1"></b-form-input></span></b-form-group>
                                                           
      <br/><b-form-group class="input-form-group" ref="receivedInputFormGroup"><b-form-input disabled class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                           Свега дин. <b-form-group class="input-form-group" ref="totalIncomeInputFormGroup" id="totalIncomeInputForm"><span v-on:mouseleave="$root.$emit('bv::hide::tooltip')"><b-form-input disabled v-model="form.income" class="input-small" id="totalIncomeInput" v-bind:class="{ 'is-invalid': shouldValidate && ( missingTotalIncome || totalIncomeNotValid ) }" type="number" min="0" step=".01"></b-form-input></span></b-form-group>
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" ref="annualReportPageInputFormGroup"><b-form-input disabled v-model="form.annualReportPage" class="input-small" id="annualReportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group ref="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" ref="municipalityPresidentInputFormGroup"><b-form-input disabled class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>

      </div>
      <div id="printBtnDiv">
        <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" ref="paymentSlipPrintBtn" id="paymentSlipPrintBtn" @click.stop="printPaymentSlip()" variant="link" class="ignoreInPrint btn-lg" :class="{ 'displayNone' : defaultPaymentSlipPreview }">
          <img src="~@/assets/print.png" class="ignoreInPrint">
        </b-button>
      </div>
      <div id="clearSaveBtnsDiv">
        <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" ref="paymentSlipSaveBtn" id="paymentSlipSaveBtn" type="submit" variant="link" class="ignoreInPrint btn-lg" @blur="postDatepickerDefaultOnBlur">
          <img src="~@/assets/save1.png" class="ignoreInPrint">
        </b-button>
        <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" ref="paymentSlipClearBtn" id="paymentSlipClearBtn" @click.stop="clearForm()" variant="link" class="ignoreInPrint btn-lg">
          <img src="~@/assets/clear.png" class="ignoreInPrint">
        </b-button>
      </div>
              
      <b-tooltip target="incomeInput" triggers="hover" placement="top" ref="incomeInputTooltip" :disabled.sync="disableIncomeTooltip">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip target="townInput" triggers="hover" placement="top" ref="townInputTooltip" :disabled.sync="disableTownTooltip">
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
          {{phrases.atLeastOnePartPosIncome}}
        </div>
      </b-tooltip>

      <b-tooltip target="firstPosSelectForm" triggers="hover" placement="top" ref="firstPosInputTooltip" :disabled.sync="disableFirstPosTooltip">
        <div class="tooltipInnerText">
          {{firstPosTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip target="firstIncomeInputForm" triggers="hover" placement="top" ref="firstIncomeInputTooltip" :disabled.sync="disableFirstIncomeTooltip">
        <div class="tooltipInnerText">
          {{firstIncomeTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip target="secondPartSelect" triggers="hover" placement="top" ref="secondPartInputTooltip" :disabled.sync="disableSecondPartTooltip">
        <div class="tooltipInnerText">
          {{phrases.atLeastOnePartPosIncome}}
        </div>
      </b-tooltip>

      <b-tooltip target="secondPosSelectForm" triggers="hover" placement="top" ref="secondPosInputTooltip" :disabled.sync="disableSecondPosTooltip">
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
    </b-form>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import Datepicker from 'vuejs-datepicker'
  import { sr, srCYRL } from 'vuejs-datepicker/dist/locale'
  const incomeCodeController = require('../../../../controllers/incomeCodeController')
  const paymentSlipController = require('../../../../controllers/paymentSlipController')
  const defaultPaymentSlipController = require('../../../../controllers/defaultPaymentSlipController')
  const { numberToSerbianDinars, getLastNYears, getCodeCombinations, showErrorDialog, mapPaymentSlipToPaymentSlipForm, mapPaymentSlipFormToPaymentSlip } = require('../../../../utils/utils')
  const i18n = require('../../../../translations/i18n')

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
        phrases: {
          save: i18n.getTranslation('Save'),
          print: i18n.getTranslation('Print'),
          clear: i18n.getTranslation('Clear'),
          willBeGenerated: i18n.getTranslation('The value will be generated'),
          enterValue: i18n.getTranslation('Enter a value'),
          pickDate: i18n.getTranslation('Pick a date'),
          atLeastOnePartPosIncome: i18n.getTranslation('Enter at least one partition, position, income'),
          enterPartition: i18n.getTranslation('Enter partition'),
          needsToBeEqualToSum: i18n.getTranslation('Needs to equal to sum of incomes by partitions and position')
        },
        calendarLanguages: {
          sr: sr,
          srCYRL: srCYRL
        }
      }
    },
    created () {
      if(this.paymentSlipPreview) {
        var paymentSlip = JSON.parse(JSON.stringify(this.paymentSlip));
        this.form = mapPaymentSlipToPaymentSlipForm(paymentSlip);
        this.shouldValidate = true;
      } else {
        var defaultPaymentSlip = JSON.parse(JSON.stringify(this.defaultPaymentSlip));
        defaultPaymentSlip._id = undefined;
        this.form = mapPaymentSlipToPaymentSlipForm(defaultPaymentSlip);
      }
      const self = this;
      incomeCodeController.getIncomeCodes().then(function (res) {
        if (!res.err) {
          self.incomeCodes = (res.data || [])
          self.incomeCodeCombinations = getCodeCombinations(self.incomeCodes)
        } else {
          showErrorDialog(res.err)
        }
      })
    },
    watch: {
      'form.firstPartition' : function (newValue) {
        /* If new value is null, i.e. the part is reset, reset the income too */
        if (!newValue || newValue.toString().trim() === '') {
          this.form.firstPosition = null
          this.form.firstIncome = null
          return;
        }
        if (!this.incomeCodeCombinations) {
          return;
        }
        const allowedPosValues = this.incomeCodeCombinations[newValue]
        if (!allowedPosValues || allowedPosValues.indexOf(this.form.firstPosition) === -1) {
          /* Pos value needs to be reset since it is not allowed with the new part */
          this.form.firstPosition = null
        }
      },
      'form.secondPartition' : function (newValue) {
        /* If new value is null, i.e. the part is reset, reset the income too */
        if (!newValue || newValue.toString().trim() === '') {
          this.form.secondPosition = null
          this.form.secondIncome = null
          return;
        }
        if (!this.incomeCodeCombinations) {
          return;
        }
        const allowedPosValues = this.incomeCodeCombinations[newValue]
        if (!allowedPosValues || allowedPosValues.indexOf(this.form.secondPosition) === -1) {
          /* Pos value needs to be reset since it is not allowed with the new part */
          this.form.secondPosition = null
        }
      }
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
            var generatedText = numberToSerbianDinars(this.form.income)
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
      firstPosTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosIncome
        }
      },
      firstIncomeTooltipText: function () {
        if (this.missingFirstPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosIncome
        }
      },
      secondPosTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosIncome
        }
      },
      secondIncomeTooltipText: function () {
        if (this.missingSecondPart) {
          return this.phrases.enterPartition
        } else {
          return this.phrases.atLeastOnePartPosIncome
        }
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
          return !this.atLeastOnePartPosNotSet || !this.missingFirstIncome || !this.shouldValidate
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
          return !this.atLeastOnePartPosNotSet || !this.missingSecondIncome || !this.shouldValidate
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
          // making computed property react on changes
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
        if (!this.incomeCodeCombinations) {
          return [];
        }
        var keys = Object.keys(this.incomeCodeCombinations);
        var index = keys.indexOf(this.form.secondPartition);
        if (index != -1) {
            keys.splice(index, 1);
        }
        keys.unshift('');
        return keys;
      },
      part2Options: function () {
        if (!this.incomeCodeCombinations) {
          return [];
        }
        var keys = Object.keys(this.incomeCodeCombinations);
        var index = keys.indexOf(this.form.firstPartition);
        if (index != -1) {
            keys.splice(index, 1);
        }
        keys.unshift('');
        return keys;
      },
      pos1Options: function () {
        if (!this.incomeCodeCombinations) {
          return []
        }
        return this.incomeCodeCombinations[this.form.firstPartition]
      },
      pos2Options: function () {
        if (!this.incomeCodeCombinations) {
          return []
        }
        return this.incomeCodeCombinations[this.form.secondPartition]
      },
      missingReason: function () {
        return !this.form.reason || this.form.reason.toString().trim() === ''
      },
      missingTown: function () {
        return !this.form.town || this.form.town.toString().trim() === ''
      },
      missingIncome: function () {
        return !this.form.income || this.form.income.toString().trim() === ''
      },
      missingFirstPart: function () {
        return !this.form.firstPartition || this.form.firstPartition.toString().trim() === ''
      },
      missingFirstPos: function () {
          return !this.form.firstPosition
      },
      missingFirstIncome: function () {
        return !this.form.firstIncome || this.form.firstIncome.toString().trim() === ''
      },
      missingSecondPart: function () {
        return !this.form.secondPartition || this.form.secondPartition.toString().trim() === ''
      },
      missingSecondPos: function () {
          return !this.form.secondPosition
      },
      missingSecondIncome: function () {
        return !this.form.secondIncome || this.form.secondIncome.toString().trim() === ''
      },
      missingTotalIncome: function () {
        return !this.form.income || this.form.income.toString().trim() === ''
      },
      totalIncomeNotValid: function () {
        if (this.form.income) {
          const totalIncome = parseFloat(this.form.income)
          const firstIncome = this.missingFirstIncome ? 0 : parseFloat(this.form.firstIncome)
          const secondIncome = this.missingSecondIncome ? 0 : parseFloat(this.form.secondIncome)
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
        // making computed property react on changes
        this.form.firstPartition
        this.form.firstPosition
        this.form.firstIncome
        this.form.secondPartition
        this.form.secondPosition
        this.form.secondIncome
        /* True if not a single part-pos combination is set. At least one combination should be set. */
        const firstCombinationSet = !this.missingFirstPart && !this.missingFirstPos && !this.missingFirstIncome
        const secondCombinationSet = !this.missingSecondPart && !this.missingSecondPos && !this.missingSecondIncome

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
              showErrorDialog(res.err)
            }
          })
        } else {
          this.shouldValidate = true;
          if (this.checkForm()) {
            if (this.paymentSlipPreview) {
              var isValid = this.form.isValid
              this.form.isValid = true
              paymentSlipController.updatePaymentSlip(mapPaymentSlipFormToPaymentSlip(this.form, this.incomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updatePaymentSlipTable')
                  self.closeModal();
                } else {
                  showErrorDialog(res.err)
                  if(!isValid) {
                    self.form.isValid = false
                  }
                }
              })
            } else {
              this.form.isValid = true
              paymentSlipController.createPaymentSlip(mapPaymentSlipFormToPaymentSlip(this.form, this.incomeCodes)).then((res) => {
                if (!res.err) {
                  self.$emit('updatePaymentSlipTable')
                  self.closeModal();
                } else {
                  showErrorDialog(res.err)
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
        this.form.secondPartition = null;
        this.form.secondPosition = null;
        this.form.secondIncome = null;
        this.form.income = null;
        this.form.incomeAsText = null;
        this.form.town = null;
        this.form.reason = null;
        this.form.payed = null;
      },
      checkForm () {
        if (this.missingIncome ||
            this.missingReason ||
            this.missingTown ||
            this.missingDate ||
            this.atLeastOnePartPosNotSet ||
            this.totalIncomeNotValid) {
          return false
        }
        return true
      },
      printPaymentSlip () {
        const modal = document.getElementById('payment-slip-preview-container')
        const cloned = modal.cloneNode(true)

        var section = document.createElement('div')
        section.id = 'print-payment-slip'
        document.body.appendChild(section)
        try {
          section.innerHTML = ''
          section.appendChild(cloned)
          window.print()
        } finally {
          document.body.removeChild(section)
        }
      },
      closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
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
  select {
    border-bottom: 1px solid black !important;
    border-radius: 0 !important;
    height: 20px;
    min-height: 20px;
  }
  #payment-slip-preview-container {
    width: 794px;
    height: 559px;
    position: relative;
  }
  .payment-slip-preview-text {
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
    width: 180px;
  }
  #reasonInput {
    width: 430px;
  }
  #payedInput {
    width: 288px;
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
  #firstIncomeInput {
    width: 85px;
  }
  #secondIncomeInput {
    width: 85px;
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
  .incomeAsTextDivWrapper {
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
  #incomeAsTextDivWrapper1 {
    height: 25px;
    width: 405px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    margin-bottom: -2px;
  }
  #incomeAsTextDivWrapper2 {
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
    width: 93px;
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
    width: 93px;
  }
  .datepickerWrapper > div:first-child {
    display: inline;
    width: 93px;
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
  }
</style>
