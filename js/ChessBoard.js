/** Class representing a ChessBoard. */
class ChessBoard {
  /**
   * @param {json[]} json - array of json objects with outcome and frequency fields
   */
  constructor(json) {
    this.openings = json;
    this.maxSliderValue = 5;
    this.lastPieceRemoved = null;
  }

  /**
   * Function that renders the chessboard
   */
  renderChessBoard(value) {
    // remove all previous moves
    d3.selectAll('.move').remove();

    if (this.lastPieceRemoved != null) {
      // restore removed piece
      d3.selectAll(".point" + this.lastPieceRemoved).selectAll("img")
        .style("display", "block");
    }
    

    // Set the dimensions of the chessboard
    let boardSize = 8;
    let squareSize = 50;

    // Create the chessboard
    let chessboard = d3.select("#chess-board")
      .style("width", boardSize * squareSize + "px")
      .style("height", boardSize * squareSize + "px");

    // Generate the checkered pattern
    let squares = [];
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        squares.push({ row: 7 - i, col: j, color: (i + j) % 2 === 0 ? "white" : "black" });
      }
    }

    // Add squares to the chessboard
    let squareElements = chessboard.selectAll(".square")
      .data(squares)
      .enter().append("div")
      .attr("class", function(d) { return "square " + d.color + " point" + (d.row*8 + d.col); })
      .style("width", squareSize + "px")
      .style("height", squareSize + "px")
      .style("line-height", squareSize + "px");
      
      // .style("text-align", "center")
      // .text(function(d) { return String.fromCharCode(97 + d.col) + (d.row + 1); })

    // Add chess pieces as images (overlay on squares)
    squareElements.each(function(d) {
      if (d.row === 0 || d.row === 7) {
        let pieceColor = d.row === 7 ? "Black" : "White";
        let pieceType = "";
        switch (d.col) {
          case 0:
          case 7:
            pieceType = "Rook";
            break;
          case 1:
          case 6:
            pieceType = "Knight";
            break;
          case 2:
          case 5:
            pieceType = "Bishop";
            break;
          case 3:
            pieceType = "Queen";
            break;
          case 4:
            pieceType = "King";
            break;
        }
        d3.select(this).append("img")
          .attr("src", `resources/${pieceColor}${pieceType}.png`)
          .style("width", squareSize + "px")
          .style("height", squareSize + "px")
          .style("position", "absolute");
      } else if (d.row === 1 || d.row === 6) {
        let pieceColor = d.row === 6 ? "Black" : "White";
        d3.select(this).append("img")
          .attr("src", `resources/${pieceColor}Pawn.png`)
          .style("width", squareSize + "px")
          .style("height", squareSize + "px")
          .style("position", "absolute");
      }
    });

    
    // Convert the JSON object to an array of objects
    const data = Object.entries(this.openings[0]);
    // Sort the array based on the win_percentage property in descending order
    data.sort((a, b) => b[1].count - a[1].count);
    //console.log(data);

    if (value != 0) {
      let indexOfDrawnMove = value > 0 ? this.maxSliderValue - value : data.length - 1 - this.maxSliderValue - value;

      let move = data[indexOfDrawnMove];
      let startSquare = parseInt(move[0].split(", ")[0]);
      let endSquare = parseInt(move[0].split(", ")[1]);
      let pieceImage = d3.select(".point" + startSquare).select("img").attr("src");
      //console.log(pieceImage);
      d3.select(".point" + endSquare).append("img")
        .attr("class", "move")
        .attr("src", pieceImage)
        .style("width", squareSize + "px")
        .style("height", squareSize + "px")
        .style("position", "absolute");

      // remove original piece
      d3.selectAll(".point" + startSquare).selectAll("img")
        .style("display", "none");
      this.lastPieceRemoved = startSquare;
    }
    
  }    
}