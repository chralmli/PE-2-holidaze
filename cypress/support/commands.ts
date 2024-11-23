declare namespace Cypress {
  interface Chainable<Subject = any> {
    register(username: string, email: string, password: string): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
    bookVenue(venueId: string, dateFrom: string, dateTo: string, guests: number): Chainable<void>;
  }
}

// Register command
Cypress.Commands.add('register', (username: string, email: string, password: string) => {
  cy.visit('/register');
  cy.get('[data-testid="register-username"]').type(username);
  cy.get('[data-testid="register-email"]').type(email);
  cy.get('[data-testid="register-password"]').type(password);
  cy.get('[data-testid="register-submit"]').click();
});

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[data-testid="login-email"]').type(email);
  cy.get('[data-testid="login-password"]').type(password);
  cy.get('[data-testid="login-submit"]').click();
});

// Book venue command
Cypress.Commands.add('bookVenue', (venueId: string, dateFrom: string, dateTo: string, guests: number) => {
  cy.visit(`/venues/${venueId}`);
  cy.get('[data-testid="date-from"]').type(dateFrom);
  cy.get('[data-testid="date-to"]').type(dateTo);
  cy.get('[data-testid="guests"]').type(guests.toString());
  cy.get('[data-testid="submit-booking"]').click();
});