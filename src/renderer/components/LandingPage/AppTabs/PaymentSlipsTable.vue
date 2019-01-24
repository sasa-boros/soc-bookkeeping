<template> 
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col md="1" class="my-1">
        <b-button-group size="sm">
          <b-btn v-b-tooltip.hover.html="phrases.addPaymentSlip" @click.stop="openCreatePayslipModal($event.target)">
            <img src="~@/assets/add1.png" class="btn-img">               
          </b-btn>
          <b-btn v-b-tooltip.hover.html="phrases.deleteSelected" @click.stop="deleteCheckedSlips()" :disabled="noRowChecked" id="deleteSelectedBtn">
            <img src="~@/assets/trash1.png" class="btn-img">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col md="8" class="my-1">
        <b-form-group horizontal class="my-0">
          <b-form-group class="my-0" id="filterInputFormGroup">
            <div class="inputWithIcon">
              <b-form-input v-model="filter" :placeholder="phrases.search" />
              <img src="~@/assets/search-blue.png" class="btn-img fa fa-user fa-lg fa-fw" aria-hidden="true">
            </div>
          </b-form-group>
          <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
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
             v-model="itemsShownInTable"
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
             :empty-text="phrases.noRecordsToShow"
             :empty-filtered-text="phrases.noRecordsToShowFiltered"
    >
      <template slot="HEAD_select" scope="data">
        <b-form-checkbox @click.native.stop="toggleCheckAll" v-model="checkAll">
        </b-form-checkbox>
      </template>
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
        <b-form-checkbox :value="row.item" v-model="checkedItems">
        </b-form-checkbox>
      </template>
      <template slot="formatedCreatedAt" slot-scope="row">{{ row.item.created_at | formateDate }}</template>
    </b-table>
    </div>

    <b-row>
      <b-col md="6" class="my-4">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Create slip modal -->
    <b-modal hide-footer hide-header size="a5" id="modalCreateSlip" @hide="resetModal">
      <payment-slip-preview :item='selectedItem' :newlyOpened.sync='modalNewlyOpened'></payment-slip-preview>
    </b-modal>

  </b-container>
</template>

<script>
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  const { dialog } = require('electron').remote

  const { getLastNYears } = require('../../../utils')
  const paymentSlipsController = require('../../../controllers/paymentSlip.controller')
  const i18n = require('../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          cancel: i18n.getTranslation('Cancel'),
          delete: i18n.getTranslation('Delete'),
          addPaymentSlip: i18n.getTranslation('Add a payment slip'),
          deleteSelected: i18n.getTranslation('Delete selected'),
          seeDetails: i18n.getTranslation('See details'),
          deletePaymentSlip: i18n.getTranslation('Delete payment slip'),
          deletePaymentSlips: i18n.getTranslation('Delete payment slips'),
          search: i18n.getTranslation('Search'),
          town: i18n.getTranslation('Town'),
          amount: i18n.getTranslation('Amount'),
          payed: i18n.getTranslation('Payed'),
          received: i18n.getTranslation('Received'),
          reason: i18n.getTranslation('Reason'),
          areYouSureToDeleteSlip: i18n.getTranslation('Are you sure you want to delete the payment slip?'),
          areYouSureToDeleteCheckedSlips: i18n.getTranslation('Are you sure you want to delete selected payment slips?'),
          noRecordsToShow: i18n.getTranslation('There are no payment slips to show'),
          noRecordsToShowFiltered: i18n.getTranslation('There are no payment slips that pass the filters')
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
        itemsShownInTable: [],
        checkAll: false,
        yearToFilter: (new Date()).getFullYear(),
        modalNewlyOpened: true,
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
      yearOptions: function () {
        return getLastNYears(50)
      },
      noRowChecked () {
        return this.checkedItems.length === 0
      },
      fields () {
        return [
          { key: 'select', label: '', thClass: 'table-col-5' },
          { key: 'actions', label: '', thClass: 'table-col-10' },
          { key: 'amount', label: this.phrases.amount, sortable: true, 'class': 'text-center', thClass: 'thSmall table-col-20' },
          { key: 'reason', label: this.phrases.reason, sortable: true, sortDirection: 'desc', 'class': 'text-center', thClass: 'thSmall table-col-20' },
          { key: 'formatedCreatedAt', label: 'datum', sortable: true, 'class': 'text-center', thClass: 'thSmall table-col-20' }
        ]
      }
    },
    methods: {
      openCreatePayslipModal (button) {
        this.resetSelectedItem()
        this.$root.$emit('bv::hide::tooltip')
        this.$root.$emit('bv::show::modal', 'modalCreateSlip', button)
      },
      toggleCheckAll () {
        /* Before the checkAll changes based on the click, so the logic is reversed in the check */
        this.checkedItems = this.checkAll ? [] : this.itemsShownInTable
      },
      rowDblClickHandler (record, index) {
        this.openUpdateSlipModal(record)
      },
      formatSlipForDialog (slip) {
        return this.phrases.amount + ':   ' + slip.amount + '\n' + this.phrases.reason + ':   ' + slip.reason
      },
      deleteSlip (item) {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          title: this.phrases.deletePaymentSlip,
          message: this.phrases.areYouSureToDeleteSlip,
          detail: this.formatSlipForDialog(item),
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          if (response === 1) {
            paymentSlipsController.deletePaymentSlip(item._id)
            this.$root.$emit('bv::refresh::table', 'payment-slips-table')
            const itemCheckedIndex = this.checkedItems.indexOf(item)
            if (itemCheckedIndex !== -1) {
              this.checkedItems.splice(itemCheckedIndex, 1)
            }
          }
        })
      },
      deleteCheckedSlips () {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          title: this.phrases.deletePaymentSlips,
          message: this.phrases.areYouSureToDeleteCheckedSlips,
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          if (response === 1) {
            this.checkedItems.forEach(function (item) {
              paymentSlipsController.deletePaymentSlip(item._id)
            })
            this.$root.$emit('bv::refresh::table', 'payment-slips-table')
            this.checkedItems = []
          }
        })
      },
      openUpdateSlipModal (item) {
        this.selectedItem = item
        this.$root.$emit('bv::show::modal', 'modalCreateSlip')
      },
      resetModal () {
        this.resetSelectedItem()
        this.modalNewlyOpened = true
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      paymentSlipsProvider (ctx) {
        return paymentSlipsController.getPaymentSlips(this.yearToFilter)
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
    filters: {
      formateDate (date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const language = i18n.usedLanguage
        return (new Date(date)).toLocaleDateString(language, options)
      }
    },
    watch: {
      checkedItems (newValue, oldValue) {
        this.checkAll = (this.itemsShownInTable.length === newValue.length)
        if (newValue.length === 0) {
          /* Close delete-selected button tooltip before it gets disabled and stuck */
          this.$root.$emit('bv::hide::tooltip', 'deleteSelectedBtn')
        }
      }
    },
    components: { PaymentSlipPreview }
  }
</script>

<style scoped>
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
  #yearSelect{
    width: 80px;
    display: inline;
  }
  #filterInputFormGroup{
    width: 200px;
    display: inline;
  }
  .thSmall{
    font-size: 80%;
  }
  .table-col-5{
    width: 5% !important;
  }
  .table-col-10{
    width: 10% !important;
  }
  .table-col-30{
    width: 30% !important;
  }
</style>
