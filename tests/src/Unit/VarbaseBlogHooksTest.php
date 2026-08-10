<?php

namespace Drupal\Tests\varbase_blog\Unit;

use Drupal\Tests\UnitTestCase;
use Drupal\varbase_blog\Hook\VarbaseBlogHooks;

/**
 * Unit tests for the Varbase Blog object-oriented hooks.
 *
 * Functional/browser coverage lives in the varbase-e2e suite
 * (tests/features/drupal). These PHP tests only exercise unit-testable logic.
 *
 * @coversDefaultClass \Drupal\varbase_blog\Hook\VarbaseBlogHooks
 * @group varbase_blog
 */
class VarbaseBlogHooksTest extends UnitTestCase {

  /**
   * The blog menu gets the expected layout classes.
   *
   * @covers ::preprocessMenu
   */
  public function testPreprocessMenuAddsClassesForBlogMenu(): void {
    $hooks = new VarbaseBlogHooks();
    $variables = ['menu_name' => 'blog-menu', 'attributes' => []];
    $hooks->preprocessMenu($variables);
    $this->assertSame(
      ['nav-pills', 'list-inline', 'center-block', 'justify-content-center'],
      $variables['attributes']['class']
    );
  }

  /**
   * Other menus are left untouched.
   *
   * @covers ::preprocessMenu
   */
  public function testPreprocessMenuIgnoresOtherMenus(): void {
    $hooks = new VarbaseBlogHooks();
    $variables = ['menu_name' => 'main', 'attributes' => []];
    $hooks->preprocessMenu($variables);
    $this->assertArrayNotHasKey('class', $variables['attributes']);
  }

}
