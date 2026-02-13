
// Removed failing reference types directive as it is not found in this environment

// Fix: Use global Cypress and Mocha/Chai variables directly as they are already available in the environment.
// This avoids "Cannot redeclare block-scoped variable" errors that occur when destructuring from window.

describe('SaaS Booking E2E Tests', () => {
  
  it('1) Login exitoso', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('roberto@saludplus.com');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/pro/dashboard');
    cy.contains('Roberto').should('be.visible');
  });

  it('2) Login inválido', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('wrong@email.com');
    // Fix: Using type assertion for string to ensure compatibility
    cy.on('window:alert', (str: string) => {
      expect(str).to.equal('Credenciales inválidas para la demo.');
    });
    cy.get('[data-cy="login-submit"]').click();
  });

  it('3) Profesional crea servicio', () => {
    // Fix: loginAsPro -> loginAsProfessional to match definition in cypress/support/commands.ts
    cy.loginAsProfessional();
    cy.contains('Servicios').click();
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Nuevo Test Service');
    cy.get('[data-cy="service-desc-input"]').type('Descripción del servicio de prueba');
    cy.get('[data-cy="service-price-input"]').type('150');
    cy.get('[data-cy="service-duration-input"]').type('60');
    cy.get('[data-cy="save-service-btn"]').click();
    cy.contains('Nuevo Test Service').should('be.visible');
  });

  it('4) Cliente reserva cita', () => {
    cy.loginAsClient();
    cy.contains('Reservar Nueva Cita').click();
    // Step 1: Select Tenant
    cy.get('[data-cy="tenant-select-t1"]').click();
    // Step 2: Select Service
    cy.get('[data-cy="service-select-s1"]').click();
    // Step 3: Select Slot
    cy.get('[data-cy="slot-btn-09:00"]').click();
    cy.get('[data-cy="confirm-booking-btn"]').click();
    // Verify Success
    cy.get('[data-cy="booking-success"]').should('be.visible');
    cy.get('[data-cy="go-to-my-appointments"]').click();
    cy.contains('Consulta General').should('be.visible');
  });

  it('5) No permitir doble reserva (conflict)', () => {
    // Attempt to book same slot already booked in previous test
    cy.loginAsClient();
    cy.contains('Reservar Nueva Cita').click();
    cy.get('[data-cy="tenant-select-t1"]').click();
    cy.get('[data-cy="service-select-s1"]').click();
    // Usually slot would be hidden, but we verify conflict logic in service
    // If we click it directly (forcing it)
    cy.get('[data-cy="slot-btn-09:00"]').should('not.exist'); 
    // This verifies conflict UI: the slot is gone if occupied.
  });

  it('6) Profesional marca como no-show', () => {
    // Fix: loginAsPro -> loginAsProfessional to match definition in cypress/support/commands.ts
    cy.loginAsProfessional();
    // Look for a confirmed appointment
    cy.get('[data-cy="appointment-table"]').within(() => {
      cy.get('[data-cy^="appointment-row-"]').first().within(() => {
        // Fix: Use contains to find the button since data-cy might be missing in component
        cy.contains('No-Show').click({ force: true });
      });
    });
    // Check analytics update
    cy.get('[data-cy="stat-noshow"]').should('not.have.text', '0');
  });

});

export {};
