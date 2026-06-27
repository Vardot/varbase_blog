<?php

/**
 * @file
 * Force-imports the Varbase Blog optional config on a Standard test site.
 *
 * Core skips optional config whose dependencies are not yet present during
 * install, so on a plain Standard site the Blog post content type, its fields,
 * the form/view displays, the blog view and its vocabularies are not created.
 * Run several passes so inter-config dependencies are satisfied.
 */

use Drupal\Core\Config\FileStorage;

$module_path = \Drupal::service('extension.list.module')->getPath('varbase_blog');
$storage = new FileStorage($module_path . '/config/optional');
$config_manager = \Drupal::service('config.manager');
$entity_type_manager = \Drupal::entityTypeManager();
$names = $storage->listAll();

for ($pass = 0; $pass < 3; $pass++) {
  foreach ($names as $name) {
    $data = $storage->read($name);
    if (!$data) {
      continue;
    }
    $entity_type_id = $config_manager->getEntityTypeIdByName($name);
    if ($entity_type_id) {
      try {
        $entity_storage = $entity_type_manager->getStorage($entity_type_id);
        $id_key = $entity_storage->getEntityType()->getKey('id');
        $id = $data[$id_key] ?? NULL;
        if ($id && $entity_storage->load($id)) {
          continue;
        }
        $entity_storage->createFromStorageRecord($data)->save();
      }
      catch (\Throwable $e) {
        // Dependency not ready on this pass; a later pass will create it.
      }
    }
    else {
      try {
        $config = \Drupal::configFactory()->getEditable($name);
        if ($config->isNew()) {
          $config->setData($data)->save();
        }
      }
      catch (\Throwable $e) {
        // Skip optional simple config that cannot be created yet.
      }
    }
  }
}
