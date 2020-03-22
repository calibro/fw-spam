<template>
  <div class="tree-item" v-if="item" v-bind:class="{leaf: !isNotLeaf}">
    <div class="item-line">
      <span @click="toggleTree" v-if="isNotLeaf" class="caret" v-bind:class="{open: openTree}"><b-icon-chevron-up /></span>
      <input type="checkbox"
        :checked="isChecked"
        :name="label"
        class="item-checkbox"
        @change="toggleCheckbox"
        v-indeterminate="isIndeterminate"
        />
      {{label}}
    </div>
    <transition name="fade">
      <div class="children-container" v-show="openTree">
        <hierarchy-tree-item ref="childrenList" v-for="(child, index) in children" :item="child" :level="level+1" :excludeHierarchy="excludeHierarchy" :onChange="onChange" :key="child.name + '-'+ index"></hierarchy-tree-item>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Vue from 'vue'

export default {
  name: 'HierarchyTreeItem',
  props: ['item', 'level', 'excludeHierarchy', 'onChange'],
  data () {
    return {
      openTree: false,
      checkedChildren: this.item.children ? this.item.children.length : 0,
      indeterminateChildren: 0
    }
  },
  mounted () {
    this.item.children && this.countCheckedChildren()
  },
  computed: {
    isNotLeaf () {
      return this.item.children && this.item.children.length > 0
    },
    label () {
      return this.item.name ///this.isNotLeaf ? this.item[0] :  this.item.hostname
    },
    children () {
      return this.item.children //this.isNotLeaf ?  this.item[1] : []
    },
    isChecked () {
      return this.isNotLeaf ?
        this.checkedChildren > 0
        :
        this.$store.getters['data/isNodeInHierarchy'](this.item)
    },
    isIndeterminate () {
      return (this.isNotLeaf && this.checkedChildren > 0 && this.checkedChildren < this.children.length) ||
        (this.isNotLeaf && this.indeterminateChildren > 0 && this.indeterminateChildren == this.children.length)
    }
  },
  methods: {
    toggleTree () {
      this.openTree = !this.openTree
    },
    toggleCheckbox (evt) {
      let val = evt.target.checked

      /*let recursiveToggle = (el, val) => {
        el.checked = val
        el.children && el.children.forEach(c => recursiveToggle(c, val))
      }*/
      //recursiveToggle(this.item, val)
      this.onChange({level: this.level, name: this.label})
    },
    countCheckedChildren () {
      if (this.isNotLeaf) {
        this.checkedChildren= this.$refs.childrenList ? this.$refs.childrenList.filter(c => {
          c.countCheckedChildren()
          return c.isChecked
        }).length : this.children.length

        this.indeterminateChildren= this.$refs.childrenList ? this.$refs.childrenList.filter(c => {
          c.countCheckedChildren()
          return c.isIndeterminate
        }).length : 0
      }
    },
  },
  watch: {
    excludeHierarchy () {
      if(this.isNotLeaf) {
        Vue.nextTick(() => {
          this.isNotLeaf && this.countCheckedChildren()
        })
      }
    }
  },
  directives: {
    indeterminate: function(el, binding) {
      el.indeterminate = Boolean(binding.value)
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