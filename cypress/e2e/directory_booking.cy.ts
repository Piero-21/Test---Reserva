describe("Flujo de directorio y reservas", () => {
  const goToHash = (hash: string) => {
    cy.window().then((win) => {
      win.location.hash = hash;
    });
    cy.location("hash").should("eq", hash);
  };

  const loginFromCurrentPage = (email: string, password: string) => {
    goToHash("#/login");
    cy.get('[data-cy="login-email"]').clear().type(email);
    cy.get('[data-cy="login-password"]').clear().type(password);
    cy.get('[data-cy="login-submit"]').click();
  };

  beforeEach(() => {
    cy.resetMockDB();
    cy.loginAsClient();
  });

  it("cambiar visibilidad del profesional afecta el directorio", () => {
    cy.logout();
    loginFromCurrentPage("admin@reservapro.com", "adminpassword");
    cy.location("hash").should("include", "/admin/dashboard");
    cy.contains("Clinica Salud Plus")
      .parents("tr")
      .find("button")
      .contains("Visible")
      .click();
    cy.contains("Oculto").should("be.visible");

    cy.logout();
    loginFromCurrentPage("juan@gmail.com", "clientpassword");
    cy.location("hash").should("include", "/client/dashboard");
    goToHash("#/directory");
    cy.contains("Clinica Salud Plus").should("not.exist");

    cy.logout();
    loginFromCurrentPage("admin@reservapro.com", "adminpassword");
    cy.contains("Clinica Salud Plus")
      .parents("tr")
      .find("button")
      .contains("Oculto")
      .click();
    cy.contains("Visible").should("be.visible");
  });

  it("reserva una cita correctamente", () => {
    goToHash("#/directory");
    cy.get('[data-cy="professional-card-p1"]')
      .find('[data-cy="view-profile-btn"]')
      .click();
    cy.contains("a", "Reservar").first().click();
    cy.location("hash").should("include", "/p/p1/book");

    cy.contains("button", /^\d{2}:\d{2}$/)
      .first()
      .click();
    cy.contains("button", "Continuar").click();
    cy.contains("button", "Confirmar y Reservar").click();

    cy.contains("¡Reserva Exitosa!").should("be.visible");
    cy.location("hash", { timeout: 10000 }).should(
      "include",
      "/client/dashboard",
    );
  });

  it("muestra conflicto 409 cuando el horario ya está ocupado", () => {
    let selectedDate = "";
    let selectedTime = "";

    goToHash("#/directory");
    cy.get('[data-cy="professional-card-p1"]')
      .find('[data-cy="view-profile-btn"]')
      .click();
    cy.contains("a", "Reservar").first().click();
    cy.location("hash").should("include", "/p/p1/book");

    cy.get('input[type="date"]')
      .invoke("val")
      .then((v) => {
        selectedDate = String(v);
      });

    cy.contains("button", /^\d{2}:\d{2}$/)
      .first()
      .then(($btn) => {
        selectedTime = $btn.text().trim();
        cy.wrap($btn).click();
      });

    cy.contains("button", "Continuar").click();

    cy.window().then((win) => {
      const raw = win.localStorage.getItem("reservapro_db_v3_stable");
      expect(raw).to.not.be.null;
      const db = JSON.parse(raw as string);
      db.appointments.push({
        id: `a-conflict-${Date.now()}`,
        professionalId: "p1",
        clientId: "u-conflict",
        clientName: "Cliente Conflicto",
        serviceId: "s1",
        serviceName: "Consulta General",
        date: selectedDate,
        startTime: selectedTime,
        status: "CONFIRMED",
        predictionScore: 0.5,
      });
      win.localStorage.setItem("reservapro_db_v3_stable", JSON.stringify(db));
    });

    cy.contains("button", "Confirmar y Reservar").click();
    cy.get('[data-cy="booking-error"]').should("be.visible");
    cy.contains("El horario ya se encuentra ocupado").should("be.visible");
  });
});
