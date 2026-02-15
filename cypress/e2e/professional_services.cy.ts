
describe('Gestión comercial del profesional', () => {
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

  it('gestiona servicios correctamente (CRUD)', () => {
    goToHash('#/pro/services');
    
    // Create
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Cypress Testing Service');
    cy.get('[data-cy="service-desc-input"]').type('Descripton for service');
    cy.get('[data-cy="service-price-input"]').type('99');
    cy.get('[data-cy="service-duration-input"]').type('45');
    cy.get('[data-cy="save-service-btn"]').click();
    cy.contains('Cypress Testing Service').should('be.visible');

    // Deactivate
    cy.on('window:confirm', () => true);
    cy.contains('Cypress Testing Service').parents('[data-cy^="service-card"]').find('button').last().click();
    cy.contains('Cypress Testing Service').should('not.exist');
  });

  it('gestiona clientes correctamente', () => {
    goToHash('#/pro/clients');
    cy.contains('+ Agregar Cliente').click();
    cy.get('input[placeholder="Ej: Juan Pérez"]').type('Manual New Client');
    cy.get('input[placeholder="+54 9 11..."]').type('5551234');
    cy.contains('button', 'Guardar Ficha').click();
    cy.contains('Manual New Client').should('be.visible');
  });
});
