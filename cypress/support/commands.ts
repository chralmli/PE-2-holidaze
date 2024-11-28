declare namespace Cypress {
  interface Chainable<Subject = any> {
    register(username: string, email: string, password: string): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
    bookVenue(venueId: string, dateFrom: string, dateTo: string, guests: number): Chainable<void>;
  }
}

// Register command
Cypress.Commands.add('register', (username: string, email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'https://v2.api.noroff.dev/auth/register',
    body: {
      name: username,
      email: email,
      password: password
    },
    headers: {
      'X-Noroff-ApiKey': Cypress.env('VITE_API_KEY')
    }
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'https://v2.api.noroff.dev/auth/login',
    body: {
      email: email,
      password: password
    },
    headers: {
      'X-Noroff-ApiKey': Cypress.env('VITE_API_KEY')
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    window.localStorage.setItem('accessToken', response.body.data.accessToken);
    window.localStorage.setItem('user', JSON.stringify(response.body.data));
  });

  cy.visit('/venues');
});

// Book venue command
Cypress.Commands.add('bookVenue', (venueId: string, dateFrom: string, dateTo: string, guests: number) => {
  cy.visit(`/venues/${venueId}`);
  cy.get('[data-testid="date-from"]').type(dateFrom);
  cy.get('[data-testid="date-to"]').type(dateTo);
  cy.get('[data-testid="guests"]').type(guests.toString());
  cy.get('[data-testid="submit-booking"]').click();
});