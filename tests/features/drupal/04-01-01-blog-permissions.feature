@varbase_blog @permissions
Feature: Varbase Blog - create access by role
  Scenario: Anonymous users cannot create a blog post
    Given I am an anonymous user
    When I am on "/node/add/varbase_blog"
    Then I should see "Access denied"

  Scenario: Authenticated users without permission cannot create a blog post
    Given I am a logged in user with the "Normal user" user
    When I am on "/node/add/varbase_blog"
    Then I should see "Access denied"

  Scenario: Blog editors can open the blog post create form
    Given I am a logged in user with the "Blog editor" user
    When I am on "/node/add/varbase_blog"
    Then I should see "Create Blog post"
