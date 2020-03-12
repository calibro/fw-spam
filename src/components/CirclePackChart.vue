<template>
  <g
    id="main-chart"
    ref="mainChart"
    :transform="'translate(' + x + ',' + y + ')'"
    :height="height"
    :width="width"
  >
  </g>
</template>

<script>
import * as d3 from "d3";
import { groups } from "d3-array";

export default {
  name: "CirclePackChart",
  props: ["x", "y", "height", "width"],
  data() {
    return {
      chartData: {},
      nodeInfo: ""
    };
  },
  mounted() {
    this.colorScale = d3
      .scaleOrdinal()
      .domain(["Poor", "Neutral", "Good"])
      .range(["#D4003D", "#EAEA6A", "#00E4A2"]);

    this.init();
  },
  methods: {
    async init() {
      const csvData = await d3.csv("/data/data.csv");

      csvData.forEach(el => {
        el.value =
          (Math.pow(10, el.lastmonth) / Math.pow(10, 10)) * Math.pow(10, 8);
      });

      const heirarchy = groups(
        csvData,
        d => d.category,
        d => d.second_level_domain
      );

      this.chartData = heirarchy;
    },
    draw() {
      let self = this;
      let vHeight = this.height; //1000 //this.$el.clientHeight
      let vWidth = this.width; //this.$el.clientWidth
      let rad = Math.min(vWidth, vHeight);
      var svg = d3
        .select(this.$refs.mainChart)
        .attr("width", vWidth)
        .attr("height", vHeight);

      d3.select(this.$refs.mainChart)
        .selectAll("*")
        .remove();

      const circle = d3
        .arc()
        .innerRadius(0)
        .outerRadius(d => d)
        .startAngle(-Math.PI)
        .endAngle(Math.PI);

      const root = d3
        .pack()
        .size([vWidth, vHeight])
        .padding(10)(
        d3
          .hierarchy([null, this.chartData], d =>
            Array.isArray(d) ? d[1] : undefined
          )
          .sum(d => {
            return d.value;
          })
          .sort((a, b) => b.value - a.value)
      );

      const textScale = d3
        .scaleLinear()
        .range([6, 14])
        .domain(
          d3.extent(
            root.descendants().filter(d => d.children && d.children.length > 1),
            d => d.r
          )
        );

      const node = svg
        .selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

      node
        .append("path")
        .attr("id", (d, i) => {
          d.id = "p_" + i;
          return "p_" + i;
        })
        .attr("d", d => circle(d.r));

      const hidden = node.filter(d => d.children && d.children.length == 1);

      hidden
        .select("path")
        .attr("stroke", "none")
        .attr("fill", "none");

      const leaves = node.filter(d => !d.children);

      leaves
        .select("path")
        .attr("stroke", "none")
        .attr("fill", d => this.colorScale(d.data.email_score_name));

      const internal = node.filter(d => d.children && d.children.length > 1);

      internal
        .select("path")
        .attr("stroke", "#ddd")
        .attr("fill", "none");

      internal
        .append("text")
        .attr("dy", "-0.3em")
        .attr("fill", "black")
        .attr("font-size", d => textScale(d.r) + "px")
        .attr("text-anchor", "middle")
        .attr("font-family", "'Arial', sans-serif")
        .append("textPath")
        .attr("xlink:href", d => "#" + d.id)
        .attr("startOffset", "50%")
        .text(d => {
          return d.data[0];
        });

      // .on("mouseover", function(d, i) {
      //   let el = d3.select(this).attr("fill", '#00f')
      //   self.nodeInfo = d.data.name || d.data.hostname
      // })
      // .on("mouseout", function(d, i) {
      //   let el = d3.select(this).attr("fill", self.color(d.height))
      //   self.nodeInfo = ''
      // })
    }
  },
  watch: {
    chartData() {
      this.draw();
    },
    height() {
      this.draw();
    }
  }
};
</script>

<style scoped lang="stylus"></style>
