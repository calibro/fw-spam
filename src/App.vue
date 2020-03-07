<template>
  <div id="app">
    <div class="fw-header item-container">
      <div>Infosec Data Visualization Lab</div>
    </div>
    <div class="options-bar-container item-container">
      <options-bar></options-bar>
    </div>
    <div class="slide-container item-container">
      <circle-pack-chart></circle-pack-chart>
    </div>
    <div class="export-bar-container item-container">
      <export-bar></export-bar>
    </div>
  </div>
</template>

<script>
import CirclePackChart from './components/CirclePackChart.vue'
import OptionsBar from './components/OptionsBar.vue'
import ExportBar from './components/ExportBar.vue'

export default {
  name: 'app',
  components: {
    CirclePackChart,
    ExportBar,
    OptionsBar
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
</style>
