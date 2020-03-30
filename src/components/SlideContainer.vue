<template>
  <svg
    v-if="!fetchingData"
    id="main-slide"
    ref="mainSlide"
    preserveAspectRatio
    :width="svgWidth"
    :height="svgHeight"
    :viewBox="'0 0 ' + slideSizeArray.join(' ')"
  >
    <text
      x="25"
      y="50"
      font-size="32px"
      font-family="'Arial', sans-serif"
      font-weight="bold"
    >
      {{ sildeTitle }}
    </text>
    <circle-pack-chart
      x="25"
      y="65"
      :width="slideSizeArray[0] - 25"
      :height="slideSizeArray[1] - 90"
    ></circle-pack-chart>
    <text
      :x="slideSizeArray[0] - 25"
      :y="slideSizeArray[1] - 25"
      font-size="16px"
      font-family="'Arial', sans-serif"
      text-anchor="end"
      fill="#aaa"
    >
      {{ slideSource }}
    </text>
  </svg>
  <div v-else class="loading-container">
    <b-spinner label="Loading..."></b-spinner>
    Loading...
  </div>
</template>

<script>
import { saveSvgAsPng } from "save-svg-as-png";
import saveSVG from "@/utils/saveSVG";
import CirclePackChart from "./CirclePackChart.vue";
import { mapState, mapGetters } from "vuex";

export default {
  name: "SlideContainer",
  data() {
    return {
      svgHeight: 0
    };
  },
  components: {
    CirclePackChart
  },
  mounted() {
    //this.$store.dispatch("data/loadTestData");
    this.resize();
  },
  computed: {
    ...mapState({
      sildeTitle: state => state.sildeTitle,
      slideSource: state => state.slideSource,
      fetchingData: state => state.data.fetchingData
    }),
    ...mapGetters(["slideSizeArray"]),
    aspectRatio() {
      return this.slideSizeArray[0] / this.slideSizeArray[1];
    },
    svgWidth() {
      return this.svgHeight * this.aspectRatio;
    }
  },
  methods: {
    exportImage(format) {
      switch (format) {
        case "png":
          saveSvgAsPng(this.$refs.mainSlide, "chart.png");
          break;
        case "svg":
          saveSVG(this.$refs.mainSlide);
      }
    },
    resize() {
      this.svgHeight = Math.min(this.$el.parentNode.clientHeight, this.$el.parentNode.clientWidth / this.aspectRatio);
    }
  }
};
</script>

<style lang="stylus" scoped>
#main-slide
  background-color #ffffff
.loading-container
  display flex
  flex-direction column
  align-items: center
  justify-content: center
  height: 100%
</style>
