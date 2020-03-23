<template>
  <div class="hierarchy-filter">
    <div class="hierarchy-filter-controls">
      <b-form-input v-model="searchTerm" placeholder="Seach" class="search-input"></b-form-input>
      <div class="select-deselect-all">
        <span @click="selectAll" class="select-all">Select all</span> / <span @click="deselectAll" class="select-all">Deselect all</span>
      </div>
    </div>
    <hierarchy-tree-item v-for="(child, index) in filteredHierarchy" :item="child" :level="0" :excludeHierarchy="excludeHierarchy" :onChange="changedNode" :key="child.name +'-'+ index"></hierarchy-tree-item>
  </div>
</template>

<script>
import * as d3 from "d3";
import { groups } from "d3-array";
import HierarchyTreeItem from './HierarchyTreeItem';

export default {
  name: 'HierarchyFilter',
  components: {
    HierarchyTreeItem
  },
  props: ['excludeHierarchy', 'onChange'],
  data () {
    return {
      searchTerm: ''
    }
  },
  computed: {
    filteredHierarchy () {
      let self = this
      let data = JSON.parse(JSON.stringify(this.hierarchy))
      let recursiveFilter = (el) => {
        let hasMatchingChildren = false
        if (el.children) {
          el.children = el.children.filter(recursiveFilter)
          hasMatchingChildren = el.children.length > 0
        }
        return (el.name && el.name.includes(self.searchTerm)) || hasMatchingChildren
      }
      return this.searchTerm ? data.filter(recursiveFilter) : data

    },
    hierarchy () {
      return this.$store.state.data.hierarchy
    }
  },
  methods: {
    changedNode (node, checked) {
      // Check parent in hierarchy and remove the category filter if active
      if(checked && node.level > 0 && !node.$parent.isChecked) {
        let nodeList = this.excludeHierarchy

        nodeList.splice(nodeList.findIndex(el => el.name == node.item.name),1)
        nodeList.splice(nodeList.findIndex(el => el.name == node.$parent.item.name),1)
        node.$parent.item.children && node.$parent.item.children.forEach(sibling => {
          if (sibling.name != node.item.name) {
            nodeList.push(sibling)
          }
        });
        this.$store.commit('data/setExcludeHierarchy', nodeList)
      } else {
        this.$store.commit('data/toggleExcludeHierarchy',node.item)
      }
    },
    selectAll () {
      this.$store.commit('data/setExcludeHierarchy', [])
    },
    deselectAll () {
      this.$store.commit('data/setExcludeHierarchy', Array.from(this.hierarchy))
    }
  }
}
</script>

<style lang="stylus" scoped>
.hierarchy-filter
  max-height 30vh
  overflow scroll
  .hierarchy-filter-controls
    margin 5px 5px 10px 5px
    .select-deselect-all
      span
        cursor pointer
        text-decoration underline
</style>