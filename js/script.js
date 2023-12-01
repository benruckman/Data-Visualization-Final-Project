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

function fetchJSONFilePromise(path) {
  return new Promise((resolve, reject) => {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          const data = JSON.parse(httpRequest.responseText);
          resolve(data);
        } else {
          reject(new Error(`Failed to fetch data from ${path}`));
        }
      }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
  });
}

// call fetchJSONFile then build and render a tree
// this is the function executed as a callback when parsing is done
fetchJSONFile('backend/data/lichess/win_percentages.json', function (data) {

  // Set up slider functionality
  let monthSlider = d3.select("#monthSlider");

  const pie = new PieChart(data);
  pie.renderPieChart(+monthSlider.node().value);

  monthSlider.on("input", () => {
    let selectedMonthValue = +monthSlider.node().value;
    pie.renderPieChart(selectedMonthValue);
  });

});

fetchJSONFile('data/LengthFrequencies.json', function (data) {
  const histogram = new HistogramChart(data);
  histogram.renderHistogramChart();
});

// fetchJSONFile('data/OpeningMoveWinRate2013-1.json', function (data) {
//   const openingMoveWinRate = new CategoricalBarChart(data);
//   openingMoveWinRate.renderCategoricalBarChart();
// });

async function loadCategoricalBarChartData() {
  const firstMovesYears = await Promise.all([
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2013.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2014.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2015.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2016.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2017.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2018.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2019.json'),
  ]);
  const openingMoveWinRate = new CategoricalBarChart(firstMovesYears);
  openingMoveWinRate.renderCategoricalBarChart(0);
  
  // Set up slider functionality
  let yearSlider = d3.select("#yearSlider");

  yearSlider.on("input", () => {
    let selectedYearValue = +yearSlider.node().value;
    openingMoveWinRate.renderCategoricalBarChart(selectedYearValue);
  });
}

loadCategoricalBarChartData();

//-----------for chessboard------------
async function loadChessBoardData() {
  const firstMovesYears = await Promise.all([
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2013.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2014.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2015.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2016.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2017.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2018.json'),
    fetchJSONFilePromise('backend/data/lichess/aggregation_of_first_moves/all/years/2019.json'),
  ]);
  const board = new ChessBoard(firstMovesYears);
  board.renderChessBoard(5, "mostPopularMoves", 0);

  // Set up slider functionality
  let moveSlider = d3.select("#moveSlider");
  let yearSlider = d3.select("#yearSlider");
  let dataSelection = d3.select("#dataSelection");

  moveSlider.on("input", () => {
    let selectedMoveValue = +moveSlider.node().value;
    let selectedYearValue = +yearSlider.node().value;
    board.renderChessBoard(selectedMoveValue, dataSelection.node().value, selectedYearValue);
  });

  yearSlider.on("input", () => {
    let selectedMoveValue = +moveSlider.node().value;
    let selectedYearValue = +yearSlider.node().value;
    board.renderChessBoard(selectedMoveValue, dataSelection.node().value, selectedYearValue);
  });

  dataSelection.on("change", () => {
    let selectedMoveValue = +moveSlider.node().value;
    let selectedYearValue = +yearSlider.node().value;
    board.renderChessBoard(selectedMoveValue, dataSelection.node().value, selectedYearValue);

    // Update slider labels based on the selected dataset
    updateSliderLabels(dataSelection.node().value);
  });

  // Initial update of slider labels
  updateSliderLabels(dataSelection.node().value);
}

function updateSliderLabels(selectedDataset) {
  let topLabel = d3.select("#topLabel");
  let bottomLabel = d3.select("#bottomLabel");

  if (selectedDataset === "mostPopularMoves") {
    topLabel.text("Most Popular Move");
    bottomLabel.text("Least Popular Move");
  } else if (selectedDataset === "bestMoves") {
    topLabel.text("Most Winning Move");
    bottomLabel.text("Least Winning Move");
  }
}

loadChessBoardData();

// fetchJSONFile('data/BestOpenings.json', function (data) {
//   const board = new ChessBoard(data);
//   board.renderChessBoard(5, "mostPopularMoves");

//   // Set up slider functionality
//   let slider = d3.select("#moveSlider");
//   let dataSelection = d3.select("#dataSelection");
  
//   slider.on("input", () => {
//     //console.log(slider.node().value);
//     let selectedValue = +slider.node().value; // Parse slider value as integer
//     board.renderChessBoard(selectedValue, dataSelection.node().value);
//   });

//   dataSelection.on("change", () => {
//     //console.log(dataSelection.node().value);
//     //console.log("Slider value: " + slider.node().value);
//     board.renderChessBoard(+slider.node().value, dataSelection.node().value);
//   });
// });

//-----------------------for map--------------------
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
  //console.log('Here is the imported data:', loadedData.countryChampions);

  // Store the loaded data into the globalApplicationState
  globalApplicationState.countryChampions = loadedData.countryChampions;
  globalApplicationState.mapData = loadedData.mapData;

  // Creates the view objects with the global state passed in 
  const worldMap = new WorldChampionMap(globalApplicationState);

  globalApplicationState.worldMap = worldMap;
});


