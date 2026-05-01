describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('loads the dashboard page', () => {
    cy.contains('FinBoard').should('be.visible');
    cy.contains('Dashboard').should('be.visible');
  });

  it('displays the market ticker', () => {
    cy.get('[data-testid="market-ticker"]').should('exist');
    cy.get('[data-testid="market-ticker"]')
      .find('[data-testid="ticker-item"]')
      .should('have.length.at.least', 1);
  });

  it('shows portfolio summary', () => {
    cy.get('[data-testid="portfolio-summary"]').should('exist');
    cy.contains('Portfolio').should('be.visible');
  });

  it('shows watchlist widget', () => {
    cy.get('[data-testid="watchlist-widget"]').should('exist');
  });

  it('navigates to market overview', () => {
    cy.get('nav').contains('Market').click();
    cy.url().should('include', '/market');
    cy.get('table').should('exist');
  });

  it('navigates to stock detail from market', () => {
    cy.get('nav').contains('Market').click();
    cy.get('table tbody tr').first().click();
    cy.url().should('include', '/stock/');
  });
});
