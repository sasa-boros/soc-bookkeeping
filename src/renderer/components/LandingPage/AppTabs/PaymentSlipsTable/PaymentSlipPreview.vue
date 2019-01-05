<template>           
  <b-container fluid id="payment-slip-preview-container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" no-validation>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-input required v-model="form.amount" class="input-small" id="amountInput" type="text" placeholder="______________________________________"></b-form-input> и словима <b-form-input required v-model="generatedAmountWithLetters" class="input-small" id="amountWithLettersInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input>
      <br/><b-form-input class="input-small" id="amountWithLettersInputPt2"  type="text" placeholder="_________________________________________________________________________________________________________________________________________"></b-form-input>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-input required v-model="form.town" class="input-small" id="townInput" type="text" placeholder="___________________________________________________________________________"></b-form-input> на име <b-form-input required v-model="form.reason" class="input-small" id="reasonInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-input class="input-small" id="payerInput" type="text" placeholder="_______________________________________________________________________________"></b-form-input>   
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за                                                                        
      <br/><b-form-input class="input-small" type="text" placeholder="................................................................"></b-form-input>                                                    
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
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      paymentSlipsController.createPaymentSlip(this.form)
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
      this.form.amount = null
      this.form.reason = null
      this.form.town = null
      this.form.amountWithLetters = null
      this.$root.$emit('bv::hide::modal', 'modalCreateSlip')
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.amount = null
      this.form.reason = null
      this.form.town = null
      this.form.amountWithLetters = null
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  },
  computed: {
    generatedAmountWithLetters: {
      get: function () {
        return numberToSerbianDinars(this.form.amount)
      },
      set: function (newValue) {
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
  font-family: "Times New Roman";
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
.input-small{
  border-style: none;
  font-weight: bold;
  padding: 2px;
  display: inline;
  height: 15px;
}
.input-small::placeholder{
  border-style: none;
  font-weight: normal;
  color: #d3d3d3;
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
