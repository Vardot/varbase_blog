@varbase_blog @content
Feature: Varbase Blog - Blog post fields, create/save and feed

  Background:
    Given I am a logged in user with the "Webmaster" user

  Scenario: The Blog post create form shows the Body, Media, Tags and Categories fields
    When I load the page "/node/add/varbase_blog"
    Then "#node-varbase-blog-form" should be visible
    And I should see "Body"
    And I should see "Main media"
    And I should see "Tags"
    And I should see "Categories"
    And I should not see "The website encountered an unexpected error"

  Scenario: An author can create and save a Blog post and see the saved page
    When I create a blog post titled "Automated Blog Post"
    Then I should see "Automated Blog Post"
    And I should see "Automated blog body content"
    And I should not see "Access denied"
    And I should not see "The website encountered an unexpected error"

  Scenario: The Blog RSS feed is available
    When I load the page "/blog/feed"
    Then I should not see "Page not found"
    And I should not see "The website encountered an unexpected error"
