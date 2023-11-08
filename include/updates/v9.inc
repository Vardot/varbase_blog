<?php

/**
 * @file
 * Contains varbase_blog_update_9###(s) hook updates.
 */

use Vardot\Installer\ModuleInstallerFactory;

/**
 * Issue #3222053: Fix to allow content editors to use stored selected layouts.
 *
 * On the Full content display mode with layout builder.
 */
function varbase_blog_update_9001() {
  $config_factory = \Drupal::configFactory()->getEditable('core.entity_view_display.node.varbase_blog.full');
  $varbase_blog_full_data = $config_factory->get();
  if (isset($varbase_blog_full_data['third_party_settings'])
    && isset($varbase_blog_full_data['third_party_settings']['layout_library'])
    && isset($varbase_blog_full_data['third_party_settings']['layout_library']['enable'])
    && $varbase_blog_full_data['third_party_settings']['layout_library']['enable'] == FALSE) {

    $varbase_blog_full_data['third_party_settings']['layout_library']['enable'] = TRUE;
    $config_factory->setData($varbase_blog_full_data)->save(TRUE);
  }

}

/**
 * Issue #3272207: Switch to use the Module Installer Factory.
 *
 * In the Varbase Blog (Corporate Blog) module.
 */
function varbase_blog_update_90002() {
  // Set the weight of the module after installation of list of modules.
  // Make sure that any hook or event subscriber workers after all used modules.
  ModuleInstallerFactory::setModuleWeightAfterInstallation('varbase_blog');
}

/**
 * Issue #3301364: Change node_type to entity_bundle.node for default pathauto.
 *
 * Pattern configs for the Blog Post content type.
 */
function varbase_blog_update_90003() {
  // Having a hook update with a copy of pathauto_update_8108()
  // https://git.drupalcode.org/project/pathauto/-/blob/8.x-1.10/pathauto.install#L304
  // Based on the following comment:
  // https://www.drupal.org/project/pathauto/issues/2925169#comment-14636138
  // ------------------------------------------------------------------------------
  // Load all pattern configuration entities.
  foreach (\Drupal::configFactory()->listAll('pathauto.pattern.') as $pattern_config_name) {
    $pattern_config = \Drupal::configFactory()->getEditable($pattern_config_name);

    // Loop patterns and swap the node_type plugin by the entity_bundle:node
    // plugin.
    if ($pattern_config->get('type') === 'canonical_entities:node') {
      $selection_criteria = $pattern_config->get('selection_criteria');
      foreach ($selection_criteria as $uuid => $condition) {
        if ($condition['id'] === 'node_type') {
          $pattern_config->set("selection_criteria.$uuid.id", 'entity_bundle:node');
          $pattern_config->save();
          break;
        }
      }
    }
  }
}
