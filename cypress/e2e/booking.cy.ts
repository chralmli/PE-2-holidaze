describe('Booking Process', () => {
  let testVenueId: string;

  before(() => {
    // Option 1: Using a fixture
    cy.fixture('venue.json').then((venue) => {
      testVenueId = venue.id;
    });
  });
  
  beforeEach(() => {
    // Login before each test
    cy.login('testuser@stud.noroff.no', 'TestPassword123');
  });
  
  it('should book a venue', () => {
    // Navigate to the venue using the stored ID
    cy.visit(`/venues/${testVenueId}`);

    // Fill booking form
    cy.get('[data-testid="date-from"]').type('2025-05-01');
    cy.get('[data-testid="date-to"]').type('2025-05-03');
    cy.get('[data-testid="guests"]').type('1');
    cy.get('[data-testid="submit-booking"]').click();

    // Verify booking confirmation
    cy.contains('Booking confirmed').should('be.visible');
    cy.url().should('include', '/bookings');
  });
  
  it('should show validation errors for invalid dates', () => {
    cy.visit(`/venues/${testVenueId}`);
    
    // Fill booking form with invalid dates
    cy.get('[data-testid="date-from"]').type('2025-05-03');
    cy.get('[data-testid="date-to"]').type('2025-05-01');
    cy.get('[data-testid="submit-booking"]').click();

    // Verify validation error
    cy.contains('Check-out date must be after check-in date').should('be.visible');
  });
  
  it('should show my bookings in profile', () => {
    cy.visit('/profile');
    cy.get('[data-testid="bookings-card"]').should('exist');
  });
});
  