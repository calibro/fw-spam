import * as d3 from "d3";

const initialFilters = {
  reputation: ['poor', 'neutral', 'good'],
  blacklists: [],
  lastdayRange: [0,10],
  lastmonthRange: [0,10]
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
      ],
      blacklists: [],
      lastdayRange: [],
      lastmonthRange: []
    }
  },
  getters: {
    filteredData: state => {
      return state.csvData.filter(el => {
        return (
          state.filters.reputation.includes(el.email_score_name.toLowerCase()) &&
          state.filters.blacklists.includes(el.blacklists_count) &&
          (!state.filters.lastdayRange || (parseFloat(el.lastday) > parseFloat(state.filters.lastdayRange[0]) && parseFloat(el.lastday) < parseFloat(state.filters.lastdayRange[1]))) &&
          (!state.filters.lastmonthRange || (parseFloat(el.lastmonth) > parseFloat(state.filters.lastmonthRange[0]) && parseFloat(el.lastmonth) < parseFloat(state.filters.lastmonthRange[1])))

        )
      })
    }
  },
  mutations: {
    setData (state, data) {
      state.csvData = data
      state.loaded = true

      let blVals = [...new Set(data.map(x => x.blacklists_count))].sort((a,b) => a - b)
      state.filterOptions.blacklists = blVals.map(el => {
        return {
          text: el,
          value: el
        }
      })

      let lastdayVals = data.map(x => parseFloat(x.lastday))
      state.filterOptions.lastdayRange = [Math.min(...lastdayVals), Math.max(...lastdayVals) + 0.01]

      let lastmonthVals = data.map(x => parseFloat(x.lastmonth))
      state.filterOptions.lastmonthRange = [Math.min(...lastmonthVals), Math.max(...lastmonthVals) + 0.01]

      state.filters.blacklists = state.filterOptions.blacklists.map(e => e.value)
      state.filters.lastdayRange = state.filterOptions.lastdayRange
      state.filters.lastmonthRange = state.filterOptions.lastmonthRange
    },
    setReputation (state, val) {
      state.filters.reputation = val
    },
    setBlacklists (state, val) {
      state.filters.blacklists = val
    },
    setLastdayRange (state, val) {
      state.filters.lastdayRange = val
    },
    setLastmonthRange (state, val) {
      state.filters.lastmonthRange = val
    },
    resetFilters (state) {
      let resetFilters = Object.assign({}, initialFilters)
      resetFilters.blacklists = state.filterOptions.blacklists.map(e => e.value)
      resetFilters.lastdayRange = state.filterOptions.lastdayRange
      resetFilters.lastmonthRange = state.filterOptions.lastmonthRange
      state.filters = Object.assign({}, resetFilters)

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
