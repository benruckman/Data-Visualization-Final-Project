/** Class representing the map view. */
class WorldChampionMap {
  /**
   * Creates a Map Visualization
   * @param globalApplicationState The shared global application state (has the data and the line chart instance in it)
   */
  constructor(globalApplicationState) {
    this.globalApplicationState = globalApplicationState;

    // Set up the map projection
    const projection = d3.geoWinkel3()
      .scale(150) // Set the size of the map
      .translate([400, 250]); // Move the map to the center of the SVG

    const svg = d3.select('#map'); 

    // Extract the countries geometries from the TopoJSON data
    const countries = topojson.feature(this.globalApplicationState.mapData, this.globalApplicationState.mapData.objects.countries);

    // Extract countryChampions data
    const countryChampions = this.globalApplicationState.countryChampions;

    // Parse the 'Champions' values as integers
    countryChampions.forEach(d => {
      d.wins = +d.Champions;
    });

    // Define a color scale based on the number of wins
    const maxWins = d3.max(countryChampions, d => d.wins);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain([0, maxWins]);

    // Create a path generator using the projection
    const path = d3.geoPath().projection(projection);

    // Draw graticule lines
    svg.select('#graticules').append('path')
      .datum(d3.geoGraticule())
      .attr('class', 'graticule')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', '#ccc')
      .style('stroke-width', 0.5);

    // Draw graticule outline
    svg.select('#graticules').append('path')
      .datum(d3.geoGraticule().outline())
      .attr('class', 'graticule-outline')
      .attr('d', path)
      .style('fill', 'none')
      .style('stroke', 'black')
      .style('stroke-width', 1);

    // Draw the countries on the map with color-coded fill and black borders
    svg.select('#countries').selectAll('.country')
      .data(countries.features)
      .enter().append('path')
      .attr('class', 'country')
      .attr('d', path)
      .style('fill', (d) => {
        const isoCode = d.id;
        const countryData = countryChampions.find(country => country.Country === isoCode);
        return countryData ? colorScale(countryData.wins) : 'gray';
      })
      .style('stroke', 'black') 
      .style('stroke-width', .5) 
      .on('click', (event, d) => this.toggleSelection(d)); // Call the toggleSelection method on click
  }

  toggleSelection(country) {
    const isoCode = country.id;

    // Check if the clicked country is already selected
    if (this.selectedCountry === isoCode) {
      // Country is already selected, clear the selection
      this.selectedCountry = null;

      // Restore outline color to black
      d3.selectAll('.country').style('stroke', 'black');

      // Remove all win labels
      this.removeWinsLabel();
    } else {
      // Country is not selected, update the selection
      this.selectedCountry = isoCode;

      // Change outline color to red
      d3.selectAll('.country').style('stroke', (d) => (d.id === isoCode) ? 'red' : 'black');

      // Display the number of wins over the country
      this.showWinsLabel(country);
    }

    // Call updateSelectedCountries to apply the visual changes
    this.updateSelectedCountries();
  }

  showWinsLabel(country) {
  const isoCode = country.id;
  const countryData = this.globalApplicationState.countryChampions.find(country => country.Country === isoCode);

  // Remove all existing win labels
  this.removeWinsLabel();

  // Display the number of wins and the country name
  const svg = d3.select('#map');
  svg.append('text')
    .attr('class', 'win-label')
    .attr('x', 10)
    .attr('y', 20)
    .text(`Country: ${isoCode}, Wins: ${countryData ? countryData.wins : 0}`)
    .style('fill', 'black')
    .style('font-size', '14px');
}

  removeWinsLabel() {
    // Remove all win labels
    const svg = d3.select('#map');
    svg.selectAll('.win-label').remove();
  }

  // updateSelectedCountries() {
  //   // Implement logic to set a selected class on the countries based on the selectedLocations array
  //   const selectedLocations = this.globalApplicationState.selectedLocations;
  //   //console.log(selectedLocations);
  //   const svg = d3.select('#map');

  //   svg.selectAll('.country')
  //     .classed('selected', (d) => selectedLocations.includes(d.id));

  //   this.globalApplicationState.lineChart.updateSelectedCountries();
  // }
}
