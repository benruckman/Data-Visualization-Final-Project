class PieChart {
  constructor(json) {
    this.year = json;
  }

  renderPieChart(monthIndex) {
    // Array of month names
    const monthNames = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];

    // Extract data for the selected month
    let monthData = this.year.months[monthIndex];

    // Update the monthLabel paragraph with the corresponding month name
    d3.select("#monthLabel").text(`Selected Month: ${monthNames[parseInt(monthData.Month) - 1]}`);

    // Select the container for the pie chart
    let svg = d3.select("#pie-chart");
    svg.selectAll("*").remove(); // Clear previous content

    // Set up dimensions and radius
    let width = 400;
    let height = 400;
    let radius = Math.min(width, height) / 2;

    // Create SVG element
    svg = svg
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Prepare data for the pie chart
    let pie = d3.pie().value(function (d) {
      return parseFloat(d);
    });
    let dataForPie = [monthData.White, monthData.Black, monthData.Draw];

    // Set up color scale
    let colorScale = d3.scaleOrdinal().range(["#ffffff", "#000000", "#a1a1a1"]);

    // Create arcs
    let arcs = svg
      .selectAll(".arc")
      .data(pie(dataForPie))
      .enter()
      .append("g")
      .attr("class", "arc");

    // Draw paths
    arcs
      .append("path")
      .attr("d", d3.arc().outerRadius(radius - 10).innerRadius(0))
      .attr("fill", function (d, i) {
        return colorScale(i);
      })
      .attr("stroke-width", "1px")
      .attr("stroke", "gray")
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        let initial = { startAngle: 0, endAngle: 0 };
        let interpolate = d3.interpolate(initial, d);
        return function (t) {
          return d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(0)(interpolate(t));
        };
      });

    // Add text labels
    arcs
      .append("text")
      .attr("transform", function (d) {
        let centroid = d3.arc()
          .outerRadius(radius - 40)
          .innerRadius(0)
          .centroid(d);
        return "translate(" + centroid + ")";
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-family", "Helvetica")
      .attr("font-weight", 900)
      .attr("stroke-width", "0.5px")
      .attr("stroke", "white")
      .attr("font-size", "0.9em")
      .text(function (d, i) {
        return `${['White', 'Black', 'Draw'][i]}: ${(d.data * 100).toFixed(2)}%`;
      });
  }
}