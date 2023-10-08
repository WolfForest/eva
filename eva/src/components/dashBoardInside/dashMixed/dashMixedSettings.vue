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
        <v-row>
          <v-col>
            <v-text-field
              v-model="options.fields.value"
              class="mb-6 mt-2"
              outlined
              label="Поле со значением"
              hide-details
              dense
              @change="isChanged = true"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="options.fields.label"
              class="mb-6 mt-2"
              outlined
              label="Поле с названием"
              hide-details
              dense
              @change="isChanged = true"
            />
          </v-col>
          <v-col>
            <v-text-field
              v-model="options.fields.group"
              class="mb-6 mt-2"
              outlined
              label="Поле с группой"
              hide-details
              dense
              @change="isChanged = true"
            />
          </v-col>
        </v-row>
        <v-row class="mt-0">
          <v-col>
            <v-checkbox
              v-model="options.stacked"
              label="Складывать столбики"
              dense
              hide-details
              color="blue"
              @change="isChanged = true"
            />
          </v-col>
        </v-row>
        <v-row class="mt-1">
          <v-col cols="12" class="py-0">
            <v-checkbox
              v-model="options.dataLabelsEnabled"
              label="Показывать значения на столбиках"
              dense
              hide-details
              color="blue"
              @change="isChanged = true"
            />
          </v-col>
          <v-col>
            <v-slider
              v-model="options.bar.columnWidthPercent"
              color="blue"
              label="Ширина столбцов"
              min="2"
              max="100"
              thumb-size="25px"
              thumb-label="always"
              @change="options.bar.columnWidth = `${options.bar.columnWidthPercent}%`"
            />
          </v-col>
        </v-row>
        <v-row class="my-0">
        </v-row>

        <h3>Настройки оформления</h3>
        <v-row>
          <v-col>
            <h4>Расположение оси X</h4>
            <v-select
              v-model="options.xaxisPosition"
              dense
              outlined
              hide-details
              :items="[
                { value: 'top', text: 'Сверху' },
                { value: 'bottom', text: 'Снизу' },
              ]"
              @change="isChanged = true"
            />
          </v-col>
          <v-col>
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
          </v-col>
        </v-row>

        <h3 class="mt-5 mb-1">Настройка метрик</h3>
        <div class="border-rounded mb-4">
          <div v-for="(metric, i) in options.metricsOptions" class="metric-item my-2">
            <v-btn
              v-if="oldMetrics.includes(metric.label)"
              icon
              small
              class="icon-delete"
              title="Удалить"
              @click="deleteMetric(metric.label)"
            >❌</v-btn>
            <h4>Метрика: {{ metric.label }}</h4>
            <v-row>
              <v-col cols="5">
                <v-select
                  label="Тип графика"
                  v-model="metric.type"
                  :items="[
                    { value: 'line', text: 'Линия' },
                    { value: 'column', text: 'Столбики' },
                    { value: 'area', text: 'Закрашенная область' },
                  ]"
                  hide-details
                  outlined
                  dense
                  :style="{ color: theme.$main_text }"
                  @input="$emit('isChanged', true); isChanged = true"
                />
                <v-text-field
                  v-model="metric.replacedLabel"
                  class="my-2"
                  outlined
                  label="Новое название"
                  hide-details
                  dense
                  @change="isChanged = true"
                />
                <v-checkbox
                  v-model="metric.colorEnabled"
                  label="Заменить цвет"
                  persistent-placeholder
                  dense
                  outlined
                  hide-details
                  color="blue"
                  @change="isChanged = true"
                />
              </v-col>
              <v-col class="pt-0">
                <v-color-picker
                  v-model="metric.color"
                  :disabled="!metric.colorEnabled"
                  dot-size="10"
                  hide-canvas
                  mode="hexa"
                  width="290"
                  @change="isChanged = true"
                />
              </v-col>
            </v-row>
            <hr v-if="options.metricsOptions.length !== i+1">
          </div>
        </div>
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
  name: 'DashMixedSettings',
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
    currentMetrics: {
      required: true,
      type: Array,
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
      fields: {
        value: 'value',
        label: 'label',
        group: 'group',
      },
      legend: {
        position: 'right'
      },
      stacked: false,
      stackType: 'normal', // 100%
      dataLabelsEnabled: false,
      xaxisPosition: 'bottom',
      bar: {
        horizontal: false,
        columnWidth: '65%',
        columnWidthPercent: 65,
      },
      metricsOptions: [],
    },
    options: {
      fields: {
        value: '',
        label: '',
        group: '',
      },
      legend: {
        position: ''
      },
      stacked: false,
      stackType: '',
      dataLabelsEnabled: false,
      xaxisPosition: '',
      bar: {
        horizontal: false,
        columnWidth: '',
        columnWidthPercent: 0,
      },
      metricsOptions: [],
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
    savedLabels() {
      return this.options.metricsOptions.map((item) => item.label);
    },
    oldMetrics() {
      return this.savedLabels.filter(label => !this.currentMetrics.includes(label));
    }
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
      const { metrics: savedMetrics = {} } = this.options;
      let metrics = this.currentMetrics.sort().reduce((acc, label) => {
        if (!this.savedLabels.includes(label)) {
          const type = savedMetrics[label]?.type || 'column';
          acc.push({
            label,
            type,
            color: null,
            colorEnabled: false,
            replacedLabel: '',
          })
        }
        return acc;
      }, []);
      this.options.metricsOptions = [...this.options.metricsOptions, ...metrics];
    },

    deleteMetric(label) {
      this.options.metricsOptions = this.options.metricsOptions.filter(item => item.label !== label);
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
.border-rounded
  border: 2px solid var(--main_border)
  border-radius: 8px
  padding: 8px
.metric-item
  position: relative
  .icon-delete
    position: absolute
    top: -5px
    right: -4px
    padding: 4px
    z-index: 1
    &:hover
      color: red
</style>
