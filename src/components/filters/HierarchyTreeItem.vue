<template>
  <div class="tree-item" v-if="item" v-bind:class="{leaf: !isNotLeaf}">
    <div class="item-line">
      <span @click="toggleTree" v-if="isNotLeaf" class="caret" v-bind:class="{open: openTree}"><b-icon-chevron-up /></span>
      <input type="checkbox"
        :checked="isChecked"
        :name="label"
        class="item-checkbox"
        @change="toggleCheckbox"
        />
      {{label}}
    </div>
    <transition name="fade">
      <div class="children-container" v-show="openTree">
        <hierarchy-tree-item v-for="child in children" :item="child" :level="level+1" :excludeHierarchy="excludeHierarchy" :onChange="onChange"></hierarchy-tree-item>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HierarchyTreeItem',
  props: ['item', 'level', 'excludeHierarchy', 'onChange'],
  data () {
    return {
      checked: this.item.checked,
      openTree: false
    }
  },
  computed: {
    isNotLeaf () {
      return this.item.children
    },
    label () {
      return this.item.name ///this.isNotLeaf ? this.item[0] :  this.item.hostname
    },
    children () {
      return this.item.children //this.isNotLeaf ?  this.item[1] : []
    },
    isChecked () {
      return this.$store.state.data.filters.excludeHierarchy.findIndex(e => e.level == this.level && e.name == this.name) == -1
    }
  },
  methods: {
    toggleTree () {
      this.openTree = !this.openTree
    },
    toggleCheckbox (evt) {
      let val = evt.target.checked

      let recursiveToggle = (el, val) => {
        el.checked = val
        el.children && el.children.forEach(c => recursiveToggle(c, val))
      }

      recursiveToggle(this.item, val)
      this.onChange({level: this.level, name: this.label})
    }
  }
}
</script>

<style lang="stylus" scoped>
.tree-item
  .item-line
    display flex
    margin 0 5px
    align-items: center
    .item-checkbox
      margin-right 5px
  .children-container
    margin-left 15px
    overflow hidden
  .caret
    transition transform 0.2s
    margin-right 5px
    &.open
      transform rotate(180deg)
  &.leaf
    margin-left 30px

.fade-enter-active, .fade-leave-active
  transition: all .3s

.fade-enter, .fade-leave-to
  opacity: 0
  transform: translateX(-10px);
</style>