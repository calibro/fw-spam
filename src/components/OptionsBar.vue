<template>
  <b-container class="options-bar">
    <b-row>
      <b-col sm="6">
        <data-selector></data-selector>
      </b-col>
      <b-col sm="2">
        <fw-select
          label="Color by"
          :value="colorBy"
          @change="setColorBy"
          :options="colorOptions"
        ></fw-select>
      </b-col>
      <b-col sm="2">
        <fw-select
          label="Area by"
          :value="areaBy"
          @change="setAreaBy"
          :options="areaOptions"
        >
        </fw-select>
      </b-col>
      <b-col sm="2" class="align-self-start d-flex flex-column">
        <label class="fw-option-select-label">Area scale</label>
        <b-form-checkbox
          :checked="useOriginalValues"
          @change="setUseOriginalValues"
          class="mt-2"
          >Log scale (original)</b-form-checkbox
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import DataSelector from "./DataSelector";

export default {
  name: "OptionsBar",
  components: {
    DataSelector
  },
  data() {
    return {
      areaOptions: [
        { value: "lastmonth", text: "Last Month" },
        { value: "lastday", text: "Last Day" }
      ],
      colorOptions: [
        { value: "email_score_name", text: "Reputation" },
        { value: "blacklists_count", text: "Blacklist count" }
      ]
    };
  },
  computed: {
    ...mapState(["areaBy", "colorBy", "useOriginalValues"])
  },
  methods: {
    ...mapMutations(["setAreaBy", "setColorBy", "setUseOriginalValues"])
  }
};
</script>

<style scoped lang="stylus">
.options-bar
  .row
    align-items: flex-end
</style>
