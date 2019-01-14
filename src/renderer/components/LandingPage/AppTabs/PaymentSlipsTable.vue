<template>           
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col md="2" class="my-1">
        <b-button-group size="sm">
          <b-btn @click.stop="openCreatePayslipModal($event.target)">
            <img src="~@/assets/add1.png" class="btn-img">               
          </b-btn>
          <b-btn @click.stop="deleteCheckedSlips()" :disabled="noRowChecked">
            <img src="~@/assets/trash1.png" class="btn-img">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col md="6" class="my-1">
        <b-form-group horizontal class="mb-0">
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

    <div class="tableDiv">
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
             @row-dblclicked="rowDblClickHandler" 
             responsive
    >
      <template slot="actions" slot-scope="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->   
        <b-button-group size="sm">
          <b-button size="sm" @click.stop="openUpdateSlipModal(row.item)" class="mr-1 btn-xs">
            <img src="~@/assets/see-more1.png" class="btnImgSm">                                           
          </b-button>
          <b-button size="sm" @click.stop="deleteSlip(row.item)" class="mr-1 btn-xs">
            <img src="~@/assets/delete.png" class="btnImgSm">                                           
          </b-button>     
        </b-button-group>                
      </template>
      <template slot="select" slot-scope="row">
        <b-form-checkbox :value="row.item._id" v-model="checkedItems">
        </b-form-checkbox>
      </template>
      <template slot="firstPartPos" slot-scope="row">{{row.item.firstPart}}-{{row.item.firstPos}}</template>
      <template slot="secondPartPos" slot-scope="row">{{row.item.secondPart}}-{{row.item.secondPos}}</template>
    </b-table>
    </div>

    <b-row>
      <b-col md="6" class="my-3">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Create slip modal -->
    <b-modal hide-footer hide-header size="a5" id="modalCreateSlip" @hide="resetModal">
      <payment-slip-preview :item='selectedItem'></payment-slip-preview>
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
        {key: 'select', label: ''},
        {key: 'actions', label: '', 'class': 'text-center'},
        { key: 'town', label: 'Town', sortable: true, sortDirection: 'desc' },
        { key: 'amount', label: 'Amount', sortable: true, 'class': 'text-center' },
        { key: 'reason', label: 'Reason', sortable: true, sortDirection: 'desc' },
        { key: 'payed', label: 'Payed', sortable: true, sortDirection: 'desc' },
        { key: 'received', label: 'Received', sortable: true, sortDirection: 'desc' },
        { key: 'firstPartPos', label: 'First part and pos', sortable: true, sortDirection: 'desc' },
        { key: 'firstAmount', label: 'Amount', sortable: true, 'class': 'text-center' },
        { key: 'secondPartPos', label: 'Second part and pos', sortable: true, sortDirection: 'desc' },
        { key: 'secondAmount', label: 'Amount', sortable: true, 'class': 'text-center' },
        { key: 'municipalityPresident', label: 'Municipality President', sortable: true, sortDirection: 'desc' }
      ],
      currentPage: 1,
      perPage: 10,
      totalRows: null,
      pageOptions: [ 10, 25, 50 ],
      sortBy: null,
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      modalCreateSlip: { title: 'Create new payment slip' },
      checkedItems: [],
      checkAll: false,
      selectedItem: {
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
        municipalityPresident: null
      }
    }
  },
  computed: {
    sortOptions () {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => { return { text: f.label, value: f.key } })
    },
    noRowChecked () {
      return this.checkedItems.length === 0
    }
  },
  methods: {
    openCreatePayslipModal (button) {
      this.resetSelectedItem()
      this.$root.$emit('bv::show::modal', 'modalCreateSlip', button)
    },
    rowDblClickHandler (record, index) {
      this.openUpdateSlipModal(record)
    },
    deleteSlip (item) {
      paymentSlipsController.deletePaymentSlip(item._id)
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
    },
    deleteCheckedSlips () {
      this.checkedItems.forEach(function (id) {
        paymentSlipsController.deletePaymentSlip(id)
      })
      this.$root.$emit('bv::refresh::table', 'payment-slips-table')
    },
    openUpdateSlipModal (item) {
      this.selectedItem = item
      this.$root.$emit('bv::show::modal', 'modalCreateSlip')
    },
    resetModal () {
      this.resetSelectedItem()
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    paymentSlipsProvider (ctx) {
      return paymentSlipsController.getPaymentSlips()
    },
    resetSelectedItem () {
      this.selectedItem = {
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
        municipalityPresident: null
      }
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
.tableDiv{
  display: block;
  overflow: auto;
}
.btnImgSm{
  width: 25px;
  height: auto;
}
</style>
