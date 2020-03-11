<template>
  <b-container class="export-bar">
    <b-row>
      <b-col>
        <fw-input label="Title" :value="slideTitle" @input="setSildeTitle"></fw-input>
      </b-col>
      <b-col>
        <fw-input label="Source" :value="slideSource" @input="setSlideSource"></fw-input>
      </b-col>
      <b-col>
        <fw-select label="Slide size" :value="slideSize" @change="setSlideSize" :options="slideSizeOptions"></fw-select>
      </b-col>
      <b-col>
        <fw-button class="export-button" @click="onExport">Export slide</fw-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'ExportBar',
  data() {
    return {
      slideSizeOptions: [
          { value: '1920:1080', text: '1920 x 1080 (16:9)' },
          { value: '1024:768', text: '1024 x 768 (4:3)' },
          { value: '1191:842', text: '1191 x 842 (A3 landscape)' }
        ]
    }
  },
  computed: {
    ...mapState(['sildeTitle', 'slideSource', 'slideSize'])
  },
  methods: {
    ...mapMutations(['setSildeTitle', 'setSlideSource', 'setSlideSize']),

    onExport () {
      this.$emit('export')
    }
  }
}
</script>

<style scoped lang="stylus">
.export-bar
  width 100%
  .row
    margin-top 8px
    align-items: flex-end
    .export-button
      width 100%
</style>
