import { forEach, map, times } from 'lodash';

/**
 * Calculates the sum of all nine fields at and around the given cell:
 * the cell itself and 8 fields surrounding it.
 * 
 * The coordinate system (0, 0) starts at the upper left corner of the grid.
 * 
 * @param {*} centerX X coordinate of the cell
 * @param {*} centerY Y coordinate of the cell
 * @param {*} grid The grid
 */
const getAreaSum = (centerX, centerY, grid) => {
  const rows = grid.length;
  const columns = grid[0].length;

  let sum = 0;

  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      const x = (centerX + i + rows) % rows;
      const y = (centerY + j + columns) % columns;

      sum += grid[x][y];
    }
  }

  return sum;
};

/**
 * Creates a new grid, either empty or with random values.
 * 
 * If randomized, 1 in around 20 cells will be alive.
 * 
 * @param {*} rows Number of rows
 * @param {*} columns Number of columns
 * @param {*} randomize True if random cells will be set alive, false otherwise
 * 
 */
export const createNewGrid = (rows = 25, columns = 40, randomize) =>
  times(rows, () =>
    times(columns, () => (randomize && Math.random() > 0.95 ? 1 : 0))
  );

/**
 * Creates a grid with a starting pattern.
 * 
 * @param {*} pattern An array of coordinates of live cells
 * @param {*} rows Number of rows
 * @param {*} columns Number of columns
 * 
 */
export const createGridWithPattern = (pattern, rows, columns) => {
  const grid = createNewGrid(rows, columns);

  forEach(pattern, ([x, y]) => {
    grid[x][y] = 1;
  });

  return grid;
};

/**
 * Returns the next generation from the old one.
 * 
 * We avoid decision branches when calculating the next state of the cell, as described in
 * https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life#Algorithms
 * 
 * We set the next state based on the sum of all nine fields at and around the cell.
 *  
 * @param {*} grid Grid with the old generation
 * 
 */
export const getNextGeneration = grid =>
  map(grid, (row, x) =>
    map(row, (value, y) => {
      const areaSum = getAreaSum(x, y, grid);

      return areaSum === 3 ? 1 : areaSum === 4 ? value : 0;
    })
  );
