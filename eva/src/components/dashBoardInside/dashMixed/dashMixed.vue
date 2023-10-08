<template>
  <portal
    :to="idFrom"
    :disabled="!fullScreenMode"
  >
    <div
      class="dash-columns"
      :class="{
        small: box.isSmall,
      }"
      v-bind="$attrs"
      @dblclick="onDblclick"
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
        v-if="showChart"
        ref="chart"
        class="chart"
        type="line"
        :options="chartOptions"
        :series="series"
        :height="box.height"
        @mousemove.stop
      />
      <DashMixedSettings
        ref="settings"
        v-model="isSettingsComponentOpen"
        :received-settings="options"
        :current-metrics="metricLabels"
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
import DashMixedSettings from '@/components/dashBoardInside/dashMixed/dashMixedSettings.vue';

export default {
  name: 'DashDashMixed',
  components: {
    DashMixedSettings,
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
          show: false,
          min: 0,
          max: 1300,
        },
        chart: {
          stacked: false,
          stackType: 'normal',
          toolbar: {
            show: false,
          },
        },
        metricsOptions: [],
      },
      showChart: true,
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
    metricLabels() {
      const { fields } = this.preparedOptions;
      return this.dataRestFrom
        .reduce((acc, item) => {
          const group = item[fields.label];
          if (!!group && !acc.includes(group)) {
            acc.push(group);
          }
          return acc;
        }, [])
    },
    series() {
      const { fields } = this.preparedOptions;
      const series = this.dataRestFrom
        .reduce((acc, item, i) => {
          const {
            type = 'column',
            replacedLabel = '',
          } = this.preparedOptions.metricsOptions.find((metric) => metric.label === item[fields.label]) || {};
          const label = replacedLabel || item[fields.label];
          const value = item[fields.value] || 0;
          const arr = acc.find(({ name }) => name === label);
          if (arr) {
            arr.data.push(value);
          } else {
            acc.push({
              nativeName: item[fields.label],
              name: label,
              type,
              data: [ value ],
            });
          }
          return acc;
        }, []);
      return series
        .sort((a, b) => a.nativeName > b.nativeName ? 1 : -1)
        .map((item, i) => {
          return {
            ...item,
            color: this.arrColors[i],
          }
        })
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
    arrColors() {
      return this.metricLabels
        .sort((a, b) => a > b ? 1 : -1)
        .map((label, i) => {
          const metric = this.preparedOptions.metricsOptions
            .find(d => d.label === label);
          return metric?.colorEnabled ? metric.color.hexa : this.themeColors[i];
        });
    },
    chartOptions() {
      const {
        xaxisPosition,
        stacked,
        stackType,
        dataLabelsEnabled,
        bar,
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
        yaxis: {
          labels: {
            formatter: function(val) {
              return val.toString();
            }
          }
        },
        plotOptions: {
          bar,
        },
        dataLabels: {
          enabled: dataLabelsEnabled,
        },
        stroke: {
          show: true,
          width: 2,
          curve: 'smooth',
          colors: this.arrColors,
        },
        fill: {
          colors: this.arrColors,
        },
        theme: {
          mode: this.isThemeDark ? 'dark' : 'light',
        },
        chart: {
          type: 'line',
          width: this.box.width,
          height: this.box.height,
          stacked,
          stackType,
          toolbar: {
            // show: false,
            offsetX: -26,
            tools: {
              zoomin: true,
              zoomout: true,
              download: false,
              pan: true,
              reset: true,
            },
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
    box() {
      this.resize();
    },
    fullScreenMode() {
      this.resize();
    },
  },
  mounted() {
  },
  methods: {
    onDblclick() {
      this.$refs.chart?.resetSeries()
    },
    resize() {
      this.showChart = false;
      setTimeout(() => {
        this.showChart = true
        this.$refs.chart?.refresh()
      }, 100)
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
  height: 100%;
  color: var(--main_text);
  .options-icon {
    position: absolute;
    top: 38px;
    right: 8px;
    z-index: 100;
  }
}
</style>
