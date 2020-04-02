<template>
  <div class="tree-item" v-if="item" v-bind:class="{ leaf: !isNotLeaf }">
    <div class="item-line">
      <span
        @click="toggleTree"
        v-if="isNotLeaf"
        class="caret"
        v-bind:class="{ open: openTree }"
        ><b-icon-chevron-down
      /></span>
      <input
        type="checkbox"
        :checked="isChecked"
        :name="label"
        class="item-checkbox"
        @click="toggleCheckbox"
        v-indeterminate="isIndeterminate"
        :disabled="isDisabled"
      />
      <div class="item-line-label">
        {{ label }}
      </div>
    </div>
    <transition name="fade">
      <div class="children-container" v-show="openTree">
        <hierarchy-tree-item
          ref="childrenList"
          v-for="(child, index) in children"
          :item="child"
          :level="level + 1"
          :excludeNodes="excludeNodes"
          :onChange="onChange"
          :key="child.name + child.ip"
          :isFiltered="isFiltered"
        ></hierarchy-tree-item>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Vue from "vue";

export default {
  name: "HierarchyTreeItem",
  props: ["item", "level", "excludeNodes", "isFiltered", "onChange"],
  data() {
    return {
      openTree: this.isFiltered
    };
  },
  computed: {
    isNotLeaf() {
      return this.item.level != "hostname";
    },
    label() {
      return this.item.name;
    },
    children() {
      let c = this.item.filteredChildren || this.item.children;
      return c ? c.sort((a, b) => (a.name > b.name ? 1 : -1)) : c;
    },
    isChecked() {
      return this.$store.getters["data/isNodeChecked"](this.item);
    },
    isIndeterminate() {
      return this.$store.getters["data/isNodeIndeterminate"](this.item);
    },
    isDisabled() {
      return (
        this.isNotLeaf &&
        this.isFiltered &&
        this.item.filteredChildren.length == 0
      );
    }
  },
  methods: {
    toggleTree() {
      if (!this.isDisabled) {
        this.openTree = !this.openTree;
      }
    },
    toggleCheckbox(evt) {
      let val = evt.target.checked;
      this.onChange(this, val);
    }
  },
  watch: {
    isFiltered(newVal, oldVal) {
      // Force open tree when start searching nodes
      if (!oldVal && newVal) {
        this.openTree = true;
      }
    }
  },
  directives: {
    indeterminate: function(el, binding) {
      el.indeterminate = Boolean(binding.value);
    }
  }
};
</script>

<style lang="stylus" scoped>
.tree-item
  .item-line
    display flex
    margin 0 5px
    align-items: center
    .item-line-label
      word-break: break-all
      line-height: 1
      margin: 5px 0px
    .item-checkbox
      margin-right 5px
  .children-container
    margin-left 15px
    overflow hidden
  .caret
    transition transform 0.2s
    margin-right 5px
    &.open
      transform rotate(-180deg)
  &.leaf
    margin-left 30px

.fade-enter-active, .fade-leave-active
  transition: all .3s

.fade-enter, .fade-leave-to
  opacity: 0
  transform: translateX(-10px);
</style>
