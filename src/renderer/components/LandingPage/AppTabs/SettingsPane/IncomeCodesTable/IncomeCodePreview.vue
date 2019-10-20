<template>
  <b-container fluid>
    <b-form v-on:submit="onSubmit" novalidate no-validation>
      <b-row>
        <b-col>
          <b-button-group class="float-right">
            <b-button v-on:click="closeModal()" variant="link" class="btn-xs">
              <img src="~@/assets/close.png">
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <label :for="`partitionInput`">Партиција:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input id="partitionInput" v-on:mouseleave="hideTooltip('partitionInput')" type="text" v-model="form.partition" class="partPosInput" v-bind:class="{ 'is-invalid': shouldValidate && (missingPartition || notUnique) }" :autofocus="!isUpdate"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <label :for="`positionInput`">Позиција:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input id="positionInput" v-on:mouseleave="hideTooltip('positionInput')" type="text" v-model="form.position" class="partPosInput" v-bind:class="{ 'is-invalid': shouldValidate && (missingPosition || notUnique) }"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="2">
          <label :for="`descriptionInput`">Опис:</label>
        </b-col>
        <b-col>
          <b-form-group>
            <b-form-input ref="descriptionInput" id="descriptionInput" v-on:mouseleave="hideTooltip('descriptionInput')" type="text" v-model="form.description" v-on:keypress="limitDescriptionInput" class="descriptionInput"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group class="float-right">
            <b-button id="saveIncomeCodeBtn" v-on:mouseleave="hideTooltip('saveIncomeCodeBtn')" type="submit" variant="link" class="btn-lg">
              <img src="~@/assets/save.png">
            </b-button>
            <b-button id="clearFormBtn" v-on:mouseleave="hideTooltip('clearFormBtn')" @click.stop="clearForm()" variant="link" class="btn-lg">
              <img src="~@/assets/clear.png">
            </b-button>
          </b-button-group>
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

      <b-modal id="income-code-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="income-code-preview-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
  </b-container>
</template>

<script>
import MessageConfirmDialog from '../../../../MessageConfirmDialog'

const incomeCodeController = require('../../../../../controllers/incomeCodeController')
const i18n = require('../../../../../../translations/i18n')
const { partitionPositionNumberOptions, mapCodeToCodeForm, mapCodeFormToCode } = require('../../../../../utils/utils')
const AutoNumeric = require('autonumeric')

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
        notUnique: i18n.getTranslation('Income code partition and position not unique'),
        ok: i18n.getTranslation('Ok')
      },
      form: { 
        partition: null, 
        position: null, 
        description: null
      },
      shouldValidate: false,
      errorText: "",
      partitionInputAutonumeric: null,
      positionInputAutonumeric: null,
      descriptionElement: null,
      alreadySubmited: false
    }
  },
  created () {
    if (this.isUpdate) {
      this.form = mapCodeToCodeForm(JSON.parse(JSON.stringify(this.incomeCode)))
    }
  },
  mounted () {
    this.partitionInputAutonumeric = new AutoNumeric('#partitionInput', partitionPositionNumberOptions)
    this.positionInputAutonumeric = new AutoNumeric('#positionInput', partitionPositionNumberOptions)
    this.descriptionElement = document.getElementById('descriptionInput')
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
    missingPartition: function () {
      return !this.form.partition || this.form.partition.trim() === ''
    },
    missingPosition: function () {
      return !this.form.position || this.form.position.trim() === ''
    },
    notUnique: function () {
      const self = this
      var euqivalentInstance = this.existingIncomeCodes.filter(incomeCode => {
        return incomeCode.partition == self.form.partition && incomeCode.position == self.form.position && incomeCode._id != self.form._id
      })

      if (euqivalentInstance && euqivalentInstance.length > 0) {
        return true
      }
      return false
    }
  },
  methods: {
    limitDescriptionInput(evt) {
      if (this.descriptionElement.scrollWidth > this.descriptionElement.clientWidth) {
        evt.preventDefault()
      } 
    },
    onSubmit (evt) {
      evt.preventDefault();
      if (this.alreadySubmited) {
        return
      }
      this.shouldValidate = true;
      const self = this;
      if (this.isFormValid()) {
        if (this.isUpdate) {
          this.alreadySubmited = true
          incomeCodeController.updateIncomeCode(mapCodeFormToCode(this.form)).then((res) => {
              if (!res.err) {
                this.shouldValidate = false;
                self.$emit('updateIncomeCodes')
                self.closeModal();
              } else {
                self.alreadySubmited = false
                self.openErrorModal(res.err)
              }
          })
        } else {
          this.alreadySubmited = true
          incomeCodeController.createIncomeCode(mapCodeFormToCode(this.form)).then((res) => {
              if (!res.err) {
                this.shouldValidate = false;
                self.$emit('updateIncomeCodes')
                self.closeModal();
              } else {
                self.alreadySubmited = false
                self.openErrorModal(res.err)
              }
          })
        }
      }
    },
    isFormValid() {
      if(!this.missingPartition && !this.missingPosition && !this.notUnique) {
        return true
      }
      return false
    },
    clearForm () {
      this.form.partition = null;
      this.partitionInputAutonumeric.clear()
      this.form.position = null;
      this.positionInputAutonumeric.clear()
      this.form.description = null;
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
      this.$root.$emit('bv::show::modal', 'income-code-preview-error-modal')
    },
    closeModal () {
        this.$root.$emit('bv::hide::modal', this.parentModal)
    }
  },
  components: { MessageConfirmDialog }
}
</script>

<style scoped>
input {
  text-align: center;
  font-family: "Times New Roman";
  font-size: 90%;
  letter-spacing: 95%;
  height:20px;
  font-weight: bold;
}
.partPosInput {
  width: 70px;
  max-width: 70px;
}
.descriptionInput {
  width: 355px;
  max-width: 355px;
}
</style>