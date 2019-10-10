<template>
  <b-container fluid>
     <b-button-group class="float-left">
      <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.createIncomeCode, customClass: 'tooltipInnerText'}" v-on:click="openCreateIncomeCodeModal()" variant="link" class="btn-xs">
        <img src="~@/assets/add1.png">
      </b-button>
     </b-button-group>
    <b-table show-empty
              stacked="md"
              class="mt-3"
              :items="incomeCodes"
              responsive
              head-variant="light"
              hover
              small
              :fields="fields"
              @row-dblclicked="rowDblClickHandler" 
              :empty-text="phrases.noRecordsToShow"
              :empty-filtered-text="phrases.noRecordsToShow"
              >
        <template v-slot:cell(preview)="row">
          <b-button-group>
            <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.seeDetails, customClass: 'tooltipInnerText'}" v-on:click="openCreateIncomeCodeModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
              <img src="~@/assets/see-more1.png">                                           
            </b-button>
          </b-button-group>
        </template>
        <template v-slot:cell(partition)="row">
          {{ row.item.partition }}
        </template>
        <template v-slot:cell(position)="row">
          {{ row.item.position }}
        </template>
        <template v-slot:cell(description)="row">
          {{ row.item.description }}
        </template>
        <template v-slot:cell(remove)="row">
           <b-button-group>
              <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.deleteIncomeCode, customClass: 'tooltipInnerText'}" v-on:click="openDeleteIncomeCodeModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
                  <img src="~@/assets/delete.png">
              </b-button>
           </b-button-group>
        </template>
      </b-table>

      <b-modal hide-footer hide-header size="sm" id="create-income-code-modal">
        <income-code-preview :incomeCode='selectedIncomeCode' :isUpdate='isUpdate' :existingIncomeCodes="incomeCodes" parentModal="create-income-code-modal" v-on:updateIncomeCodes="update"></income-code-preview>
      </b-modal>

      <b-modal id="delete-income-code-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="delete-income-code-modal" type="confirm" :text="phrases.areYouSureToDeleteIncomeCode" :subText="phrases.incomeCodeDeleteConsequences" :cancelOkText="phrases.cancel" :confirmText="phrases.delete" v-on:confirmed="deleteIncomeCode"></message-confirm-dialog>
      </b-modal>

      <b-modal id="income-code-table-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="income-code-table-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
  </b-container>
</template>

<script>
  import IncomeCodePreview from './IncomeCodePreview';
  import MessageConfirmDialog from './MessageConfirmDialog';
  import { EventBus } from '../../../eventbus/event-bus.js';

  const { dialog } = require('electron').remote
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const i18n = require('../../../translations/i18n')
  const { compareCodes } = require('../../../utils/utils')

  export default {
    data () {
      return {
        phrases: {
          noRecordsToShow: i18n.getTranslation('There are no income codes to show'),
          createIncomeCode: i18n.getTranslation('Create income code'),
          deleteIncomeCode: i18n.getTranslation('Delete income code'),
          seeDetails: i18n.getTranslation('See details'),
          cancel: i18n.getTranslation('Cancel'),
          delete: i18n.getTranslation('Delete'),
          areYouSureToDeleteIncomeCode: i18n.getTranslation('Are you sure you want to delete income code?'),
          incomeCodeDeleteConsequences: i18n.getTranslation('By deleting income code you will possibly make some of payment slips invalid.'),
          ok: i18n.getTranslation('Ok'),
          maxNumberOfIncomeCodesReached: i18n.getTranslation('Maximum number of income codes reached (15).')
        },
        fields: [
          {
            key: 'preview',
            label: ''
          },
          {
            key: 'partition',
            label: i18n.getTranslation('Partition'),
            class: 'text-center'
          },
          {
            key: 'position',
            label: i18n.getTranslation('Position'),
            class: 'text-center'
          },
          {
            key: 'description',
            label: i18n.getTranslation('Description'),
            class: 'text-center'
          },
          {
            key: 'remove',
            label: ''
          }
        ],
        incomeCodes: [],
        selectedIncomeCode: null,
        deletedIncomeCode: null,
        isUpdate: false,
        errorText: ""
      }
    },
    created () {
      this.loadIncomeCodes()
    },
    methods: {
      loadIncomeCodes () {
        const self = this
        incomeCodeController.getIncomeCodes().then((res) => {
          if (!res.err) {
            var incomeCodes = res.data ? res.data : []
            self.incomeCodes = incomeCodes.sort(compareCodes)
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      openCreateIncomeCodeModal (incomeCode) {
        if(incomeCode) {
          this.selectedIncomeCode = incomeCode
          this.isUpdate = true
        } else {
          if(this.incomeCodes.length >= 15) {
            this.openErrorModal(this.phrases.maxNumberOfIncomeCodesReached)
            return
          }
          this.selectedIncomeCode = null
          this.isUpdate = false    
        }
        this.$root.$emit('bv::show::modal', 'create-income-code-modal')
      },
      rowDblClickHandler (record, index) {
        this.openCreateIncomeCodeModal(record)
      },
      openDeleteIncomeCodeModal(incomeCode) {
         this.deletedIncomeCode = incomeCode
         this.$root.$emit('bv::show::modal', 'delete-income-code-modal')
      },
      deleteIncomeCode () {
        const self = this
        incomeCodeController.deleteIncomeCode(this.deletedIncomeCode).then((res) => {
          if (!res.err) {
            self.update()
            EventBus.$emit('updatePaymentSlipTable');
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'income-code-table-error-modal')
      },
      update () {
        this.loadIncomeCodes()
      }
    },
    components: { IncomeCodePreview, MessageConfirmDialog }
  }
</script>

<style>
  .modal .modal-sm {
    max-width: 500px;
    width: 500px;
  }
</style>