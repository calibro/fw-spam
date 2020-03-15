import * as d3 from "d3";

const initialFilters = {
  reputation: ['poor', 'neutral', 'good']
}

export default {
  namespaced: true,
  state: {
    loaded: false,
    csvData: [],
    filters: Object.assign({}, initialFilters),
    filterOptions: {
      reputation :[
        { text: 'Poor', value: 'poor' },
        { text: 'Neutral', value: 'neutral' },
        { text: 'Good', value: 'good' },
      ]
    }
  },
  getters: {
    filteredData: state => {
      return state.csvData.filter(el => {
        return state.filters.reputation.includes(el.email_score_name.toLowerCase())
      })
    }
  },
  mutations: {
    setData (state, val) {
      state.csvData = val
      state.loaded = true
    },
    setReputation (state, val) {
      state.filters.reputation = val
    },
    resetFilters (state) {
      state.filters = Object.assign({}, initialFilters)
    }
  },
  actions: {
    async loadData({state, commit}) {
      state.loaded = false
      const csvData = await d3.csv("/data/data.csv");
      commit('setData', csvData)
    }
  }
}
