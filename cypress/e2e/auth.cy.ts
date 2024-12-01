describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
    // Handle ResizeObserver error
    cy.window().then((win) => {
      const resizeObserverLoopError = 'ResizeObserver loop completed with undelivered notifications.';
      cy.on('uncaught:exception', (err) => {
        if (err.message.includes(resizeObserverLoopError)) {
          return false;
        }
      });
    });
  });

  it('should register a new user', () => {
    const timestamp = Date.now().toString().slice(-8);
    const username = `testuser_${timestamp}`;
    const email =`${username}@stud.noroff.no`;
    const password = 'TestPassword123';

    cy.visit('/register');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();

    // Wait for the registration response and check URL and message
    cy.get('[data-testid="register-success"]', { timeout: 4000 }).should('be.visible');
    cy.url().should('include', '/login')
  });

  it('should login a user', () => {
    const timestamp = Date.now().toString().slice(-8);
    const username = `testuser_${timestamp}`;
    const email = `${username}@stud.noroff.no`;
    const password = 'TestPassword123'

    cy.request({
      method: 'POST',
      url: 'https://v2.api.noroff.dev/auth/register',
      headers: {
        'X-Noroff-ApiKey': Cypress.env('NOROFF_API_KEY')
      },
      body: {
        name: username,
        email: email,
        password: password
      },
    }).then(() => {
      cy.visit('/login');
      cy.get('[data-testid="login-email"]').type(email);
      cy.get('[data-testid="login-password"]').type(password);
      cy.get('[data-testid="login-submit"]').click();
  
      cy.url({ timeout: 10000 }).should('include', '/venues');
    })
  });

  it('should display validation errors', () => {
    cy.visit('/register');

    // clear any existing values
    cy.get('input[name="username"]').clear();
    cy.get('input[name="email"]').clear();
    cy.get('input[name="password"]').clear();

    // click submit and check for error
    cy.get('[data-testid="register-submit"]').click();

    // Wait for the error message and verify its content
    cy.get('[data-testid="register-error"]')
      .should('exist')
      .should('be.visible')
      .and('have.text', 'Username is required');
  });
});
