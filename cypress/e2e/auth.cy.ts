describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should register a new user', () => {
    const username = `testuser_${Date.now()}`
    const email =`${username}@stud.noroff.no`
    const password = 'TestPassword123'

    cy.register(username, email, password)
    cy.wait(1000)
    cy.url().should('include', '/login')
    cy.contains('Registration successful').should('be.visible')
  })

  it('should login a user', () => {
    const email = 'existing@stud.noroff.no'
    const password = 'ExistingPassword123'

    cy.login(email, password)
    cy.url().should('include', '/profile')
    cy.get('[data-testid="user-profile"]').should('exist')
  })

  it('should display validation errors', () => {
    cy.visit('/register')
    cy.get('button[type="submit"]').click()
    cy.contains('Email must be a valid stud.noroff.no address').should('be.visible')
  })
})