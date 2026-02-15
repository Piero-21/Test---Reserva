
describe('Pruebas del módulo profesional', () => {
  const goToHash = (hash: string) => {
    cy.window().then((win) => {
      win.location.hash = hash;
    });
    cy.location('hash').should('eq', hash);
  };

  beforeEach(() => {
    cy.resetMockDB();
    cy.intercept('POST', '**/generativelanguage.googleapis.com/**', {
      statusCode: 200,
      body: {},
    });
    cy.loginAsProfessional();
  });

  it('6) Crear servicio => aparece en lista', () => {
    goToHash('#/pro/services');
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Servicio Cypress');
    cy.get('[data-cy="service-desc-input"]').type('Desc');
    cy.get('[data-cy="service-price-input"]').clear().type('100');
    cy.get('[data-cy="service-duration-input"]').clear().type('45');
    cy.get('[data-cy="save-service-btn"]').click();
    
    cy.contains('Servicio Cypress').should('be.visible');
  });

  it('7) Crear cliente => aparece en lista', () => {
    goToHash('#/pro/clients');
    cy.contains('Agregar Cliente').click();
    cy.get('input[placeholder="Ej: Juan Pérez"]').type('Nuevo Cliente Cypress');
    cy.get('input[placeholder="+54 9 11..."]').type('12345678');
    cy.get('button').contains('Guardar Ficha').click();
    
    cy.contains('Nuevo Cliente Cypress').should('be.visible');
  });

  it('8) Crear reserva manual => aparece en agenda', () => {
    goToHash('#/pro/agenda');
    cy.get('[data-cy="open-manual-booking-btn"]').click();
    cy.get('[data-cy="manual-client-select"]').select('Juan Perez');
    cy.get('[data-cy="manual-service-select"]').select('s1');
    cy.get('[data-cy="manual-time-input"]').type('11:00');
    cy.get('[data-cy="manual-submit-btn"]').click();
    
    cy.contains('Juan Perez').should('be.visible');
    cy.contains('11:00').should('be.visible');
  });
});
