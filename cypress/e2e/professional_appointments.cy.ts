
describe('Professional Agenda Management', () => {
  beforeEach(() => {
    cy.loginAsProfessional();
    cy.contains('Agenda Maestra').click();
  });

  it('updates appointment status', () => {
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

  it('creates a manual booking successfully', () => {
    cy.get('[data-cy="open-manual-booking-btn"]').click();
    cy.get('[data-cy="manual-client-select"]').select('Juan Perez');
    cy.get('[data-cy="manual-service-select"]').select('Consulta General');
    cy.get('[data-cy="manual-date-input"]').type('2025-12-25');
    cy.get('[data-cy="manual-time-input"]').type('11:00');
    cy.get('[data-cy="manual-submit-btn"]').click();
    
    cy.contains('Juan Perez').should('be.visible');
    cy.contains('11:00').should('be.visible');
  });
});
