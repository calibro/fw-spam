<template>
  <div class="options-bar">
    <div class="data-input-container">
      <fw-button>Upload data</fw-button>
    </div>
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
    <div class="option-input-container">
      <fw-select label="Group by"></fw-select>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OptionsBar'
}
</script>

<style scoped lang="stylus">
.options-bar
  width 100%
  display flex
  flex-direction row
  align-items center
  height 100%
  justify-content: space-between
  > div
    flex 0 0 23%

</style>
