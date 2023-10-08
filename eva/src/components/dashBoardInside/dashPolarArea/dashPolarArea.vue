<template>
  <portal
    :to="idFrom"
    :disabled="!fullScreenMode"
    style="height: calc(100% - 40px);"
  >
    <div
      class="polar-area"
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
        v-if="showChart"
        ref="chart"
        class="chart"
        :type="preparedOptions.type"
        :width="box.width"
        height="100%"
        :options="chartOptions"
        :series="series"
      />
      <DashPolarAreaSettings
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
import DashPolarAreaSettings from "@/components/dashBoardInside/dashPolarArea/dashPolarAreaSettings.vue";

export default {
  name: 'DashPolarArea',
  components: {
    DashPolarAreaSettings,
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
        type: 'polarArea',
        fields: {
          value: 'value',
          label: 'label',
        },
        legend: {
          position: 'right',
        },
        yaxis: {
          show: true,
        },
        theme: 'monochrome',
        hidePlotArea: false,
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
    series() {
      const { fields } = this.preparedOptions;
      return this.dataRestFrom.map((d) => d[fields.value] || 0)
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
        height: Math.round(height) - 50,
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
        fields,
        yaxis,
        theme,
        hidePlotArea,
      } = this.preparedOptions;
      return {
        legend: this.preparedOptions.legend,
        labels: this.dataRestFrom.map((d) => d[fields.label] || '...'),
        stroke: {
          width: 1,
          colors: this.colors, // ['#fff']
        },
        fill: {
          opacity: .9,
          colors: this.colors,
        },
        yaxis,
        plotOptions: {
          polarArea: {
            rings: {
              strokeWidth: hidePlotArea ? 0 : 1,
              strokeColor: '#e8e8e8',
            },
            spokes: {
              strokeWidth: hidePlotArea ? 0 : 1,
              connectorColors: '#e8e8e8',
            },
          },
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
          animations: {
            enabled: false,
          },
          background: 'rgba(0,0,0,0)'
        }
      }
    }
  },
  watch: {
    box(val, old) {
      if (JSON.stringify(val) !== JSON.stringify(old)) {
        this.resize();
        setTimeout(() => {
          this.resize();
        }, 50)
      }
    },
    theme() {
      this.resize();
    },
    fullScreenMode() {
      this.resize();
    },
  },
  mounted() {
  },
  methods: {
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
.polar-area {
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
