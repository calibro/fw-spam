<template>
  <div class="hierarchy-filter">
    <div class="hierarchy-filter-controls">
      <b-form-input v-model="searchTerm" placeholder="Seach" class="search-input"></b-form-input>
      <div class="select-deselect-all">
        <span @click="selectAll" class="select-all">Select all</span> / <span @click="deselectAll" class="select-all">Deselect all</span>
      </div>
    </div>
    <hierarchy-tree-item v-for="(child, index) in filteredHierarchy" :item="child" :level="0" :excludeNodes="excludeNodes" :onChange="changedNode" :key="child.name" :isFiltered="searchTerm != ''"></hierarchy-tree-item>
  </div>
</template>

<script>
import * as d3 from "d3";
import _ from 'underscore'
import { groups } from "d3-array";
import HierarchyTreeItem from './HierarchyTreeItem';

export default {
  name: 'HierarchyFilter',
  components: {
    HierarchyTreeItem
  },
  props: ['excludeNodes', 'onChange'],
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
          el.filteredChildren = el.children.filter(recursiveFilter)
          hasMatchingChildren = el.filteredChildren.length > 0
        }
        return (el.name && el.name.includes(self.searchTerm)) || hasMatchingChildren
      }
      return this.searchTerm ? data.filter(recursiveFilter) : data
      return data

    },
    hierarchy () {
      return this.$store.state.data.hierarchy
    }
  },
  methods: {
    changedNode (clickedNode, checked) {
      /*// Check parent in hierarchy and remove the category filter if active
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
      }*/

      let excludedNodes = this.excludeNodes
      let children = clickedNode.filteredChildren || clickedNode.children
      // check/uncheck Leaves
      if(!children){
        if (checked) {
          excludedNodes = _.without(excludedNodes, clickedNode.item.nodeId)
        } else{
          excludedNodes.push(clickedNode.item.nodeId)
        }
      } 
      // check/uncheck branches
      else {
        let h = d3.hierarchy(clickedNode, d => d.filteredChildren || d.children)
        let nodes = h.leaves()
        if (checked) {
          excludedNodes = _.difference(excludedNodes, nodes.map(e => e.data.nodeId))

        } else {
          excludedNodes = _.union(excludedNodes, nodes.map(e => e.data.nodeId))
        }
        /*nodes.forEach(node => {
          const ind = excludedNodes.findIndex(el => el.name == node.data.name && el.ip == node.data.ip)
          if (checked) {
            excludedNodes.splice(ind, 1)
          } else{
            ind < 0 && excludedNodes.push(node.data)
          }
        });*/
      }
      this.$store.commit('data/setExcludeNodes', excludedNodes)
    },
    selectAll () {
      this.changedNode({children: this.filteredHierarchy}, true)
    },
    deselectAll () {
      this.changedNode({children: this.filteredHierarchy}, false)
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