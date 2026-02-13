
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      login(email: string, password?: string): Chainable<void>;
      resetMockDB(): Chainable<void>;
      logout(): Chainable<void>;
      loginAsSuperAdmin(): Chainable<void>;
      loginAsProfessional(): Chainable<void>;
      loginAsClient(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('resetMockDB', () => {
  localStorage.removeItem('reservapro_db_v3_stable');
  localStorage.removeItem('reservapro_auth_v1');
});

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/#/login');
  cy.get('[data-cy="login-email"]').clear().type(email);
  cy.get('[data-cy="login-password"]').clear().type(password);
  cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.login('admin@reservapro.com', 'adminpassword');
  cy.url().should('include', '/admin/dashboard');
});

Cypress.Commands.add('loginAsProfessional', () => {
  cy.login('roberto@saludplus.com', 'propassword');
  cy.url().should('include', '/pro/dashboard');
});

Cypress.Commands.add('loginAsClient', () => {
  cy.login('juan@gmail.com', 'clientpassword');
  cy.url().should('include', '/client/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu-button"]').click();
  cy.get('[data-cy="logout-button"]').click();
  // El logout ahora debe redirigir a la raíz (Landing Page)
  cy.url().should('eq', Cypress.config().baseUrl + '/#/');
});

export {};
