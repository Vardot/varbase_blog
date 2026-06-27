@varbase_blog @permissions
Feature: Varbase Blog - Blog post create access by role
  As a site builder
  I want only authorized roles to create Blog posts on Drupal 11

  Scenario: Anonymous users cannot create a Blog post
    Given I am an anonymous visitor
    When I load the page "/node/add/varbase_blog"
    Then I should see "Access denied"

  Scenario: Authenticated users without permission cannot create a Blog post
    Given I am a logged in user with the "Normal user" user
    When I load the page "/node/add/varbase_blog"
    Then I should see "Access denied"

  Scenario: Editor users can create a Blog post
    Given I am a logged in user with the "Editor" user
    When I load the page "/node/add/varbase_blog"
    Then I should not see "Access denied"
    And I should see "Create Blog post"
    And I should not see "The website encountered an unexpected error"
