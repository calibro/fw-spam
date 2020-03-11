<template>
  <g id="main-chart" ref='mainChart' :transform="'translate('+ x + ',' + y + ')'" :height="height" :width="width">
  </g>
</template>

<script>
import * as d3 from 'd3'
import {group} from "d3-array";

export default {
  name: 'CirclePackChart',
  props: ['x', 'y', 'height', 'width'],
  data () {
    return {
      chartData: {},
      nodeInfo: ''
    }
  },
  mounted () {
    this.init()
    this.color = d3.scaleSequential([5, 0], d3.interpolateMagma)
  },
  methods: {
    async init () {
      let csvData = await d3.csv('./data/test-data.csv')
      // let ] = d3.]().domain(d3.extent(csvData, d => d.lastmonth)).range([10, 500]);

      csvData.forEach(el => {
        el.value = (Math.pow(10,el.lastmonth) / Math.pow(10,10)) * Math.pow(10,8)
      })
      let categories = Array.from(group(csvData, d => d.category), ([key, value]) => ({name: key, children: value}))
      categories.forEach(c => {
        c.children = Array.from(group(c.children , d => d.second_level_domain), ([key, value]) => ({name: key, children: value}))
      })

      this.chartData = {
        name: 'chart',
        children: categories
      }
    },
    draw () {
      let self = this
      let vHeight = this.height //1000 //this.$el.clientHeight
      let vWidth = this.width //this.$el.clientWidth
      let rad = Math.min(vWidth,vHeight)
      var svg = d3.select(this.$refs.mainChart).attr('width', vWidth).attr('height', vHeight)
      // Declare d3 layout

      d3.select(this.$refs.mainChart).selectAll('*').remove()

      const root = d3.pack()
        .size([rad - 10, rad - 10])
        .padding(5)
          (d3.hierarchy(this.chartData)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
        )

      const node = svg.selectAll("g")
        .data(d3.nest().key(d => d.height).entries(root.descendants()))
        .join("g")
        .selectAll("g")
        .data(d => d.values)
        .join("g")
          .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

      node.append("circle")
          .attr("r", d => d.r)
          .attr("fill", d => this.color(d.height))
          .on("mouseover", function(d, i) {
            let el = d3.select(this).attr("fill", '#00f')
            self.nodeInfo = d.data.name || d.data.hostname
          })
          .on("mouseout", function(d, i) {
            let el = d3.select(this).attr("fill", self.color(d.height))
            self.nodeInfo = ''
          })
    }
  },
  watch: {
    chartData () {
      this.draw()
    },
    height () {
      this.draw()
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
