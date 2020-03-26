<template>
  <div class="filter-sidebar" v-bind:class="{open: isOpen}" v-click-outside="hide">
    <div class="button-container">
      <b-button class="button-toggle-filter" pill @click="toggleSidebar">
        <b-icon-filter></b-icon-filter>
      </b-button>
    </div>
    <div class="filters-container">
      <div class="filter-header">
        <div class="filter-title">Filters</div>
        <div class="filter-reset" @click="() => this['data/resetFilters']()">RESET</div>
      </div>
      <div class="filter-list" role="tablist">
        <div class="filter-block">
          <div class="filter-according-toggle" v-b-toggle.accordion-1 role="tab">Hierachy<b-icon-chevron-up class="caret"></b-icon-chevron-up></div>
          <b-collapse id="accordion-1" visible accordion="filter-accordion" role="tabpanel">
            <div class="filter-body">
              <hierarchy-filter :excludeHierarchy="excludeHierarchy" :onChange="this['data/toggleExcludeHierarchy']"></hierarchy-filter>
            </div>
          </b-collapse>
        </div>
        <div class="filter-block">
          <div class="filter-according-toggle" v-b-toggle.accordion-2 role="tab">Reputation<b-icon-chevron-up class="caret"></b-icon-chevron-up></div>
          <b-collapse id="accordion-2" visible accordion="filter-accordion" role="tabpanel">
            <div class="filter-body">
              <checkbox-filter :options="reputationOptions" :value="reputationValue" :onChange="this['data/setReputation']"></checkbox-filter>
            </div>
          </b-collapse>
        </div>
        <div class="filter-block">
          <div class="filter-according-toggle" v-b-toggle.accordion-3 role="tab">Last day volume<b-icon-chevron-up class="caret"></b-icon-chevron-up></div>
          <b-collapse id="accordion-3" visible accordion="filter-accordion" role="tabpanel">
            <div class="filter-body">
                <range-filter :range="lastdayRangeOptions" :value="lastdayRangeValue" :onChange="this['data/setLastdayRange']"></range-filter>
            </div>
          </b-collapse>
        </div>
        <div class="filter-block">
          <div class="filter-according-toggle" v-b-toggle.accordion-4 role="tab">Last month volume<b-icon-chevron-up class="caret"></b-icon-chevron-up></div>
          <b-collapse id="accordion-4" visible accordion="filter-accordion" role="tabpanel">
            <div class="filter-body">
              <range-filter :range="lastmonthRangeOptions" :value="lastmonthRangeValue" :onChange="this['data/setLastmonthRange']"></range-filter>
            </div>
          </b-collapse>
        </div>
        <div class="filter-block">
          <div class="filter-according-toggle" v-b-toggle.accordion-5 role="tab">Blacklist<b-icon-chevron-up class="caret"></b-icon-chevron-up></div>
          <b-collapse id="accordion-5" visible accordion="filter-accordion" role="tabpanel">
            <div class="filter-body">
              <checkbox-filter :options="blacklistsOptions" :value="blacklistsValue" :onChange="this['data/setBlacklists']"></checkbox-filter>
            </div>
          </b-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import CheckboxFilter from './filters/CheckboxFilter'
import RangeFilter from './filters/RangeFilter'
import HierarchyFilter from './filters/HierarchyFilter'

import { mapState, mapMutations } from 'vuex'

export default {
  name: 'FilterSidebar',
  components: {
    RangeFilter,
    CheckboxFilter,
    HierarchyFilter
  },
  data () {
    return {
      isOpen: false
    }
  },
  computed: {
    ...mapState({
      reputationValue: state => state.data.filters.reputation,
      reputationOptions: state => state.data.filterOptions.reputation,
      blacklistsValue: state => state.data.filters.blacklists,
      blacklistsOptions: state => state.data.filterOptions.blacklists,
      lastdayRangeValue: state => state.data.filters.lastdayRange,
      lastdayRangeOptions: state => state.data.filterOptions.lastdayRange,
      lastmonthRangeValue: state => state.data.filters.lastmonthRange,
      lastmonthRangeOptions: state => state.data.filterOptions.lastmonthRange,
      excludeHierarchy: state => state.data.filters.excludeHierarchy,
    })
  },
  methods: {
    ...mapMutations([
      'data/setReputation',
      'data/setBlacklists',
      'data/setLastdayRange',
      'data/setLastmonthRange',
      'data/resetFilters',
      'data/toggleExcludeHierarchy'
    ]),
    toggleSidebar () {
      this.isOpen = !this.isOpen
    },
    hide() {
      this.isOpen = false
    }
  },
  directives: {
    ClickOutside
  }
}
</script>

<style lang="stylus" scoped>
.filter-sidebar
  height 100%
  max-width 400px
  position absolute
  right -350px
  transition all 0.3s
  display flex
  border-left 1px solid #ccc
  background #fff
  overflow scroll
  &.open
    right 0px
  .button-container
    flex 0 0 50px
    margin 7px
    .button-toggle-filter
      border-radius: 50% 50% !important;
      width: 34px;
      height: 34px;
      padding 0px
  .filters-container
    flex 1 0 auto
    margin-top 15px
    margin-right 30px
    .filter-header
      display flex
      flex-direction row
      border-bottom 1px solid #ccc
      padding-bottom 10px
      margin-bottom 10px
      .filter-title
        font-weight bold
      .filter-reset
        margin-left auto
        cursor pointer
        &:hover
          text-decoration underline
    .filter-block
      border-bottom 1px solid #ccc
      padding 10px 0px
      margin 10px 0px
      .filter-according-toggle
        display flex
        justify-content center
        .caret
          margin-left auto
          transition transform 0.3s
        &.collapsed
          .caret
            transform rotate(180deg)
      .filter-body
        margin-top 10px
        max-width: 305px
</style>