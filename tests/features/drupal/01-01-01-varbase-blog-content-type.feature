@varbase_blog @content
Feature: Varbase Blog - Blog post content type
  As a site administrator
  I want the Varbase Blog content type and its create form to work on Drupal 11

  Background:
    Given I am a logged in user with the "Webmaster" user

  Scenario: The Blog post content type is available
    When I am on "/admin/structure/types"
    Then I should see "Blog post"
    And I should not see "Page not found"
    And I should not see "The website encountered an unexpected error"

  Scenario: The Blog post create form loads
    When I am on "/node/add/varbase_blog"
    Then "#node-varbase-blog-form" should be visible
    And I should see "Create Blog post"
    And I should not see "Access denied"
    And I should not see "The website encountered an unexpected error"
