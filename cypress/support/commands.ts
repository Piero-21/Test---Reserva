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

Cypress.Commands.add("resetMockDB", () => {
  localStorage.removeItem("reservapro_db_v3_stable");
  localStorage.removeItem("reservapro_auth_v1");
});

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/#/login");
  cy.wait(1000); // Esperar a que la página de login cargue
  cy.get('[data-cy="login-email"]').clear().type(email);
  cy.get('[data-cy="login-password"]')
    .clear()
    .type(password || "password123");
  cy.get('[data-cy="login-submit"]').click();
  // Esperar a que se complete la navegación post-login
  cy.wait(2000);
});

Cypress.Commands.add("loginAsSuperAdmin", () => {
  cy.login("admin@reservapro.com", "adminpassword");
  cy.wait(1000);
  cy.location("hash").should("include", "/admin/dashboard");
});

Cypress.Commands.add("loginAsProfessional", () => {
  cy.login("roberto@saludplus.com", "propassword");
  cy.wait(1000);
  cy.location("hash").should("include", "/pro/dashboard");
});

Cypress.Commands.add("loginAsClient", () => {
  cy.login("juan@gmail.com", "clientpassword");
  cy.wait(1000);
  cy.location("hash").should("include", "/client/dashboard");
});

Cypress.Commands.add("logout", () => {
  // Soporta ambos layouts: Dashboard (Header con menu) y ClientLayout (boton directo)
  cy.get("body").then(($body) => {
    if ($body.find('[data-cy="user-menu-button"]').length > 0) {
      cy.get('[data-cy="user-menu-button"]').click({ force: true });
      cy.wait(300);
    }
  });

  cy.get('[data-cy="logout-button"]').click({ force: true });

  cy.wait(2000);

  // Validar hash en vez de URL completa para evitar ruido por redirects del servidor
  cy.location("hash").should("eq", "#/");
});

export {};
