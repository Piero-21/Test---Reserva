describe("Pruebas del módulo cliente", () => {
  beforeEach(() => {
    cy.resetMockDB();
    cy.loginAsClient();
  });

  it("9) Buscar profesional en directorio", () => {
    cy.window().then((win) => {
      win.location.hash = "#/directory";
    });
    cy.location("hash").should("eq", "#/directory");
    cy.get('input[placeholder="Buscar por nombre o clínica..."]').type(
      "Clinica Salud Plus",
    );
    cy.get('[data-cy="professional-card-p1"]').should("be.visible");

    cy.get('input[placeholder="Buscar por nombre o clínica..."]')
      .clear()
      .type("MentalCare");
    cy.get('[data-cy="professional-card-p2"]').should("be.visible");
    cy.get('[data-cy="professional-card-p1"]').should("not.exist");
  });

  it("10) Reservar cita => si el slot está ocupado => muestra error (409)", () => {
    let selectedDate = "";
    let selectedTime = "";

    cy.window().then((win) => {
      win.location.hash = "#/directory";
    });
    cy.location("hash").should("eq", "#/directory");
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
