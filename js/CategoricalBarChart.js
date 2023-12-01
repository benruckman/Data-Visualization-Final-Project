/** Class representing a Histogram. */
class CategoricalBarChart {
  /**
   * @param {Array} json - array of JSON objects with length field
   */
  constructor(json) {
    this.yearData = json;
    this.CHART_WIDTH = 1000;
    this.CHART_HEIGHT = 250;
    this.MARGIN = { left: 50, bottom: 50, top: 20, right: 20 };

    this.initializeChart();
  }

  /**
   * Function that initializes the categorical bar chart.
   */
  initializeChart() {
    this.categoricalBarChartSvg = d3
      .select("#CategoricalBarChart-div")
      .append("svg")
      .attr("width", this.CHART_WIDTH + this.MARGIN.left + this.MARGIN.right)
      .attr("height", this.CHART_HEIGHT + this.MARGIN.top + this.MARGIN.bottom)
      .append("g")
      .attr("transform", "translate(" + this.MARGIN.left + "," + this.MARGIN.top + ")")
      .attr("id", "CategoricalBarChart-svg")
      .attr("class", "categorical-bar-chart");

    // X axis
    this.x = d3.scaleBand().range([0, this.CHART_WIDTH - this.MARGIN.left - this.MARGIN.right]).padding(0.1);

    // Y axis
    this.y = d3.scaleLinear().nice().range([this.CHART_HEIGHT - this.MARGIN.bottom - this.MARGIN.top, 0]);

    // X axis label formatter
    this.formatXAxisLabel = (d) => {
      return this.getMoveFromStartAndEndNums(d[0]);
    };

    // X axis
    this.categoricalBarChartSvg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (this.CHART_HEIGHT - this.MARGIN.bottom - this.MARGIN.top) + ")");

    // Y axis
    this.categoricalBarChartSvg.append("g").attr("class", "y-axis");

    // X axis label
    this.categoricalBarChartSvg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", this.CHART_WIDTH / 2)
      .attr("y", this.CHART_HEIGHT) // Adjust the vertical position as needed
      .style("text-anchor", "middle")
      .text("Opening Move (Coordinate Points)");

    // Y axis label
    this.categoricalBarChartSvg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -this.CHART_HEIGHT / 2)
      .attr("y", -this.MARGIN.left + 10) // Adjust the horizontal position as needed
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Win Rate");

    // Tooltip
    this.tooltip = d3
      .select("#CategoricalBarChart-div")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    this.renderCategoricalBarChart(0);
  }

  /**
   * Function that renders the categorical bar chart.
   */
  renderCategoricalBarChart(yearIndex) {
    let years = ["2013","2014","2015","2016","2017","2018","2019"];
    d3.select("#yearLabel").text("Year: " + years[yearIndex]);

    // Extract opening moves and their data
    const openingMoves = Object.entries(this.yearData[yearIndex]);
    openingMoves.sort((a, b) => b[1].win_percentage - a[1].win_percentage);

    this.x.domain(openingMoves);
    this.y.domain([0, 0.6]);

    // Bars
    const bars = this.categoricalBarChartSvg.selectAll(".bar").data(openingMoves);

    // Enter
    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("fill", "#2AC3EA")
      .on("mouseover", this.handleMouseOver.bind(this))
      .on("mouseout", this.handleMouseOut.bind(this));

    // Update
    bars
      .merge(bars)
      .transition()
      .duration(500)
      .attr("x", (d) => this.x(d))
      .attr("width", (d) => this.x.bandwidth())
      .attr("y", (d) => this.y(this.yearData[yearIndex][d[0]].win_percentage))
      .attr(
        "height",
        (d) =>
          this.CHART_HEIGHT -
          this.MARGIN.bottom -
          this.MARGIN.top -
          this.y(this.yearData[yearIndex][d[0]].win_percentage)
      );

    // Exit
    bars.exit().remove();

    // X axis
    this.categoricalBarChartSvg.select(".x-axis").call(d3.axisBottom(this.x).tickFormat(this.formatXAxisLabel));

    // Y axis
    this.categoricalBarChartSvg.select(".y-axis").call(d3.axisLeft(this.y).ticks(5).tickFormat(d3.format(".0%")));
  }

  handleMouseOver(d) {
    const bar = d3.select(d.target);
    bar.attr("fill", "lightgray"); // Change color on hover
    const winRate = (d.target.__data__[1].win_percentage * 100).toFixed(2);
    const numGames = d.target.__data__[1].count.toLocaleString("en-US");
    this.tooltip.transition().duration(200).style("opacity", 0.9);
    this.tooltip
      .html(`Games Played: ${numGames}<br>Win Rate: ${winRate}%`)
      .style("left", d.pageX + "px")
      .style("top", d.pageY - 28 + "px");
  }

  handleMouseOut(d) {
    const bar = d3.select(d.target);
    bar.attr("fill", "#2AC3EA"); // Revert color on mouseout
    this.tooltip.transition().duration(500).style("opacity", 0);
  }

  getMoveFromStartAndEndNums(str) {
    let arr = str.split(", ");
    let pieceType = "";
    switch (arr[0]) {
      case "1":
      case "6":
        pieceType = "N";
        break;
    }
    return pieceType + String.fromCharCode(97 + arr[1] % 8) + (parseInt(arr[1] / 8) + 1);
  }
}
