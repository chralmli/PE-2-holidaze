describe('Venues', () => {
  beforeEach(() => {
    cy.visit('/venues')
  })

  it('should display venues', () => {
    cy.get('[data-testid="venue-card"]').should('have.length.at.least', 1)
  })

  it('should filter venues', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="price-filter"]').type('100')
    cy.get('[data-testid="apply-filters"]').click()
    cy.get('[data-testid="venue-card"]').should('exist')
    })

    it('should search venues', () => {
      cy.get('[data-testid="search-input"]').type('Oslo')
      // Wait for search results
      cy.wait(1000)
      cy.get('[data-testid="venue-card"]').should('exist')
    })

    describe('Venue details', () => {
      it('should display venue details', () => {
        cy.get('[data-testid="venue-card"]').first().click()
        cy.url().should('include', '/venues/')
        cy.get('[data-testid="venue-title"]').should('exist')
        cy.get('[data-testid="venue-description"]').should('exist')
        cy.get('[data-testid="booking-form"]').should('exist')
      })
    })
})