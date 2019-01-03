<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show" novalidate>
      <b-form-group id="exampleInputGroup1"
                    label="Item:"
                    label-for="exampleInput1">
        <b-form-input id="exampleInput1"
                      type="text"
                      v-model="form.item"
                      required
                      placeholder="">
        </b-form-input>
      </b-form-group>
      <b-form-group id="exampleInputGroup2"
                    label="Price:"
                    label-for="exampleInput2">
        <b-form-input id="exampleInput2"
                      type="number"
                      v-model="form.price"
                      required
                      placeholder="">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
  </div>
</template>

<script>
const paymentSlipsController = require('../../../../controllers/paymentSlip.controller')

export default {
  data () {
    return {
      form: {
        item: '',
        price: null
      },
      show: true
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      paymentSlipsController.createPaymentSlip(this.form)
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
      this.form.item = ''
      this.form.price = null
      this.$root.$emit('bv::hide::modal', 'modalCreateSlip')
    },
    onReset (evt) {
      evt.preventDefault()
      /* Reset our form values */
      this.form.item = ''
      this.form.price = null
      /* Trick to reset/clear native browser form validation state */
      this.show = false
      this.$nextTick(() => { this.show = true })
    }
  }
}
</script>

<style scoped>
</style>
