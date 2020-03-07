<template>
  <div class="export-bar">
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
    <div class="export-input-container">
      <fw-button>Export slide</fw-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportBar'
}
</script>

<style scoped lang="stylus">
.export-bar
  width 100%
  display flex
  flex-direction row
  align-items center
  height 100%
  justify-content: space-between
  > div
    flex 0 0 23%
  .export-input-container
    .fw-button
      width 100%
</style>
