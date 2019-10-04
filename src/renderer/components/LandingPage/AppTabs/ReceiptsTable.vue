<template> 
  <b-container fluid>
    <!-- User Interface controls -->
     <b-row>
      <b-col cols="6" class="my-1">
        <b-button-group size="sm">
          <b-btn v-b-tooltip.hover.html="phrases.addReceipt" @click.stop="openCreateReceiptModal($event.target)">
            <img src="~@/assets/add1.png" class="btn-img">               
          </b-btn>
          <b-btn v-b-tooltip.hover.html="phrases.deleteSelected" @click.stop="deleteCheckedReceipts()" :disabled="noRowChecked" id="deleteSelectedBtn">
            <img src="~@/assets/trash1.png" class="btn-img">               
          </b-btn>
        </b-button-group> 
      </b-col>
      <b-col cols="6" class="my-1">
        <b-form-group horizontal class="my-0">
          <label :for="`yearSelect`">{{phrases.filterByYear}}: </label>
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
             :sort-by.sync="sortBy"
             :sort-desc.sync="sortDesc"
             :sort-direction="sortDirection"
             :sort-compare="sortCompare"
             :no-provider-sorting="true"
             :no-provider-filtering="true"
             :no-provider-paging="true"
             @filtered="onFiltered"
             @row-dblclicked="rowDblClickHandler" 
             responsive
             no-sort-reset
             :empty-text="phrases.noRecordsToShow"
             :empty-filtered-text="phrases.noRecordsToShow"
    >
      <template v-slot:cell(HEAD_select)="row">
        <b-form-checkbox @click.native.stop="toggleCheckAll" v-model="checkAll">
        </b-form-checkbox>
      </template>
      <template v-slot:cell(preview)="row">
        <b-button-group size="sm">
          <b-button v-b-tooltip.hover.html="phrases.seeDetails" @click.stop="openUpdateReceiptModal(row.item)" class="mr-1 btn-xs" size="sm" >
            <img src="~@/assets/see-more1.png" class="btnImgSm">                                           
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
      <template v-slot:cell(formatedUpdatedAt)="row">{{ row.item.updatedAt | formatUpdatedAt }}</template>
      <template v-slot:cell(invalid)="row">
        <div v-show="!isValid(row.item)">
          <img :id="'invalid' + row.item._id" src="~@/assets/invalid.png" class="imgSm">
          <b-tooltip :target="'invalid' + row.item._id">
            <div class="tooltipInnerText">
              {{phrases.invalidReceipt}}
            </div>
          </b-tooltip>
        </div>
      </template>
      <template v-slot:cell(delete)="row">
        <b-button-group size="sm">
          <b-button v-b-tooltip.hover.html="phrases.deleteReceipt" @click.stop="deleteReceipt(row.item)" class="mr-1 btn-xs" size="sm" >
            <img src="~@/assets/delete.png" class="btnImgSm">                                           
          </b-button>     
        </b-button-group>                
      </template>
    </b-table>
    </div>

    <b-row>
      <b-col md="6" class="my-4">
        <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" class="my-0" />
      </b-col>
    </b-row>

    <!-- Create receipt modal -->
    <b-modal hide-footer hide-header size="a5" id="create-receipt-modal">
      <receipt-preview :receipt='selectedItem' :receiptPreview='isPreview' parentModal="create-receipt-modal" v-on:updateReceiptTable="update"></receipt-preview>
    </b-modal>

  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'
  import { EventBus } from '../../../eventbus/event-bus.js';
  
  const { dialog } = require('electron').remote
  const { getLastNYears, showErrorDialog } = require('../../../utils/utils')
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
          invalidReceipt: i18n.getTranslation('Invalid receipt')
        },
        receipts: [],
        items: [],
        yearToFilter: '',
        currentPage: 1,
        perPage: 10,
        totalRows: null,
        sortBy: 'formatedUpdatedAt',
        sortDesc: true,
        sortDirection: 'desc',
        filter: null,
        checkedItems: [],
        itemsShownInTable: [],
        checkAll: false,
        selectedItem: null,
        isPreview: false
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
        return this.checkedItems.length === 0
      },
      fields () {
        return [
          { key: 'select', label: '' },
          { key: 'preview', label: '' },
          { key: 'outcome', label: this.phrases.outcome, sortable: true, class: 'text-center' },
          { key: 'reason', label: this.phrases.reason, sortable: true, class: 'text-center' },
          { key: 'formatedDate', label: this.phrases.forDate, sortable: true, class: 'text-center' },
          { key: 'formatedUpdatedAt', label: this.phrases.updatedAt, sortable: true, class: 'text-center'},
          { key: 'invalid', label: '' },
          { key: 'delete', label: '' }
        ]
      }
    },
    methods: {
      update() {
        this.loadReceipts()
        this.$emit('updateBookedYears')
        this.$emit('updateInvalidReceiptsInfo')
        this.yearToFilter = ''
      },
      loadReceipts () {
        const self = this
        receiptController.getReceipts().then((res) => {
          if (!res.err) {
            self.receipts = res.data ? res.data : []
            self.items = self.receipts
          } else {
            showErrorDialog(res.err)
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
          if (response === 1) {
            const self = this
            receiptController.deleteReceipt(item._id).then((res) => {
              if (!res.err) {
                self.update()
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
      isValid (receipt) {
        return receipt.isValid
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
                  self.update()
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
      resetSelectedItem () {
        this.selectedItem = null
      },
      sortCompare(aRow, bRow, key, sortDesc, formatter, compareOptions, compareLocale) {
        var a,b
        if(key == 'formatedDate' || key == 'formatedUpdatedAt') {
          a = Date.parse(aRow['date'])
          b = Date.parse(bRow['updatedAt'])
        } else {
          a = aRow[key]
          b = bRow[key]
        }
        if (
          (typeof a === 'number' && typeof b === 'number') ||
          (a instanceof Date && b instanceof Date)
        ) {
          // If both compared fields are native numbers or both are native dates
          return a < b ? -1 : a > b ? 1 : 0
        } else {
          return this.toString(a).localeCompare(this.toString(b))
        }
      },
      toString(value) {
        if (value === null || typeof value === 'undefined') {
          return ''
        } else if (value instanceof Object) {
          return Object.keys(value)
            .sort()
            .map(key => toString(value[key]))
            .join(' ')
        } else {
          return String(value)
        }
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
      checkedItems (newValue, oldValue) {
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
  .imgSm{
    width: 25px;
    height: auto;
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
</style>
