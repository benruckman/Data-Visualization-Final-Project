/**
* Requests the file and executes a callback with the parsed result once
* it is available
* @param {string} path - The path to the file.
* @param {function} callback - The callback function to execute once the result is available
*/
function fetchJSONFile (path, callback) {
  const httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        const data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send();
}

// call fetchJSONFile then build and render a tree
// this is the function executed as a callback when parsing is done
fetchJSONFile('data/GameOutcomes.json', function (data) {
  const pie = new PieChart(data);
  pie.renderPieChart();
});

fetchJSONFile('data/GameLengths.json', function (data) {
  const histogram = new HistogramChart(data);
  histogram.renderHistogramChart();
});

fetchJSONFile('data/OpeningMoveWinRate2013-1.json', function (data) {
  const openingMoveWinRate = new CategoricalBarChart(data);
  openingMoveWinRate.renderCategoricalBarChart();
});

fetchJSONFile('data/BestOpenings.json', function (data) {
  const board = new ChessBoard(data);
  board.renderChessBoard(5, "mostPopularMoves");

  // Set up slider functionality
  let slider = d3.select("input[type=range]");
  let dataSelection = d3.select("#dataSelection");
  
  slider.on("input", () => {
    //console.log(slider.node().value);
    let selectedValue = +slider.node().value; // Parse slider value as integer
    board.renderChessBoard(selectedValue, dataSelection.node().value);
  });

  dataSelection.on("change", () => {
    //console.log(dataSelection.node().value);
    //console.log("Slider value: " + slider.node().value);
    board.renderChessBoard(+slider.node().value, dataSelection.node().value);
  });
});

// ******* DATA LOADING *******
// We took care of that for you
async function loadData () {
  const countryChampions = await d3.csv('data/countryChampions.csv');
  const mapData = await d3.json('data/world.json');
  return { countryChampions, mapData };
}

// ******* STATE MANAGEMENT *******
// This should be all you need, but feel free to add to this if you need to 
// communicate across the visualizations
const globalApplicationState = {
  selectedCountry: null,
  countryChampions: null,
  mapData: null,
  worldMap: null,
};

//******* APPLICATION MOUNTING *******
loadData().then((loadedData) => {
  console.log('Here is the imported data:', loadedData.countryChampions);

  // Store the loaded data into the globalApplicationState
  globalApplicationState.countryChampions = loadedData.countryChampions;
  globalApplicationState.mapData = loadedData.mapData;

  // Creates the view objects with the global state passed in 
  const worldMap = new WorldChampionMap(globalApplicationState);

  globalApplicationState.worldMap = worldMap;
});


