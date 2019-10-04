<template>
  <b-container fluid>
    <b-form v-on:submit="onSubmit" no-validation>
      <b-row>
        <b-col cols="10"/>
        <b-col>
          <b-button v-on:click="closeModal()" size="sm" variant="link">
            <img src="~@/assets/delete.png" class="btnImgSm">
          </b-button>
        </b-col>
      </b-row>
      <hr/>
      <b-row>
        <b-col cols="3">
          <label :for="`partitionInput`">Партиција:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input id="partitionInput" type="number" min="0" step="1" v-model="form.partition" class="partPosInput" v-bind:class="{ 'is-invalid': shouldValidate && (missingPartition || notUnique) }"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label :for="`positionInput`">Позиција:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input id="positionInput" type="number" min="0" step="1" v-model="form.position" class="partPosInput" v-bind:class="{ 'is-invalid': shouldValidate && (missingPosition || notUnique) }"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="3">
          <label :for="`descriptionInput`">Опис:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input id="descriptionInput" type="text" v-model="form.description" class="descriptionInput" v-bind:class="{ 'is-invalid': shouldValidate && missingDescription }"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row >
        <b-col cols="8">
        </b-col>
        <b-col cols="4">
          <b-button id="saveIncomeCodeBtn" type="submit" variant="secondary">
            <img src="~@/assets/save1.png" class="btnImgSm">
          </b-button>
          <b-button id="clearFormBtn" @click.stop="clearForm()" variant="secondary">
            <img src="~@/assets/clear.png" class="btnImgSm ">
          </b-button>
        </b-col>
      </b-row>
    </b-form>

    <b-tooltip target="saveIncomeCodeBtn" triggers="hover" placement="top" ref="saveIncomeCodeBtnTooltip">
        <div class="tooltipInnerText">
          {{phrases.save}}
        </div>
      </b-tooltip>

      <b-tooltip target="clearFormBtn" triggers="hover" placement="top" ref="clearFormBtnTooltip">
        <div class="tooltipInnerText">
          {{phrases.clear}}
        </div>
      </b-tooltip>

      <b-tooltip target="partitionInput" triggers="hover" placement="top" ref="partitionInputTooltip" :disabled.sync="disablePartitionTooltip">
        <div class="tooltipInnerText">
          {{partitionTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip target="positionInput" triggers="hover" placement="top" ref="positionInputTooltip" :disabled.sync="disablePositionTooltip">
        <div class="tooltipInnerText">
          {{positionTooltipText}}
        </div>
      </b-tooltip>

      <b-tooltip target="descriptionInput" triggers="hover" placement="top" ref="descriptionInputTooltip" :disabled.sync="disableDescriptionTooltip">
        <div class="tooltipInnerText">
          {{descriptionTooltipText}}
        </div>
      </b-tooltip>
  </b-container>
</template>

<script>

const incomeCodeController = require('../../../controllers/incomeCodeController')
const i18n = require('../../../translations/i18n');
 const { showErrorDialog } = require('../../../utils/utils')

export default {
  props: {
    existingIncomeCodes: {
      type: Array,
      default: []
    },
    incomeCode: Object,
    isUpdate: {
      type: Boolean,
      default: false
    },
    parentModal: String
  },
  data () {
    return {
      phrases: {
        save: i18n.getTranslation('Save'),
        clear: i18n.getTranslation('Clear'),
        enterPartition: i18n.getTranslation('Enter partition'),
        enterPosition: i18n.getTranslation('Enter position'),
        notUnique: i18n.getTranslation('Partition and position not unique'),
        enterDescription: i18n.getTranslation('Enter description')
      },
      form: { 
        partition: null, 
        position: null, 
        description: null
      },
      shouldValidate: false,
      incomeCodes: []
    }
  },
  created () {
    if (this.isUpdate) {
      this.form = JSON.parse(JSON.stringify(this.incomeCode))
    }
    this.incomeCodes = JSON.parse(JSON.stringify(this.existingIncomeCodes))
  },
  computed: {
    disablePartitionTooltip: {
      get: function () {
        return (!this.missingPartition && !this.notUnique) || !this.shouldValidate
      },
      set: function (newValue) {
        if (newValue) {
          this.$refs.partitionInputTooltip.$emit('close')
        }
      }
    },
    disablePositionTooltip: {
      get: function () {
        return (!this.missingPosition && !this.notUnique) || !this.shouldValidate
      },
      set: function (newValue) {
        if (newValue) {
          this.$refs.positionInputTooltip.$emit('close')
        }
      }
    },
    disableDescriptionTooltip: {
      get: function () {
        return !this.missingDescription || !this.shouldValidate
      },
      set: function (newValue) {
        if (newValue) {
          this.$refs.descriptionInputTooltip.$emit('close')
        }
      }
    },
    partitionTooltipText: function () {
        if (this.missingPartition) {
          return this.phrases.enterPartition
        } else if (this.notUnique) {
          return this.phrases.notUnique
        }
    },
    positionTooltipText: function () {
        if (this.missingPosition) {
          return this.phrases.enterPosition
        } else if (this.notUnique) {
          return this.phrases.notUnique
        }
    },
    descriptionTooltipText: function () {
        if (this.missingDescription) {
          return this.phrases.enterDescription
        }
    },
    missingPartition: function () {
      return !this.form.partition || this.form.partition.toString().trim() === ''
    },
    missingPosition: function () {
      return !this.form.position || this.form.position.toString().trim() === ''
    },
    missingDescription: function () {
      return !this.form.description || this.form.description.toString().trim() === ''
    },
    notUnique: function () {
      const self = this
      var euqivalentInstance = this.incomeCodes.filter(incomeCode => {
        return incomeCode.partition == self.form.partition && incomeCode.position == self.form.position && incomeCode._id != self.form._id
      })

      if (euqivalentInstance && euqivalentInstance.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      this.shouldValidate = true;
      const self = this;
      if (this.isFormValid()) {
        if (this.isUpdate) {
          incomeCodeController.updateIncomeCode(this.form).then((res) => {
              if (!res.err) {
                self.$emit('updateIncomeCodes')
                self.closeModal();
              } else {
                showErrorDialog(res.err)
              }
          })
        } else {
          incomeCodeController.createIncomeCode(this.form).then((res) => {
              if (!res.err) {
                self.$emit('updateIncomeCodes')
                self.closeModal();
              } else {
                showErrorDialog(res.err)
              }
          })
        }
      }
    },
    isFormValid() {
      if(!this.missingPartition && !this.missingPosition && !this.notUnique && !this.missingDescription) {
        return true
      }
      return false
    },
    clearForm () {
      this.form.partition = null;
      this.form.position = null;
      this.form.description = null;
    },
    closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
    }
  }
}
</script>

<style scoped>
.partPosInput {
  width: 100px;
  max-width: 100px;
}
.descriptionInput {
  width: 300px;
  max-width: 300px;
}
.is-invalid {
    border: dotted 1px red;
    padding-right: 0 !important;
    background-image: url('~@/assets/invalid-red.png') !important;
  }
</style>