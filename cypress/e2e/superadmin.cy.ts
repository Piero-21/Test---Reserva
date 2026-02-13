
describe('Super Admin Dashboard', () => {
  beforeEach(() => {
    cy.loginAsSuperAdmin();
  });

  it('monitors global metrics', () => {
    cy.contains('Total Tenants').should('be.visible');
    cy.contains('Ingresos Mensuales').should('be.visible');
  });

  it('manages professional subscriptions', () => {
    cy.contains('Clinica Salud Plus').parents('tr').within(() => {
      cy.get('span').contains('ACTIVE').should('be.visible');
      cy.contains('Suspender').click();
      cy.get('span').contains('SUSPENDED').should('be.visible');
      cy.contains('Activar').click();
      cy.get('span').contains('ACTIVE').should('be.visible');
    });
  });
});
