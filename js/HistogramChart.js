/** Class representing a Histogram. */
class HistogramChart {
    /**
     * @param {Array} json - array of JSON objects with value and freq fields
     */
    constructor(json) {
        this.data = json.flatMap(({ value, freq }) =>
            Array.from({ length: freq }, () => value)
        );
    }

    /**
     * Function that renders the histogram.
     */
    renderHistogramChart() {
        // Constants for the chart that would be useful.
        const CHART_WIDTH = 900;
        const CHART_HEIGHT = 500;
        const MARGIN = { left: 70, bottom: 20, top: 20, right: 20 };
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

        const binWidth = 5;
        const histogramData = d3.histogram()
            .domain(d3.extent(this.data))
            .thresholds(d3.range(d3.min(this.data), d3.max(this.data) + binWidth, binWidth))
            (this.data);

        // X axis
        const x = d3
            .scaleLinear()
            .domain(d3.extent(this.data))
            .range([0, CHART_WIDTH - MARGIN.left - MARGIN.right]);

        // Y axis
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(histogramData, d => d.length)])
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
            .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
            .attr("height", d => CHART_HEIGHT - MARGIN.top - MARGIN.bottom - y(d.length))
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);

        bars.exit().remove();

        let tooltip = d3
            .select("#HistogramChart-div")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // Add hover effect and tooltip using a separate function
        function handleMouseOver(d) {
            const bar = d3.select(this);
            bar.attr("fill", "lightgray"); // Change color on hover
        
            const range = `${d.srcElement.__data__.x0} - ${d.srcElement.__data__.x1}`;
            const length = d.srcElement.__data__.length;
        
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`Range: ${range} moves<br>Games: ${length.toLocaleString("en-US")}`)
                .style("left", (d.pageX) + "px")
                .style("top", (CHART_HEIGHT + MARGIN.top) + "px"); // Adjust the top position
        
        }

        function handleMouseOut() {
            const bar = d3.select(this);
            bar.attr("fill", "5cd34f"); // Revert color on mouseout
            tooltip.transition().duration(500).style("opacity", 0);
        }

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

        // X axis label
        histogramChartSvg
            .append("text")
            .attr("class", "x-axis-label")
            .attr("x", CHART_WIDTH / 2 - MARGIN.left)
            .attr("y", CHART_HEIGHT) // Adjust the vertical position as needed
            .style("text-anchor", "middle")
            .text("Game Length");

        // Y axis label
        histogramChartSvg
            .append("text")
            .attr("class", "y-axis-label")
            .attr("x", -CHART_HEIGHT / 2 + 5)
            .attr("y", -MARGIN.left / 2 - 20) // Adjust the horizontal position as needed
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "middle")
            .text("Number of Games");
    }
}
