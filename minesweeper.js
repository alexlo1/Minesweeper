var WIDTH = 600;
var HEIGHT = 370;
var SIDE_LENGTH = 20;
var OFFSET = 50;
var ROWS = 16;
var COLS = 30;
var BOMBS = 99;

var unmarkedbombs;
var unclickedtiles;
var mousebutton;
var gameState;
var paused;
var gameOver;

var tiles;
var bombs;

function setup() {
  createCanvas(601, 371);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);

  reset();
}

function draw() {
  background(0);
  fill(255);
  textSize(20);
  text("Bombs remaining: " + unmarkedbombs, WIDTH/4, OFFSET/2);
  text(gameOver, WIDTH*3/4, OFFSET/2);

  // restart button and face
  rect(WIDTH/2, OFFSET/2, SIDE_LENGTH*2, SIDE_LENGTH*2);
  if (gameState == -1) {
    fill(255, 0, 0);
  } else if (gameState == 1) {
    fill(0, 255, 150);
  } else {
    fill(200, 200, 200);
  }
  ellipse(WIDTH/2, OFFSET/2, SIDE_LENGTH*3/2, SIDE_LENGTH*3/2);
  fill(0);
  ellipse(WIDTH/2-5, OFFSET/2-5, 5, 5);
  ellipse(WIDTH/2+5, OFFSET/2-5, 5, 5);

  // redraw all tiles
  for (var row = 0; row < ROWS; row++) {
    for (var col = 0; col < COLS; col++) {
      var t = tiles[row][col];
      // color scheme: red for exploded, blue for marked, light for clicked
      if (t.marked) {
        fill(0, 120, 250);
      } else if (t.clicked && bombs.includes(t)) {
        fill(255, 0, 0);
      } else if (t.clicked) {
        fill(200);
      } else {
        fill(100);
      }
      rect(t.x + SIDE_LENGTH/2, t.y + SIDE_LENGTH/2, SIDE_LENGTH, SIDE_LENGTH);
      // display labels
      fill(0);
      textSize(15);
      text(t.label, t.x + SIDE_LENGTH/2, t.y + SIDE_LENGTH/2);
    }
  }
}

function mousePressed() {
  // restart button is clicked
  if (mouseX > WIDTH/2 - SIDE_LENGTH && mouseX < WIDTH/2 + SIDE_LENGTH &&
    mouseY > OFFSET/2 - SIDE_LENGTH && mouseY < OFFSET/2 + SIDE_LENGTH) {
    reset();
  }

  // game tile is clicked
  else if (!paused && mouseY > OFFSET) {
    // determine mouse button
    if (mouseButton == LEFT) {
      mousebutton = 1;
    } else {
      mousebutton = -1;
    }

    // determine which tile is clicked
    var x = int((mouseY - OFFSET) / SIDE_LENGTH);
    var y = int(mouseX / SIDE_LENGTH);
    if(isValid(x, y)) {
      gameState = click(tiles[x][y], mousebutton);
    }

    // check for game over
    mousebutton = 0;
    if (gameState == -1) {
      losingMessage();
    } else if (gameState == 1) {
      winningMessage();
    }
  }
  redraw();
}

function reset() {
  tiles = new Array();
  for (var r = 0; r < ROWS; r++) {
    tiles[r] = new Array();
    for (var c = 0; c < COLS; c++) {
      tiles[r][c] = new Object();
      tiles[r][c].r = r;
      tiles[r][c].c = c;
      tiles[r][c].x = c * SIDE_LENGTH;
      tiles[r][c].y = r * SIDE_LENGTH + OFFSET;
      tiles[r][c].label = "";
      tiles[r][c].marked = tiles[r][c].clicked = false;
    }
  }

  bombs = new Array();
  for (var b = 0; b < BOMBS; b++) {
    setBombs();
  }
  unmarkedbombs = BOMBS;
  unclickedtiles = ROWS * COLS - BOMBS;
  mousebutton = 0;
  gameState = 0;
  paused = false;
  gameOver = "";
}

function setBombs() {
  var row = floor(random() * ROWS);
  var col = floor(random() * COLS);
  if (!bombs.includes(tiles[row][col])) {
    bombs.push(tiles[row][col]);
  } else {
    setBombs();
  }
}

// avoid out of bounds
function isValid(r, c) {
  return (r >= 0 && r < ROWS && c >= 0 && c < COLS);
}

function click(tile, button) {
  if (button == 1 && !tile.clicked && !tile.marked) {
    tile.clicked = true;
    unclickedtiles--;
    if (bombs.includes(tile)) {
      //game is lost
      return -1;
    } else if (countBombs(tile) > 0) {
      tile.label = str(countBombs(tile));
    } else {
      for (var i = -1; i <=1; i++) {
        for (var j = -1; j <=1; j++) {
          if (isValid(tile.r+i, tile.c+j)) {
            click(tiles[tile.r+i][tile.c+j], 1);
          }
        }
      }
    }

    if (unclickedtiles <= 0) {
      return 1; // game is won
    }
  }
  // cannot mark revealed tile
  else if (button == -1 && !tile.clicked) {
    if (tile.marked) {
      tile.marked = false;
      unmarkedbombs++;
    } else {
      tile.marked = true;
      unmarkedbombs--;
    }
  }
  return 0;
}

function countBombs(tile) {
  var count = 0;
  for (var i = -1; i <=1; i++) {
    for (var j = -1; j <=1; j++) {
      if (isValid(tile.r+i, tile.c+j)) {
        if (bombs.includes(tiles[tile.r+i][tile.c+j])) {
          count++;
        }
      }
    }
  }
  return count;
}

function losingMessage() {
  fill(255);
  gameOver = "You lose ):";
  // reveal all bombs
  for(var b = 0; b < BOMBS; b++) {
    click(bombs[b], 1);
  }
  paused = true;
}

function winningMessage() {
  gameOver = "You win! (:";
  paused = true;
}
