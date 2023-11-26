class PieChart {
    constructor(json) {
      this.categories = json;
    }
  
    renderPieChart() {
      var width = 400;
      var height = 400;
      var radius = Math.min(width, height) / 2;
  
      var svg = d3.select("#pie-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  
      var pie = d3.pie()
        .value(function (d) { return parseFloat(d.frequency); });
  
      var arc = svg.selectAll(".arc")
        .data(pie(this.categories))
        .enter()
        .append("g")
        .attr("class", "arc");
  
      var colorScale = d3.scaleOrdinal().range(["#ffffff", "#000000", "#a1a1a1"]);
  
      arc.append("path")
        .attr("d", d3.arc()
          .outerRadius(radius - 10)
          .innerRadius(0))
        .attr("fill", function (d, i) { return colorScale(i); })
        .attr("stroke-width", "1px")
        .attr("stroke", "gray")
        .transition() // Add a transition for the animation
        .duration(1000) // Set the duration of the animation in milliseconds
        .attrTween("d", function (d) {
          var initial = { startAngle: 0, endAngle: 0 }; // Initial state
          var interpolate = d3.interpolate(initial, d); // Create interpolation between initial and final state
          return function (t) {
            return d3.arc().outerRadius(radius - 10).innerRadius(0)(interpolate(t));
          };
        });
  
      arc.append("text")
        .attr("transform", function (d) {
          var centroid = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(0)
            .centroid(d);
          return "translate(" + centroid + ")";
        })
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .attr("font-family", "Helvetica")
        .attr("font-weight", 900)
        .attr("stroke-width", "0.25px")
        .attr("stroke", "white")
        .attr("font-size", "0.9em")
        .text(function (d) {
          return `${d.data.outcome}: ${(d.data.frequency * 100).toFixed(2)}%`;
        });
    }
  }