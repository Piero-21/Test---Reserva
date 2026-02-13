
describe('Client Module Tests', () => {
  beforeEach(() => {
    cy.resetMockDB();
    cy.loginAsClient();
  });

  it('9) Buscar profesional en directorio', () => {
    cy.visit('/#/directory');
    cy.get('input[placeholder="Buscar por nombre o clínica..."]').type('Clinica Salud Plus');
    cy.get('[data-cy="professional-card-p1"]').should('be.visible');
    
    cy.get('input[placeholder="Buscar por nombre o clínica..."]').clear().type('MentalCare');
    cy.get('[data-cy="professional-card-p2"]').should('be.visible');
    cy.get('[data-cy="professional-card-p1"]').should('not.exist');
  });

  it('10) Reservar cita => si el slot está ocupado => muestra error (409)', () => {
    // In MockDB, Juan Perez (our current user) already has a booking for 'p1' today at '09:00'
    cy.visit('/#/directory');
    cy.get('[data-cy="professional-card-p1"]').find('[data-cy="view-profile-btn"]').click();
    
    // Select Service
    cy.contains('Consulta General').click();
    
    // Select the already occupied slot 09:00
    // Note: The UI might hide occupied slots if we used getAvailableTimes correctly, 
    // but we want to test the 409 error handling if the request is made.
    // In our MockApiClient, we have an appointment at 09:00 for p1 on Date.today()
    cy.get('button').contains('09:00').click();
    
    cy.get('button').contains('Confirmar Reserva').click();
    
    // Verify conflict error message
    cy.contains('El horario ya se encuentra ocupado').should('be.visible');
  });
});
