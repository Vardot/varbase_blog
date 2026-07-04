<?php

declare(strict_types=1);

namespace Drupal\varbase_blog\Hook;

use Drupal\Core\Hook\Attribute\Hook;

/**
 * Hook implementations for the Varbase Blog module.
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
