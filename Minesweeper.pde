final private int SIDE_LENGTH = 20;
final private int OFFSET = 50;
final private int ROWS = 16;
final private int COLS = 30;
final private int BOMBS = 99;

private Tile[][] tiles;
private ArrayList<Tile> bombs;
private int unmarkedbombs;
private int unclickedtiles;
private int mousebutton;
private int gameState;
private boolean paused;
private String gameOver;

public void setup() {
  size(601, 371);
  strokeWeight(2);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noLoop();

  restart();
}

public void draw() {
  background(0);
  fill(255);
  textSize(20);
  text("Bombs remaining: " + unmarkedbombs, width/4, OFFSET/2);
  text(gameOver, width*3/4, OFFSET/2);
  
  // restart button and face
  rect(width/2, OFFSET/2, SIDE_LENGTH*2, SIDE_LENGTH*2);
  if (gameState == -1) {
    fill(255, 0, 0);
  } else if (gameState == 1) {
    fill(0, 255, 150);
  } else {
    fill(200, 200, 200);
  }
  ellipse(width/2, OFFSET/2, SIDE_LENGTH*3/2, SIDE_LENGTH*3/2);
  fill(0);
  ellipse(width/2-5, OFFSET/2-5, 5, 5);
  ellipse(width/2+5, OFFSET/2-5, 5, 5);

  // redraw all tiles
  for (int row = 0; row < ROWS; row++) {
    for (int col = 0; col < COLS; col++) {
      tiles[row][col].draw();
    }
  }
}

public void mousePressed() {
  // restart button is clicked
  if (mouseX > width/2 - SIDE_LENGTH && mouseX < width/2 + SIDE_LENGTH && 
    mouseY > OFFSET/2 - SIDE_LENGTH && mouseY < OFFSET/2 + SIDE_LENGTH) {
    restart();
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
    int x = (mouseY - OFFSET) / SIDE_LENGTH;
    int y = mouseX / SIDE_LENGTH;
    if(isValid(x, y)) {
      gameState = tiles[x][y].click(mousebutton);
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

// randomly place all bombs
public void setBombs() {
  int row = (int)(Math.random() * ROWS); 
  int col = (int)(Math.random() * COLS); 
  if (!bombs.contains(tiles[row][col])) {
    bombs.add(tiles[row][col]);
  } else {
    setBombs();
  }
}

public void losingMessage() {
  gameOver = "You lose ):";
  // reveal all bombs
  for(int i = 0; i < BOMBS; i++) {
    bombs.get(i).click(1);
  }
  paused = true;
}

public void winningMessage() {
  gameOver = "You win! (:";
  paused = true;
}

// reset all variable, create new map layout
public void restart() {
  tiles = new Tile[ROWS][COLS];
  bombs = new ArrayList<Tile>(BOMBS);
  unmarkedbombs = BOMBS;
  unclickedtiles = ROWS * COLS - BOMBS;
  mousebutton = 0;
  gameState = 0;
  paused = false;
  gameOver = "";

  // set all tiles/bombs
  for (int row = 0; row < ROWS; row++) {
    for (int col = 0; col < COLS; col++) {
      tiles[row][col] = new Tile(row, col);
    }
  }
  for (int bomb = 0; bomb < BOMBS; bomb++) {
    setBombs();
  }
}

// avoid out of bounds
public boolean isValid(int r, int c) {
  return (r >= 0 && r < ROWS && c >= 0 && c < COLS);
}

public class Tile {
  private int r, c;
  private float x, y; 
  private boolean clicked, marked;
  private String label;

  public Tile(int row, int col) {
    r = row;
    c = col;
    x = c * SIDE_LENGTH;
    y = r * SIDE_LENGTH + OFFSET;
    label = "";
    marked = clicked = false;
  }

  // if the tile was clicked: check if left click or right click
  public int click(int button) {
    
    // cannot left click already-revealed tile or marked tile
    if (button == 1 && !clicked && !marked) {
      clicked = true;
      unclickedtiles--;
      
      if (bombs.contains(this)) {
        // game is lost
        return -1;
      } else if (countBombs() > 0) {
        label = str(countBombs());
      } else {
        // recurse onto neighbors if the tile has no neighboring bombs
        for (int i = -1; i <=1; i++) {
          for (int j = -1; j <=1; j++) {
            if (isValid(r+i, c+j)) {
              tiles[r+i][c+j].click(1);
            }
          }
        }
      }
      
      if (unclickedtiles <= 0) {
        // game is won
        return 1;
      }
    } 
    // cannot mark revealed tile
    else if (button == -1 && !clicked) {
      if (marked) {
        marked = false;
        unmarkedbombs++;
      } else {
        marked = true;
        unmarkedbombs--;
      }
    }
    return 0;
  }

  // check the eight neighbor tiles for bombs
  public int countBombs() {
    int count = 0;
    for (int i = -1; i <=1; i++) {
      for (int j = -1; j <=1; j++) {
        if (isValid(r+i, c+j)) {
          if (bombs.contains(tiles[r+i][c+j])) {
            count++;
          }
        }
      }
    }
    return count;
  }

  // arbitrary color scheme
  // red for bomb, blue for marked, dark gray for unexplored, light gray for revealed
  public void draw() {
    if (marked) {
      fill(0, 120, 250);
    } else if (clicked && bombs.contains(this)) {
      fill(255, 0, 0);
    } else if (clicked) {
      fill(200);
    } else {
      fill(100);
    }
    rect(x + SIDE_LENGTH/2, y + SIDE_LENGTH/2, SIDE_LENGTH, SIDE_LENGTH);  
    fill(0);
    textSize(14);
    text(label, x+SIDE_LENGTH/2, y+SIDE_LENGTH/2);
  }
}