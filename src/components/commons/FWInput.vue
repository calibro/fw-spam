<template>
  <div class="fw-input">
    <label class="fw-option-select-label">{{ label }}</label>
    <b-form-input
      :value="value"
      @input="onInput"
      :placeholder="placeholder"
    ></b-form-input>
  </div>
</template>

<script>
export default {
  name: "FWInput",
  props: ["label", "value", "placeholder"],
  methods: {
    onInput(evt) {
      this.$emit("input", evt);
    }
  }
};
</script>

<style lang="stylus" scoped></style>
