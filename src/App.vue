<template>
  <div id="app">
    <div class="fw-header item-container">
      <div>Infosec Data Visualization Lab</div>
    </div>
    <div class="options-bar-container item-container">
      <options-bar></options-bar>
    </div>
    <div class="slide-container item-container">
      <div class="slide-box">
        <slide-container ref="slide"></slide-container>
      </div>
      <filter-sidebar></filter-sidebar>
    </div>
    <div class="export-bar-container item-container">
      <export-bar @export="doExport"></export-bar>
    </div>
  </div>
</template>

<script>
import SlideContainer from './components/SlideContainer.vue'
import OptionsBar from './components/OptionsBar.vue'
import ExportBar from './components/ExportBar.vue'
import FilterSidebar from './components/FilterSidebar.vue'

export default {
  name: 'app',
  components: {
    SlideContainer,
    ExportBar,
    OptionsBar,
    FilterSidebar
  },
  methods: {
    doExport () {
      this.$refs.slide.exportImage()
    }
  }
}
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

  .options-bar-container, .export-bar-container
    min-height 90px
    max-height 90px
  .options-bar-container
    border-bottom 1px solid #ccc
  .export-bar-container
    margin-top auto
    border-top 1px solid #ccc
  .slide-container
    height auto
    display flex
    flex 1 0 auto
    background #f2f2f2
    max-height: calc(100vh - 40px - 90px - 90px)
    overflow: hidden;
    position relative
    .slide-box
      width 80%
      margin 15px auto
      overflow hidden
      text-align: center
</style>
