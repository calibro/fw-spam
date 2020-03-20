<template>
  <div class="hierarchy-filter">
    <hierarchy-tree-item v-for="child in hierarchy" :item="child" :level="0" :excludeHierarchy="excludeHierarchy" :onChange="onChange"></hierarchy-tree-item>
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
  }
}
</script>

<style lang="stylus" scoped>
.hierarchy-filter
  max-height 30vh
  overflow scroll
</style>