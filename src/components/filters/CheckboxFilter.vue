<template>
  <b-form-group>
    <b-form-checkbox-group
      v-model="value"
      :options="options"
      :name="name"
      @change="change"
    ></b-form-checkbox-group>
  </b-form-group>
</template>

<script>
export default {
  name: "CheckboxFilter",
  props: ["name", "options", "value", "onChange"],
  data() {
    return {
      selected: null
    };
  },
  methods: {
    change(val) {
      this.onChange(val);
    }
  }
};
</script>

<style lang="stylus" scoped></style>
