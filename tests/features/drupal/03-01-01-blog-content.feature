@varbase_blog @content
Feature: Varbase Blog - blog post content
  As a content editor
  I want to create blog posts

  Background:
    Given I am a logged in user with the "Webmaster" user

  Scenario: An author creates and saves a blog post
    When I create a blog post titled "Spring Product Announcement"
    Then I should see "has been created"

  Scenario: A created blog post appears in the content admin
    When I create a blog post titled "QA Blog Post"
    And I go to "/admin/content"
    Then I should see "QA Blog Post"
