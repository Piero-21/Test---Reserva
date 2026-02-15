describe('Pruebas E2E de reservas SaaS', () => {
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
  });

  it('1) Inicio de sesión exitoso', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('roberto@saludplus.com');
    cy.get('[data-cy="login-password"]').clear().type('propassword');
    cy.get('[data-cy="login-submit"]').click();
    cy.location('hash').should('include', '/pro/dashboard');
    cy.contains('Panel de Gestión').should('be.visible');
  });

  it('2) Inicio de sesión inválido', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').clear().type('wrong@email.com');
    cy.get('[data-cy="login-password"]').clear().type('wrongpassword');
    cy.on('window:alert', (str: string) => {
      expect(str).to.equal('Credenciales inválidas para la demo.');
    });
    cy.get('[data-cy="login-submit"]').click();
  });

  it('3) Profesional crea servicio', () => {
    cy.loginAsProfessional();
    goToHash('#/pro/services');
    cy.get('[data-cy="create-service-btn"]').click();
    cy.get('[data-cy="service-name-input"]').type('Nuevo Test Service');
    cy.get('[data-cy="service-desc-input"]').type('Descripción del servicio de prueba');
    cy.get('[data-cy="service-price-input"]').clear().type('150');
    cy.get('[data-cy="service-duration-input"]').clear().type('60');
    cy.get('[data-cy="save-service-btn"]').click();
    cy.contains('Nuevo Test Service').should('be.visible');
  });

  it('4) Cliente reserva cita', () => {
    cy.loginAsClient();
    goToHash('#/directory');

    cy.get('[data-cy="professional-card-p1"]').within(() => {
      cy.get('[data-cy="view-profile-btn"]').click();
    });
    cy.contains('a', 'Reservar').first().click();
    cy.location('hash').should('include', '/p/p1/book');

    cy.contains('button', /^\d{2}:\d{2}$/).first().click();
    cy.contains('button', 'Continuar').click();
    cy.contains('button', 'Confirmar y Reservar').click();

    cy.contains('¡Reserva Exitosa!').should('be.visible');
    cy.location('hash', { timeout: 10000 }).should('include', '/client/dashboard');
  });

  it('5) No permitir doble reserva (conflicto)', () => {
    let selectedDate = '';
    let selectedTime = '';

    cy.loginAsClient();
    goToHash('#/directory');
    cy.get('[data-cy="professional-card-p1"]').find('[data-cy="view-profile-btn"]').click();
    cy.contains('a', 'Reservar').first().click();
    cy.location('hash').should('include', '/p/p1/book');

    cy.get('input[type="date"]').invoke('val').then((v) => {
      selectedDate = String(v);
    });

    cy.contains('button', /^\d{2}:\d{2}$/).first().then(($btn) => {
      selectedTime = $btn.text().trim();
      cy.wrap($btn).click();
    });

    cy.contains('button', 'Continuar').click();

    cy.window().then((win) => {
      const raw = win.localStorage.getItem('reservapro_db_v3_stable');
      expect(raw).to.not.be.null;
      const db = JSON.parse(raw as string);
      db.appointments.push({
        id: `a-conflict-${Date.now()}`,
        professionalId: 'p1',
        clientId: 'u-conflict',
        clientName: 'Cliente Conflicto',
        serviceId: 's1',
        serviceName: 'Consulta General',
        date: selectedDate,
        startTime: selectedTime,
        status: 'CONFIRMED',
        predictionScore: 0.5,
      });
      win.localStorage.setItem('reservapro_db_v3_stable', JSON.stringify(db));
    });

    cy.contains('button', 'Confirmar y Reservar').click();
    cy.get('[data-cy="booking-error"]').should('be.visible');
    cy.contains('El horario ya se encuentra ocupado').should('be.visible');
  });

  it('6) Profesional marca cita como ausente', () => {
    cy.loginAsProfessional();
    goToHash('#/pro/agenda');

    cy.get('[data-cy="appointment-table"]').within(() => {
      cy.get('[data-cy^="appointment-card-"]').first().within(() => {
        cy.contains('No-Show').click({ force: true });
      });
    });

    cy.contains('NOSHOW').should('be.visible');
  });
});

export {};
