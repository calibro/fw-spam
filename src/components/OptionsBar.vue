<template>
  <b-container class="options-bar">
    <b-row>
      <b-col sm="6">
        <data-selector></data-selector>
      </b-col>
      <b-col>
        <fw-select
          label="Area by"
          :value="areaBy"
          @change="setAreaBy"
          :options="areaOptions"
        >
        </fw-select>
      </b-col>
      <b-col>
        <fw-select
          label="Color by"
          :value="colorBy"
          @change="setColorBy"
          :options="colorOptions"
        ></fw-select>
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
    ...mapState(["areaBy", "colorBy"])
  },
  methods: {
    ...mapMutations(["setAreaBy", "setColorBy"])
  }
};
</script>

<style scoped lang="stylus">
.options-bar
  .row
    align-items: flex-end
</style>
