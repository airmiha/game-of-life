import React, { Component } from 'react';
import {
  Button,
  ButtonToolbar,
  DropdownButton,
  MenuItem
} from 'react-bootstrap';

import {
  createNewGrid,
  createGridWithPattern,
  getNextGeneration
} from './grid';
import patterns from './patterns';
import './App.css';

const ROWS = 25;
const COLUMNS = 40;

class App extends Component {
  state = { generations: 0, grid: createNewGrid(ROWS, COLUMNS) };

  next = () => {
    this.setState({
      generations: this.state.generations + 1,
      grid: getNextGeneration(this.state.grid)
    });
  };

  randomizeGrid = () => this.clear(true);

  clear = randomize => {
    this.setState({
      generations: 0,
      grid: createNewGrid(ROWS, COLUMNS, randomize)
    });

    this.pause();
  };

  play = () => {
    this.interval = setInterval(() => {
      this.next();
    }, 100);

    this.setState({ playing: true });
  };

  pause = () => {
    clearInterval(this.interval);

    this.setState({ playing: false });
  };

  selectPattern = ({ pattern }) => {
    this.setState({ generations: 0, grid: createGridWithPattern(pattern) });

    this.pause();
  };

  toggleCell = (x, y, oldValue) => {
    const newGrid = this.state.grid.slice();

    newGrid[x][y] = oldValue ? 0 : 1;

    this.setState({ grid: newGrid });
  };

  renderRow = (row, x) => (
    <tr key={x}>
      {row.map((value, y) => (
        <td
          key={y}
          className={value && 'is-alive'}
          onClick={() => this.toggleCell(x, y, value)}
        />
      ))}
    </tr>
  );

  renderPatternPicker = () => (
    <DropdownButton title="Patterns" id="dropdown">
      {patterns.map((pattern, index) => (
        <MenuItem
          eventKey={index}
          key={index}
          onClick={() => this.selectPattern(pattern)}
        >
          {pattern.name}
        </MenuItem>
      ))}
    </DropdownButton>
  );

  renderControls = () => (
    <ButtonToolbar className="controls">
      {this.state.playing ? (
        <Button bsStyle="warning" onClick={this.pause}>
          <i className="fa fa-pause" /> Pause
        </Button>
      ) : (
        <Button bsStyle="success" onClick={this.play}>
          <i className="fa fa-play" /> Play
        </Button>
      )}
      <Button bsStyle="primary" onClick={this.next}>
        <i className="fa fa-step-forward" /> Next
      </Button>
      <Button bsStyle="danger" onClick={() => this.clear()}>
        <i className="fa fa-refresh" /> Clear
      </Button>
      <Button bsStyle="danger" onClick={this.randomizeGrid}>
        <i className="fa fa-random" /> Randomize
      </Button>
      {this.renderPatternPicker()}
    </ButtonToolbar>
  );

  render() {
    return (
      <div className="App">
        <h1>Game of Life - React</h1>
        <p>
          Click on cells to create custom patterns or select one of the
          predefined ones, as described in
          <a
            href="http://www.math.cornell.edu/~lipa/mec/lesson6.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            {' '}
            this lesson
          </a>
        </p>
        <table>
          <tbody>{this.state.grid.map(this.renderRow)}</tbody>
        </table>
        {this.renderControls()}
        <span>{`Generations: ${this.state.generations}`}</span>
      </div>
    );
  }
}

export default App;
