<template> 
  <b-container fluid>
    <!-- User Interface controls -->
     <br>
     <b-row>
      <b-col cols="6">
        <b-button-group class="float-left">
          <b-btn v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.addReceipt, customClass: 'tooltipInnerText'}" @click.stop="openCreateReceiptModal($event.target)" variant="link" class="btn-xs">
            <img src="~@/assets/add1.png">               
          </b-btn>
        </b-button-group>
        <b-button-group class="float-left">
          <b-btn v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.deleteSelected, customClass: 'tooltipInnerText'}" @click.stop="openDeleteCheckedReceiptsModal()" :disabled="noRowChecked" :class="{disabledBtn : noRowChecked}" id="deleteSelectedBtn" variant="link" class="btn-xs">
            <img src="~@/assets/trash1.png">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col cols="6">
        <b-form-group class="float-right">
          <label :for="`yearSelect`">{{phrases.filterByYear}}: </label>
          &nbsp;
          <b-form-select v-model="yearToFilter" id="yearSelect" :options="yearOptions" size="sm" class="my-0"/>
        </b-form-group>
      </b-col>
    </b-row>

    <div class="tableDiv">
    <!-- Main table element -->
    <b-table show-empty hover small id="receipts-table" class="mt-3"
             stacked="md"
             :items="items"
             v-model="itemsShownInTable"
             :fields="fields"
             :current-page="currentPage"
             :per-page="perPage"
             :filter="filter"
             :no-provider-sorting="true"
             :no-provider-filtering="true"
             :no-provider-paging="true"
              head-variant="light"
             @row-dblclicked="rowDblClickHandler" 
             responsive
             no-sort-reset
             :empty-text="phrases.noRecordsToShow"
             :empty-filtered-text="phrases.noRecordsToShow"
    >
      <template v-slot:head(select)="row">
        <span v-on:mouseleave="$root.$emit('bv::hide::tooltip')">
          <b-form-checkbox  v-b-tooltip.hover.right="{title: phrases.selectAll, customClass: 'tooltipInnerText'}" v-on:change="toggleCheckAll" v-model="checkAll">
          </b-form-checkbox>
         </span>
      </template>
      <template v-slot:cell(preview)="row">
        <b-button-group>
          <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.seeDetails, customClass: 'tooltipInnerText'}" @click.stop="openUpdateReceiptModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
            <img src="~@/assets/see-more1.png">                                           
          </b-button>
        </b-button-group>                
      </template>
      <template v-slot:cell(select)="row">
        <span v-on:mouseleave="$root.$emit('bv::hide::tooltip')">
          <b-form-checkbox v-b-tooltip.hover.top="{title: phrases.select, customClass: 'tooltipInnerText'}" :value="row.item" v-model="checkedReceipts">
          </b-form-checkbox>
        </span>
      </template>
      <template v-slot:cell(outcome)="row">{{ row.item.outcome }}</template>
      <template v-slot:cell(reason)="row">{{ row.item.reason }}</template>
      <template v-slot:cell(formatedDate)="row">{{ row.item.date | formatDate }}</template>
      <template v-slot:cell(formatedUpdatedAt)="row">{{ row.item.updatedAt | formatUpdatedAt }}</template>
      <template v-slot:cell(invalid)="row">
        <div v-show="!isValid(row.item)">
          <img :id="'invalid' + row.item._id" src="~@/assets/invalid.png" class="invalidIcon">
          <b-tooltip :target="'invalid' + row.item._id">
            <div class="tooltipInnerText">
              {{phrases.invalidReceipt}}
            </div>
          </b-tooltip>
        </div>
      </template>
      <template v-slot:cell(delete)="row">
        <b-button-group>
          <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.deleteReceipt, customClass: 'tooltipInnerText'}" @click.stop="openDeleteReceiptModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
            <img src="~@/assets/delete.png">                                           
          </b-button>     
        </b-button-group>                
      </template>
    </b-table>
    </div>

    <b-row>
      <b-col>
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" align="center" v-on:input="clearChecked"/>
      </b-col>
    </b-row>

    <b-modal hide-footer hide-header size="a5" id="create-receipt-modal">
      <receipt-preview :receipt='selectedItem' :receiptPreview='isPreview' parentModal="create-receipt-modal" :existingReceipts="receipts" v-on:updateReceiptTable="update"></receipt-preview>
    </b-modal>

    <b-modal id="delete-receipt-modal" hide-backdrop hide-footer hide-header content-class="shadow">
      <message-confirm-dialog parentModal="delete-receipt-modal" type="confirm" :text="phrases.areYouSureToDeleteReceipt" :cancelOkText="phrases.cancel" :confirmText="phrases.delete" v-on:confirmed="deleteReceipt"></message-confirm-dialog>
    </b-modal>

    <b-modal id="delete-checked-receipts-modal" hide-backdrop hide-footer hide-header content-class="shadow">
      <message-confirm-dialog parentModal="delete-checked-receipts-modal" type="confirm" :text="phrases.areYouSureToDeleteCheckedReceipts" :cancelOkText="phrases.cancel" :confirmText="phrases.delete" v-on:confirmed="deleteCheckedReceipts"></message-confirm-dialog>
    </b-modal>

    <b-modal id="receipt-table-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="receipt-table-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'
  import MessageConfirmDialog from './MessageConfirmDialog'
  import { EventBus } from '../../../eventbus/event-bus.js';
  
  const receiptController = require('../../../controllers/receiptController')
  const commonController = require('../../../controllers/commonController')
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
          filterByYear: i18n.getTranslation('Filter by year'),
          invalidReceipt: i18n.getTranslation('Invalid receipt'),
          select: i18n.getTranslation('Select'),
          selectAll: i18n.getTranslation('Select all'),
          ok: i18n.getTranslation('Ok')
        },
        receipts: [],
        items: [],
        yearToFilter: '',
        currentPage: 1,
        perPage: 10,
        totalRows: null,
        filter: null,
        deletedReceipt: null,
        checkedReceipts: [],
        itemsShownInTable: [],
        checkAll: false,
        selectedItem: null,
        isPreview: false,
        errorText: ""
      }
    },
    created () {
      this.loadReceipts()
      EventBus.$on('updateReceiptTable', () => {
        this.update()
        this.$emit('updateInvalidReceiptsInfo')
      });
    },
    computed: {
      ...mapState(
        {
          yearOptions: state => {
            var yearOptions = JSON.parse(JSON.stringify(state.CommonValues.bookedYears))
            yearOptions.unshift('')
            return yearOptions
          }
        }
      ),
      noRowChecked () {
        return this.checkedReceipts.length === 0
      },
      fields () {
        return [
          { key: 'select', label: '', thStyle: {outline: 'none'} },
          { key: 'preview', label: '', thStyle: {outline: 'none'} },
          { key: 'outcome', label: this.phrases.outcome, class: 'text-center', thStyle: {outline: 'none'} },
          { key: 'reason', label: this.phrases.reason, class: 'text-center', thStyle: {outline: 'none'} },
          { key: 'formatedDate', label: this.phrases.forDate, class: 'text-center', thStyle: {outline: 'none'} },
          { key: 'formatedUpdatedAt', label: this.phrases.updatedAt, class: 'text-center', thStyle: {outline: 'none'} },
          { key: 'invalid', label: '', thStyle: {outline: 'none'} },
          { key: 'delete', label: '', thStyle: {outline: 'none'} }
        ]
      }
    },
    methods: {
      update() {
        this.loadReceipts()
        this.$emit('updateBookedYears')
        this.$emit('updateInvalidReceiptsInfo')
        this.yearToFilter = ''
        this.clearChecked()
      },
      clearChecked () {
        this.checkAll = false
        this.checkedReceipts = []
      },
      loadReceipts () {
        const self = this
        receiptController.getReceipts().then((res) => {
          if (!res.err) {
            self.receipts = res.data ? res.data : []
            self.items = self.receipts
            self.totalRows = self.receipts.length
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      openCreateReceiptModal (button) {
        this.isPreview = false;
        this.selectedItem = null;
        this.$root.$emit('bv::hide::tooltip')
        this.$root.$emit('bv::show::modal', 'create-receipt-modal', button)
      },
      toggleCheckAll () {
        /* Before the checkAll changes based on the click, so the logic is reversed in the check */
        this.checkedReceipts = this.checkAll ? [] : this.itemsShownInTable
      },
      rowDblClickHandler (record, index) {
        this.openUpdateReceiptModal(record)
      },
      isValid (receipt) {
        return receipt.isValid
      },
      openDeleteReceiptModal(receipt) {
         this.deletedReceipt = receipt
         this.$root.$emit('bv::show::modal', 'delete-receipt-modal')
      },
      deleteReceipt () {
        const self = this
        receiptController.deleteReceipt(this.deletedReceipt._id).then((res) => {
          if (!res.err) {
            self.update()
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      openDeleteCheckedReceiptsModal() {
         this.$root.$emit('bv::show::modal', 'delete-checked-receipts-modal')
      },
      deleteCheckedReceipts () {
        var checkedReceiptsIds = []
        this.checkedReceipts.forEach(function (receipt) {
          checkedReceiptsIds.push(receipt._id)
        })
        const self = this
        receiptController.deleteReceipts(checkedReceiptsIds).then((res) => {
          if (!res.err) {
            self.update()
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      openUpdateReceiptModal (item) {
        this.isPreview = true
        this.selectedItem = item
        this.$root.$emit('bv::show::modal', 'create-receipt-modal')
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'receipt-table-error-modal')
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
      },
      formatUpdatedAt (date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
        const language = i18n.usedLanguage
        return (new Date(date)).toLocaleDateString(language, options)
      }
    },
    watch: {
      checkedReceipts (newValue, oldValue) {
        this.checkAll = (this.itemsShownInTable.length !== 0 && this.itemsShownInTable.length === newValue.length)
        if (newValue.length === 0) {
          /* Close delete-selected button tooltip before it gets disabled and stuck */
          this.$root.$emit('bv::hide::tooltip', 'deleteSelectedBtn')
        }
      },
      yearToFilter (newYearValue) {
        if(newYearValue == '') {
          this.items = this.receipts;
        } else {
          this.items = this.receipts.filter(value => {
            if(new Date(value.date).getUTCFullYear() == newYearValue) {
              return true;
            }
            return false;
          })
        }
        this.totalRows = this.items.length
        this.currentPage = 1
        this.checkedReceipts = []
      }
    },
    components: { ReceiptPreview, MessageConfirmDialog }
  }
</script>

<style>
  .modal .modal-a5 {
    max-width: 830px;
    width: 830px;
  }
</style>

<style scoped>
  .disabledBtn {
    background-color: gray;
  }
  .tableDiv{
    display: block;
    overflow: auto;
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
</style>
