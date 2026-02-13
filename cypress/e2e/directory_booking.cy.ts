
describe('Directory and Booking Flow', () => {
  beforeEach(() => {
    cy.loginAsClient();
  });

  it('professional visibility toggle affects directory', () => {
    // 1. Hide professional as Admin
    cy.logout();
    cy.loginAsSuperAdmin();
    // Locate the first tenant and toggle its visibility (assuming its visible initially)
    cy.contains('Clinica Salud Plus').parents('tr').find('button').contains('Visible').click();
    cy.contains('Oculto').should('be.visible');
    
    // 2. Check directory as Client
    cy.logout();
    cy.visit('/#/directory');
    cy.contains('Clinica Salud Plus').should('not.exist');

    // 3. Show professional again as Admin
    cy.visit('/#/login');
    cy.get('[data-cy="demo-admin"]').click();
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Clinica Salud Plus').parents('tr').find('button').contains('Oculto').click();
    cy.contains('Visible').should('be.visible');
    
    // 4. Verify in directory
    cy.visit('/#/directory');
    cy.contains('Clinica Salud Plus').should('be.visible');
  });

  it('successfully books an appointment', () => {
    cy.visit('/#/directory');
    cy.contains('Clinica Salud Plus').parents('div[data-cy]').find('a').contains('Ver Perfil').click();
    
    // Select Service
    cy.contains('Consulta General').click();
    // Select Slot
    cy.get('button').contains('10:00').first().click();
    // Confirm
    cy.get('button').contains('Confirmar Reserva').click();
    
    // Verify in dashboard
    cy.url().should('include', '/client/dashboard');
    cy.get('table').contains('Consulta General').should('be.visible');
  });

  it('shows 409 conflict when slot is already busy', () => {
    // Note: In MockDB 'Juan Perez' already has a booking at 09:00 for p1
    cy.visit('/#/booking/p1');
    cy.contains('Consulta General').click();
    
    // Force set the date to a known booked date if necessary, 
    // but MockDB has a booking for '2024-06-20' at '09:00'
    cy.get('input[type="date"]').type('2024-06-20');
    cy.get('button').contains('09:00').click();
    
    cy.get('button').contains('Confirmar Reserva').click();
    cy.get('[data-cy="booking-error"]', { timeout: 10000 }).should('be.visible');
    cy.contains('El horario ya se encuentra ocupado').should('be.visible');
  });
});
