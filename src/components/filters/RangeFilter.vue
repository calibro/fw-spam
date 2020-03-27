<template>
  <div class="range-filter">
    <div class="input-block">
      <label>Min</label>
      <b-form-input ref="minInput" :value="minVal" type="number" :min="minRange" :max="maxRange" @input="change" step="0.01"></b-form-input>
    </div>
    <div class="input-block">
      <label>Max</label>
      <b-form-input ref="maxInput" :value="maxVal" type="number" :min="minRange" :max="maxRange" @input="change" step="0.01"></b-form-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RangeFilter',
  props: ['range', 'value', 'onChange'],
  computed: {
    minRange () {
      return this.range && this.range.length == 2 ? this.range[0].toFixed(2) : 0
    },
    maxRange () {
      return this.range && this.range.length == 2 ? this.range[1].toFixed(2) : 10
    },
    minVal () {
      return this.value && this.value.length == 2 ? this.value[0].toFixed(2) : 0
    },
    maxVal () {
      return this.value && this.value.length == 2 ? this.value[1].toFixed(2) : 10
    }
  },
  methods: {
    change (val) {
      let min = parseFloat(this.$refs.minInput.localValue)
      let max = parseFloat(this.$refs.maxInput.localValue)
      this.onChange([min, max])
    }
  }
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