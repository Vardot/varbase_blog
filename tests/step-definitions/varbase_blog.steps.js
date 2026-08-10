'use strict';

// The Varbase login and wait steps ship as built-ins in @vardot/varbase-e2e
// (varbase.steps.js / drupal-core.steps.js) - the local copies were removed to
// keep every matching scenario unambiguous.

/**
 * @file
 * Custom step definitions for the Varbase API module test suite.
 *
 * The bulk of the suite reuses the step definitions that ship with varbase-e2e
 * (navigation, form, web-first assertions, accessibility). Only two
 * module-specific helpers live here:
 *
 *   - logging in as a named user from cucumber.js worldParameters.users, and
 *   - dropping back to an anonymous session for the access-control scenario.
 *
 * Navigation and waiting reuse varbase-e2e's own helpers - gotoUrl (friendly
 * navigation errors) and waitForPageLoad (smart-settle: DOM ready, network
 * idle, no pending AJAX/timers) - instead of raw Playwright waits, and
 * failures are wrapped with friendly().
 */

const { Given, When } = require('@cucumber/cucumber');
const {
  friendly,
} = require('@vardot/varbase-e2e/tests/step-definitions/varbase-e2e');

/**
 * Navigate with domcontentloaded only — heavy front-end themes (Bootstrap/AOS)
 * may never reach network idle, so do not block on it.
 */
async function gotoUrl(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('body', { state: 'attached', timeout: 30000 }).catch(() => {});
}

/**
 * Bounded settle for the heavy Bootstrap theme (no network idle).
 */
async function settle(page) {
  await page.waitForLoadState('domcontentloaded').catch(() => {});
  await page.waitForTimeout(1500);
}

/**
 * Run a step body and rethrow any failure as a tester-friendly error.
 *
 * @param {Function} body
 *   Async function performing the step.
 * @param {string} message
 *   Human-readable description for failures.
 */
async function attempt(body, message) {
  try {
    await body();
  }
  catch (err) {
    throw friendly(message, err);
  }
}

/**
 * Drop back to an anonymous session by clearing every cookie.
 *
 * Used by the access-control scenario to prove the Varbase API settings pages
 * are protected by the `administer varbase api settings` permission.
 *
 * Example #1: Given I am an anonymous visitor
 * Example #2: Given we are an anonymous visitor
 */
Given(/^(?:I |we )?am an anonymous visitor$/, async function () {
  await attempt(async () => {
    await this.context.clearCookies();
  }, 'Could not clear the session to become anonymous');
});

/**
 * Create an Article node through the node-add form.
 *
 * Used by the entity-operation scenarios so that varbase_blog can attach its
 * "View API Docs" / "View JSON" operations to a real row on /admin/content.
 * Driven entirely through the browser - no Drush.
 *
 * Example #1: Given I create an article titled "API Docs Article"
 * Example #2: When we create an article titled "JSON test"
 */
When(/^(?:I |we )?create an article titled "([^"]*)"$/, async function (title) {
  await attempt(async () => {
    await gotoUrl(this.page, `${this.parameters.launchUrl}/node/add/article`);
    await this.page.locator('#edit-title-0-value').fill(title);
    await this.page.locator('#edit-submit').click();
    await settle(this.page);
  }, `Could not create an article titled "${title}"`);
});

/**
 * Navigate to a path with domcontentloaded only (robust on the Bootstrap theme),
 * without asserting access — lets access-denied pages load for assertions.
 */
When(/^I load the page "([^"]*)"$/, async function (path) {
  await gotoUrl(this.page, `${this.parameters.launchUrl}${path}`);
  await settle(this.page);
});

/**
 * Create and save a Blog post (title + CKEditor body) and land on the node page.
 */
When(/^(?:I |we )?create a blog post titled "([^"]*)"$/, async function (title) {
  await attempt(async () => {
    await gotoUrl(this.page, `${this.parameters.launchUrl}/node/add/varbase_blog`);
    await this.page.locator('#edit-title-0-value').fill(title);
    // Fill the body via the CKEditor 5 instance (robust); fall back to the
    // underlying textarea if the editor did not initialize.
    await this.page.evaluate((bodyText) => {
      const el = document.querySelector('.ck-editor__editable');
      const ed = el && el.ckeditorInstance;
      if (ed) {
        ed.setData('<p>' + bodyText + '</p>');
      } else {
        const ta = document.querySelector('#edit-body-0-value');
        if (ta) { ta.value = bodyText; ta.dispatchEvent(new Event('change', { bubbles: true })); }
      }
    }, 'Automated blog body content for the Varbase Blog tests.');
    await this.page.locator('#edit-submit').click();
    await settle(this.page);
  }, `Could not create a blog post titled "${title}"`);
});
