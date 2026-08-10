'use strict';

/**
 * @file
 * Custom step definitions for the Varbase Blog test suite.
 *
 * The suite reuses the step definitions that ship with varbase-e2e (navigation,
 * forms, web-first assertions, accessibility). The only module-specific steps
 * are logging in as a named user from cucumber.js worldParameters.users
 * (varbase-e2e does not ship a Drupal form-login step) and creating a Blog post
 * (its Body field is required and rendered with CKEditor 5).
 */

const { When } = require('@cucumber/cucumber');
const {
  friendly,
  gotoUrl,
  waitForPageLoad,
} = require('@vardot/varbase-e2e/tests/step-definitions/varbase-e2e');

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
