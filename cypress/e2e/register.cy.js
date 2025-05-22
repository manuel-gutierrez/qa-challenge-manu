import { faker } from '@faker-js/faker';
import utilities from '../support/utilities';

const path = 'login';

// Helper function to generate a complete valid user data set
const createValidUserData = () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const birthDate = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });

  return {
    initialSignup: {
      name: `${firstName} ${lastName}`,
      // Ensure email is somewhat unique and valid for the domain
      email: faker.internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase(), provider: 'fakermail.com' }),
    },
    personalData: {
      password: faker.internet.password({ length: 12, memorable: false, prefix: 'Pass!1' }),
      firstName: firstName,
      lastName: lastName,
      day: birthDate.getDate().toString(),
      month: (birthDate.getMonth() + 1).toString(), // Month is 0-indexed for JS Date, 1-indexed for form
      year: birthDate.getFullYear().toString(),
      newsletter: faker.datatype.boolean(),
      optin: faker.datatype.boolean(),
    },
    shippingInformation: {
      firstName: firstName, // Usually same as personal data for registration
      lastName: lastName,   // Usually same as personal data for registration
      company: faker.company.name(),
      address1: faker.location.streetAddress(),
      address2: faker.location.secondaryAddress(),
      country: 'United States', // Default valid country, ensure this is an option in your dropdown
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.location.zipCode(),
      mobileNumber: faker.phone.number('##########'), // Ensure 10 digits for automationexercise.com
    },
  };
};

describe('Positive Register Scenarios', () => {
  beforeEach(() => {
    cy.visit(path);
  });

  it('should successfully register a new user with valid random data', function () {
    const userData = createValidUserData(); // Generate fresh valid data for the positive test

    cy.typeDataSingUp(userData.initialSignup);
    cy.fillPersonalData(userData.personalData);
    cy.fillShippingData(userData.shippingInformation);
    cy.createAccount();

    // Assertions for successful registration
    utilities.getByCssSelector('account-created').should('be.visible');
    cy.contains('h2[data-qa="account-created"]', 'Account Created!').should('be.visible');
    utilities.getByCssSelector('continue-button').click();
    cy.url().should('not.include', '/account_created'); // Should redirect
    cy.contains(' Logged in as ').should('be.visible').and('contain.text', userData.initialSignup.name);
    cy.contains(' Logout').should('be.visible');
  });
});

describe('Negative Register Scenarios', () => {
  let baseUserData;

  beforeEach(() => {
    cy.visit(path);
    // Create a base valid user data set once before each negative test
    // We'll modify this base data for specific negative scenarios
    baseUserData = createValidUserData();
  });

  // it('should show an error when trying to register with an existing email', function () {
  //   // For this test to be reliable, 'existinguser@example.com' should ideally be pre-registered
  //   // or registered in a setup step if your application allows easy programmatic user creation.
  //   // Alternatively, run a positive registration test first that uses this email.
  //   const existingUser = {
  //     ...baseUserData.initialSignup, // Use base name or generate a new one
  //     email: 'existinguser@automationexercise.com', // An email known to exist or registered in a previous step
  //     name: faker.person.fullName(), // Optionally, use a different name for this test
  //   };

  //   cy.typeDataSingUp(existingUser);
  //   // The error message "Email Address already exist!" appears after clicking the initial signup button.
  //   cy.contains('p', 'Email Address already exist!').should('be.visible');
  // });

  it('should show an HTML5 validation error for an invalid email format during initial signup', function () {
    const testInitialSignup = {
      ...baseUserData.initialSignup, // Use valid name from base
      email: 'notanemailformat', // Override with invalid email
    };

    // Manually fill initial signup fields to control the click precisely
    cy.get('input[data-qa="signup-name"]').type(testInitialSignup.name);
    cy.get('input[data-qa="signup-email"]').type(testInitialSignup.email);
    utilities.getByCssSelector('signup-button').click();

    // Check for the HTML5 :invalid pseudo-class on the email input
    cy.get('input[data-qa="signup-email"]:invalid').should('be.visible');
  });

  it('should show an HTML5 validation error if a required field (e.g., password) is missing on the main registration form', function () {
    // Step 1: Perform a valid initial signup to get to the main registration form
    // Use the initialSignup part from our base valid user
    cy.typeDataSingUp(baseUserData.initialSignup);
    cy.url().should('include', '/signup'); // Ensure we are on the signup page

    // Step 2: Prepare data for the main form, but omit the password
    // Create a copy of personalData from our base valid user and remove the password
    const personalDataForTest = { ...baseUserData.personalData };
    delete personalDataForTest.password;

    // Use the shippingInformation from our base valid user
    // Ensure shipping first/last name match what might be pre-filled or expected from personalData
    const shippingDataForTest = {
      ...baseUserData.shippingInformation,
      firstName: baseUserData.personalData.firstName, // Align with personal data
      lastName: baseUserData.personalData.lastName,   // Align with personal data
    };

    // Fill data. Your `fillPersonalData` custom command would ideally
    // handle cases where a property (like password) is missing.
    // If it doesn't, you might need to fill fields individually or
    // add an option to your custom command like { skipPassword: true }.
    // For this example, we assume `fillPersonalData` can proceed if `password` is undefined.
    cy.fillPersonalData(personalDataForTest, { skipPassword: true }); // Pass option if command supports it
    cy.fillShippingData(shippingDataForTest);
    utilities.getByCssSelector('create-account').click(); // Click create account directly

    // Check for the HTML5 :invalid pseudo-class on the password input
    cy.get('input[data-qa="password"]:invalid').should('be.visible');
  });
});