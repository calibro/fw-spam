<template>
  <div id="app">
    <div class="fw-header item-container">
      <div>Cyber Security Data Visualization Lab</div>
    </div>
    <div v-if="showApp" class="ui-body">
      <div class="options-bar-container item-container">
        <options-bar></options-bar>
      </div>
      <div class="slide-container item-container">
        <div class="slide-box" v-resize="onResize">
          <slide-container ref="slide"></slide-container>
        </div>
        <filter-sidebar></filter-sidebar>
      </div>
      <div class="export-bar-container item-container">
        <export-bar @export="doExport"></export-bar>
      </div>
    </div>
    <div v-else class="load-data-ui">
      <data-selector></data-selector>
    </div>
  </div>
</template>

<script>
import SlideContainer from "./components/SlideContainer.vue";
import OptionsBar from "./components/OptionsBar.vue";
import ExportBar from "./components/ExportBar.vue";
import FilterSidebar from "./components/FilterSidebar.vue";
import DataSelector from "./components/DataSelector.vue";
import resize from "vue-resize-directive";

export default {
  name: "app",
  components: {
    SlideContainer,
    ExportBar,
    OptionsBar,
    FilterSidebar,
    DataSelector
  },
  computed: {
    showApp() {
      return (
        !this.$store.state.data.firstLoad || this.$store.state.data.fetchingData
      );
    }
  },
  methods: {
    doExport(format) {
      this.$refs.slide.exportImage(format);
    },
    onResize() {
      this.$refs.slide.resize();
    }
  },
  directives: {
    resize
  }
};
</script>
<style lang="stylus">
body
  margin 0
  padding 0
#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50
  max-height 100vh
  height 100vh
  display flex
  flex-direction column
  .item-container
    > div
      width 80%
      margin auto
  .fw-header
    min-height 40px
    background #000
    color #ffc107
    align-items: center;
    display: flex;
  .ui-body
    display: flex
    height:calc(100vh - 40px)
    flex-direction column
  .load-data-ui
    display: flex
    height: 100%
    justify-content center
    align-items center

  .options-bar-container
    border-bottom 1px solid #ccc
    padding: 15px 0
  .export-bar-container
    border-top 1px solid #ccc
    padding: 15px 0
  .slide-container
    display flex
    flex 1 1 auto
    background #f2f2f2
    overflow: hidden;
    position relative
    .slide-box
      width 80%
      margin 15px auto
      overflow hidden
      text-align: center
  .fw-option-select-label
    font-size: 0.7rem
    text-transform:uppercase
    color: #495057
    margin-bottom:2px
</style>
