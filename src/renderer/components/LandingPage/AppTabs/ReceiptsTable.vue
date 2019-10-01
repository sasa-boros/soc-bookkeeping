<template> 
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col md="2" class="my-1">
        <b-button-group size="sm">
          <b-btn v-b-tooltip.hover.html="phrases.addReceipt" @click.stop="openCreateReceiptModal($event.target)">
            <img src="~@/assets/add1.png" class="btn-img">               
          </b-btn>
          <b-btn v-b-tooltip.hover.html="phrases.deleteSelected" @click.stop="deleteCheckedReceipts()" :disabled="noRowChecked" id="deleteSelectedBtn">
            <img src="~@/assets/trash1.png" class="btn-img">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col md="7" class="my-1">
        <b-form-group horizontal class="my-0">
          <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
        </b-form-group>
      </b-col>
    </b-row>

    <div class="tableDiv">
    <!-- Main table element -->
    <b-table show-empty hover small id="receipts-table" class="mt-3"
             stacked="md"
             :items="receiptsProvider"
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
             no-sort-reset
             :empty-text="phrases.noRecordsToShow"
             :empty-filtered-text="phrases.noRecordsToShowFiltered"
    >
      <template v-slot:cell(HEAD_select)="row">
        <b-form-checkbox @click.native.stop="toggleCheckAll" v-model="checkAll">
        </b-form-checkbox>
      </template>
      <template v-slot:cell(actions)="row">
        <!-- We use @click.stop here to prevent a 'row-clicked' event from also happening -->   
        <b-button-group size="sm">
          <b-button v-b-tooltip.hover.html="phrases.seeDetails" @click.stop="openUpdateReceiptModal(row.item)" class="mr-1 btn-xs" size="sm" >
            <img src="~@/assets/see-more1.png" class="btnImgSm">                                           
          </b-button>
          <b-button v-b-tooltip.hover.html="phrases.deleteReceipt" @click.stop="deleteReceipt(row.item)" class="mr-1 btn-xs" size="sm" >
            <img src="~@/assets/delete.png" class="btnImgSm">                                           
          </b-button>     
        </b-button-group>                
      </template>
      <template v-slot:cell(select)="row">
        <b-form-checkbox :value="row.item" v-model="checkedItems">
        </b-form-checkbox>
      </template>
      <template v-slot:cell(outcome)="row">{{ row.item.outcome }}</template>
      <template v-slot:cell(reason)="row">{{ row.item.reason }}</template>
      <template v-slot:cell(formatedDate)="row">{{ row.item.date | formatDate }}</template>
      <template v-slot:cell(formatedUpdatedAt)="row">{{ row.item.updatedAt | formatDate }}</template>
    </b-table>
    </div>

    <b-row>
      <b-col md="6" class="my-4">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Create receipt modal -->
    <b-modal hide-footer hide-header size="a5" id="create-receipt-modal">
      <receipt-preview :receipt='selectedItem' :receiptPreview='isPreview' parentModal="create-receipt-modal"></receipt-preview>
    </b-modal>

  </b-container>
</template>

<script>
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'
  const { dialog } = require('electron').remote

  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')
  const receiptController = require('../../../controllers/receiptController')
  const i18n = require('../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          cancel: i18n.getTranslation('Cancel'),
          delete: i18n.getTranslation('Delete'),
          addReceipt: i18n.getTranslation('Add a receipt'),
          deleteSelected: i18n.getTranslation('Delete selected'),
          seeDetails: i18n.getTranslation('See details'),
          deleteReceipt: i18n.getTranslation('Delete the receipt'),
          deleteReceipts: i18n.getTranslation('Delete receipt'),
          town: i18n.getTranslation('Town'),
          outcome: i18n.getTranslation('Amount'),
          payed: i18n.getTranslation('Payed'),
          received: i18n.getTranslation('Received'),
          reason: i18n.getTranslation('Reason'),
          forDate: i18n.getTranslation('For date'),
          updatedAt: i18n.getTranslation('Updated at'),
          areYouSureToDeleteReceipt: i18n.getTranslation('Are you sure you want to delete the receipt?'),
          areYouSureToDeleteCheckedReceipts: i18n.getTranslation('Are you sure you want to delete selected receipts?'),
          noRecordsToShow: i18n.getTranslation('There are no receipts to show'),
          noRecordsToShowFiltered: i18n.getTranslation('There are no receipts that pass the filters')
        },
        currentPage: 1,
        perPage: 10,
        totalRows: null,
        sortBy: null,
        sortDesc: false,
        sortDirection: 'asc',
        filter: null,
        checkedItems: [],
        itemsShownInTable: [],
        checkAll: false,
        yearToFilter: (new Date()).getFullYear(),
        selectedItem: null,
        isPreview: false
      }
    },
    computed: {
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
          { key: 'outcome', label: this.phrases.outcome, sortable: true, 'class': 'text-center', thClass: 'thSmall table-col-20' },
          { key: 'reason', label: this.phrases.reason, sortable: true, sortDirection: 'desc', 'class': 'text-center', thClass: 'thSmall table-col-20' },
          { key: 'formatedDate', label: this.phrases.forDate, sortable: true, 'class': 'text-center', thClass: 'thSmall table-col-15' },
          { key: 'formatedUpdatedAt', label: this.phrases.updatedAt, sortable: true, 'class': 'text-center', thClass: 'thSmall table-col-15' }
        ]
      }
    },
    methods: {
      openCreateReceiptModal (button) {
        this.isPreview = false;
        this.selectedItem = null;
        this.$root.$emit('bv::hide::tooltip')
        this.$root.$emit('bv::show::modal', 'create-receipt-modal', button)
      },
      toggleCheckAll () {
        /* Before the checkAll changes based on the click, so the logic is reversed in the check */
        this.checkedItems = this.checkAll ? [] : this.itemsShownInTable
      },
      rowDblClickHandler (record, index) {
        this.openUpdateReceiptModal(record)
      },
      formatReceiptForDialog (receipt) {
        return this.phrases.outcome + ':   ' + receipt.outcome + '\n' + this.phrases.reason + ':   ' + receipt.reason
      },
      deleteReceipt (item) {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          title: this.phrases.deleteReceipt,
          message: this.phrases.areYouSureToDeleteReceipt,
          detail: this.formatReceiptForDialog(item),
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          console.log(response)
          if (response === 1) {
            const self = this
            receiptController.deleteReceipt(item._id).then((res) => {
              console.log(res)
              if (!res.err) {
                self.$root.$emit('bv::refresh::table', 'receipts-table')
                const itemCheckedIndex = self.checkedItems.indexOf(item)
                if (itemCheckedIndex !== -1) {
                  self.checkedItems.splice(itemCheckedIndex, 1)
                }
              } else {
                showErrorDialog(res.err)
              }
            })
          }
        })
      },
      deleteCheckedReceipts () {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          title: this.phrases.deleteReceipts,
          message: this.phrases.areYouSureToDeleteCheckedReceipts,
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          if (response === 1) {
            const self = this
            this.checkedItems.forEach(function (item) {
              receiptController.deleteReceipt(item._id).then((res) => {
                if (!res.err) {
                  self.$root.$emit('bv::refresh::table', 'receipts-table')
                  const itemCheckedIndex = self.checkedItems.indexOf(item)
                  if (itemCheckedIndex !== -1) {
                    self.checkedItems.splice(itemCheckedIndex, 1)
                  }
                } else {
                  showErrorDialog(res.err)
                }
              })
            })
            // this.$root.$emit('bv::refresh::table', 'receipts-table')
            // this.checkedItems = []
          }
        })
      },
      openUpdateReceiptModal (item) {
        this.isPreview = true
        this.selectedItem = item
        this.$root.$emit('bv::show::modal', 'create-receipt-modal')
      },
      onFiltered (filteredItems) {
        // Trigger pagination to update the number of buttons/pages due to filtering
        this.totalRows = filteredItems.length
        this.currentPage = 1
      },
      receiptsProvider (ctx) {
        return receiptController.getReceipts(this.yearToFilter).then((res) => {
          if (!res.err) {
            const items = res.data
            return (items || [])
          } else {
            showErrorDialog(res.err)
          }
          return null
        })
      },
      resetSelectedItem () {
        this.selectedItem = null
      }
    },
    filters: {
      formatDate (date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const language = i18n.usedLanguage
        return (new Date(date)).toLocaleDateString(language, options)
      }
    },
    watch: {
      checkedItems (newValue, oldValue) {
        this.checkAll = (this.itemsShownInTable.length !== 0 && this.itemsShownInTable.length === newValue.length)
        if (newValue.length === 0) {
          /* Close delete-selected button tooltip before it gets disabled and stuck */
          this.$root.$emit('bv::hide::tooltip', 'deleteSelectedBtn')
        }
      },
      yearToFilter (newValue) {
        this.$root.$emit('bv::refresh::table', 'receipts-table')
        this.checkedItems = []
      }
    },
    components: { ReceiptPreview }
  }
</script>

<style>
  .modal .modal-a5 {
    max-width: 830px;
    width: 830px;
  }
</style>

<style scoped>
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
