import React from 'react';
import ReactDOM from 'react-dom';

import {
  Button,
  ButtonToolbar,
  DropdownButton,
  MenuItem
} from 'react-bootstrap';

import { shallow } from 'enzyme';

import App from './App';

let wrapper;

beforeEach(() => {
  wrapper = shallow(<App />);
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('has 25 rows', () => {
  expect(wrapper.find('tr').length).toBe(25);
});

it('has 1000 table cells', () => {
  expect(wrapper.find('td').length).toBe(1000);
});

it('shows the number of generations', () => {
  expect(wrapper.find('span').text()).toBe('Generations: 0');
});

it('sets at least one cell to active when randomizing, in the average case', () => {
  wrapper
    .find(Button)
    .at(3)
    .simulate('click');

  expect(wrapper.update().find('td.is-alive').length).toBeGreaterThan(1);
});

it('toggles cell status when clicked', () => {
  expect(
    wrapper
      .update()
      .find('td')
      .at(0)
      .hasClass('is-alive')
  ).toBe(false);

  wrapper
    .find('td')
    .at(0)
    .simulate('click');

  expect(
    wrapper
      .update()
      .find('td')
      .at(0)
      .hasClass('is-alive')
  ).toBe(true);

  wrapper
    .find('td')
    .at(0)
    .simulate('click');

  expect(
    wrapper
      .update()
      .find('td')
      .at(0)
      .hasClass('is-alive')
  ).toBe(false);
});

it('clears all cells on press of Clear button', () => {
  wrapper
    .find('td')
    .at(0)
    .simulate('click');

  expect(
    wrapper
      .update()
      .find('td')
      .at(0)
      .hasClass('is-alive')
  ).toBe(true);

  wrapper
    .find(Button)
    .at(2)
    .simulate('click');

  expect(
    wrapper
      .update()
      .find('td')
      .at(0)
      .hasClass('is-alive')
  ).toBe(false);
});

it('advances the grid by one generation on press of Next button', () => {
  wrapper
    .find(Button)
    .at(1)
    .simulate('click');

  expect(
    wrapper
      .update()
      .find('span')
      .text()
  ).toBe('Generations: 1');
});
