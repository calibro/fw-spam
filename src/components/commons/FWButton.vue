<template>
  <b-button variant="warning" class="fw-button text-uppercase" @click="onClick">
    <slot></slot>
  </b-button>
</template>

<script>
export default {
  name: "FWButton",
  methods: {
    onClick(evt) {
      this.$emit("click", evt);
    }
  }
};
</script>

<style lang="stylus" scoped>
.fw-button
  font-size: 0.7rem
</style>
