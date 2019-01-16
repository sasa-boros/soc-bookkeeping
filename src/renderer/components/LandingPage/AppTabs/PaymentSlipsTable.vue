<template>           
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col md="2" class="my-1">
        <b-button-group size="sm">
          <b-btn v-b-tooltip.hover.html="phrases.addPaymentSlip" @click.stop="openCreatePayslipModal($event.target)">
            <img src="~@/assets/add1.png" class="btn-img">               
          </b-btn>
          <b-btn v-b-tooltip.hover.html="phrases.deleteSelected" @click.stop="deleteCheckedSlips()" :disabled="noRowChecked">
            <img src="~@/assets/trash1.png" class="btn-img">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col md="7" class="my-1">
        <b-form-group horizontal class="mb-0">
          <b-input-group>
            <div class="inputWithIcon">
              <b-form-input v-model="filter" :placeholder="phrases.search" />
              <img src="~@/assets/search-blue.png" class="btn-img fa fa-user fa-lg fa-fw" aria-hidden="true">
            </div>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="3" class="my-1">
        <b-form-group horizontal class="mb-0" size="sm">
          <b-form-select :options="pageOptions" v-model="perPage" id="perPageSelect" size="sm"/>
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
          <b-button v-b-tooltip.hover.html="phrases.seeDetails" @click.stop="openUpdateSlipModal(row.item)" class="mr-1 btn-xs" size="sm" >
            <img src="~@/assets/see-more1.png" class="btnImgSm">                                           
          </b-button>
          <b-button v-b-tooltip.hover.html="phrases.deletePaymentSlip" @click.stop="deleteSlip(row.item)" class="mr-1 btn-xs" size="sm" >
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

  const paymentSlipsController = require('../../../controllers/paymentSlip.controller')
  const i18n = require('../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          addPaymentSlip: i18n.getTranslation('Add a payment slip'),
          deleteSelected: i18n.getTranslation('Delete selected'),
          seeDetails: i18n.getTranslation('See details'),
          deletePaymentSlip: i18n.getTranslation('Delete payment slip'),
          search: i18n.getTranslation('Search'),
          town: i18n.getTranslation('Town'),
          amount: i18n.getTranslation('Amount'),
          payed: i18n.getTranslation('Payed'),
          received: i18n.getTranslation('Received'),
          reason: i18n.getTranslation('Reason')
        },
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
      },
      fields () {
        return [
          { key: 'select', label: '' },
          { key: 'actions', label: '', 'class': 'text-center' },
          { key: 'town', label: this.phrases.town, sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'amount', label: this.phrases.amount, sortable: true, 'class': 'text-center', thClass: 'thSmall' },
          { key: 'reason', label: this.phrases.reason, sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'payed', label: this.phrases.payed, sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'received', label: this.phrases.received, sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'firstPartPos', label: 'Part-pos', sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'firstAmount', label: 'Amount', sortable: true, 'class': 'text-center', thClass: 'thSmall' },
          { key: 'secondPartPos', label: 'Part-pos', sortable: true, sortDirection: 'desc', thClass: 'thSmall' },
          { key: 'secondAmount', label: 'Amount', sortable: true, 'class': 'text-center', thClass: 'thSmall' },
          { key: 'municipalityPresident', label: 'Municipality President', sortable: true, sortDirection: 'desc', thClass: 'thSmall' }
        ]
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
    components: { PaymentSlipPreview }
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
  .inputWithIcon input[type="text"] {
    padding-left: 40px;
  }
  .inputWithIcon {
    position: relative;
    transition: 0.3s;
  }
  .inputWithIcon img {
    position: absolute;
    left: 0;
    top: 0px;
    padding: 3px 2px;
    color: #111;
    transition: 0.3s;
    filter: grayscale(100%);
  }
  .inputWithIcon input[type="text"]:focus + img {
    filter: none;
  }
  #perPageSelect{
    width: 60px;
  }
  .thSmall{
    font-size: 90%;
  }
</style>
