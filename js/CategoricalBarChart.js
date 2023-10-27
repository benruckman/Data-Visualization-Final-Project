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

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d))
      .attr("width", d => (x.bandwidth() * (this.data[d].count) / totalGames))
      .attr("y", d => y(this.data[d].win_percentage))
      .attr("height", d => CHART_HEIGHT - MARGIN.top - MARGIN.bottom - y(this.data[d].win_percentage));


    bars.exit().remove();

    // X axis
    categoricalBarChartSvg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (CHART_HEIGHT - MARGIN.bottom - MARGIN.top) + ")")
      .call(d3.axisBottom(x))
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

}
  