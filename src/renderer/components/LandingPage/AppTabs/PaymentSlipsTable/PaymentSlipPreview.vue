<template>           
  <b-container fluid id="payment-slip-preview-container">
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" no-validation>
      <div class="payment-slip-preview-text">
        <h1> УПЛАТНИЦА </h1>
      <br/>На дин. <b-form-input required v-model="form.price" class="input-small" id="priceInput" type="text" placeholder="______________________________________"></b-form-input> и словима <b-form-input required v-model="generatedPriceWithLetters" class="input-small" id="priceWithLettersInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input>
      <br/><b-form-input class="input-small" id="priceWithLettersInputPt2"  type="text" placeholder="_________________________________________________________________________________________________________________________________________"></b-form-input>
      <br/>колико сам данас уплатио у благајну Српске православне црквене општине<br/>у <b-form-input required v-model="form.place" class="input-small" id="placeInput" type="text" placeholder="___________________________________________________________________________"></b-form-input> на име <b-form-input required v-model="form.name" class="input-small" id="nameInput" type="text" placeholder="_______________________________________________________________________________________"></b-form-input>
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

const {numberToSerbianDinars} = require('../../../../utils')

export default {
  data () {
    return {
      form: {
        price: null,
        name: null,
        place: null,
        priceWithLetters: null
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
    },
    onReset (evt) {
    }
  },
  computed: {
    generatedPriceWithLetters: {
      get: function () {
        return numberToSerbianDinars(this.form.price, ' ')
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
#priceInput{
  width: 140px;
}
#priceWithLettersInput{
  width: 410px;
}
#priceWithLettersInputPt2{
  width: 670px;
}
#placeInput{
  width: 180px;
}
#nameInput{
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
