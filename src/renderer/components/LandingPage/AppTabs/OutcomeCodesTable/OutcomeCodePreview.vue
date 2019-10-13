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
            <b-form-input id="partitionInput" v-on:mouseleave="hideTooltip('partitionInput')" type="text" v-model="form.partition" class="partPosInput" v-bind:class="{ 'is-invalid': shouldValidate && (missingPartition || notUnique) }"/>
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
            <b-form-input id="descriptionInput" :maxlength="35" v-on:mouseleave="hideTooltip('descriptionInput')" type="text" v-model="form.description" class="descriptionInput" v-bind:class="{ 'is-invalid': shouldValidate && missingDescription }"/>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row >
        <b-col>
          <b-button-group class="float-right">
            <b-button id="saveOutcomeCodeBtn" v-on:mouseleave="hideTooltip('saveOutcomeCodeBtn')" type="submit" variant="link" class="btn-lg">
              <img src="~@/assets/save.png">
            </b-button>
            <b-button id="clearFormBtn" v-on:mouseleave="hideTooltip('clearFormBtn')" @click.stop="clearForm()" variant="link" class="btn-lg">
              <img src="~@/assets/clear.png">
            </b-button>
          </b-button-group>
        </b-col>
      </b-row>
    </b-form>

    <b-tooltip target="saveOutcomeCodeBtn" triggers="hover" placement="top" ref="saveOutcomeCodeBtnTooltip">
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

      <b-modal id="outcome-code-preview-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="outcome-code-preview-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
  </b-container>
</template>

<script>
import MessageConfirmDialog from '../../../MessageConfirmDialog'

const outcomeCodeController = require('../../../../controllers/outcomeCodeController')
const i18n = require('../../../../translations/i18n')
const { partitionPositionNumberOptions, mapCodeToCodeForm, mapCodeFormToCode } = require('../../../../utils/utils')
const AutoNumeric = require('autonumeric')

export default {
  props: {
    existingOutcomeCodes: {
      type: Array,
      default: []
    },
    outcomeCode: Object,
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
        notUnique: i18n.getTranslation('Outcome code partition and position not unique'),
        enterDescription: i18n.getTranslation('Enter description'),
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
      positionInputAutonumeric: null
    }
  },
  created () {
    if (this.isUpdate) {
      this.form = mapCodeToCodeForm(JSON.parse(JSON.stringify(this.outcomeCode)))
    }
  },
  mounted () {
    this.partitionInputAutonumeric = new AutoNumeric('#partitionInput', partitionPositionNumberOptions)
    this.positionInputAutonumeric = new AutoNumeric('#positionInput', partitionPositionNumberOptions)
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
      return !this.form.partition || this.form.partition.trim() === ''
    },
    missingPosition: function () {
      return !this.form.position || this.form.position.trim() === ''
    },
    missingDescription: function () {
      return !this.form.description || this.form.description.toString().trim() === ''
    },
    notUnique: function () {
      const self = this
      var euqivalentInstance = this.existingOutcomeCodes.filter(outcomeCode => {
        return outcomeCode.partition == self.form.partition && outcomeCode.position == self.form.position && outcomeCode._id != self.form._id
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
          outcomeCodeController.updateOutcomeCode(mapCodeFormToCode(this.form)).then((res) => {
              if (!res.err) {
                self.$emit('updateOutcomeCodes')
                self.closeModal();
              } else {
                self.openErrorModal(res.err)
              }
          })
        } else {
          outcomeCodeController.createOutcomeCode(mapCodeFormToCode(this.form)).then((res) => {
              if (!res.err) {
                self.$emit('updateOutcomeCodes')
                self.closeModal();
              } else {
                self.openErrorModal(res.err)
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
      this.$root.$emit('bv::show::modal', 'outcome-code-preview-error-modal')
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
  width: 50px;
  max-width: 50px;
}
.descriptionInput {
  width: 355px;
  max-width: 355px;
}
.is-invalid {
  border: dotted 1px red;
  padding-right: 0 !important;
  background-image: url('~@/assets/invalid-red.png') !important;
}
</style>