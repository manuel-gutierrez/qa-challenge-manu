import utils from '../utilities';
import uiLogin from '../elements/login-elements';

/**
 * Custom Cypress command to type email and password into login fields and click the login button.
 * Assumes that `utils.getByCssSelector` correctly resolves elements based on `data-qa` attributes
 * defined in `uiLogin` from `login-elements.js`.
 *
 * @param {string} email - The email address to type into the email field.
 * @param {string} password - The password to type into the password field.
 */
Cypress.Commands.add('typeDataLogin', (email, password) => {
    utils.getByCssSelector(uiLogin.EMAIL).type(email);
    utils.getByCssSelector(uiLogin.PASSWORD).type(password);
    return utils.getByCssSelector(uiLogin.LOGIN_BUTTON).click(); // Explicitly return for potential chaining
});
