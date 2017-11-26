import { forEach, some, times } from 'lodash';

import {
  createNewGrid,
  createGridWithPattern,
  getNextGeneration
} from './grid';

it('should create an empty grid with given width and height', () => {
  expect(createNewGrid(20, 50)).toEqual(times(20, () => times(50, () => 0)));
});

it('should create an empty grid with default width and height', () => {
  expect(createNewGrid()).toEqual(times(25, () => times(40, () => 0)));
});

it('should create a grid with random values when creating a new grid with randomize option', () => {
  const grid = createNewGrid(50, 50, true);

  expect(some(grid, row => some(row, Boolean))).toBe(true);
});

it('should create a grid populated with given pattern', () => {
  const expectedGrid = createNewGrid();
  expectedGrid[0][0] = 1;
  expectedGrid[0][1] = 1;

  expect(createGridWithPattern([[0, 0], [0, 1]])).toEqual(expectedGrid);
});

describe('Game rules', () => {
  it('Any live cell with one live neighbour dies, as if caused by underpopulation', () => {
    const grid = createGridWithPattern([[0, 0], [0, 1]]);
    const next = getNextGeneration(grid);

    expect(next[0][0]).toBe(0);
    expect(next[0][1]).toBe(0);
  });

  it('Any live cell with no live neighbours dies', () => {
    const grid = createGridWithPattern([[0, 0]]);

    expect(getNextGeneration(grid)[0][0]).toBe(0);
  });

  it('Any live cell with two neighbours lives on to the next generation', () => {
    const grid = createGridWithPattern([[0, 1], [1, 1], [1, 0]]);

    expect(getNextGeneration(grid)[1][1]).toBe(1);
  });

  it('Any live cell with three neighbours lives on to the next generation', () => {
    const grid = createGridWithPattern([[0, 0], [0, 1], [1, 1], [1, 0]]);

    expect(getNextGeneration(grid)[1][1]).toBe(1);
  });

  it('Any live cell with more than three live neighbours dies, as if by overpopulation.', () => {
    const grid = createGridWithPattern([
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 1],
      [1, 0]
    ]);

    expect(getNextGeneration(grid)[1][1]).toBe(0);
  });

  it('Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.', () => {
    // 4 neighbours
    let grid = createGridWithPattern([[0, 0], [0, 1], [0, 2], [1, 0]]);

    expect(getNextGeneration(grid)[1][1]).toBe(0);

    // Exactly 3 neighbours
    grid = createGridWithPattern([[0, 0], [0, 2], [1, 0]]);

    expect(getNextGeneration(grid)[1][1]).toBe(1);

    // Two neighbours
    grid = createGridWithPattern([[0, 0], [0, 2], [1, 0]]);

    expect(getNextGeneration(grid)[1][1]).toBe(1);
  });
});

describe('Game rules with boundary conditions and toroidal array', () => {
  it('Any live cell with two neighbours lives on', () => {
    const grid = createGridWithPattern([[0, 0], [0, 5], [5, 5]], 6, 6);

    expect(getNextGeneration(grid)[0][0]).toBe(1);
  });

  it('Any live cell with three neighbours lives on', () => {
    const grid = createGridWithPattern([[0, 0], [0, 5], [5, 0], [5, 5]], 6, 6);

    expect(getNextGeneration(grid)[0][0]).toBe(1);
  });

  it('Any live cell with more than three live neighbours dies, as if by overpopulation.', () => {
    const grid = createGridWithPattern(
      [[0, 0], [0, 5], [1, 5], [5, 0], [5, 5]],
      6,
      6
    );

    expect(getNextGeneration(grid)[0][0]).toBe(0);
  });

  it('Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.', () => {
    const grid = createGridWithPattern([[0, 5], [1, 5], [5, 0]], 6, 6);

    expect(getNextGeneration(grid)[0][0]).toBe(1);
  });
});
