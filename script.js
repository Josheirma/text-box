// script.js
// TEXTBOX CODE - ChatGPT : Canvas Text Grid Cursor
// === Setup and center canvas on screen ===
const canvas = document.createElement('canvas');
document.body.style.margin = '0';
document.body.style.height = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.background = '#fafafa';

canvas.width = 12 * 25;  // 12px per column × 25 columns
canvas.height = 19 * 25; // 19px per row × 25 rows
canvas.style.border = '2px solid black';
document.body.appendChild(canvas);

// === Canvas context setup ===
const ctx = canvas.getContext('2d');
ctx.font = '15px monospace';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

// === Constants ===
const COLS = 25;               // Number of columns in the grid (width)
const ROWS = 25;               // Number of rows in the grid (height)
const CELL_W = 12;             // Width of each cell in pixels
const CELL_H = 19;             // Height of each cell in pixels
const CURSOR_H = 2;            // Height (thickness) of the underline cursor in pixels
const CHAR_ABOVE_CURSOR = 1;   // Vertical offset to shift text up for better alignment above the cursor line
const DASH = ' ';               // Character used to represent an empty cell (currently empty string)

// === State ===
let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(DASH)); 
// Initialize 2D grid array of ROWS x COLS filled with empty cells (DASH)
// Cursor position, starting at top-left cell (row 0, column 0)
let cursor = { row: 0, col: 0 }; 
//const CELL_W = 12; 
// Width of each grid cell in pixels
// Determines horizontal spacing between characters on the canvas
//const CELL_H = 19; 
// Height of each grid cell in pixels
// Determines vertical spacing between rows of characters on the canvas
//const CHAR_ABOVE_CURSOR = 1; // Number of pixels to shift characters upward
// This small vertical offset helps visually center text
// so it sits nicely above the underline cursor line
//CURSOR_H :  Height of cursor
// === Draw the grid, characters, and cursor ===
function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      // 'grid' is a 2D array representing the text grid:
      // Each element grid[row][col] holds a single character (or empty DASH) at that position.
      //
      // For example:
      // grid[0][0] is the character in the top-left cell,
      // grid[24][24] is the character in the bottom-right cell.
      //
      // It is initialized as a ROWS × COLS array filled with empty cells (DASH).
      const ch = grid[r][c];
      // Calculate horizontal center of the cell:
      // CELL_W is the width of each cell in pixels
      // Adding CELL_W / 2 centers the character horizontally within the cell
      const x = c * CELL_W + CELL_W / 2;
      // Calculate vertical center of the cell:
      // CELL_H is the height of each cell in pixels
      // Adding CELL_H / 2 centers the character vertically within the cell
      const y = r * CELL_H + CELL_H / 2;

      // Draw character (slightly shifted up by CHAR_ABOVE_CURSOR pixels for visual alignment)
      ctx.fillStyle = 'black';
      ctx.fillText(ch, x, y - CHAR_ABOVE_CURSOR);

      // Draw underline cursor at current position
      if (cursor.row === r && cursor.col === c) {
        ctx.fillRect(
          c * CELL_W,                    // x-position: left edge of the cell
          r * CELL_H + CELL_H - CURSOR_H, // y-position: bottom of the cell minus CURSOR_H (height of cursor)
          CELL_W,                       // width of cursor equals cell width
          CURSOR_H                      // height of the underline cursor in pixels (thin line)
        );
      }

      // Draw light gray cell borders
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(c * CELL_W, r * CELL_H, CELL_W, CELL_H);
    }
  }
}

// === Initial render ===
drawGrid();

// === Keyboard input handler ===
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveCursor(-1, 0);
  else if (e.key === 'ArrowRight') moveCursor(1, 0);
  else if (e.key === 'ArrowUp') moveCursor(0, -1);
  else if (e.key === 'ArrowDown') moveCursor(0, 1);
  else if (e.key === 'Backspace') deleteChar();
  else if (e.key === 'Delete') deleteChar();
  // All letter characters
  else if (e.key.length === 1 && /^[\x20-\x7E]$/.test(e.key)) insertChar(e.key); // Letters only

  drawGrid();
});


// === Move the cursor with edge wrapping ===
// 'cursor' is an object tracking the current cursor position in the grid:
//
// cursor.row — the vertical position (row index), from 0 (top) to ROWS - 1 (bottom)
// cursor.col — the horizontal position (column index), from 0 (left) to COLS - 1 (right)
//
// These values determine where characters are inserted, deleted, or where the cursor is drawn.
function moveCursor(dx, dy) {
  // dx: horizontal direction (-1 = left, 1 = right)
  // dy: vertical direction   (-1 = up,   1 = down)

  // === Horizontal Movement ===
  if (dx === -1) {
    if (cursor.col === 0) {
      if (cursor.row === 0) {
        // Top-left corner: can't move left
        return;
      } else {
        // Move left from start of row: go up and wrap to rightmost column
        cursor.row -= 1;
        cursor.col = COLS - 1;
      }
    } else {
      cursor.col -= 1; // Normal left move
    }
  } else if (dx === 1) {
    const isLastCell = cursor.row === ROWS - 1 && cursor.col === COLS - 1;
    if (isLastCell) {
      // Bottom-right corner: can't move right
      return;
    } else if (cursor.col === COLS - 1) {
      // Move right from end of row: go down and wrap to first column
      cursor.row += 1;
      cursor.col = 0;
    } else {
      cursor.col += 1; // Normal right move
    }
  }

  // === Vertical Movement ===
  if (dy === -1) {
    // Move up with wrap
    cursor.row = cursor.row === 0 ? ROWS - 1 : cursor.row - 1;
  } else if (dy === 1) {
    // Move down with wrap
    cursor.row = cursor.row === ROWS - 1 ? 0 : cursor.row + 1;
  }
}





function insertChar(char) {
  shiftRight(cursor.row, cursor.col);
  grid[cursor.row][cursor.col] = char;
  moveCursor(1, 0);
   moveRightWordToNextRowWhitespace()
}


//COLS represents the total number of columns in the grid. 
//ROWS represents the total number of rows in the grid. 
//DASH :
// Represents an empty cell in the grid
// Used to clear cells or indicate no character present
// Can be changed to '-' or ' ' if a visible placeholder is desired

// 'lastIndex' is the flattened 1D index of the very last cell in the grid:
//
// Calculated as total number of cells minus one:
// ROWS * COLS - 1
//
// Used to identify the last cell's position when clearing or shifting characters.

// 'grid' is a 2D array representing the text grid:
// Each element grid[row][col] holds a single character (or empty DASH) at that position.
//
// For example:
// grid[0][0] is the character in the top-left cell,
// grid[24][24] is the character in the bottom-right cell.
//
// It is initialized as a ROWS × COLS array filled with empty cells (DASH).

// Math.floor(value) rounds a decimal number down to the nearest whole integer.
//
// Used here to convert a 1D index into a row number by dividing by COLS,
// because integer division isn’t directly available in JavaScript.
//
// Example:
// Math.floor(27 / 25) = 1 (row 1)
// Math.floor(24 / 25) = 0 (row 0)

// === Shift all characters one space to the right (after insertion) ===
function shiftRight(row, col) {
  // Flattened index of the insertion point
  // Shift everything from this point to the right by 1
  for (let i = ROWS * COLS - 2; i >= row * COLS + col; i--) {
    const from = i;       // Current character index
    const to = i + 1;     // Destination index (1 cell to the right)

    // Convert 1D index to 2D row and column
    const fr = Math.floor(from / COLS); // From row
    const fc = from % COLS;             // From col
    const tr = Math.floor(to / COLS);   // To row
    const tc = to % COLS;               // To col

    // Move character to the right
    grid[tr][tc] = grid[fr][fc];
  }

  // Clear the last cell in the grid
  const lastIndex = ROWS * COLS - 1;         // Final 1D index of the grid
  const lastR = Math.floor(lastIndex / COLS); // Last row
  const lastC = lastIndex % COLS;             // Last col
  grid[lastR][lastC] = DASH;
}


function deleteChar() {
  if (cursor.row === 0 && cursor.col === 0) return;
  moveCursor(-1, 0);
  shiftLeft(cursor.row, cursor.col);
  moveRightWordToNextRowWhitespace() 
}


// === Shift all characters left to fill the gap after deletion ===
//COLS represents the total number of columns in the grid. 
//DASH :
// Represents an empty cell in the grid
// Used to clear cells or indicate no character present
// Can be changed to '-' or ' ' if a visible placeholder is desired

// 'lastIndex' is the flattened 1D index of the very last cell in the grid:
//
// Calculated as total number of cells minus one:
// ROWS * COLS - 1
//
// Used to identify the last cell's position when clearing or shifting characters.

// 'grid' is a 2D array representing the text grid:
// Each element grid[row][col] holds a single character (or empty DASH) at that position.
//
// For example:
// grid[0][0] is the character in the top-left cell,
// grid[24][24] is the character in the bottom-right cell.
//
// It is initialized as a ROWS × COLS array filled with empty cells (DASH).

// Math.floor(value) rounds a decimal number down to the nearest whole integer.
//
// Used here to convert a 1D index into a row number by dividing by COLS,
// because integer division isn’t directly available in JavaScript.
//
// Example:
// Math.floor(27 / 25) = 1 (row 1)
// Math.floor(24 / 25) = 0 (row 0)

function shiftLeft(row, col) {
  // Start at the flattened index of the cursor position,
  // and move every character after it one position to the left
  for (let i = row * COLS + col; i < ROWS * COLS - 1; i++) {
    const from = i + 1; // Index of the character to move forward
    const to = i;       // Destination index (move left by 1)

    // Convert 'from' 1D index to 2D grid position
    const fr = Math.floor(from / COLS); // 'from' row
    const fc = from % COLS;             // 'from' column

    // Convert 'to' 1D index to 2D grid position
    const tr = Math.floor(to / COLS);   // 'to' row
    const tc = to % COLS;               // 'to' column

    // Move character from (fr, fc) to (tr, tc)
    grid[tr][tc] = grid[fr][fc];
  }

  // Clear the final cell (last character got duplicated during the shift)
  const lastIndex = ROWS * COLS - 1;
  const lastR = Math.floor(lastIndex / COLS); // Last row
  const lastC = lastIndex % COLS;             // Last column
  grid[lastR][lastC] = DASH;
}

//added to text box///////////////////////////

function moveRightWordToNextRowWhitespace() {
  //any character but space
  const isLetter = ch => /^[\x21-\x7E]$/.test(ch);

  for (let row = 0; row < ROWS - 1; row++) {
    let col = 0;

    // Step through each column of current row
    while (col < COLS) {
      // Skip over non-letter characters
      if (!isLetter(grid[row][col])) {
        col++;
        continue;
      }

      const startCol = col;

      // Find the end of the current consecutive letter word
      while (col < COLS && isLetter(grid[row][col])) {
        col++;
      }

      const endCol = col - 1;
      const wordLen = endCol - startCol + 1;

      // === Check if the word qualifies for moving ===
      const endsAtRightEdge = endCol === COLS - 1;
      const isSingleAtEnd =
        startCol === endCol &&
        endCol === COLS - 1 &&
        grid[row + 1][0] !== ' ';

      if (!endsAtRightEdge && !isSingleAtEnd) {
        // Try next potential word
        col = startCol + 1;
        continue;
      }

      // === Find where the leftmost block of non-space characters ends in the next row ===
      let leftBlockEnd = 0;
      while (leftBlockEnd < COLS && grid[row + 1][leftBlockEnd] !== ' ') {
        leftBlockEnd++;
      }

      // === Count how many consecutive spaces follow that left block ===
      let spaceCount = 0;
      let spaceStart = leftBlockEnd;
      while (
        spaceStart + spaceCount < COLS &&
        grid[row + 1][spaceStart + spaceCount] === ' '
      ) {
        spaceCount++;
      }

      // === Final checks before inserting ===
      const nextRowStartsWithChar = grid[row + 1][0] !== ' ';
      const canFit = wordLen <= spaceCount;
      const insertCol = leftBlockEnd;

      // Ensure the entire target region is spaces only
      let allSpaces = true;
      for (let i = 0; i < wordLen; i++) {
        if (grid[row + 1][insertCol + i] !== ' ') {
          allSpaces = false;
          break;
        }
      }

      if (nextRowStartsWithChar && canFit && allSpaces) {
        // === Perform the move ===
        for (let i = 0; i < wordLen; i++) {
          grid[row + 1][insertCol + i] = grid[row][startCol + i]; // move down
          console.log("1: ", grid[row][startCol + i])
          grid[row][startCol + i] = ' '; // erase from original row
        }
      }

      break; // Only move one word per row
    }
  }
}

//////////////////////