<template>
  <b-container fluid>
    <b-button v-b-tooltip.hover.html="phrases.createIncomeCode" v-on:click="openCreateIncomeCodeModal()" size="sm">
      <img src="~@/assets/add1.png" class="btnImgSm">
    </b-button>
    <b-table show-empty
              stacked="md"
              class="mt-3"
              :items="incomeCodes"
              responsive
              small
              :fields="fields"
              :empty-text="phrases.noRecordsToShow"
              :empty-filtered-text="phrases.noRecordsToShow"
              >
        <template v-slot:cell(preview)="row">
          <b-button v-b-tooltip.hover.html="phrases.seeDetails" v-on:click="openCreateIncomeCodeModal(row.item)" size="sm">
            <img src="~@/assets/see-more1.png" class="btnImgSm">                                           
          </b-button>
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
            <b-button v-b-tooltip.hover.html="phrases.deleteIncomeCode" v-on:click="deleteIncomeCode(row.item)" size="sm">
                <img src="~@/assets/delete.png" class="btnImgSm">
            </b-button>
        </template>
      </b-table>

      <b-modal hide-footer hide-header size="sm" id="create-income-code-modal">
        <income-code-preview :incomeCode='selectedIncomeCode' :isUpdate='isUpdate' :existingIncomeCodes="incomeCodes" parentModal="create-income-code-modal" v-on:updateIncomeCodes="update"></income-code-preview>
      </b-modal>
  </b-container>
</template>

<script>
  import IncomeCodePreview from './IncomeCodePreview';

  const { dialog } = require('electron').remote
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const i18n = require('../../../translations/i18n')
  const { showErrorDialog, compareCodes } = require('../../../utils/utils')

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
          incomeCodeDeleteConsequences: i18n.getTranslation('By deleting income code you will possibly make some of payment slips invalid.')
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
        isUpdate: false
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
            showErrorDialog(res.err)
          }
        })
      },
      openCreateIncomeCodeModal (incomeCode) {
        if(incomeCode) {
          this.selectedIncomeCode = incomeCode
          this.isUpdate = true
        } else {
          this.selectedIncomeCode = null
          this.isUpdate = false    
        }
        this.$root.$emit('bv::show::modal', 'create-income-code-modal')
      },
      deleteIncomeCode (incomeCode) {
        const options = {
          type: 'question',
          buttons: [this.phrases.cancel, this.phrases.delete],
          defaultId: 1,
          message: this.phrases.areYouSureToDeleteIncomeCode,
          detail: this.phrases.incomeCodeDeleteConsequences,
          noLink: true,
          cancelId: 0
        }
        dialog.showMessageBox(null, options, (response) => {
          if (response === 1) {
            const self = this
            incomeCodeController.deleteIncomeCode(incomeCode._id).then((res) => {
              if (!res.err) {
                self.update()
              } else {
                showErrorDialog(res.err)
              }
            })
          }
        })
      },
      update () {
        this.loadIncomeCodes()
      }
    },
    components: { IncomeCodePreview }
  }
</script>

<style>
  .modal .modal-sm {
    max-width: 500px;
    width: 500px;
  }
 .tooltipInnerText {
    font-size: 95%;
    line-height: 1;
    margin: 1px;
  }
  .btnImgSm {
    width: 25px;
    height: auto;
  }
</style>