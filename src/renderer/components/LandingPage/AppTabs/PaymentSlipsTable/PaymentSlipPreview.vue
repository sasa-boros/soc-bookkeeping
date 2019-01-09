<template>           
  <b-container fluid id="payment-slip-preview-container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" no-validation>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group"><b-form-input v-model="form.amount" v-b-tooltip.hover.html="missingAmountTooltipText" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="amountInput" type="number" min="0" step=".01" placeholder="______________________________________"></b-form-input></b-form-group> и словима <b-form-group class="input-form-group"><b-form-input v-model="generatedAmountWithLetters" class="input-small" id="amountWithLettersInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input></b-form-group>
      <br/><b-form-group class="input-form-group"><b-form-input class="input-small" id="amountWithLettersInputPt2"  type="text" placeholder="_________________________________________________________________________________________________________________________________________"></b-form-input></b-form-group>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group"><b-form-input v-model="form.town" class="input-small" v-b-tooltip.hover.html="missingTownTooltipText" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text" placeholder="___________________________________________________________________________"></b-form-input></b-form-group> на име <b-form-group class="input-form-group"><b-form-input v-model="form.reason" v-b-tooltip.hover.html="missingReasonTooltipText" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-group class="input-form-group"><b-form-input class="input-small" id="payerInput" type="text" placeholder="_______________________________________________________________________________"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за                                                                        
      <br/><b-form-group class="input-form-group"><b-form-input class="input-small" type="text" placeholder="................................................................"></b-form-input></b-form-group>                                                   
      </div>
      
      Примио благајник, 
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
      </div>
    </b-form>
  </b-container>
</template>

<script>

const paymentSlipsController = require('../../../../controllers/paymentSlip.controller')
const {numberToSerbianDinars} = require('../../../../utils')

export default {
  data () {
    return {
      form: {
        amount: null,
        reason: null,
        town: null,
        amountWithLetters: null
      },
      attemptSubmit: false,
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      this.attemptSubmit = true
      if (this.checkForm()) {
        paymentSlipsController.createPaymentSlip(this.form)
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
          !this.form.town) {
        return false
      }
      return true
    },
    resetForm () {
      this.form.amount = null
      this.form.reason = null
      this.form.town = null
      this.form.amountWithLetters = null
      this.attemptSubmit = false
    }
  },
  computed: {
    generatedAmountWithLetters: {
      get: function () {
        return numberToSerbianDinars(this.form.amount)
      },
      set: function (newValue) {
      }
    },
    missingReason: function () {
      return !this.form.reason || this.form.reason.trim() === ''
    },
    missingTown: function () {
      return !this.form.town || this.form.town.trim() === ''
    },
    missingAmount: function () {
      return !this.form.amount || this.form.amount.trim() === ''
    },
    missingReasonTooltipText: function () {
      if (this.missingReason && this.attemptSubmit) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    },
    missingTownTooltipText: function () {
      if (this.missingTown && this.attemptSubmit) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    },
    missingAmountTooltipText: function () {
      if (this.missingAmount && this.attemptSubmit) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
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
}
.input-small::placeholder{
  border-style: none;
  font-weight: normal;
  color: #d3d3d3;
}
.is-invalid {
  border-style: dotted;
}
#amountInput{
  width: 140px;
}
#amountWithLettersInput{
  width: 410px;
}
#amountWithLettersInputPt2{
  width: 670px;
}
#townInput{
  width: 180px;
}
#reasonInput{
  width: 430px;
}
#payerInput{
  width: 288px;
}
#divContentEditable{ 
  -ms-flow-into: article;
  -webkit-flow-into: article;
}
</style>
