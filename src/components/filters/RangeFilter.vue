<template>
  <div class="range-filter">
    <div class="input-block">
      <label>Min</label>
      <b-form-input :placeholder="min" type="number"></b-form-input>
    </div>
    <div class="input-block">
      <label>Max</label>
      <b-form-input :placeholder="max" type="number"></b-form-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RangeFilter',
  props: ['min', 'max']
}
</script>

<style lang="stylus" scoped>
.range-filter
  display flex
  justify-content: space-between
  .input-block
    display flex
    flex-direction column
    width 45%
    label
      font-size 13px
      font-weight bold
</style>