<template>
  <div class="data-selector">
      <b-alert :show="dataError != ''" class="error-bar" variant="warning">
        {{dataError}}
      </b-alert>
      <div class="data-selector-line">
        <div class="upload-button-container">
        <div class="upload-file-name" v-if="selectedFile">
          {{selectedFile.name}}
        </div>
        <fw-button class="upload-button" @click="openSelectFile">
        Upload data
        <input type="file" ref="fileSelector" style="display: none" accept="text/csv" @change="onSelectFile">
      </fw-button>
      </div>
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
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  name: 'DataSelector',
  mounted () {
    this.$store.dispatch('loadRemoteFileList')
  },
  computed: {
    ...mapState({
      remoteFileList: state => state.remoteFileList,
      selectedFile: state => state.data.selectedDataSource.localFile,
      selectedRemote: state => state.data.selectedDataSource.remoteFileUrl,
      dataError: state => state.data.dataError
    })
  },
  methods: {
    openSelectFile () {
      this.$refs.fileSelector.click()
    },
    onSelectFile(evt) {
      let file = evt.target.files.length > 0 && evt.target.files[0]
      if (file) {
        this.$store.dispatch('data/loadDataFromFile', file)
      }
    },
    selectRemoteFile (el) {
      this.$store.dispatch('data/loadData', el)
    }
  }
}
</script>

<style lang="stylus" scoped>
.data-selector
  .error-bar
    width 100%
    margin 5px 0px
    padding 5px
    font-size 0.7em
  .data-selector-line
    display flex
    align-items: flex-end
  .separator
    margin 8px
  .upload-button
    max-height 35px
    min-width 180px
  .upload-file-name
    font-size 14px
    max-width 180px
    white-space: nowrap;
    margin-bottom 5px
    overflow hidden
    text-overflow: ellipsis
</style>