<template>
  <portal
    :to="idFrom"
    :disabled="!fullScreenMode"
    style="height: calc(100% - 40px);"
  >
    <div
      class="dash-columns"
      :class="{
        small: box.isSmall,
      }"
      v-bind="$attrs"
    >
      <v-icon
        v-if="dataModeFrom && !fullScreenMode"
        class="options-icon"
        :color="theme.$main_border"
        @click="isSettingsComponentOpen = true"
      >
        {{ icons.mdiSettings }}
      </v-icon>
      <vue-apex-charts
        ref="chart"
        class="chart"
        type="bar"
        :width="box.width"
        height="100%"
        :options="chartOptions"
        :series="series"
      />
      <DashColumnsSettings
        ref="settings"
        v-model="isSettingsComponentOpen"
        :received-settings="options"
        @save="saveSettings"
        @close="closeSettings"
      />
    </div>
  </portal>
</template>

<script>
import { mapGetters } from 'vuex';
import { mdiSettings } from '@mdi/js';
import VueApexCharts from 'vue-apexcharts';
import DashColumnsSettings from '@/components/dashBoardInside/dashColumns/dashColumnsSettings.vue';

export default {
  name: 'DashDashColumns',
  components: {
    DashColumnsSettings,
    VueApexCharts
  },
  props: {
    sizeFrom: {
      type: Object,
      required: true,
    },
    dataRestFrom: {
      type: Array,
      required: true,
    },
    idFrom: {
      type: String,
      required: true,
    },
    idDashFrom: {
      type: String,
      required: true,
    },
    options: {
      type: Object,
      default: null,
    },
    fullScreenMode: {
      type: Boolean,
      default: false,
    },
    dataModeFrom: {
      type: Boolean,
      default: false,
    },
    icons: {
      type: Object,
      default: () => ({
        mdiSettings,
      }),
    },
    defaultZones: {
      type: Array,
      default: () => ([
        { color: '#cccccc', min: 0, max: 100 },
      ]),
    },
    updateSettings: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isSettingsComponentOpen: false,
      defaultOptions: {
        type: 'bar',
        fields: {
          value: 'value',
          label: 'label',
        },
        legend: {
          position: 'right',
        },
        bar: {
          horizontal: false,
          columnWidth: '65%',
          columnWidthPercent: 65,
        },
        yaxis: {
          show: true,
        },
        theme: 'monochrome',
        chart: {
          stacked: false,
          stackType: 'normal',
          toolbar: {
            show: false,
          },
        },
      }
    };
  },
  computed: {
    ...mapGetters({
      theme: 'getTheme',
      isThemeDark: 'isThemeDark',
      themeColors: 'themeColors',
    }),
    ...mapGetters('app', [
      'userSettings',
    ]),
    dashFromStore() {
      return this.$store.state[this.idDashFrom][this.idFrom];
    },
    groups() {
      const { fields } = this.preparedOptions;
      return this.dataRestFrom
        .reduce((acc, item) => {
          const group = item[fields.group] || '';
          if (!acc.includes(group)) {
            acc.push(group);
          }
          return acc;
        }, [])
    },
    series() {
      const { fields } = this.preparedOptions;
      return this.dataRestFrom
        .reduce((acc, item) => {
          const label = item[fields.label];
          const value = item[fields.value] || 0;
          const arr = acc.find(({ name }) => name === label);
          if (arr) {
            arr.data.push(value);
          } else {
            acc.push({
              name: label,
              data: [ value ]
            });
          }
          return acc;
        }, [])
    },
    colors() {
      const { theme } = this.preparedOptions;
      if (theme === 'monochrome') {
        return undefined;
      }
      const colors = this.dataRestFrom
        .map((d) => d.color)
        .filter((color) => /^#[0-9a-f]{6}/i.test(`${color}`));
      if (colors.length !== this.dataRestFrom.length) {
        return this.themeColors
      }
      return colors;
    },
    box() {
      const { width, height } = this.sizeFrom;
      return {
        width: Math.round(width) - 30,
        height: Math.round(height) - 62,
      };
    },
    preparedOptions() {
      return {
        ...structuredClone(this.defaultOptions),
        ...this.options,
      }
    },
    chartOptions() {
      const {
        xaxisPosition,
        stacked,
        stackType,
        dataLabelsEnabled,
        bar,
        theme,
      } = this.preparedOptions;
      return {
        legend: this.preparedOptions.legend,
        xaxis: {
          categories: this.groups,
          position: xaxisPosition,
          axisBorder: {
            show: true
          },
        },
        plotOptions: {
          bar,
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          enabled: dataLabelsEnabled,
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        theme: {
          mode: this.isThemeDark ? 'dark' : 'light',
          monochrome: {
            enabled: theme === 'monochrome',
            shadeTo: this.isThemeDark ? 'dark' : 'light',
            shadeIntensity: 0.6
          }
        },
        chart: {
          type: 'bar',
          height: this.box.height,
          stacked,
          stackType,
          toolbar: {
            show: false,
          },
          animations: {
            enabled: false,
          },
          background: 'rgba(0,0,0,0)',
        },
      }
    }
  },
  watch: {
    box(val, old) {
      if (JSON.stringify(val) !== JSON.stringify(old)) {
        setTimeout(() => {
          this.resize();
        }, 10)
      }
    },
    theme() {
      this.resize();
    },
    fullScreenMode() {
      this.resize();
    },
    chartOptions() {
      this.$nextTick(() => {
        this.resize();
      })
    },
  },
  mounted() {
    this.resize();
  },
  methods: {
    resize() {
      this.$refs.chart?.refresh()
    },

    saveOptions(options) {
      this.$store.commit('setOptions', {
        id: this.idFrom,
        idDash: this.idDashFrom,
        options,
      });
    },

    closeSettings() {
      this.isSettingsComponentOpen = false;
    },

    saveSettings(options) {
      this.closeSettings();
      this.saveOptions(options);
      if (this.updateSettings) this.updateSettings(options);
    },

  },
};
</script>

<style scoped lang="scss">
.dash-columns {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  justify-items: center;
  align-items: center;
  color: var(--main_text);
  .options-icon {
    position: absolute;
    top: 40px;
    right: 8px;
    z-index: 100;
  }
}
</style>
