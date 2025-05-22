import utils from '../utilities';
import uiRegister from '../elements/register-elements';


/**
 * Custom Cypress command to fill the initial signup form (name and email) and submit it.
 * Assumes `utils.getByCssSelector` resolves elements based on `data-qa` attributes.
 * Navigates to the main registration page upon successful initial signup.
 *
 * @param {object} initialSignupData - An object containing the name and email for signup.
 * @param {string} initialSignupData.name - The name to type into the signup name field.
 * @param {string} initialSignupData.email - The email to type into the signup email field.
 */
Cypress.Commands.add('typeDataSingUp', (initialSignupData) => {
    utils.getByCssSelector(uiRegister.NAME).type(initialSignupData.name);
    utils.getByCssSelector(uiRegister.EMAIL).type(initialSignupData.email);
    utils.getByCssSelector(uiRegister.SIGNUP_BUTTON).click();
    // Ensure navigation to the main signup form by checking URL and a landmark element
    return cy.url().should('include', '/signup')
      .then(() => {
        cy.contains('h2.title.text-center', 'Enter Account Information').should('be.visible');
      });
});

/**
 * Custom Cypress command to fill the personal data section of the registration form.
 *
 * @param {object} personalData - An object containing personal details for registration.
 * @param {string} [personalData.password] - The password to enter.
 * @param {string} personalData.day - The day of birth.
 * @param {string} personalData.month - The month of birth.
 * @param {string} personalData.year - The year of birth.
 * @param {boolean} [personalData.newsletter] - Whether to subscribe to the newsletter.
 * @param {boolean} [personalData.optin] - Whether to opt-in for special offers.
 * @param {object} [options] - Optional parameters for the command.
 * @param {boolean} [options.skipPassword=false] - If true, skips filling the password field.
 */
Cypress.Commands.add('fillPersonalData', (personalData, options = {}) => {
    utils.getById(uiRegister.TITLEMRS).click();
    if (!options.skipPassword && personalData.password) {
        utils.getByCssSelector(uiRegister.PASSWORD_REGISTER).type(personalData.password);
    }
    utils.getByCssSelector(uiRegister.DAY).select(personalData.day);
    utils.getByCssSelector(uiRegister.MONTH).select(personalData.month);
    utils.getByCssSelector(uiRegister.YEAR).select(personalData.year);
    // Handle optional newsletter and opt-in checkboxes
    if (personalData.newsletter && uiRegister.NEWSLETTER_CHECKBOX) { // Ensure selector exists
        utils.getById(uiRegister.NEWSLETTER_CHECKBOX).check();
    }
    if (personalData.optin && uiRegister.OPTIN_CHECKBOX) { // Ensure selector exists
        utils.getById(uiRegister.OPTIN_CHECKBOX).check();
    }
    // Return the subject for potential chaining, though typically these are sequential actions.
    return cy.wrap(null, { log: false }); // Returns a dummy subject to maintain chainability
});

/**
 * Custom Cypress command to fill the shipping/address information section of the registration form.
 * Assumes `createValidUserData` in the test file provides these fields as non-empty strings.
 *
 * @param {object} shippingData - An object containing address and contact details.
 * @param {string} shippingData.firstName - First name for the address.
 * @param {string} shippingData.lastName - Last name for the address.
 * @param {string} shippingData.address1 - Primary address line.
 * @param {string} [shippingData.address2] - Optional secondary address line.
 * @param {string} [shippingData.company] - Optional company name.
 * @param {string} shippingData.country - Country for the address.
 * @param {string} shippingData.state - State for the address.
 * @param {string} shippingData.city - City for the address.
 * @param {string} shippingData.zipcode - Zipcode for the address.
 * @param {string} shippingData.mobileNumber - Mobile phone number.
 */
Cypress.Commands.add('fillShippingData', (shippingData) => {
    // Assumes createValidUserData in register.cy.js provides these fields as non-empty strings
    utils.getByCssSelector(uiRegister.NAME_ADDRESS).type(shippingData.firstName);
    utils.getByCssSelector(uiRegister.LAST_NAME_ADDRESS).type(shippingData.lastName);
    utils.getByCssSelector(uiRegister.ADDRESS).type(shippingData.address1);
    utils.getByCssSelector(uiRegister.COUNTRY).select(shippingData.country);
    utils.getByCssSelector(uiRegister.STATE).type(shippingData.state);
    utils.getByCssSelector(uiRegister.CITY).type(shippingData.city);
    utils.getByCssSelector(uiRegister.ZIPCODE).type(shippingData.zipcode); // Matches 'zipcode' from register.cy.js
    utils.getByCssSelector(uiRegister.MOBILE_NUMBER).type(shippingData.mobileNumber);

    // Optional fields: company and address2
    // Type them only if they exist in shippingData and have a non-empty value,
    // and their selectors are defined in uiRegister.
    if (shippingData.company && typeof shippingData.company === 'string' && shippingData.company.trim() !== '' && uiRegister.COMPANY) {
        utils.getByCssSelector(uiRegister.COMPANY).type(shippingData.company);
    }
    if (shippingData.address2 && typeof shippingData.address2 === 'string' && shippingData.address2.trim() !== '' && uiRegister.ADDRESS2) {
        utils.getByCssSelector(uiRegister.ADDRESS2).type(shippingData.address2);
    }
    // Return the subject for potential chaining
    return cy.wrap(null, { log: false }); // Returns a dummy subject
});

/**
 * Custom Cypress command to click the "Create Account" button.
 * This command should only perform the click action. Subsequent assertions
 * or interactions should be handled in the test case.
 */
Cypress.Commands.add('createAccount', () => {
    // This command should only click the "Create Account" button.
    // Subsequent actions (like clicking "Continue") and assertions belong in the test.
    return utils.getByCssSelector(uiRegister.CREATE_ACCOUNT_BUTTON).click();
});
