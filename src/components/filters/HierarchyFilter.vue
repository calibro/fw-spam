<template>
  <div class="hierarchy-filter">
    <hierarchy-tree-item v-for="(child, index) in hierarchy" :item="child" :level="0" :excludeHierarchy="excludeHierarchy" :onChange="changedNode" :key="child.name +'-'+ index"></hierarchy-tree-item>
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
  computed: {
    hierarchy () {
      return this.$store.state.data.hierarchy
    }
  },
  methods: {
    changedNode (node, checked) {
      debugger
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
    }
  }
}
</script>

<style lang="stylus" scoped>
.hierarchy-filter
  max-height 30vh
  overflow scroll
</style>