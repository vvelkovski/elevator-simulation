// https://on.cypress.io/api

import { TOTAL_ELEVATORS, TOTAL_FLOORS } from '../../src/constants/buildingSpecs';

describe('App', () => {
  it('renders a log component', () => {
    cy.visit('/');
    cy.contains('h2', 'Event Log');
    cy.get('div.log').should('exist');
  });

  it('renders the correct number of elevators', () => {
    cy.visit('/');
    cy.get('.elevator').should('have.length', TOTAL_ELEVATORS);
  });

  it('renders the correct number of floors', () => {
    cy.visit('/');
    cy.get('.floor').should('have.length', TOTAL_ELEVATORS * TOTAL_FLOORS);
  });
});
