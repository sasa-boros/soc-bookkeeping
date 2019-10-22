<template>
  <b-container fluid>
     <b-button-group class="float-left">
      <b-button v-on:mouseleave="hideTooltip('addIncomeCodeBtn')" id="addIncomeCodeBtn" v-b-tooltip.hover.top="{title: phrases.createIncomeCode, customClass: 'tooltipInnerText'}" v-on:click="openCreateIncomeCodeModal()" variant="light" class="btn-xs">
        <img src="~@/assets/add.png">
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
            <b-button id="updateIncomeCodeBtn" v-on:mouseleave="hideTooltip('updateIncomeCodeBtn')" v-b-tooltip.hover.top="{title: phrases.seeDetails, customClass: 'tooltipInnerText'}" v-on:click="openCreateIncomeCodeModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
              <img src="~@/assets/see-more.png">                                           
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
              <b-button id="deleteIncomeCodeBtn" v-on:mouseleave="hideTooltip('deleteIncomeCodeBtn')" v-b-tooltip.hover.top="{title: phrases.deleteIncomeCode, customClass: 'tooltipInnerText'}" v-on:click="openDeleteIncomeCodeModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
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
  import IncomeCodePreview from './IncomeCodesTable/IncomeCodePreview';
  import MessageConfirmDialog from '../../../MessageConfirmDialog';
  import { EventBus } from '../../../../eventbus/event-bus.js';

  const { dialog } = require('electron').remote
  const incomeCodeController = require('../../../../controllers/incomeCodeController')
  const i18n = require('../../../../../translations/i18n')
  const { compareCodes } = require('../../../../utils/utils')

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
          this.hideTooltip('updateIncomeCodeBtn')
          this.selectedIncomeCode = incomeCode
          this.isUpdate = true
        } else {
          this.hideTooltip('addIncomeCodeBtn')
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
        this.hideTooltip('deleteIncomeCodeBtn')
        this.deletedIncomeCode = incomeCode
        this.$root.$emit('bv::show::modal', 'delete-income-code-modal')
      },
      deleteIncomeCode () {
        const self = this
        incomeCodeController.deleteIncomeCode(this.deletedIncomeCode._id).then((res) => {
          if (!res.err) {
            self.update()
            EventBus.$emit('updatePaymentSlipTable');
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      hideTooltip (elementId) {
        if (elementId) {
          this.$root.$emit('bv::hide::tooltip', elementId)
        } else {
          this.$root.$emit('bv::hide::tooltip')
        }
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

<style scoped>
  .btn-light {
    background-color:#e6f4ff;
    border: none;
  }
</style>

<style>
  .modal .modal-sm {
    max-width: 500px;
    width: 500px;
  }
</style>