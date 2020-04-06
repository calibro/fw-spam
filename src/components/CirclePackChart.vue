<template>
  <svg :x="x" :y="y" :height="height" :width="width" ref="mainSVG">
    <svg id="main-chart" ref="mainChart" :height="height" :width="width"></svg>
    <g
      id="legend"
      ref="legend"
      :transform="'translate(0,' + (height - 100) + ')'"
    ></g>
  </svg>
</template>

<script>
import * as d3 from "d3";
import { groups } from "d3-array";
import d3Legend from "d3-svg-legend";
import { mapState, mapGetters, mapMutations } from "vuex";
import tippy from "tippy.js";
import Vue from "vue";
import ChartTooltip from "./commons/ChartTooltip";

export default {
  name: "CirclePackChart",
  props: ["x", "y", "height", "width"],
  computed: {
    ...mapState({
      colorBy: state => state.colorBy,
      areaBy: state => state.areaBy,
      useOriginalValues: state => state.useOriginalValues,
      csvData: state => state.data.csvData
    }),
    ...mapGetters({
      filteredData: "data/filteredData",
      hierarchyData: "data/filteredHierarchy"
    })
  },
  mounted() {
    this.draw();
  },
  methods: {
    init() {
      let csvData = this.csvData;

      let reputationScale = d3
        .scaleOrdinal()
        .domain(["Poor", "Neutral", "Good"])
        .range(["#D4003D", "#EAEA6A", "#00E4A2"]);

      let blacklistScale = d3
        .scaleLinear()
        .domain([0, 1, 3])
        .range(["rgb(221,221,221)", "rgb(253, 137, 60)", "rgb(128, 0, 38)"]);

      this.colorScales = {
        email_score_name: reputationScale,
        blacklists_count: blacklistScale
      };

      this.legendLabels = {
        lastmonth: "last month volume",
        lastday: "last day volume",
        email_score_name: "reputation",
        blacklists_count: "blacklist count"
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

      const svg = d3
        .select(this.$refs.mainChart)
        .attr("width", vWidth)
        .attr("height", vHeight);

      if (this.hierarchyData.length == 0) {
        svg.selectAll("*").remove();
        d3.select(this.$refs.legend)
          .selectAll("*")
          .remove();
        svg
          .append("text")
          .attr("class", "no-data-text")
          .style("font-size", "40px")
          .attr("y", "50%")
          .text("No data in your selection");

        this.scaleToFit(0, 0, this.width, this.height);
      } else {
        svg.selectAll(".no-data-text").remove();

        const circle = d3
          .arc()
          .innerRadius(0)
          .outerRadius(d => d)
          .startAngle(-Math.PI)
          .endAngle(Math.PI);

        const hierarchy = d3.hierarchy(
          { children: this.hierarchyData },
          d => d.children
        );

        // Define range base on useOriginaValue or not
        const lastmonthExtent = d3.extent(
          hierarchy.leaves(),
          d => d.data.lastmonth
        );
        const sizeScaleLastmonth = d3
          .scaleLinear()
          .domain(lastmonthExtent)
          .range(this.useOriginalValues ? lastmonthExtent : [1.0, 100.0]);

        const lastdayExtent = d3.extent(
          hierarchy.leaves(),
          d => d.data.lastday
        );
        const sizeScaleLastday = d3
          .scaleLinear()
          .domain(lastdayExtent)
          .range(this.useOriginalValues ? lastdayExtent : [1.0, 100.0]);

        const sizeScales = {
          lastday: sizeScaleLastday,
          lastmonth: sizeScaleLastmonth
        };

        const root = d3
          .pack()
          .size([vWidth, vHeight])
          .padding(10)(
          hierarchy
            .sum(d => {
              return sizeScales[self.areaBy](d[self.areaBy]);
            })
            .sort((a, b) => {
              return b.value - a.value;
            })
        );

        const minX = d3.min(
          root.descendants().slice(rooted ? 0 : 1),
          d => d.x - d.r
        );
        const maxX = d3.max(
          root.descendants().slice(rooted ? 0 : 1),
          d => d.x + d.r
        );
        const minY = d3.min(
          root.descendants().slice(rooted ? 0 : 1),
          d => d.y - d.r
        );
        const maxY = d3.max(
          root.descendants().slice(rooted ? 0 : 1),
          d => d.y + d.r
        );

        const textScale = d3
          .scaleLinear()
          .range([7, 14])
          .domain(
            d3.extent(
              root
                .descendants()
                .slice(rooted ? 0 : 1)
                .filter(d => d.children && d.children.length > 1),
              d => d.r
            )
          );

        let node = svg.selectAll(".node-g").data(
          root
            .descendants()
            .slice(rooted ? 0 : 1)
            .reverse(),
          d => d.data.level + d.data.name + (d.data.ip ? d.data.ip : "group")
        );

        let nodeEnter = node
          .enter()
          .append("g")
          .attr("class", "node-g")
          .attr("opacity", 0)
          .attr(
            "transform",
            d => `translate(${this.width / 2},${this.height / 2})`
          );

        nodeEnter
          .append("path")
          .attr("class", "node-path")
          .attr("id", (d, i) => {
            const id =
              "p_" +
              d.data.level +
              d.data.name +
              (d.data.ip ? d.data.ip : "group");

            return id;
          })
          .filter(d => !d.children)
          .on("mouseover", function(d) {
            tippy(this, {
              content:
                "<div><strong>" +
                (d.data.hostname ? d.data.hostname : d.data.ip) +
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
                "<div>Blacklists count: " +
                d.data.blacklists_count +
                (d.data.blacklists_count
                  ? " <br> - " +
                    d.data.blacklists_sources.split(" | ").join("<br> - ")
                  : "") +
                "</div>",
              allowHTML: true
            });
            d3.select(this).attr("stroke", "#222");
          })
          .on("mouseout", function(d) {
            !d3.select(this).classed("has-label") &&
              d3.select(this).attr("stroke", "none");
            //this._tippy && this._tippy.destroy()
          })
          .on("click", function(d) {
            let parent = d3.select(this.parentNode);
            if (parent.selectAll(".node-label").size() > 0) {
              d3.select(this)
                .attr("stroke", "none")
                .classed("has-label", false);
              parent.selectAll(".node-label").remove();
            } else {
              d3.select(this)
                .attr("stroke", "black")
                .classed("has-label", true);
              parent
                .append("text")
                .attr("fill", "black")
                .attr("class", "node-label")
                .attr("font-size", "12px")
                .attr("text-anchor", "middle")
                .attr("dy", 4)
                .attr("font-family", "'Arial', sans-serif")
                .attr("paint-order", "stroke")
                .attr("stroke", "#fff")
                .attr("stroke-width", "2px")
                .attr("stroke-linecap", "round")
                .attr("stroke-linejoin", "miter")
                .text(d.data.hostname ? d.data.hostname : d.data.ip);
              parent.raise();
            }
          });

        node.exit().remove();

        node = node.merge(nodeEnter);

        node
          .transition()
          .duration(500)
          .attr("opacity", 1)
          .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

        node
          .select(".node-path")
          .attr("d", d => circle(d.r))
          .attr("stroke", function(d) {
            if (d.children && d.children.length > 1) {
              return "#ddd";
            } else if (d3.select(this).classed("has-label")) {
              return "black";
            } else {
              return "none";
            }
          })
          .transition()
          .duration(500)
          .attr("fill", d => {
            if (d.children && d.children.length >= 1) {
              return "none";
            } else {
              return this.colorScales[self.colorBy](d.data[self.colorBy]);
            }
          });

        // LABELS
        let nodeLabels = svg
          .selectAll(".node-labels")
          .data(
            root
              .descendants()
              .slice(rooted ? 0 : 1)
              .reverse()
              .filter(d => d.children && d.children.length > 1),
            d => d.data.level + d.data.name + (d.data.ip ? d.data.ip : "group")
          )
          .join(
            enter =>
              enter
                .append("text")
                .attr(
                  "transform",
                  `translate(${this.width / 2},${this.height / 2})`
                )
                .call(enter =>
                  enter
                    .transition()
                    .duration(500)
                    .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
                ),
            update =>
              update.call(update =>
                update
                  .transition()
                  .duration(500)
                  .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`)
              )
          )
          .attr("class", "node-labels")
          .attr("dy", "-0.3em")
          .attr("fill", "black")
          .attr("font-size", d => textScale(d.r) + "px")
          .attr("text-anchor", "middle")
          .attr("font-family", "'Arial', sans-serif");

        nodeLabels
          .selectAll("textPath")
          .data(d => [d])
          .join("textPath")
          .attr("href", (d, i) => {
            const id =
              "p_" +
              d.data.level +
              d.data.name +
              (d.data.ip ? d.data.ip : "group");
            return "#" + id;
          })
          .attr("startOffset", "50%")
          .text(d => {
            return d.data.name;
          });

        const legendColorCont = d3
          .select(this.$refs.legend)
          .select(".legendColor");

        const legendOrdinal = d3Legend
          .legendColor()
          .shapePadding(10)
          .title(self.legendLabels[self.colorBy])
          .scale(self.colorScales[self.colorBy]);

        if (self.colorBy === "blacklists_count") {
          legendOrdinal
            .cells(self.colorScales[self.colorBy].domain())
            .labelFormat(d3.format(".0f"));
        }

        if (legendColorCont.empty()) {
          d3.select(this.$refs.legend)
            .append("g")
            .attr("class", "legendColor");

          d3.select(this.$refs.legend)
            .select(".legendColor")
            .call(legendOrdinal);

          d3.select(this.$refs.legend)
            .select(".legendColor")
            .selectAll("text")
            .attr("font-family", "'Arial', sans-serif");
        } else {
          legendColorCont.call(legendOrdinal);
          legendColorCont
            .selectAll("text")
            .attr("font-family", "'Arial', sans-serif");
        }

        //size legends

        const sizeLegendDomain = d3.extent(hierarchy.leaves(), d => d.r);
        const sizeLegendRange = d3.extent(
          hierarchy.leaves(),
          d => d.data[self.areaBy]
        );

        const sizeLegendScale = d3
          .scaleLinear()
          .domain(sizeLegendDomain)
          .range(sizeLegendRange);

        const sizeLegendCircles = [5, 20, 40];

        const sizeLegendCirclesData = sizeLegendCircles.map(d => {
          return { r: d, label: sizeLegendScale(d) };
        });

        if (
          d3
            .select(this.$refs.legend)
            .select(".legendSize")
            .empty()
        ) {
          d3.select(this.$refs.legend)
            .append("g")
            .attr("class", "legendSize")
            .attr("transform", "translate(150,0)")
            .append("text")
            .attr("class", "legendTitle")
            .text(self.legendLabels[self.areaBy])
            .attr("font-family", "'Arial', sans-serif");
        }

        d3.select(this.$refs.legend)
          .select(".legendSize")
          .select(".legendTitle")
          .text(self.legendLabels[self.areaBy]);

        const legendSizeCont = d3
          .select(this.$refs.legend)
          .select(".legendSize");

        const nodeLegend = legendSizeCont
          .selectAll("g")
          .data(sizeLegendCirclesData)
          .join("g")
          .attr("transform", "translate(0," + 19 + ")");

        nodeLegend
          .selectAll("circle")
          .data(d => [d])
          .join("circle")
          .attr("fill", "none")
          .attr("stroke", "#ccc")
          .attr("cx", d3.max(sizeLegendCircles))
          .attr("r", d => d.r)
          .attr("cy", d => d3.max(sizeLegendCircles) * 2 - d.r);

        nodeLegend
          .selectAll("line")
          .data(d => [d])
          .join("line")
          .attr("stroke", "#ccc")
          .attr("stroke-dasharray", "3 3")
          .attr("x1", d3.max(sizeLegendCircles))
          .attr("y1", d => d3.max(sizeLegendCircles) * 2 - d.r * 2)
          .attr("x2", d3.max(sizeLegendCircles) * 2 + 8)
          .attr("y2", d => d3.max(sizeLegendCircles) * 2 - d.r * 2);

        nodeLegend
          .selectAll("text")
          .data(d => [d])
          .join("text")
          .attr("font-family", "'Arial', sans-serif")
          .attr("dy", 6)
          .attr("x", d3.max(sizeLegendCircles) * 2 + 12)
          .attr("y", d => d3.max(sizeLegendCircles) * 2 - d.r * 2)
          .attr("text-anchor", "end")
          .attr("transform", "translate(36,0)")
          .text(d => d3.format("0.2f")(d.label));

        const legendBbox = d3
          .select(this.$refs.legend)
          .node()
          .getBBox();

        d3.select(this.$refs.legend)
          .selectAll(".background")
          .data([legendBbox])
          .enter()
          .append("rect")
          .attr("class", "background")
          .attr("width", d => d.width)
          .attr("height", d => d.height)
          .attr("y", d => d.y)
          .attr("fill", "white")
          .lower();

        this.scaleToFit(minX, maxX, minY, maxY);
      }
    },
    scaleToFit(minX, maxX, minY, maxY) {
      const labelSize = 12;
      d3.select(this.$refs.mainChart).attr(
        "viewBox",
        `${minX} ${minY - labelSize} ${maxX - minX} ${maxY -
          minY +
          labelSize * 2}`
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
    },
    useOriginalValues() {
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
  .legendTitle
    fill: #aaa
.node-label
  pointer-events: none
</style>
