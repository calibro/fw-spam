<template>
  <b-container class="options-bar">
    <b-row>
      <b-col>
        <fw-button>Upload data</fw-button>
      </b-col>
      <b-col>
        <fw-select label="Area by" :value="areaBy" @input="setAreaBy" :options="areaOptions">
        </fw-select>
      </b-col>
      <b-col>
        <fw-select label="Color by" :value="colorBy" @input="setColorBy" :options="colorOptions"></fw-select>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'OptionsBar',
  data () {
    return {
      areaOptions: [
        { value: 'lastmonth', text: 'Last Month' },
        { value: 'lastday', text: 'Last Day' }
      ],
      colorOptions: [
        { value: 'email_score_name', text: 'Reputation' },
        { value: 'blacklists_count', text: 'Blacklist count' }
      ]
    }
  },
  computed: {
    ...mapState(['areaBy', 'colorBy'])
  },
  methods: {
    ...mapMutations(['setAreaBy', 'setColorBy'])
  }
}
</script>

<style scoped lang="stylus">
.options-bar
  .row
      margin-top 8px
      align-items: flex-end
</style>
