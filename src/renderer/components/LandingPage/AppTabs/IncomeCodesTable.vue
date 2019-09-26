<template>
  <b-container fluid>
    <b-table show-empty
              stacked="md"
              empty-text=""
              class="mt-3"
              :items="incomeCodes"
              :fields="fields">
          <template v-slot:cell(partition)="row">
              <input type="number" min="1" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.partition" v-on:input="isValidIncomeCode(row.item)"/>
          </template>
          <template v-slot:cell(position)="row">
              <input type="number" min="1" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.position" v-on:input="isValidIncomeCode(row.item)"/>
          </template>
          <template v-slot:cell(description)="row">
              <input type="text" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.description" v-on:input="isValidIncomeCode(row.item)"/>
          </template>
          <template v-slot:cell()="row">
              <b-button size="sm" variant="danger" v-on:click="removeIncomeCode(row.index)">
                  {{phrases.remove}}
              </b-button>
          </template>
      </b-table>
       <b-button size="sm"  v-on:click="newIncomeCode()">
        {{phrases.new}}
      </b-button>
      <b-button size="sm"  v-on:click="cancelIncomeCodeChanges()">
        {{phrases.cancel}}
      </b-button>
      <b-button size="sm"  v-on:click="saveIncomeCodes()" :disabled="!saveIncomeCodesEnabled">
        {{phrases.save}}
      </b-button>
  </b-container>
</template>

<script>
  const incomeCodeController = require('../../../controllers/incomeCodeController')
  const i18n = require('../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          remove: i18n.getTranslation('Remove'),
          new: i18n.getTranslation('New'),
          cancel: i18n.getTranslation('Cancel'),
          save: i18n.getTranslation('Save')
        },
        originalIncomeCodes: [],
        incomeCodes: [],
        saveIncomeCodesEnabled: false,
        fields: [
          {
            key: 'partition',
            label: i18n.getTranslation('Partition'),
            sortable: true
          },
          {
            key: 'position',
            label: i18n.getTranslation('Position'),
            sortable: true
          },
          {
            key: 'description',
            label: i18n.getTranslation('Description'),
            sortable: true
          },
          {
            key: 'remove',
            label: ''
          }
        ],
      }
    },
    computed: {
    },
    created () {
      const self = this
      incomeCodeController.getIncomeCodes().then(function (res) {
        if (!res.err) {
          self.incomeCodes = (res.data || [])
          self.originalIncomeCodes = self.incomeCodes
        } else {
          showErrorDialog(res.err)
        }
      })
    },
    methods: {
      newIncomeCode() {
        if(this.incomeCodes.length > 0) {
          if(!this.incomeCodes[this.incomeCodes.length-1].partition 
          && !this.incomeCodes[this.incomeCodes.length-1].position 
          && !this.incomeCodes[this.incomeCodes.length-1].description) {
            return;
          }
        }
        this.toggleSavingIncomeCode(false);
        this.incomeCodes.push({});
      },
      removeIncomeCode(index) {
        this.incomeCodes.splice(index, 1);
      },
      saveIncomeCodes() {
        const self = this;
        incomeCodeController.createIncomeCodes(this.incomeCodes).then(function (res) {
          if (res.err) {
            showErrorDialog(res.err)
          } else {
            self.toggleSavingIncomeCode(false);
          }
        })
      },
      isValidIncomeCode(validatedIncomeCode) {
        var tmpArr = [];
        if (!validatedIncomeCode.partition || !validatedIncomeCode.position || !validatedIncomeCode.description) {
          this.toggleSavingIncomeCode(false);
          return false;
        }
        for (let i=0; i<this.incomeCodes.length; i++) {
          const incomeCode = this.incomeCodes[i];
          if(tmpArr.indexOf(incomeCode.partition + incomeCode.position) < 0) {
            tmpArr.push(incomeCode.partition + incomeCode.position);
          } else {
            // paint red
            this.toggleSavingIncomeCode(false);
            return false;
          }
        }
        // paint normal
        this.toggleSavingIncomeCode(true);
        return true;
      },
      toggleSavingIncomeCode(sw) {
        this.saveIncomeCodesEnabled = sw;
      },
      cancelIncomeCodeChanges() {
        this.incomeCodes = this.originalIncomeCodes;
        this.toggleSavingIncomeCode(false);
      }
    },
    components: { }
  }
</script>

<style scoped>
</style>