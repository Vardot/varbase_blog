<?php

namespace Drupal\varbase_blog\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Object-oriented hook implementations for Varbase Blog.
 *
 * Drupal 11 replaces procedural hooks with methods that carry the #[Hook]
 * attribute (https://www.drupal.org/node/3442349). The real logic lives here;
 * the procedural function in varbase_blog.module is kept only as a
 * #[LegacyHook] shim that delegates to this service, for backwards
 * compatibility.
 */
class VarbaseBlogHooks {

  /**
   * Implements hook_preprocess_HOOK() for menu.html.twig.
   */
  #[Hook('preprocess_menu')]
  public function preprocessMenu(array &$variables): void {
    if (isset($variables['menu_name']) && $variables['menu_name'] == 'blog-menu') {
      $variables['attributes']['class'] = [
        'nav-pills',
        'list-inline',
        'center-block',
        'justify-content-center',
      ];
    }
  }

}
