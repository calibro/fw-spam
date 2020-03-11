<template>
  <div class="fw-input">
    <label>{{label}}</label>
    <b-form-input :value="value" @input="onInput"></b-form-input>
  </div>
</template>

<script>
export default {
  name: 'FWInput',
  props: ['label', 'value'],
  methods: {
    onInput (evt) {
      this.$emit('input', evt);
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>