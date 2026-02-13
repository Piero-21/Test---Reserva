
describe('SaaS Booking E2E Tests', () => {
  
  beforeEach(() => {
    cy.resetMockDB();
  });

  it('1) Login exitoso', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('roberto@saludplus.com');
    cy.get('input[type="password"]').clear().type('password123');
    cy.get('[data-cy="login-submit"]').click();
    cy.url().should('include', '/pro/dashboard');
    cy.contains('Roberto').should('be.visible');
  });

  it('2) Login inválido', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('wrong@email.com');
    cy.get('input[type="password"]').clear().type('wrongpassword');
    cy.on('window:alert', (str: string) => {
      expect(str).to.equal('Credenciales inválidas para la demo.');
    });
    cy.get('[data-cy="login-submit"]').click();
  });

  it('3) Profesional crea servicio', () => {
    cy.loginAsProfessional();
    cy.visit('/#/pro/services');
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Nuevo Test Service');
    cy.get('[data-cy="service-desc-input"]').type('Descripción del servicio de prueba');
    cy.get('[data-cy="service-price-input"]').clear().type('150');
    cy.get('[data-cy="service-duration-input"]').clear().type('60');
    cy.get('[data-cy="save-service-btn"]').click();
    cy.contains('Nuevo Test Service').should('be.visible');
  });

  it('4) Cliente reserva cita', () => {
    cy.loginAsClient();
    cy.contains('Reservar Nueva Cita').click();
    cy.url().should('include', '/directory');
    
    // Step 1: Select Professional
    cy.get('[data-cy="professional-card-p1"]').within(() => {
      cy.get('[data-cy="view-profile-btn"]').click();
    });
    
    // Step 2: Select Service
    cy.contains('Consulta General').click();
    
    // Step 3: Select Slot
    // We pick a slot that is not 09:00 (which is pre-booked in mock DB)
    cy.get('button').contains('10:00').click();
    
    cy.get('button').contains('Confirmar Reserva').click();
    
    // Verify Success
    cy.url().should('include', '/client/dashboard');
    cy.contains('Consulta General').should('be.visible');
    cy.contains('10:00').should('be.visible');
  });

  it('5) No permitir doble reserva (conflict)', () => {
    cy.loginAsClient();
    cy.visit('/#/p/p1'); // Go directly to p1 profile
    cy.contains('Consulta General').click();
    
    // The slot 09:00 is already booked in MockDB seed
    cy.get('button').contains('09:00').click();
    cy.get('button').contains('Confirmar Reserva').click();
    
    // Verify conflict error message
    cy.contains('El horario ya se encuentra ocupado').should('be.visible');
  });

  it('6) Profesional marca como no-show', () => {
    cy.loginAsProfessional();
    cy.visit('/#/pro/agenda');
    
    // Look for a confirmed/pending appointment card
    cy.get('[data-cy="appointment-table"]').within(() => {
      cy.get('[data-cy^="appointment-card-"]').first().within(() => {
        // If confirmed, mark no-show. Our seed has a confirmed app for p1.
        cy.contains('No-Show').click({ force: true });
      });
    });
    
    cy.contains('NOSHOW').should('be.visible');
  });

});

export {};
