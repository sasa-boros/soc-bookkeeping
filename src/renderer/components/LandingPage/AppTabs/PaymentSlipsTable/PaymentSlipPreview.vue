<template>           
  <b-container fluid id="payment-slip-preview-container">
  <div class="payment-slip-preview-text">
    <h1> {{slipText.title}} </h1>
  <br/>На дин. <b-form-input class="input-small" id="priceInput" type="text" placeholder="___________________________"></b-form-input> и словима <b-form-input class="input-small" id="priceWithLettersInput"  type="text" placeholder="..........................................................................................."></b-form-input>
  <br/><b-form-input class="input-small" id="priceWithLettersInputPt2"  type="text" placeholder="......................................................................................................................................................."></b-form-input>
  колико сам данас уплатио у благајну Српске православне црквене општине
  у <b-form-input class="input-small" id="placeInput" type="text" placeholder="......................................................"></b-form-input> на име <b-form-input class="input-small" id="nameInput" type="text" placeholder="................................................................................."></b-form-input>
                                                                                                                  Уплатио,
  Примио благајник,                                                        <b-form-input class="input-small" id="payerInput" type="text" placeholder="................................................................"></b-form-input>
                                                                                           Књижити у корист буџета за                                                                        
  <br/><b-form-input class="input-small" type="text" placeholder="................................................................"></b-form-input>                                                    
  <div id="divprice">asdhbksjhfskjdhfvkajhsdvfkahsdvfkhasdvf</div>

  <div id="divContentEditable" contenteditable="true">asdhbksjhfskjdhfvkajhsdvfkahsdvfkhasdvf</div>
  </div>
  </b-container>
</template>

<script>

const slipText = {
  title: 'УПЛАТНИЦА',
  text: [
    'На дин. ........................... и словима ...........................................................................................',
    '.......................................................................................................................................................',
    'колико сам данас уплатио у благајну Српске православне црквене општине',
    'у ...................................................... на име .................................................................................',
    '                                                                                                                Уплатио,',
    'Примио благајник,                                                        ................................................................'
  ]
}

export default {
  data () {
    return {
      slipText
    }
  }
}
</script>

<style scoped>
#payment-slip-preview-container{
  width: 794px; 
  height: 559px; 
  border-style: solid;
  font-family: "Times New Roman";
  position: relative;
}
.payment-slip-preview-text{
  white-space: pre;
  width: 670px; 
  height: 520px; 
  border-style: solid;
  border-color: blue;
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
}
#priceInput{
  width: 110px;
}
#priceWithLettersInput{
  width: 370px;
}
#priceWithLettersInputPt2{
  width: 615px;
}
#placeInput{
  width: 220px;
}
#nameInput{
  width: 330px;
}
#payerInput{
  width: 260px;
}
#divContentEditable{ 
  -ms-flow-into: article;
  -webkit-flow-into: article;
}
</style>
