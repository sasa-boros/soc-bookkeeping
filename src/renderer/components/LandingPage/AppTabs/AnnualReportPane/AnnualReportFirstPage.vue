<template>
  <b-container fluid class="pageDiv">
    <div class="headerDiv">
    <h1><b>ДНЕВНИК БЛАГАЈНЕ</b></h1>
    Српске православне цркве
    <div class="textWrapperDiv municipalityTextWrapperDiv">{{municipalityTextLine1}}</div>
    <br/><div class="textWrapperDiv municipalityTextWrapperDiv">{{municipalityTextLine2}}</div>

    <div style="display: inline;">за <div class="textWrapperDiv yearTextWrapperDiv" id="yearWrapperDiv">{{yearText}}.</div> годину </div>
    </div>
  </b-container>
</template>

<script>
  export default {
    props: {
      church: {
        type: String,
        default: ''
      },
      year: {
        deafult: ''
      }
    },
    data () {
      return {
      }
    },
    computed: {
      municipalityTextLine1: function () {
        return this.church
      },
      municipalityTextLine2: function () {
        return ''
      },
      yearText: function () {
        return this.year
      }
    }
  }
</script>

<style scoped>
  .pageDiv {
    font-family: "Times New Roman";
    letter-spacing: 1px;
    border: solid 1px;
    border-color: #ddeeee;
    background-color: white;
    width: 41.9cm !important;
    height: 29.6cm !important;
    padding: 0px !important;
    margin: 0px !important;
    text-align: center;
    /* Vertical centering */
    display: flex;
    justify-content: center;
    align-items: center; 
  }
  .headerDiv {
    border: solid 7px;
    border-radius: 20px;
    width: 505px;
    height: 325px;
    margin: 0 auto;
  }
  .textWrapperDiv {
    font-weight: bold;
    color: black;
    font-size: 110% !important;
    line-height: 2 !important;
    min-height: 4 !important;
    border-bottom: solid;
    border-width: 2px;
  }
  .municipalityTextWrapperDiv {
    width: 400px;
  }
  .yearTextWrapperDiv {
    width: 200px;
  }
</style>