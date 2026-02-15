describe("Pruebas de autenticación y guardias", () => {
  beforeEach(() => {
    cy.resetMockDB();
    // Stub de Gemini API para evitar errores
    cy.intercept("POST", "**/generativelanguage.googleapis.com/**", {
      statusCode: 200,
      body: {},
    });
  });

  it("1) Inicio de sesión falla con contraseña incorrecta", () => {
    cy.visit("/#/login");
    cy.get('[data-cy="login-email"]').type("roberto@saludplus.com");
    cy.get('input[type="password"]').type("wrongpassword");
    cy.on("window:alert", (str) => {
      expect(str).to.equal("Contraseña incorrecta.");
    });
    cy.get('[data-cy="login-submit"]').click();
  });

  it("2) Inicio de sesión correcto con credenciales válidas", () => {
    cy.login("roberto@saludplus.com", "propassword");
    cy.location("hash").should("include", "/pro/dashboard");
  });

  it("3) Registro crea usuario y luego inicio de sesión correcto", () => {
    const email = `newuser_${Date.now()}@test.com`;
    cy.visit("/#/register");
    cy.get('[data-cy="register-name"]').type("User Test");
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type("password123");
    cy.get('[data-cy="role-client-btn"]').click();
    cy.get('[data-cy="register-submit"]').click();

    cy.location("hash").should("include", "/client/dashboard");

    cy.logout();

    cy.location("hash").should("eq", "#/");
    cy.wait(1000);

    cy.window().then((win) => {
      win.location.hash = "#/login";
    });
    cy.get('[data-cy="login-email"]').clear().type(email);
    cy.get('[data-cy="login-password"]').clear().type("password123");
    cy.get('[data-cy="login-submit"]').click();
    cy.location("hash").should("include", "/client/dashboard");
  });

  it("4) Cliente no puede entrar a /pro/* (redirige)", () => {
    cy.loginAsClient();
    cy.wait(500);
    cy.window().then((win) => {
      win.location.hash = "#/pro/dashboard";
    });
    cy.wait(1000);
    cy.location("hash").should("eq", "#/");
  });

  it("5) Profesional no puede entrar a /admin/*", () => {
    cy.loginAsProfessional();
    cy.wait(500);
    cy.window().then((win) => {
      win.location.hash = "#/admin/dashboard";
    });
    cy.wait(1000);
    cy.location("hash").should("eq", "#/");
  });
});
