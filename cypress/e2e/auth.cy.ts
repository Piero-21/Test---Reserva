
describe('Auth and Guard Tests', () => {
  beforeEach(() => {
    cy.resetMockDB();
  });

  it('1) Login falla con password incorrecto', () => {
    cy.visit('/#/login');
    cy.get('[data-cy="login-email"]').type('roberto@saludplus.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Contraseña incorrecta.');
    });
    cy.get('[data-cy="login-submit"]').click();
  });

  it('2) Login ok con credenciales correctas', () => {
    cy.login('roberto@saludplus.com', 'password123');
    cy.url().should('include', '/pro/dashboard');
  });

  it('3) Register crea usuario y luego login ok', () => {
    const email = `newuser_${Date.now()}@test.com`;
    cy.visit('/#/register');
    cy.get('[data-cy="register-name"]').type('User Test');
    cy.get('[data-cy="register-email"]').type(email);
    cy.get('[data-cy="register-password"]').type('password123');
    cy.get('[data-cy="role-client-btn"]').click();
    cy.get('[data-cy="register-submit"]').click();
    
    cy.url().should('include', '/client/dashboard');
    cy.logout();
    
    cy.login(email, 'password123');
    cy.url().should('include', '/client/dashboard');
  });

  it('4) Cliente no puede entrar a /pro/* (redirige)', () => {
    cy.loginAsClient();
    cy.visit('/#/pro/dashboard');
    // Guard redirects unauthorized roles to home /
    cy.url().should('eq', Cypress.config().baseUrl + '/#/');
  });

  it('5) Profesional no puede entrar a /admin/*', () => {
    cy.loginAsProfessional();
    cy.visit('/#/admin/dashboard');
    cy.url().should('eq', Cypress.config().baseUrl + '/#/');
  });
});
