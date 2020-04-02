import Vue from "vue";
import Vuex from "vuex";
import data from "./modules/data";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    data
  },
  state: {
    areaBy: "lastmonth",
    colorBy: "email_score_name",
    useOriginalValues: false,
    sildeTitle: "",
    slideSource: "",
    slideSize: "1920:1080",
    remoteFileList: []
  },
  getters: {
    slideSizeArray: state => {
      return state.slideSize.split(":");
    }
  },
  mutations: {
    setAreaBy(state, val) {
      state.areaBy = val;
    },
    setColorBy(state, val) {
      state.colorBy = val;
    },
    setSildeTitle(state, val) {
      state.sildeTitle = val;
    },
    setSlideSource(state, val) {
      state.slideSource = val;
    },
    setSlideSourceFromData(state, val) {
      state.slideSource = 'talosintelligence.com - ' + val.substring(0, val.lastIndexOf('.'))
    },
    setSlideSize(state, val) {
      state.slideSize = val;
    },
    setRemoteFileList(state, val) {
      state.remoteFileList = val;
    },
    setUseOriginalValues(state, val) {
      state.useOriginalValues = val
    }
  },
  actions: {
    loadRemoteFileList({ state, commit }) {
      axios.get(process.env.VUE_APP_SCRAPER_URL + "api/data").then(resp => {
        commit("setRemoteFileList", resp.data.list);
      });
    }
  }
});
