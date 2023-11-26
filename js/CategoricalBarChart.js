/** Class representing a Histogram. */
class CategoricalBarChart {
  /**
   * @param {Array} json - array of JSON objects with length field
   */
  constructor(json) {
    this.data = json;
  }

  /**
   * Function that renders the categorical bar chart.
   */
  renderCategoricalBarChart() {
    // Constants for the chart that would be useful.
    const CHART_WIDTH = 1000;
    const CHART_HEIGHT = 250;
    const MARGIN = { left: 50, bottom: 50, top: 20, right: 20 };

    let categoricalBarChartSvg;
    categoricalBarChartSvg = d3
      .select("#CategoricalBarChart-div")
      .append("svg")
      .attr("width", CHART_WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom)
      .append("g")
      .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")")
      .attr("id", "CategoricalBarChart-svg")
      .attr("class", "categorical-bar-chart");

    // Extract opening moves and their data
    const openingMoves = Object.keys(this.data);
    openingMoves.sort((a, b) => this.data[b].win_percentage - this.data[a].win_percentage); // Sort by win rate
    const totalGames = openingMoves.reduce((acc, move) => acc + this.data[move].count, 0);

    // X axis
    const x = d3
      .scaleBand()
      .domain(openingMoves)
      .range([0, CHART_WIDTH - MARGIN.left - MARGIN.right])
      .padding(0.1);

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([0, .6]) // Win rate ranges from 0 to 1
      .nice()
      .range([CHART_HEIGHT - MARGIN.top - MARGIN.bottom, 0]);

    // Bars
    const bars = categoricalBarChartSvg.selectAll(".bar").data(openingMoves);

    let renamedData = this.data;

    // Add hover effect and tooltip using separate function
    function handleMouseOver(d) {
      const bar = d3.select(this);
      bar.attr("fill", "lightgray"); // Change color on hover
      console.log(renamedData);
      console.log(d.target.__data__);
      const winRate = (renamedData[d.target.__data__].win_percentage * 100).toFixed(2);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`Win Rate: ${winRate}%`)
        .style("left", (d.x || d.pageX) + "px")  // Use d.x or d.pageX
        .style("top", (d.y || d.pageY - 28) + "px");  // Use d.y or d.pageY
    }

    function handleMouseOut() {
      const bar = d3.select(this);
      bar.attr("fill", "black"); // Revert color on mouseout
      tooltip.transition().duration(500).style("opacity", 0);
    }

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d))
      .attr("width", d => x.bandwidth())
      .attr("y", d => y(this.data[d].win_percentage))
      .attr("height", d => CHART_HEIGHT - MARGIN.top - MARGIN.bottom - y(this.data[d].win_percentage))
      .attr("fill", "black") // Initial color
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut);

    bars.exit().remove();

    // X axis label formatter
    const formatXAxisLabel = (d) => {
      return this.getMoveFromStartAndEndNums(d);
    };

    // X axis
    categoricalBarChartSvg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (CHART_HEIGHT - MARGIN.bottom - MARGIN.top) + ")")
      .call(d3.axisBottom(x).tickFormat(formatXAxisLabel))
      .selectAll("text")
      .style("text-anchor", "middle");
    
    // Y axis
    categoricalBarChartSvg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".0%")));

    // X axis label
    categoricalBarChartSvg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", CHART_WIDTH / 2)
      .attr("y", CHART_HEIGHT) // Adjust the vertical position as needed
      .style("text-anchor", "middle")
      .text("Opening Move (Coordinate Points)");

    // Y axis label
    categoricalBarChartSvg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("x", -CHART_HEIGHT / 2)
      .attr("y", -MARGIN.left + 10) // Adjust the horizontal position as needed
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Win Rate");

    // Tooltip
    const tooltip = d3
      .select("#CategoricalBarChart-div")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
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