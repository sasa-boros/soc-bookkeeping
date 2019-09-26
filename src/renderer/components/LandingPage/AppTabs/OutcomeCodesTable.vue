<template>
  <b-container fluid>
    <b-table show-empty
              stacked="md"
              empty-text=""
              class="mt-3"
              :items="outcomeCodes"
              :fields="fields">
          <template v-slot:cell(partition)="row">
              <input type="text" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.partition" v-on:input="isValidOutcomeCode(row.item)"/>
          </template>
          <template v-slot:cell(position)="row">
              <input type="text" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.position" v-on:input="isValidOutcomeCode(row.item)"/>
          </template>
          <template v-slot:cell(description)="row">
              <input type="text" class="form-control-sm"
                           style="width:5em"
                           v-model="row.item.description" v-on:input="isValidOutcomeCode(row.item)"/>
          </template>
          <template v-slot:cell()="row">
              <b-button size="sm" variant="danger" v-on:click="removeOutcomeCode(row.index)">
                  {{phrases.remove}}
              </b-button>
          </template>
      </b-table>
       <b-button size="sm"  v-on:click="newOutcomeCode()">
        {{phrases.new}}
      </b-button>
      <b-button size="sm"  v-on:click="cancelOutcomeCodeChanges()">
        {{phrases.cancel}}
      </b-button>
      <b-button size="sm"  v-on:click="saveOutcomeCodes()" :disabled="!saveOutcomeCodesEnabled">
        {{phrases.save}}
      </b-button>
  </b-container>
</template>

<script>
  const outcomeCodeController = require('../../../controllers/outcomeCodeController')
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
        originalOutcomeCodes: [],
        outcomeCodes: [],
        saveOutcomeCodesEnabled: false,
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
      outcomeCodeController.getOutcomeCodes().then(function (res) {
        if (!res.err) {
          self.outcomeCodes = (res.data || [])
          self.originalOutcomeCodes = self.outcomeCodes
        } else {
          showErrorDialog(res.err)
        }
      })
    },
    methods: {
      newOutcomeCode() {
        if(this.outcomeCodes.length > 0) {
          if(!this.outcomeCodes[this.outcomeCodes.length-1].partition 
          && !this.outcomeCodes[this.outcomeCodes.length-1].position 
          && !this.outcomeCodes[this.outcomeCodes.length-1].description) {
            return;
          }
        }
        this.toggleSavingOutcomeCode(false);
        this.outcomeCodes.push({});
      },
      removeOutcomeCode(index) {
        this.outcomeCodes.splice(index, 1);
      },
      saveOutcomeCodes() {
        outcomeCodeController.createOutcomeCodes(this.outcomeCodes).then(function (res) {
          if (res.err) {
            showErrorDialog(res.err)
          } else {
            this.toggleSavingOutcomeCode(false);
          }
        })
      },
      isValidOutcomeCode(validatedOutcomeCode) {
        var tmpArr = [];
        if (!validatedOutcomeCode.partition || !validatedOutcomeCode.position || !validatedOutcomeCode.description) {
          this.toggleSavingOutcomeCode(false);
          return false;
        }
        for (let i=0; i<this.outcomeCodes.length; i++) {
          const outcomeCode = this.outcomeCodes[i];
          if(tmpArr.indexOf(outcomeCode.partition + outcomeCode.position) < 0) {
            tmpArr.push(outcomeCode.partition + outcomeCode.position);
          } else {
            // paint red
            this.toggleSavingOutcomeCode(false);
            return false;
          }
        }
        // paint normal
        this.toggleSavingOutcomeCode(true);
        return true;
      },
      toggleSavingOutcomeCode(sw) {
        this.saveOutcomeCodesEnabled = sw;
      },
      cancelOutcomeCodeChanges() {
        this.outcomeCodes = this.originalOutcomeCodes;
        this.toggleSavingOutcomeCode(false);
      }
    },
    components: { }
  }
</script>

<style scoped>
</style>