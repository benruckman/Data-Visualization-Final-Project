/** Class representing a PieChart. */
class PieChart {
  /**
   * @param {json[]} json - array of json objects with outcome and frequency fields
   */
  constructor(json) {
    this.categories = json;
  }

  /**
   * Function that renders the piechart
   */
  renderPieChart() {
    // Create an SVG element for the chart
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    
    var svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Generate the pie chart layout
    var pie = d3.pie()
        .value(function(d) { return parseFloat(d.frequency); });
    
    // Append SVG path elements for each pie slice
    var arc = svg.selectAll(".arc")
        .data(pie(this.categories))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Colors for the chart
    var colorScale = d3.scaleOrdinal().range(["#ffffff","#000000","#a1a1a1"]);

    // Path stroke
    arc.append("path")
        .attr("d", d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0))
        .attr("fill", function(d, i) { return colorScale(i); })
        .attr("stroke-width", "1px")
        .attr("stroke", "gray") // Add a stroke for better separation

    // Add labels with improved positioning
    arc.append("text")
        .attr("transform", function(d) {
            var centroid = d3.arc()
            .outerRadius(radius - 40) // Adjust outer radius for label positioning
            .innerRadius(0)
            .centroid(d);
            return "translate(" + centroid + ")";
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family","Helvetica")
        .attr("font-weight", 900)
        .attr("stroke-width", "0.25px")
        .attr("stroke", "white")
        .attr("font-size", "0.9em")
        .text(function(d) {
            return `${d.data.outcome}: ${(d.data.frequency * 100).toFixed(2)}%`;
        });
  }    
}