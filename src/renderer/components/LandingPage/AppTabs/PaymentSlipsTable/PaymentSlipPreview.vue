<template>           
  <b-container fluid id="payment-slip-preview-container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" no-validation>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-group class="input-form-group"><b-form-input v-model="form.amount" v-b-tooltip.hover.html="missingAmountTooltipText" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingAmount }" id="amountInput" type="number" min="0" step=".01" placeholder="______________________________________"></b-form-input></b-form-group> и словима  <div class="parent" contenteditable="false" id="divContentEditable">{{generatedAmountText}}</div><br v-if="showWs" />
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-group class="input-form-group"><b-form-input v-model="form.town" class="input-small" v-b-tooltip.hover.html="missingTownTooltipText" v-bind:class="{ 'is-invalid': attemptSubmit && missingTown }" id="townInput" type="text" placeholder="___________________________________________________________________________"></b-form-input></b-form-group> на име <b-form-group class="input-form-group"><b-form-input v-model="form.reason" v-b-tooltip.hover.html="missingReasonTooltipText" class="input-small" v-bind:class="{ 'is-invalid': attemptSubmit && missingReason }" id="reasonInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input></b-form-group>
      <div class="mt-2">                                                                                                                                        У п л а т и о,
                                                                                                            <b-form-group class="input-form-group"><b-form-input class="input-small" id="payerInput" type="text" placeholder="_______________________________________________________________________________"></b-form-input></b-form-group>  
      </div><div class="mt-2">                                                                                                          Књижити у корист буџета за                                                                        
      <br/><b-form-group class="input-form-group"><b-form-input class="input-small" type="text" placeholder="................................................................"></b-form-input></b-form-group>                                                   
      </div>
      
      Примио благајник, 

      
        <b-row>
          <b-col md="8">
          </b-col>
          <b-col md="4">
            <b-button type="submit" variant="secondary" class="ignoreInPrint">
              <img src="~@/assets/save.png" class="btn-img ignoreInPrint">
            </b-button>
            <b-button type="reset" variant="danger" class="ignoreInPrint">Reset</b-button>
            <b-button @click.stop="printPaymentSlip()" variant="secondary" class="ignoreInPrint">
              <img src="~@/assets/print.png" class="btn-img ignoreInPrint">
            </b-button>      
          </b-col>
        </b-row>
      </div>
    </b-form>
  </b-container>
</template>

<script>

const paymentSlipsController = require('../../../../controllers/paymentSlip.controller')
const {numberToSerbianDinars} = require('../../../../utils')

export default {
  props: {
    item: {
      type: Object,
      default: function () {
        return {
          amount: null,
          reason: null,
          town: null,
          amountText: null
        }
      }
    }
  },
  data () {
    return {
      form: this.item,
      attemptSubmit: false,
      show: true
    }
  },
  watch: {
    item: function () {
      this.form = this.item
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
          !this.form.town) {
        return false
      }
      return true
    },
    resetForm () {
      this.form = {}
      this.attemptSubmit = false
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
    missingReasonTooltipText: function () {
      if (this.attemptSubmit && this.missingReason) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    },
    missingTownTooltipText: function () {
      if (this.attemptSubmit && this.missingTown) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    },
    missingAmountTooltipText: function () {
      if (this.attemptSubmit && this.missingAmount) {
        return 'Унесите вредност'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>
input { 
  text-align: center; 
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
#payerInput{
  width: 288px;
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
