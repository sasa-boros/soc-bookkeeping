<template>           
  <b-container fluid id="payment-slip-preview-container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" no-validation>
      <b-button @click.stop="closeModal()" size="sm" variant="link" class="ignoreInPrint" id="modalCancelBtn">
        <img src="~@/assets/delete.png" class="btn-img ignoreInPrint">
      </b-button>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group" id="amountInputFormGroup"><b-form-input v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="amountInput" type="number" min="0" step=".01"></b-form-input></b-form-group> и словима  <div class="parent" contenteditable="false" id="divContentEditable">{{generatedAmountText}}</div><br v-if="showWs" />
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group" id="townInputFormGroup"><b-form-input v-model="form.town" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text"></b-form-input></b-form-group> на име <b-form-group class="input-form-group" id="reasonInputFormGroup"><b-form-input v-model="form.reason" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-group class="input-form-group" id="payedInputFormGroup"><b-form-input v-model="form.payed" v-bind:class="{ 'is-invalid': attemptSubmit && missingPayed }" class="input-small" id="payedInput" type="text"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за  <b-form-select v-model="yearSelected" id="yearSelect" :options="yearOptions" size="sm" class="input-small"/> г.
                                                                                                            Парт. <b-form-group class="input-form-group"><b-form-select v-model="form.firstPart" @change="onFirstPartChange()" id="part1Select" :options="partOptions" size="sm" class="input-small"/></b-form-group> поз. <b-form-group class="input-form-group"><b-form-select v-model="form.firstPos" id="pos1Select" :options="pos1Options" size="sm" class="input-small"/></b-form-group> дин. <b-form-group class="input-form-group" id="firstAmountInputFormGroup"><b-form-input v-model="form.firstAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingFirstAmount }" id="firstAmountInput" type="number" min="0" step=".01"></b-form-input></b-form-group>
                  Примио благајник,                                                          Парт. <b-form-group class="input-form-group"><b-form-select v-model="form.secondPart" @change="onSecondPartChange()" id="part2Select" :options="partOptions" size="sm" class="input-small"/></b-form-group> поз. <b-form-group class="input-form-group"><b-form-select v-model="form.secondPos" id="pos2Select" :options="pos2Options" size="sm" class="input-small"/></b-form-group> дин. <b-form-group class="input-form-group" id="secondAmountInputFormGroup"><b-form-input v-model="form.secondAmount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingSecondAmount }" id="secondAmountInput" type="number" min="0" step=".01"></b-form-input></b-form-group>                                                        
                                                           
      <br/><b-form-group class="input-form-group" id="receivedInputFormGroup"><b-form-input v-model="form.received" v-bind:class="{ 'is-invalid': attemptSubmit && missingReceived }" class="input-small" id="receivedInput" type="text"></b-form-input></b-form-group>                                                                    Свега дин. <b-form-group class="input-form-group" id="totalAmountInputFormGroup"><b-form-input v-model="form.amount" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="totalAmountInput" type="number" min="0" step=".01"></b-form-input></b-form-group>                                                
      <div class="my-0 line-spacing-small">
                                                                                                                                                Наредбодавац
                                                                                                                                  Председник црквене општине,
      </div><div style="margin-top:-15px;">Књижено у Дн. бл. стр. <b-form-group class="input-form-group" id="reportPageInputFormGroup"><b-form-input disabled v-model="form.reportPage" class="input-small" id="reportPageInput" type="text"></b-form-input></b-form-group> р. бр. <b-form-group id="ordinalInputFormGroup" class="input-form-group"><b-form-input disabled v-model="form.ordinal" class="input-small" id="ordinalInput" type="text"></b-form-input></b-form-group>.                                               <b-form-group class="input-form-group" id="municipalityPresidentInputFormGroup"><b-form-input v-model="form.municipalityPresident" v-bind:class="{ 'is-invalid': attemptSubmit && missingMunicipalityPresident }" class="input-small" id="municipalityPresidentInput" type="text"></b-form-input></b-form-group>
      </div></div>


  



      
        <b-row>
          <b-col md="9">
          </b-col>
          <b-col md="3">
            <b-button type="submit" variant="secondary" class="ignoreInPrint" id="paymentSlipSaveBtn">
              <img src="~@/assets/save.png" class="btn-img ignoreInPrint">
            </b-button>
            <b-button @click.stop="printPaymentSlip()" variant="secondary" class="ignoreInPrint" id="paymentSlipPrintBtn">
              <img src="~@/assets/print.png" class="btn-img ignoreInPrint">
            </b-button>      
          </b-col>
        </b-row>
              
      <b-tooltip :disabled.sync="disableAmountTooltip" target="amountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableTownTooltip" target="townInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableReasonTooltip" target="reasonInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disablePayedTooltip" target="payedInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableReceivedTooltip" target="receivedInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableFirstAmountTooltip" target="firstAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableSecondAmountTooltip" target="secondAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableTotalAmountTooltip" target="totalAmountInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip :disabled.sync="disableMunicipalityPresidentTooltip" target="municipalityPresidentInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.enterValue}}
        </div>
      </b-tooltip>

      <b-tooltip target="reportPageInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.willBeGenerated}}
        </div>
      </b-tooltip>

      <b-tooltip target="ordinalInputFormGroup">
        <div class="tooltipInnerText">
          {{phrases.willBeGenerated}}
        </div>
      </b-tooltip>

      <b-tooltip target="paymentSlipPrintBtn">
        <div class="tooltipInnerText">
          {{phrases.print}}
        </div>
      </b-tooltip>

      <b-tooltip target="paymentSlipSaveBtn">
        <div class="tooltipInnerText">
          {{phrases.save}}
        </div>
      </b-tooltip>
      </div>
    </b-form>
  </b-container>
</template>

<script>

const paymentSlipsController = require('../../../../controllers/paymentSlip.controller')
const {numberToSerbianDinars, getLastNYears, getIncomeCodeCombinations} = require('../../../../utils')
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
          reportPage: null,
          ordinal: null,
          municipalityPresident: null
        }
      }
    }
  },
  data () {
    return {
      form: this.item,
      attemptSubmit: false,
      show: true,
      yearSelected: null,
      phrases: {
        save: i18n.getTranslation('Save'),
        print: i18n.getTranslation('Print'),
        willBeGenerated: i18n.getTranslation('The value will be generated'),
        enterValue: i18n.getTranslation('Enter a value')
      }
    }
  },
  watch: {
    item: function () {
      /* Deep clone the item using JSON parsing */
      this.form = JSON.parse(JSON.stringify(this.item))
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.attemptSubmit = true
      if (this.checkForm()) {
        if (this.form._id) {
          /* Update the item */
          paymentSlipsController.updatePaymentSlip(this.form)
        } else {
          /* Create new item */
          paymentSlipsController.createPaymentSlip(this.form)
        }
        this.$root.$emit('bv::refresh::table', 'payment-slips-table')
        this.resetForm()
        this.$root.$emit('bv::hide::modal', 'modalCreateSlip')
      }
    },
    onReset (evt) {
      evt.preventDefault()
      this.resetForm()
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    },
    checkForm () {
      if (!this.form.amount ||
          !this.form.reason ||
          !this.form.town ||
          !this.form.payed ||
          !this.form.received ||
          !this.form.firstAmount ||
          !this.form.secondAmount ||
          !this.form.municipalityPresident) {
        return false
      }
      return true
    },
    resetForm () {
      this.form = {
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
        reportPage: null,
        ordinal: null,
        municipalityPresident: null
      }
      this.attemptSubmit = false
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
      this.$root.$emit('bv::hide::modal', 'modalCreateSlip')
    }
  },
  computed: {
    generatedAmountText: {
      get: function () {
        var placeholder = '_______________________________________________________________________________________________________________________________________'
        if (this.form) {
          var generatedText = numberToSerbianDinars(this.form.amount)
          if (!generatedText) {
            return placeholder
          } else {
            return generatedText
          }
        } else {
          return placeholder
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
          this.$root.$emit('bv::hide::tooltip', 'amountInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'townInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'reasonInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'payedInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'receivedInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'firstAmountInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'secondAmountInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'totalAmountInputFormGroup')
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
          this.$root.$emit('bv::hide::tooltip', 'municipalityPresidentInputFormGroup')
        }
      }
    },
    yearOptions: function () {
      return getLastNYears(10)
    },
    incomeCodeCombinations: function () {
      return getIncomeCodeCombinations()
    },
    partOptions: function () {
      return Object.keys(this.incomeCodeCombinations)
    },
    pos1Options: function () {
      return this.incomeCodeCombinations[this.form.firstPart]
    },
    pos2Options: function () {
      return this.incomeCodeCombinations[this.form.secondPart]
    },
    showWs: function () {
      return this.generatedAmountText.length < 55
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
    }
  }
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
  border-style: dotted;
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
  white-space:normal !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
}
#totalAmountInput{
  width: 100px;
}
#reportPageInput{
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
</style>

<style>
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
