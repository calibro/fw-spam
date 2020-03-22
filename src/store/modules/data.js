import * as d3 from "d3";
import { groups } from "d3-array";

const initialFilters = {
  reputation: ['poor', 'neutral', 'good'],
  blacklists: [],
  lastdayRange: [0,10],
  lastmonthRange: [0,10],
  excludeHierarchy: []
}

const hierarchyLevels = ['category', 'second_level_domain', 'hostname']

const makeHierarchy = (data) => {
  return Array.from(groups(
    data,
    d => d.category,
    d => d.second_level_domain
  ), ([name, children]) => ({
    level: 'category',
    name,
    checked: true,
    children: Array.from(children, ([name, children]) => ({
      level: 'second_level_domain',
      name,
      checked: true,
      children: children.map(e => ({
        ...e,
        level: 'second_level_domain',
        name: e.hostname,
        checked: true
      }))
    }))
  }))
}

export default {
  namespaced: true,
  state: {
    loaded: false,
    csvData: [],
    hierarchy: [],
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
    filteredHierarchy: state => {
      let passFilterHierarchy = (el) => {
        let r = state.filters.excludeHierarchy.reduce((acc, excluedEl) => {
          return acc && el[hierarchyLevels[excluedEl.level]] != excluedEl.name
        }, true)
        return r
      }

      let h = makeHierarchy(state.csvData.filter(el => {
        return (
          state.filters.reputation.includes(el.email_score_name.toLowerCase()) &&
          state.filters.blacklists.includes(el.blacklists_count) &&
          (!state.filters.lastdayRange || (parseFloat(el.lastday) > parseFloat(state.filters.lastdayRange[0]) && parseFloat(el.lastday) < parseFloat(state.filters.lastdayRange[1]))) &&
          (!state.filters.lastmonthRange || (parseFloat(el.lastmonth) > parseFloat(state.filters.lastmonthRange[0]) && parseFloat(el.lastmonth) < parseFloat(state.filters.lastmonthRange[1]))) &&
          (state.filters.excludeHierarchy.length == 0 || passFilterHierarchy(el))
        )
      }))
      return h
    }
  },
  mutations: {
    setData (state, data) {
      state.csvData = data
      state.loaded = true


      state.hierarchy = makeHierarchy(data)


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
    uncheckHierarchyElement (state, val) {
      let findIndex = state.filters.excludeHierarchy.findIndex(e => e.level == val.level && e.name == val.name)
      if (findIndex == -1) {
        state.filters.excludeHierarchy.push(val)
      }
    },
    checkHierarchyElement(state, val) {
      let findIndex = state.filters.excludeHierarchy.findIndex(e => e.level == val.level && e.name == val.name)
      if (findIndex >= 0) {
        state.filters.excludeHierarchy.splice(findIndex)
      }
    },
    resetFilters (state) {
      let resetFilters = Object.assign({}, initialFilters)
      resetFilters.blacklists = state.filterOptions.blacklists.map(e => e.value)
      resetFilters.lastdayRange = state.filterOptions.lastdayRange
      resetFilters.lastmonthRange = state.filterOptions.lastmonthRange
      resetFilters.excludeHierarchy = []
      state.filters = Object.assign({}, resetFilters)
    }
  },
  actions: {
    async loadTestData({state, commit}) {
      state.loaded = false
      const csvData = await d3.csv("/data/data.csv", d3.autoType);
      commit('setData', csvData)
    },
    async loadData({state, commit}, filename) {
      state.loaded = false
      let csvData = await d3.csv(process.env.VUE_APP_SCRAPER_URL + "data/" + filename, d3.autoType);
      commit('setData', csvData)
    }
  }
}
