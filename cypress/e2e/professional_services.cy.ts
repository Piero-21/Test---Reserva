
describe('Professional Business Management', () => {
  beforeEach(() => {
    cy.loginAsProfessional();
  });

  it('manages services correctly (CRUD)', () => {
    cy.contains('Mis Servicios').click();
    
    // Create
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Cypress Testing Service');
    cy.get('[data-cy="service-desc-input"]').type('Descripton for service');
    cy.get('[data-cy="service-price-input"]').type('99');
    cy.get('[data-cy="service-duration-input"]').type('45');
    cy.get('[data-cy="save-service-btn"]').click();
    cy.contains('Cypress Testing Service').should('be.visible');

    // Deactivate
    cy.contains('Cypress Testing Service').parents('[data-cy^="service-card"]').find('button').last().click();
    cy.on('window:confirm', () => true);
    cy.contains('Cypress Testing Service').should('not.exist');
  });

  it('manages clients correctly', () => {
    cy.contains('Mis Clientes').click();
    cy.contains('+ Agregar Cliente Manual').click();
    cy.get('input[placeholder="Nombre"]').type('Manual New Client');
    cy.get('input[placeholder="Teléfono"]').type('5551234');
    cy.get('button').contains('Guardar Cliente').click();
    cy.contains('Manual New Client').should('be.visible');
  });
});
