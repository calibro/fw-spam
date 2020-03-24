<template>
<svg :x="x"
  :y="y"
  :height="height"
  :width="width"
  ref="mainSVG">
    <svg
    id="main-chart"
    ref="mainChart"
    :height="height"
    :width="width"
    >
    </svg>
  <svg id="legend" ref="legend" :x="x" :y="height-400" height="300" :width="height"></svg>
</svg>
</template>

<script>
import * as d3 from "d3";
import { groups } from "d3-array";
import { mapState, mapGetters, mapMutations } from "vuex";
import tippy from "tippy.js";
import Vue from "vue";
import ChartTooltip from "./commons/ChartTooltip";

export default {
  name: "CirclePackChart",
  props: ["x", "y", "height", "width"],
  mounted() {
    this.$store.dispatch("data/loadTestData");
  },
  computed: {
    ...mapState({
      colorBy: state => state.colorBy,
      areaBy: state => state.areaBy,
      csvData: state => state.data.csvData
    }),
    ...mapGetters({
      filteredData: "data/filteredData",
      hierarchyData: "data/filteredHierarchy"
    })
  },
  methods: {
    init() {
      let csvData = this.csvData;

      const sizeScaleLastmonth = d3
        .scaleLinear()
        .domain(d3.extent(csvData, d => d.lastmonth))
        .range([1.0, 100.0]);

      const sizeScaleLastday = d3
        .scaleLinear()
        .domain(d3.extent(csvData, d => d.lastday))
        .range([1, 100.0]);

      let reputationScale = d3
        .scaleOrdinal()
        //.domain([...new Set(csvData.map(d => d.email_score_name))])
        .domain(["Poor", "Neutral", "Good"])
        .range(["#D4003D", "#EAEA6A", "#00E4A2"]);

      // TODO: Improve the color scale for blacklist
      let domainBlackList = d3.extent(csvData, d => +d.blacklists_count);

      // let blacklistScale = d3
      //   .scaleSequential(d3.interpolateYlOrRd)
      //   .domain(d3.extent(csvData, d => +d.blacklists_count));

      let blacklistScale = d3
        .scaleLinear()
        //.domain([0, 1, domainBlackList[1]])
        .domain([0, 1, 3])
        .range(["rgb(221,221,221)", "rgb(253, 137, 60)", "rgb(128, 0, 38)"]);

      this.colorScales = {
        email_score_name: reputationScale,
        blacklists_count: blacklistScale,
        lastday: sizeScaleLastday,
        lastmonth: sizeScaleLastmonth
      };
      this.initialized = true;
    },
    draw() {
      !this.initialized && this.init();

      let self = this;
      let vHeight = this.height;
      let vWidth = this.width;
      let rad = Math.min(vWidth, vHeight);
      let rooted = false; // show or hide broader circle

      var svg = d3
        .select(this.$refs.mainChart)
        .attr("width", vWidth)
        .attr("height", vHeight);

      /*d3.select(this.$refs.mainChart)
        .selectAll("*")
        .remove();*/

      if (this.hierarchyData.length == 0) {
        svg.selectAll("*").remove();
        d3.select(this.$refs.legend).selectAll('*').remove()
        svg
          .append("text")
          .attr("class", "no-data-text")
          .style("font-size", "20px")
          .text("No data in your selection");
      } else {
    
        svg.selectAll(".no-data-text").remove()
      
        const circle = d3
          .arc()
          .innerRadius(0)
          .outerRadius(d => d)
          .startAngle(-Math.PI)
          .endAngle(Math.PI);

        const getValue = el => {
          return (
            (Math.pow(10, el[self.areaBy]) / Math.pow(10, 10)) * Math.pow(10, 8)
          );
        };

        const root = d3
          .pack()
          .size([vWidth, vHeight])
          .padding(10)(
          d3
            .hierarchy({ children: this.hierarchyData }, d => d.children)
            .sum(d => {
              //return getValue(d);
              return self.colorScales[self.areaBy](d[self.areaBy]);
            })
            .sort((a, b) => {
              return b.value - a.value;
            })
        );

        const textScale = d3
          .scaleLinear()
          .range([6, 14])
          .domain(
            d3.extent(
              root
                .descendants()
                .slice(rooted ? 0 : 1)
                .filter(d => d.children && d.children.length > 1),
              d => d.r
            )
          );

        let node = svg
          .selectAll("g")
          .data(
            root
              .descendants()
              .slice(rooted ? 0 : 1)
              .reverse()
          , (d) =>d.data.level + d.data.name)

        let nodeEnter = node.enter()
          .append("g")
          .attr("class", 'node-g')

        nodeEnter
          .attr("opacity", 0)
          .attr("transform", d => `translate(${this.width/2},${this.height/2})`)
          .append("path")
          .attr("class", 'node-path')
          .attr("id", (d, i) => {
            d.id = "p_" + i;
            return "p_" + i;
          })

        node.exit().remove()

        node = node.merge(nodeEnter)
        node
          .transition()
          .attr("opacity", 1)
          .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
          .duration(500)
          /*.end()
          .then(self.scaleToFit)*/
        //self.scaleToFit()

        node.select(".node-path")
          .attr("d", d => circle(d.r))

        const hidden = node.filter(d => d.children && d.children.length == 1);


        hidden
          .select("path")
          .attr("stroke", "none")
          .attr("fill", "none");

        const leaves = node.filter(d => !d.children);

        leaves
          .select("path")
          .attr("stroke", "none")
          .attr("fill", d => this.colorScales[self.colorBy](d.data[self.colorBy]))
          .on("mouseover", function(d) {
            tippy(this, {
              content:
                "<div><strong>" +
                d.data.hostname +
                "</strong></div>" +
                "<div>Last day: " +
                parseFloat(d.data.lastday).toFixed(2) +
                "</div>" +
                "<div>Last month: " +
                parseFloat(d.data.lastmonth).toFixed(2) +
                "</div>" +
                "<div>Reputation: " +
                d.data.email_score_name +
                "</div>" +
                "<div>Blacklists: " +
                d.data.blacklists_count +
                "</div>",
              allowHTML: true
            });
            d3.select(this).attr("stroke", "#222");
          })
          .on("mouseout", function(d) {
            !d3.select(this).classed('has-label') && d3.select(this).attr("stroke", "none");
            //this._tippy && this._tippy.destroy()
          })
          .on("click", function(d) {
            let parent = d3.select(this.parentNode);
            if (parent.selectAll(".node-label").size() > 0) {
              d3.select(this).attr("stroke", "none").classed('has-label', false);
              parent.selectAll(".node-label").remove();
            } else {
              d3.select(this).attr("stroke", "#222").attr('class', 'has-label');
              parent
                .append("text")
                .attr("fill", "black")
                .attr("class", "node-label")
                .attr("font-size", "14px")//d => textScale(d.r) + "px")
                .attr("text-anchor", "middle")
                .attr("font-family", "'Arial', sans-serif")
                .text(d.data.hostname);
              parent.raise();
            }
          });

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
            return d.data.name;
          });

        //legends
        let maxminRadius = d3.extent(leaves.nodes(), d => d3.select(d).datum().r)
        let maxminValues = d3.extent(leaves.nodes(), d => d3.select(d).datum().data[self.areaBy])

        let legHeight = maxminRadius[1] * 2 + 100
        let legend = d3.select(this.$refs.legend)
          .attr("height", legHeight)
          .attr("y", vHeight - legHeight -10)
          .attr("stroke", "#ccc")
        legend.selectAll("*").remove()

        let legendSizes = legend.selectAll(".legend-size")
            .data(maxminRadius)

        let legendSizesEnter = legendSizes.enter()
        .append('g')
        .attr('class','legend-size')
        .attr("transform", (d,i) => `translate(${(i) * Math.max(120, maxminRadius[0] + maxminRadius[1] + 70) + d+1}, ${maxminRadius[1] + 5})`)

        legendSizesEnter
            .append("path")
            .attr("stroke", "#000")
            .attr("fill", "#ccc")
            .attr("d", d => circle(d))

        legendSizesEnter
          .append("text")
          .attr("text-anchor", "start")
          .attr("font-family", "'Arial', sans-serif")
          .attr('font-size', '28px')
          .attr('alignment-baseline', 'middle')
          .attr("transform", (d,i) => `translate(${d + 5}, 0)`)
          .text((d,i) => maxminValues[i].toFixed(2))

        let colorDomain = self.colorScales[self.colorBy].domain()
        let legendColors = legend.selectAll(".legend-color")
            .data(colorDomain)
            .enter()
            .append('g')
            .attr('class','legend-color')
            .attr("transform", (d,i) => `translate(${i * 160}, ${maxminRadius[1] * 2 + 100})`)

        legendColors
            .append('circle')
            .attr('r', 15)
            .attr('cx', 15)
            .attr('cy', -15)
            .attr('fill', d => self.colorScales[self.colorBy](d))
        
        legendColors
          .append('text')
          .attr('font-size', '28px')
          .attr("font-family", "'Arial', sans-serif")
          .attr("transform", (d,i) => `translate(35, -6)`)
          .text(d => d)
        

        // .on("mouseover", function(d, i) {
        //   let el = d3.select(this).attr("fill", '#00f')
        //   self.nodeInfo = d.data.name || d.data.hostname
        // })
        // .on("mouseout", function(d, i) {
        //   let el = d3.select(this).attr("fill", self.color(d.height))
        //   self.nodeInfo = ''
        // })
        //this.scaleToFit()
      }
    },
    scaleToFit() {
      //scale to fit
      let box = this.$refs.mainChart.getBBox();
      d3.select(this.$refs.mainChart)
        .attr(
          "viewBox",
          `${box.x - 1} ${box.y - 1} ${box.width + 2} ${box.height + 2}`
        );
    },
    tooltipContent(item) {
      var ComponentClass = Vue.extend(ChartTooltip);
      if (item) {
        var instance = new ComponentClass({
          propsData: {
            item: item.data
          }
        });
        instance.$mount();
        return instance.$el;
      }
      return "";
    }
  },
  watch: {
    hierarchyData() {
      this.draw();
    },
    height() {
      this.draw();
    },
    areaBy() {
      this.draw();
    },
    colorBy() {
      this.draw();
    }
  }
};
</script>

<style lang="stylus">
svg
  g, path
    user-select: none
    outline: none !important
</style>
