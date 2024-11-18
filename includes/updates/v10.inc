<?php

/**
 * @file
 * Contains varbase_blog_update_10###(s) hook updates.
 */

/**
 * Issue #3487489: Fix Homepage Blog View Responsiveness on Mobile by Switching to Single-Column Layout.
 *
 * To Varbase Homepage Blog Block.
 */
function varbase_blog_update_100001() {
  // Change columns layout for varbase homepage blog block.
  // when old config is not changed.
  $old_config_array = [
    'row_class' => 'gy-4 g-sm-4',
    'default_row_class' => true,
    'uses_fields' => false,
    'col_xs' => 'none',
    'col_sm' => 'col-sm-12',
    'col_md' => 'col-md-4',
    'col_lg' => 'col-lg-4',
    'col_xl' => 'col-xl-4',
    'col_xxl' => 'none'
  ];

  $current_block_config = \Drupal::service('config.factory')->getEditable('views.view.varbase_blog');
  $current_config_array = $current_block_config->get('display.homepage_blog_block.display_options.style.options');

  // Check if the current configuration matches the defined old configuration.
  if ($old_config_array === $current_config_array) {
    $homepage_blog_block_config = $current_block_config->get();

    // Update specific values in the new configuration.
    $homepage_blog_block_config['display']['homepage_blog_block']['display_options']['style']['options'] = [
      'row_class' => 'gy-4 g-sm-4',
      'default_row_class' => true,
      'uses_fields' => false,
      'grid_class' => '',
      'col_xs' => 'col-12',
      'col_sm' => 'none',
      'col_md' => 'none',
      'col_lg' => 'none',
      'col_xl' => 'col-xl-4',
      'col_xxl' => 'none'
    ];

    // Set and save the new configuration.
    $current_block_config->setData($homepage_blog_block_config)->save();
  }
}
