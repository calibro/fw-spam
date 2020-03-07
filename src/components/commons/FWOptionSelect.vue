<template>
  <div class="fw-option-select">
    <label>{{label}}</label>
    <b-form-select v-model="selected" :options="options"></b-form-select>
  </div>
</template>

<script>
export default {
  name: 'FWOptionSelect',
  props: ['label'],
  data () {
    return {
      selected: null,
      options: [
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' },
          { value: { C: '3PO' }, text: 'This is an option with object value' },
          { value: 'd', text: 'This one is disabled', disabled: true }
        ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.fw-option-select
  display flex
  flex-direction column
</style>