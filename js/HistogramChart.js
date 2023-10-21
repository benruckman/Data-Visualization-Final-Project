/** Class representing a Histogram. */
class HistogramChart {
  /**
   * @param {Array} json - array of JSON objects with length field
   */
  constructor(json) {
    this.data = json;
  }

  /**
  * Function that renders the histogram.
  */
  renderHistogramChart() {
    // Constants for the chart that would be useful.
    const CHART_WIDTH = 500;
    const CHART_HEIGHT = 250;
    const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
    const ANIMATION_DURATION = 300;

    let histogramChartSvg;
    histogramChartSvg = d3
      .select("#HistogramChart-div")
      .append("svg")
      .attr("width", CHART_WIDTH + MARGIN.left + MARGIN.right)
      .attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom)
      .append("g")
      .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")")
      .attr("id", "HistogramChart-svg")
      .attr("class", "histogram");

    // Parse the 'length' field of each data point as integers
    const parsedData = this.data.map(d => parseInt(d.length));

    // Calculate histogram data
    const histogramData = d3.histogram()
      .value(d => d)
      .domain([0, 100])
      .thresholds(20)(parsedData);
  
    // Get the maximum frequency value from the histogram data
    const maxFrequency = d3.max(histogramData, d => d.length);

    // X axis
    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, CHART_WIDTH - MARGIN.left - MARGIN.right]);

    // Y axis
    const y = d3
      .scaleLinear()
      .domain([0, maxFrequency]) // Set the domain to the maximum frequency value
      .nice()
      .range([CHART_HEIGHT - MARGIN.top - MARGIN.bottom, 0]);

    // Bars
    const bars = histogramChartSvg.selectAll(".bar").data(histogramData);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => CHART_HEIGHT - MARGIN.top - MARGIN.bottom - y(d.length));

    bars
      .transition()
      .duration(ANIMATION_DURATION)
      .attr("x", d => x(d.x0))
      .attr("y", d => y(d.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => CHART_HEIGHT - MARGIN.top - MARGIN.bottom - y(d.length));

    bars.exit().remove();

    // X axis
    histogramChartSvg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + (CHART_HEIGHT - MARGIN.bottom - MARGIN.top) + ")")
      .call(d3.axisBottom(x).ticks(10));

    // Y axis
    histogramChartSvg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));
  }

}
  