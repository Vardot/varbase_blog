@varbase_blog @content-type
Feature: Varbase Blog - Blog post content type
  As a site administrator
  I want a Blog post content type

  Background:
    Given I am a logged in user with the "Webmaster" user

  Scenario: The Blog post content type is listed
    When I go to "/admin/structure/types"
    Then I should see "Blog post"

  Scenario: The Blog post create form loads
    When I go to "/node/add/varbase_blog"
    Then I should see "Create Blog post"
