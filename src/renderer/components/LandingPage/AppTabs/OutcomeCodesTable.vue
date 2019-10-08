<template>
  <b-container fluid>
    <b-button-group class="float-left">
      <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.createOutcomeCode, customClass: 'tooltipInnerText'}" v-on:click="openCreateOutcomeCodeModal()" variant="link" class="btn-xs">
        <img src="~@/assets/add1.png">
      </b-button>
    </b-button-group>
    <b-table show-empty
              stacked="md"
              class="mt-3"
              :items="outcomeCodes"
              responsive
              hover
              small
              :fields="fields"
              @row-dblclicked="rowDblClickHandler" 
              :empty-text="phrases.noRecordsToShow"
              :empty-filtered-text="phrases.noRecordsToShow"
              >
        <template v-slot:cell(preview)="row">
          <b-button-group>
            <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.seeDetails, customClass: 'tooltipInnerText'}" v-on:click="openCreateOutcomeCodeModal(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
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
            <b-button v-on:mouseleave="$root.$emit('bv::hide::tooltip')" v-b-tooltip.hover.top="{title: phrases.deleteOutcomeCode, customClass: 'tooltipInnerText'}" v-on:click="deleteOutcomeCode(row.item)" variant="link" class="btn-xs" style="position:relative; bottom:10px;">
                <img src="~@/assets/delete.png">
            </b-button>
          </b-button-group>
        </template>
      </b-table>

      <b-modal hide-footer hide-header size="sm" id="create-outcome-code-modal">
        <outcome-code-preview :outcomeCode='selectedOutcomeCode' :isUpdate='isUpdate' :existingOutcomeCodes="outcomeCodes" parentModal="create-outcome-code-modal" v-on:updateOutcomeCodes="update"></outcome-code-preview>
      </b-modal>
  </b-container>
</template>

<script>
  import OutcomeCodePreview from './OutcomeCodePreview';
  import { EventBus } from '../../../eventbus/event-bus.js';

  const { dialog } = require('electron').remote
  const outcomeCodeController = require('../../../controllers/outcomeCodeController')
  const i18n = require('../../../translations/i18n')
  const { showErrorDialog, compareCodes } = require('../../../utils/utils')

  export default {
    data () {
      return {
        phrases: {
          noRecordsToShow: i18n.getTranslation('There are no outcome codes to show'),
          createOutcomeCode: i18n.getTranslation('Create outcome code'),
          deleteOutcomeCode: i18n.getTranslation('Delete outcome code'),
          seeDetails: i18n.getTranslation('See details'),
          cancel: i18n.getTranslation('Cancel'),
          delete: i18n.getTranslation('Delete'),
          areYouSureToDeleteOutcomeCode: i18n.getTranslation('Are you sure you want to delete outcome code?'),
          outcomeCodeDeleteConsequences: i18n.getTranslation('By deleting outcome code you will possibly make some of receipts invalid.')
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
        outcomeCodes: [],
        selectedOutcomeCode: null,
        isUpdate: false
      }
    },
    created () {
      this.loadOutcomeCodes()
    },
    methods: {
      loadOutcomeCodes () {
        const self = this
        outcomeCodeController.getOutcomeCodes().then((res) => {
          if (!res.err) {
            var outcomeCodes = res.data ? res.data : []
            self.outcomeCodes = outcomeCodes.sort(compareCodes)
          } else {
            showErrorDialog(res.err)
          }
        })
      },
      openCreateOutcomeCodeModal (outcomeCode) {
        if(outcomeCode) {
          this.selectedOutcomeCode = outcomeCode
          this.isUpdate = true
        } else {
          this.selectedOutcomeCode = null
          this.isUpdate = false    
        }
        this.$root.$emit('bv::show::modal', 'create-outcome-code-modal')
      },
      rowDblClickHandler (record, index) {
        this.openCreateOutcomeCodeModal(record)
      },
      deleteOutcomeCode (outcomeCode) {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          message: this.phrases.areYouSureToDeleteOutcomeCode,
          detail: this.phrases.outcomeCodeDeleteConsequences,
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          if (response === 1) {
            const self = this
            outcomeCodeController.deleteOutcomeCode(outcomeCode._id).then((res) => {
              if (!res.err) {
                self.update()
                EventBus.$emit('updateReceiptTable');
              } else {
                showErrorDialog(res.err)
              }
            })
          }
        })
      },
      update () {
        this.loadOutcomeCodes()
      }
    },
    components: { OutcomeCodePreview }
  }
</script>

<style>
  .modal .modal-sm {
    max-width: 500px;
    width: 500px;
  }
</style>