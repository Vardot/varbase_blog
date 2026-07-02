'use strict';

/**
 * @file
 * Custom step definitions for the Varbase Blog test suite.
 *
 * The suite reuses the step definitions that ship with webship-js (navigation,
 * forms, web-first assertions, accessibility). The only module-specific steps
 * are logging in as a named user from cucumber.js worldParameters.users
 * (webship-js does not ship a Drupal form-login step) and creating a Blog post
 * (its Body field is required and rendered with CKEditor 5).
 */

const { Given, When } = require('@cucumber/cucumber');
const {
  friendly,
  gotoUrl,
  waitForPageLoad,
} = require('webship-js/tests/step-definitions/webship');

/**
 * Log in as a named test user defined in cucumber.js worldParameters.users.
 *
 * Example: Given I am a logged in user with the "Webmaster" user
 */
Given(/^I am a logged in user with( the)*( username)* "([^"]*)?"( user)?$/, async function (theCase, usernameCase, key, userCase) {
  const users = this.parameters.users || {};
  if (!(key in users)) {
    throw new Error(`No user named "${key}" in cucumber.js worldParameters.users`);
  }
  const { username, password } = users[key];
  if (!username || !password) {
    throw new Error(`User "${key}" is missing username or password in worldParameters.users`);
  }
  try {
    await this.context.clearCookies();
    await gotoUrl(this.page, `${this.parameters.launchUrl}/user/login`);
    await this.page.locator('#user-login-form #edit-name').fill(username);
    await this.page.locator('#user-login-form #edit-pass').fill(password);
    await Promise.all([
      this.page.waitForURL((url) => !/\/user\/login/.test(String(url)), { timeout: 30000 }).catch(() => {}),
      this.page.locator('#user-login-form #edit-submit').click(),
    ]);
    await waitForPageLoad(this.page, this.minWaitTime && this.minWaitTime.page);
  }
  catch (err) {
    throw friendly(`Could not log in as "${key}"`, err);
  }
});

/**
 * Create and save a Blog post: fill the Title and the required Body field, then
 * submit. Body is a CKEditor 5 rich-text field, so type into the editable area
 * when it is present and fall back to the underlying textarea otherwise.
 */
When(/^(?:I |we )?create a blog post titled "([^"]*)"$/, async function (title) {
  try {
    await gotoUrl(this.page, `${this.parameters.launchUrl}/node/add/varbase_blog`);
    await this.page.locator('#edit-title-0-value').fill(title);
    // The Body field is required. It renders either as a CKEditor 5 instance
    // (type into the visible editable area, which syncs to the textarea on
    // submit) or, if the editor did not initialize, as the plain textarea.
    const bodyCopy = `Body copy for ${title}.`;
    const editable = this.page.locator('.ck-editor__editable').first();
    const hasCkEditor = (await editable.count()) > 0
      && (await editable.isVisible().catch(() => false));
    if (hasCkEditor) {
      await editable.click();
      await this.page.keyboard.type(bodyCopy);
    }
    else {
      await this.page.locator('#edit-body-0-value').fill(bodyCopy);
    }
    await this.page.locator('#edit-submit').click();
    await waitForPageLoad(this.page, this.minWaitTime && this.minWaitTime.page);
  }
  catch (err) {
    throw friendly(`Could not create the Blog post "${title}"`, err);
  }
});
