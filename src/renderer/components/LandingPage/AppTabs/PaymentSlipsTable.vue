<template>           
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col md="2" class="my-1">
        <b-button-group size="sm">
          <b-btn @click.stop="create($event.target)">
            New
          </b-btn>
          <b-btn>
            Delete 
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal label="Filter" class="mb-0">
          <b-input-group>
            <b-form-input v-model="filter" placeholder="Type to Search" />
            <b-input-group-append>
              <b-btn :disabled="!filter" @click="filter = ''">Clear</b-btn>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="4" class="my-1">
        <b-form-group horizontal label="Per page" class="mb-0">
          <b-form-select :options="pageOptions" v-model="perPage" />
        </b-form-group>
      </b-col>
    </b-row>

    <!-- Main table element -->
    <b-table show-empty hover small id="payment-slips-table"
             stacked="md"
             :items="paymentSlipsProvider"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             :no-provider-sorting="true"
             :no-provider-filtering="true"
             :no-provider-paging="true"
             @filtered="onFiltered"
    >
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->
        
      <b-button-group size="sm">
        <b-button size="sm" @click.stop="info(row.item, row.index, $event.target)" class="mr-1">
          <img src="~@/assets/see.png" class="btn-img">
        </b-button>   
        <b-button size="sm" @click.stop="deleteSlip(row.item)" class="mr-1">
          <img src="~@/assets/delete.png" class="btn-img">                                           
        </b-button>       
        <b-button size="sm" @click.stop="updateSlip(row.item)" class="mr-1">
          <img src="~@/assets/delete.png" class="btn-img">                                           
        </b-button>  
      </b-button-group>                
      </template>
      <template slot="show_details" slot-scope="row">
        <!-- In some circumstances you may need to use @click.native.stop instead -->
        <!-- As `row.showDetails` is one-way, we call the toggleDetails function on @change -->
        <b-form-checkbox @click.native.stop @change="row.toggleDetails" v-model="row.detailsShowing">
        </b-form-checkbox>
      </template>
    </b-table>

    <b-row>
      <b-col md="6" class="my-1">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Info modal -->
    <b-modal hide-footer hide-header size="a5" id="modalInfo" @hide="resetModal" >
      <payment-slip-preview></payment-slip-preview>
    </b-modal>

    <!-- Create slip modal -->
    <b-modal hide-footer hide-header size="a5" id="modalCreateSlip" @hide="resetModal">
      <payment-slip-preview></payment-slip-preview>
    </b-modal>

  </b-container>
</template>

<script>
import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
import PaymentSlipPreviewSimple from './PaymentSlipsTable/PaymentSlipPreviewSimple'

const paymentSlipsController = require('../../../controllers/paymentSlip.controller')

export default {
  data () {
    return {
      fields: [
        {key: 'show_details', label: ''},
        { key: 'town', label: 'Town', sortable: true, sortDirection: 'desc' },
        { key: 'amount', label: 'Amount', sortable: true, 'class': 'text-center' },
        { key: 'reason', label: 'Reason', sortable: true, sortDirection: 'desc' },
        {key: 'actions', label: '', 'class': 'text-center'}
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: null,
      pageOptions: [ 10, 25, 50 ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalInfo: { title: '', content: '' },
      modalCreateSlip: { title: 'Create new payment slip' }
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    }
  },
  methods: {
    info (item, index, button) {
      this.modalInfo.title = `Row index: ${index}`
      this.modalInfo.content = JSON.stringify(item, null, 2)
      this.$root.$emit('bv::show::modal', 'modalInfo', button)
    },
    create (button) {
      this.$root.$emit('bv::show::modal', 'modalCreateSlip', button)
    },
    deleteSlip (item) {
      paymentSlipsController.deletePaymentSlip(item._id)
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
    },
    updateSlip (item) {
      item.amount++
      paymentSlipsController.updatePaymentSlip(item)
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
    },
    resetModal () {
      this.modalInfo.title = ''
      this.modalInfo.content = ''
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    paymentSlipsProvider (ctx) {
      return paymentSlipsController.getPaymentSlips()
    }
  },
  components: { PaymentSlipPreview, PaymentSlipPreviewSimple }
}
</script>

<style>
.modal .modal-a5 {
  max-width: 830px;
  width: 830px;
}
</style>
