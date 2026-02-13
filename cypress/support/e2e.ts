
// Removed failing reference types directive as it is not found in this environment

// Add custom commands or global configuration for Cypress
import './commands';

// Prevents Cypress from failing when an uncaught exception occurs in the app
// Fix: Access Cypress via window to avoid "namespace as value" error when types are not properly loaded
(window as any).Cypress.on('uncaught:exception', (err: any, runnable: any) => {
  return false;
});
