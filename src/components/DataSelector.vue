<template>
  <div class="data-selector">
      <fw-button class="upload-button" @click="uploadFile">Upload data</fw-button>
      <span class="separator">or</span>
      <b-form-select v-model="selectedRemote" :options="remoteFileList"
      value-field="filename"
      text-field="filename"
      @change="selectRemoteFile"
      >
        <template v-slot:first>
          <b-form-select-option :value="null" disabled>-- Please select an option --</b-form-select-option>
        </template>
      </b-form-select>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataSelector',
  data() {
    return {
      selectedRemote: null,
    }
  },
  mounted () {
    this.$store.dispatch('loadRemoteFileList')
  },
  computed: {
    ...mapState(['remoteFileList'])
  },
  methods: {
    uploadFile () {
      this.selectedRemote = null
    },
    selectRemoteFile (el) {
      this.$store.dispatch('data/loadData', el)
    }
  }
}
</script>

<style lang="stylus" scoped>
.data-selector
  display flex
  align-items: flex-end
  .separator
    margin 8px
  .upload-button
    max-height 35px
    min-width 120px
</style>