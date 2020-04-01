<template>
  <b-container class="export-bar">
    <b-row>
      <b-col>
        <fw-input
          label="Title"
          :value="slideTitle"
          @input="setSildeTitle"
          placeholder="your slide title"
        ></fw-input>
      </b-col>
      <b-col>
        <fw-input
          label="Source"
          :value="slideSource"
          @input="setSlideSource"
          placeholder="additional information"
        ></fw-input>
      </b-col>
      <b-col>
        <fw-select
          label="Slide size"
          :value="slideSize"
          @change="setSlideSize"
          :options="slideSizeOptions"
        ></fw-select>
      </b-col>
      <b-col>
        <div class="fw-option-select-label">export</div>
        <b-row>
          <b-col>
            <b-button
              variant="warning"
              class="btn-block fw-button"
              @click="() => onExport('svg')"
            >
              .svg
            </b-button>
          </b-col>
          <b-col>
            <b-button
              variant="warning"
              class="btn-block fw-button"
              @click="() => onExport('png')"
            >
              .png
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "ExportBar",
  data() {
    return {
      slideSizeOptions: [
        { value: "1920:1080", text: "1920 x 1080 (16:9)" },
        { value: "1024:768", text: "1024 x 768 (4:3)" },
        { value: "1191:842", text: "1191 x 842 (A3 landscape)" }
      ]
    };
  },
  computed: {
    ...mapState(["slideTitle", "slideSource", "slideSize"])
  },
  methods: {
    ...mapMutations(["setSildeTitle", "setSlideSource", "setSlideSize"]),

    onExport(format) {
      this.$emit("export", format);
    }
  }
};
</script>

<style scoped lang="stylus">
.export-bar
  width 100%
  .row
    .export-button
      width 100%
.fw-button
  font-size: 0.7rem
  padding 0.525rem 0.75rem
  text-transform uppercase
</style>
