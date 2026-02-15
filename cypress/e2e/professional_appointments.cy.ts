
describe('Gestión de agenda profesional', () => {
  beforeEach(() => {
    cy.resetMockDB();
    cy.intercept('POST', '**/generativelanguage.googleapis.com/**', {
      statusCode: 200,
      body: {},
    });
    cy.loginAsProfessional();
    cy.contains('Agenda Maestra').click();
  });

  it('actualiza el estado de una cita', () => {
    // Find a pending appointment (Mock DB starts with a confirmed one, but we can filter or use existing)
    // For this test we assume there's at least one appointment card
    cy.get('[data-cy^="appointment-card-"]').first().within(() => {
      // If confirmed, mark completed
      if (Cypress.$('button:contains("Completar")').length > 0) {
        cy.get('[data-cy="btn-complete"]').click();
      }
    });
    cy.contains('COMPLETED').should('be.visible');
  });

  it('crea una reserva manual correctamente', () => {
    cy.get('[data-cy="open-manual-booking-btn"]').click();
    cy.get('[data-cy="manual-client-select"]').select('Juan Perez');
    cy.get('[data-cy="manual-service-select"]').select('s1');
    cy.get('[data-cy="manual-date-input"]').clear().type('2025-12-25');
    cy.get('[data-cy="manual-time-input"]').clear().type('11:00');
    cy.get('[data-cy="manual-submit-btn"]').click();
    
    cy.contains('Juan Perez').should('be.visible');
    cy.contains('11:00').should('be.visible');
  });
});
