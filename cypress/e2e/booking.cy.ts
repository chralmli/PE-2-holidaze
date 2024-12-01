interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

describe('Booking Process', () => {
  let testVenueId: string;
  let testUserEmail: string;
  let testUserPassword: string;
  let availableStartDate: string;
  let availableEndDate: string;

  const formatDateToNorwegian = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}.${day}.${year}`;
  }

  before(() => {
    const timestamp = Date.now().toString().slice(-8);
    const username = `tester${timestamp}`;
    testUserEmail = `${username}@stud.noroff.no`;
    testUserPassword = 'TestPassword123';

    // Register test user
    cy.request({
      method: 'POST',
      url: 'https://v2.api.noroff.dev/auth/register',
      headers: {
        'X-Noroff-API-Key': Cypress.env('VITE_API_KEY')
      },
      body: {
        name: username,
        email: testUserEmail,
        password: testUserPassword,
        avatar: { 
          url: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0', 
          alt: 'Test Avatar' 
        },
        venueManager: false
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
  });

  // Get a venue ID and check its availability
  cy.request({
    method: 'GET',
    url: 'https://v2.api.noroff.dev/holidaze/venues',
    headers: {
      'X-Noroff-API-Key': Cypress.env('VITE_API_KEY')
    }
  }).then((response) => {
    expect(response.status).to.eq(200);
    testVenueId = response.body.data[0].id;

    // Get venue details including bookings
    cy.request({
      method: 'GET',
      url: `https://v2.api.noroff.dev/holidaze/venues/${testVenueId}?_bookings=true&_owner=true`,
      headers: {
        'X-Noroff-API-Key': Cypress.env('VITE_API_KEY')
      }
    }).then((venueResponse) => {
      const bookings: Booking[] = venueResponse.body.data.bookings || [];

      // Sort bookings by date
      bookings.sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime());

      let startDate = new Date();
      startDate.setDate(startDate.getDate() + 7);
      startDate.setHours(0, 0, 0, 0);

      let foundDates = false;
      let attempts = 0;
      const maxAttempts = 180;

      let testStart = new Date(startDate);
      let testEnd = new Date(testStart);
      testEnd.setDate(testEnd.getDate() + 2);

      while (!foundDates && attempts < maxAttempts) {
        const isBooked = bookings.some((booking) => {
          const bookingStart = new Date(booking.dateFrom);
          const bookingEnd = new Date(booking.dateTo);

          bookingStart.setHours(0, 0, 0, 0);
          bookingEnd.setHours(0, 0, 0, 0);

          const hasOverlap = (
            (testStart <= bookingEnd && testEnd >= bookingStart) ||
            (bookingStart <= testEnd && bookingEnd >= testStart)
          );

          if (hasOverlap) {
            cy.log(`Date conflict with booking: ${booking.dateFrom} - ${booking.dateTo}`);
          }

          return hasOverlap;
        });

        if (!isBooked) {
          // Double check by looking at nearby dates
          const hasNearbyBookings = bookings.some((booking) => {
            const bookingStart = new Date(booking.dateFrom);
            bookingStart.setHours(0, 0, 0, 0);

            const daysBeforeBooking = Math.abs((testStart.getTime() - bookingStart.getTime()) / (1000 * 60 * 60 * 24));
            return daysBeforeBooking < 3;
          });

          if (!hasNearbyBookings) {
            foundDates = true;
            availableStartDate = formatDateToNorwegian(testStart);
            availableEndDate = formatDateToNorwegian(testEnd);
            cy.log(`Found available dates: ${availableStartDate} - ${availableEndDate}`);
          }
        }

        if (!foundDates) {
          testStart.setDate(testStart.getDate() + 1);
          testEnd = new Date(testStart);
          testEnd.setDate(testEnd.getDate() + 2);
          attempts++;
        }
      }

      if (!foundDates) {
        cy.log('No available dates found. Current bookings:');
        bookings.forEach((booking) => {
          cy.log(`Booking: ${booking.dateFrom} - ${booking.dateTo}`);
        });
      }

      expect(foundDates, 'Could not find any available dates').to.be.true;
    });
  });
});

  beforeEach(() => {
    cy.login(testUserEmail, testUserPassword);
  });

  it('should book a venue if dates are available', () => {
    if (!availableStartDate || !availableEndDate) {
      cy.log(`skipping booking as no available dates were found`);
      return
    }

    cy.intercept('POST', '**/holidaze/bookings').as('createBooking');

    cy.visit(`/venue/${testVenueId}`);
    cy.wait(3000);

    // Wait for <the form to be visible first
    cy.get('[data-testid="booking-form"]')
      .scrollIntoView()
      .should('be.visible')
      .should('exist')
      .within(() => {
        cy.get('input[data-testid="date-from-input"]').type(availableStartDate, { delay: 100});
        cy.get('input[data-testid="date-to-input"]').type(availableEndDate, { delay: 100});
        cy.get('input[data-testid="guests-input"]').clear().type('2');
      })

    cy.wait(500);
    cy.get('[data-testid="submit-booking"]').click();

    cy.wait('@createBooking', { timeout: 5000 }).then((interception) => {
      if (!interception.response) {
        throw new Error('Booking request did not return a response');
      }

      const statusCode = interception.response.statusCode;
      cy.log(`Booking response status: ${statusCode}`);

      if (interception.response.statusCode === 409) {
        cy.log('Booking conflict detected:', interception.response.body);
      } else if (statusCode === 201) {
        cy.get('[data-testid="booking-success"]').should('be.visible').and('contain', 'Booking confirmed');
      } else {
        cy.get('[data-testid="booking-error"]').then(($error) => {
          throw new Error(`Booking failed: ${$error.text()}`);
        });
      }
    });

    // Check for either success or error message
    cy.get('body').then($body => {
      if ($body.find('[data-testid="booking-success"]').length) {
        cy.get('[data-testid="booking-success"]')
         .should('be.visible')
         .and('contain', 'Booking confirmed');
      } else {
        cy.get('[data-testid="booking-error"]').then($error => {
          throw new Error(`Booking failed: ${$error.text()}`);
      });
      }
    });
  });
  
  it('should show validation errors for invalid dates', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const laterDate = formatDateToNorwegian(futureDate);

    const earlierDate = formatDateToNorwegian(new Date(futureDate.setDate(futureDate.getDate() - 2)));

    cy.visit(`/venue/${testVenueId}`);
    
    // Fill booking form with invalid dates
    cy.get('[data-testid="booking-form"]').scrollIntoView().should('be.visible');

    cy.get('input[data-testid="date-from-input"]')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(laterDate);

    cy.get('input[data-testid="date-to-input"]')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(earlierDate);

    cy.get('input[data-testid="guests-input"]')
    .scrollIntoView()
    .should('be.visible')
    .clear()
    .type('2');

    cy.get('[data-testid="submit-booking"]')
    .scrollIntoView()
    .should('be.visible')
    .click();

    // Verify validation error
    cy.get('[data-testid="booking-error"]')
      .should('be.visible')
      .and('contain', 'Check-out date must be after the check-in date');
  });
  
  it('should show my bookings in profile', () => {
    cy.wait(2000);
    cy.visit('/profile');

    cy.wait(2000);

    cy.get('[data-testid="booking-card"]')
      .should('exist')
      .should('be.visible')
      .within(() => {
        cy.get('h5').should('exist');
        cy.get('img').should('exist');
      });
  });
});
  