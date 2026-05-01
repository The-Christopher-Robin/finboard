describe('Watchlist', () => {
  beforeEach(() => {
    cy.visit('/watchlist');
  });

  it('loads the watchlist page', () => {
    cy.contains('Watchlist').should('be.visible');
  });

  it('displays watchlist items', () => {
    cy.get('table').should('exist');
    cy.get('table tbody tr').should('have.length.at.least', 1);
  });

  it('has an add stock form', () => {
    cy.get('input[placeholder*="symbol" i]').should('exist');
    cy.get('button').contains(/add/i).should('exist');
  });

  it('can remove a watchlist item', () => {
    cy.get('table tbody tr')
      .first()
      .find('button')
      .contains(/remove|delete|×/i)
      .should('exist');
  });
});
