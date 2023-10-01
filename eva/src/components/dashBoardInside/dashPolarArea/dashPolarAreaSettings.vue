<template>
  <modal-persistent
    ref="confirmModal"
    v-model="isOpen"
    :theme="theme"
    width="560"
    scrollable
    :is-confirm="isChanged"
    :persistent="isChanged"
    :dark="isDarkTheme"
    @cancelModal="close"
    @keydown.esc="close"
  >
    <v-card class="dialog-content">
      <v-card-title class="header">
        <span class="main-title">Настройка визуализации</span>
      </v-card-title>
      <v-card-text class="content groups-multiline-settings">

        <h3>Настройки данных</h3>
        <v-text-field
          v-model="options.fields.value"
          class="mb-6 mt-2"
          outlined
          label="Поле со значением"
          hide-details
          dense
          @change="isChanged = true"
        />
        <v-text-field
          v-model="options.fields.label"
          class="mb-6 mt-2"
          outlined
          label="Поле с названием"
          hide-details
          dense
          @change="isChanged = true"
        />

        <h3>Настройки оформления</h3>
        <h4>Тип диаграммы</h4>
        <v-select
          v-model="options.type"
          dense
          outlined
          hide-details
          :items="[
            { value: 'polarArea', text: 'Polar Area' },
            { value: 'donut', text: 'Donut' },
            { value: 'pie', text: 'Pie' },
          ]"
          @change="isChanged = true"
        />
        <h4>Расположение легенды</h4>
        <v-select
          v-model="options.legend.position"
          dense
          outlined
          hide-details
          :items="[
            { value: 'right', text: 'Справа' },
            { value: 'left', text: 'Слева' },
            { value: 'top', text: 'Сверху' },
            { value: 'bottom', text: 'Снизу' },
          ]"
          @change="isChanged = true"
        />
        <h4>Тема</h4>
        <v-select
          v-model="options.theme"
          dense
          outlined
          hide-details
          :items="[
            { value: 'monochrome', text: 'Монохромная' },
            { value: 'colored', text: 'Цветная' },
          ]"
          @change="isChanged = true"
        />
        <v-row>
          <v-col>
            <v-checkbox
              v-if="options.type === 'polarArea'"
              v-model="options.yaxis.show"
              label="Показывать шкалу Y"
              dense
              hide-details
              color="blue"
            />
            <v-checkbox
              v-if="options.type === 'polarArea'"
              v-model="options.hidePlotArea"
              label="Скрыть подложку"
              dense
              hide-details
              color="blue"
            />
          </v-col>
        </v-row>

      </v-card-text>

      <v-card-actions class="footer pr-3 d-flex justify-end px-6">
        <v-btn
          text
          depressed
          class="btn-cancel"
          dark
          :color="theme.$primary_button"
          @click="close"
        >
          Отмена
        </v-btn>
        <v-btn
          depressed
          class="btn-save"
          dark
          :color="theme.$primary_button"
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </modal-persistent>
</template>

<script>
import {
  mdiPalette,
  mdiDelete,
  mdiPlus,
} from '@mdi/js';
import { mapGetters } from 'vuex';

export default {
  name: 'DashPolarAreaSettings',
  model: {
    prop: 'modalValue',
    event: 'updateModalValue',
  },
  props: {
    modalValue: {
      type: Boolean,
      default: false,
    },
    receivedSettings: {
      required: true,
      type: Object,
    },
    icons: {
      type: Object,
      default: () => ({
        mdiPalette,
        mdiDelete,
        mdiPlus,
      }),
    },
  },
  data: () => ({
    defaultOptions: {
      type: 'polarArea',
      fields: {
        value: 'value',
        label: 'label',
      },
      legend: {
        position: 'right'
      },
      yaxis: {
        show: true,
      },
      theme: 'monochrome',
      hidePlotArea: false,
    },
    options: {
      fields: {
        value: '',
        label: '',
      },
      legend: {
        position: ''
      },
      yaxis: {
        show: true,
      },
      theme: 'monochrome',
      hidePlotArea: false,
    },
    isChanged: false,
  }),
  computed: {
    ...mapGetters({
      theme: 'getTheme',
      themeTitle: 'getThemeTitle',
    }),
    isDarkTheme() {
      return this.themeTitle.indexOf('light') === -1;
    },
    isOpen: {
      get() {
        return this.modalValue;
      },
      set(val) {
        this.panelMetric = [];
        this.$emit('updateModalValue', val);
      },
    },
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.initOptions();
      }
    },
    receivedSettings() {
      this.initOptions();
    },
  },
  mounted() {
    this.initOptions();
  },
  methods: {

    initOptions() {
      this.options = {
        ...structuredClone(this.defaultOptions),
        ...structuredClone(this.receivedSettings),
      }
    },

    save() {
      this.isChanged = false;
      this.$emit('save', structuredClone(this.options));
      this.close(true);
    },

    close() {
      this.isChanged = false;
      this.$emit('close');
    },

  },
};
</script>

<style lang="sass" scoped>
@import ../../../sass/_colors
.dialog-content::v-deep,
.v-color-picker
  background-color: $main_bg !important
.zone-item
  border: 1px solid $main_border
  border-radius: 3px
  margin: 4px 0
  padding-bottom: 2px
  &.has-error::v-deep
    border-color: #bd0000
    background-color: #f002
    .v-text-field__slot input
      color: red
    .picker
      .v-color-picker__controls
        background-color: #f002
.picker::v-deep
  .v-color-picker__controls
    padding: 12px
</style>
