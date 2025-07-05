// script.js

// Setup and center canvas
const canvas = document.createElement('canvas');
document.body.style.margin = '0';
document.body.style.height = '100vh';
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.background = '#fafafa';

canvas.width = 12 * 25;  // 12px * 25 cols
canvas.height = 19 * 25; // 19px * 25 rows
canvas.style.border = '2px solid black';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.font = '15px monospace';
ctx.textBaseline = 'middle';
ctx.textAlign = 'center';

const COLS = 25;
const ROWS = 25;
const CELL_W = 12;
const CELL_H = 19;
const CURSOR_H = 2;
const CHAR_ABOVE_CURSOR = 1; // chars 1px above cursor underline
const DASH = '-';

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(DASH));
let cursor = { row: 0, col: 0 };

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const ch = grid[r][c];
      const x = c * CELL_W + CELL_W / 2;
      const y = r * CELL_H + CELL_H / 2;

      // Draw character vertically centered, shifted 1px up
      ctx.fillStyle = 'black';
      ctx.fillText(ch, x, y - CHAR_ABOVE_CURSOR);

      // Draw underline cursor line beneath characters
      if (cursor.row === r && cursor.col === c) {
        ctx.fillRect(
          c * CELL_W,
          r * CELL_H + CELL_H - CURSOR_H,
          CELL_W,
          CURSOR_H
        );
      }

      // Draw cell border
      ctx.strokeStyle = '#ccc';
      ctx.strokeRect(c * CELL_W, r * CELL_H, CELL_W, CELL_H);
    }
  }
}

drawGrid();

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moveCursor(-1, 0);
  else if (e.key === 'ArrowRight') moveCursor(1, 0);
  else if (e.key === 'ArrowUp') moveCursor(0, -1);
  else if (e.key === 'ArrowDown') moveCursor(0, 1);
  else if (e.key === 'Backspace') deleteChar();
  else if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) insertChar(e.key);

  drawGrid();
});

function moveCursor(dx, dy) {
  cursor.col += dx;

  if (cursor.col < 0) cursor.col = 0;
  else if (cursor.col >= COLS) {
    cursor.col = 0;
    cursor.row = (cursor.row + 1) % ROWS;
  }

  cursor.row += dy;
  if (cursor.row < 0) cursor.row = ROWS - 1;
  else if (cursor.row >= ROWS) cursor.row = 0;
}

function insertChar(char) {
  shiftRight(cursor.row, cursor.col);
  grid[cursor.row][cursor.col] = char;
  moveCursor(1, 0);
}

function shiftRight(row, col) {
  for (let i = ROWS * COLS - 2; i >= row * COLS + col; i--) {
    const from = i;
    const to = i + 1;
    const fr = Math.floor(from / COLS);
    const fc = from % COLS;
    const tr = Math.floor(to / COLS);
    const tc = to % COLS;
    grid[tr][tc] = grid[fr][fc];
  }
  // Fill last cell with dash
  const lastR = Math.floor((ROWS * COLS - 1) / COLS);
  const lastC = (ROWS * COLS - 1) % COLS;
  grid[lastR][lastC] = DASH;
}

function deleteChar() {
  if (cursor.row === 0 && cursor.col === 0) return;
  moveCursor(-1, 0);
  shiftLeft(cursor.row, cursor.col);
}

function shiftLeft(row, col) {
  for (let i = row * COLS + col; i < ROWS * COLS - 1; i++) {
    const from = i + 1;
    const to = i;
    const fr = Math.floor(from / COLS);
    const fc = from % COLS;
    const tr = Math.floor(to / COLS);
    const tc = to % COLS;
    grid[tr][tc] = grid[fr][fc];
  }
  const lastR = Math.floor((ROWS * COLS - 1) / COLS);
  const lastC = (ROWS * COLS - 1) % COLS;
  grid[lastR][lastC] = DASH;
}

// Checks if char is a letter
function isAlpha(ch) {
  return /^[a-zA-Z]$/.test(ch);
}

/**
 * Get word starting at (row,col) spanning row edges.
 * Returns word string or null.
 */
function getWordAt(row, col) {
  if (!isAlpha(grid[row][col])) return null;
  let word = '';
  let r = row;
  let c = col;
  while (r < ROWS) {
    while (c < COLS) {
      const ch = grid[r][c];
      if (!isAlpha(ch)) return word.length ? word : null;
      word += ch;
      c++;
    }
    r++;
    c = 0;
  }
  return word.length ? word : null;
}
