<template>
  <div class="fw-option-select">
    <label>{{label}}</label>
    <b-form-select :value="value" :options="options" @change="onChange"></b-form-select>
  </div>
</template>

<script>
export default {
  name: 'FWOptionSelect',
  props: ['label', 'value', 'options'],
  methods: {
    onChange (evt) {
      this.$emit('change', evt)
    }
  }
}
</script>

<style lang="stylus" scoped>
.fw-option-select
  display flex
  flex-direction column
</style>