///<reference types="cypress"/>
import '../support/commands/login-commands';
import '../support/commands/register-commands';
// import '@percy/cypress';
import '@shelex/cypress-allure-plugin';
const  compareSnapshotCommand = require('cypress-image-diff-js/command');
compareSnapshotCommand();
Cypress.on('uncaught:exception', (err, runnable) => {
    return false;
  });
