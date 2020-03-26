import * as d3 from "d3";
import { groups } from "d3-array";
import Vue from "vue";

const initialFilters = {
  reputation: ["poor", "neutral", "good"],
  blacklists: [],
  lastdayRange: [0, 10],
  lastmonthRange: [0, 10],
  excludeNodes: []
};

const makeHierarchy = data => {
  let hier = Array.from(
    groups(
      data,
      d => d.category,
      d => (d.second_level_domain ? d.second_level_domain : d.ip)
    ),
    ([name, children]) => ({
      level: "category",
      name,
      children: Array.from(children, ([name, children]) => ({
        level: "second_level_domain",
        name,
        children: children.map(e => ({
          ...e,
          level: "hostname",
          name: e.hostname ? e.hostname: e.ip,
          nodeId: e.hostname + e.ip
        }))
      }))
    })
  );
  if (hier.length == 1 && !hier[0].name) {
    hier = hier[0].children;
  }
  console.log(hier);
  return hier;
};

let passFilterHierarchy = (state, el) => {
  return !state.filters.excludeNodes.includes(el.hostname + el.ip);
};
export default {
  namespaced: true,
  state: {
    loaded: false,
    fetchingData: false,
    csvData: [],
    hierarchy: [],
    selectedDataSource: {
      localFile: null,
      remoteFileUrl: null
    },
    filters: Object.assign({}, initialFilters),
    filterOptions: {
      reputation: [
        { text: "Poor", value: "poor" },
        { text: "Neutral", value: "neutral" },
        { text: "Good", value: "good" }
      ],
      blacklists: [],
      lastdayRange: [],
      lastmonthRange: []
    }
  },
  getters: {
    filteredHierarchy: state => {
      let h = makeHierarchy(
        state.csvData.filter(el => {
          return (
            state.filters.reputation.includes(
              el.email_score_name.toLowerCase()
            ) &&
            state.filters.blacklists.includes(el.blacklists_count) &&
            (!state.filters.lastdayRange ||
              (parseFloat(el.lastday) >=
                parseFloat(state.filters.lastdayRange[0]) &&
                parseFloat(el.lastday) <=
                  parseFloat(state.filters.lastdayRange[1]))) &&
            (!state.filters.lastmonthRange ||
              (parseFloat(el.lastmonth) >=
                parseFloat(state.filters.lastmonthRange[0]) &&
                parseFloat(el.lastmonth) <=
                  parseFloat(state.filters.lastmonthRange[1]))) &&
            (state.filters.excludeNodes.length == 0 ||
              passFilterHierarchy(state, el))
          );
        })
      );
      return h;
    },
    isNodeInHierarchy: state => node => {
      return (
        state.filters.excludeNodes.length == 0 || passFilterHierarchy(state, node)
      );
    },
    isNodeChecked: state => node => {
      let isChecked = false
      if (node.children){
        let h = d3.hierarchy(node, d=> d.children)
        let leaves = h.leaves()
        let checkedChildren = leaves.filter(n => passFilterHierarchy(state, n.data))
        isChecked = checkedChildren.length > 0
      } else {
        isChecked = passFilterHierarchy(state, node)
      }
      return isChecked
    },
    isNodeIndeterminate: state => node => {
      let isIndetermine = false
      if (node.children){
        let h = d3.hierarchy(node, d=> d.children)
        let leaves = h.leaves()
        let checkedChildren = leaves.filter(n => passFilterHierarchy(state, n.data))
        isIndetermine = checkedChildren.length > 0 && (leaves.length > checkedChildren.length)
      }
      return isIndetermine
    }
  },
  mutations: {
    setData(state, data) {
      state.loaded = true;
      state.fetchingData = false;
      state.csvData = data;

      state.hierarchy = makeHierarchy(data);

      let blVals = [...new Set(data.map(x => x.blacklists_count))].sort(
        (a, b) => a - b
      );
      state.filterOptions.blacklists = blVals.map(el => {
        return {
          text: el,
          value: el
        };
      });

      let lastdayVals = data.map(x => parseFloat(x.lastday));
      state.filterOptions.lastdayRange = [
        Math.min(...lastdayVals),
        Math.max(...lastdayVals) + 0.01
      ];

      let lastmonthVals = data.map(x => parseFloat(x.lastmonth));
      state.filterOptions.lastmonthRange = [
        Math.min(...lastmonthVals),
        Math.max(...lastmonthVals) + 0.01
      ];

      state.filters.blacklists = state.filterOptions.blacklists.map(
        e => e.value
      );
      state.filters.lastdayRange = state.filterOptions.lastdayRange;
      state.filters.lastmonthRange = state.filterOptions.lastmonthRange;
    },
    setReputation(state, val) {
      state.filters.reputation = val;
    },
    setBlacklists(state, val) {
      state.filters.blacklists = val;
    },
    setLastdayRange(state, val) {
      state.filters.lastdayRange = val;
    },
    setLastmonthRange(state, val) {
      state.filters.lastmonthRange = val;
    },
    setExcludeNodes(state, val) {
      Vue.set(state.filters, "excludeNodes", val);
    },
    toggleExcludeNode(state, val) {
      let exHierarchy = state.filters.excludeNodes;
      let findIndex = exHierarchy.findIndex(
        e => e.level == val.level && e.name == val.name
      );
      if (findIndex >= 0 || val.forceCheck) {
        exHierarchy.splice(findIndex, 1);
      } else {
        exHierarchy.push(val);
      }
      Vue.set(state.filters, "excludeNodes", exHierarchy);
    },
    resetFilters(state) {
      let resetFilters = Object.assign({}, initialFilters);
      resetFilters.blacklists = state.filterOptions.blacklists.map(
        e => e.value
      );
      resetFilters.lastdayRange = state.filterOptions.lastdayRange;
      resetFilters.lastmonthRange = state.filterOptions.lastmonthRange;
      resetFilters.excludeNodes = [];
      state.filters = Object.assign({}, resetFilters);
    }
  },
  actions: {
    async loadTestData({ state, commit }) {
      state.loaded = false;
      state.fetchingData = true;

      const csvData = await d3.csv("./data/data.csv", d3.autoType);
      commit("setData", csvData);
      commit("resetFilters");
    },
    loadDataFromFile({ state, commit }, file) {
      if (file) {
        state.loaded = false;
        state.fetchingData = true;
        state.selectedDataSource = {
          localFile: file,
          remoteFileUrl: null
        };
        var reader = new FileReader();
        reader.onloadend = async function(evt) {
          var dataUrl = evt.target.result;
          // The following call results in an "Access denied" error in IE.
          let csvData = await d3.csv(dataUrl, d3.autoType);
          commit("setData", csvData);
          commit("resetFilters");
        };
        reader.readAsDataURL(file);
      }
    },
    async loadData({ state, commit }, filename) {
      state.loaded = false;
      state.fetchingData = true;
      state.selectedDataSource = {
        localFile: null,
        remoteFileUrl: filename
      };
      let csvData = await d3.csv(
        process.env.VUE_APP_SCRAPER_URL + "data/" + filename,
        d3.autoType
      );
      commit("setData", csvData);
      commit("resetFilters");
    }
  }
};
