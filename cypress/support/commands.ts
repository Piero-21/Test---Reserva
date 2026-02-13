
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
  // Matches the DB_KEY in api/mockClient.ts
  localStorage.removeItem('reservapro_db_v3_stable');
  localStorage.removeItem('reservapro_auth_v1');
});

Cypress.Commands.add('login', (email, password = 'password123') => {
  cy.visit('/#/login');
  cy.get('[data-cy="login-email"]').clear().type(email);
  cy.get('input[type="password"]').clear().type(password);
  cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add('loginAsSuperAdmin', () => {
  cy.login('admin@reservapro.com');
  cy.url().should('include', '/admin/dashboard');
});

Cypress.Commands.add('loginAsProfessional', () => {
  cy.login('roberto@saludplus.com');
  cy.url().should('include', '/pro/dashboard');
});

Cypress.Commands.add('loginAsClient', () => {
  cy.login('juan@gmail.com');
  cy.url().should('include', '/client/dashboard');
});

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy="user-menu-button"]').click();
  cy.get('[data-cy="logout-button"]').click();
  cy.url().should('include', '/login');
});

export {};
