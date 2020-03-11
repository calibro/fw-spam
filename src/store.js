import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    areaBy: 'lastmonth',
    colorBy: 'email_score_name',
    sildeTitle: '',
    slideSource: '',
    slideSize: '1920:1080'
  },
  getters: {
    slideSizeArray: state => {
      return state.slideSize.split(':')
    }
  },
  mutations: {
    setAreaBy (state, val) {
      state.areaBy = val
    },
    setColorBy (state, val) {
      state.colorBy = val
    },
    setSildeTitle (state, val) {
      state.sildeTitle = val
    },
    setSlideSource (state, val) {
      state.slideSource = val
    },
    setSlideSize (state, val) {
      state.slideSize = val
    }
  },
  actions: {

  }
})
