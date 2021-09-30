<?php

namespace Drupal\Tests\varbase_blog\FunctionalJavascript;

use Drupal\FunctionalJavascriptTests\WebDriverTestBase;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Tests Varbase Blog.
 *
 * @group varbase_blog
 */
class VarbaseBlogTest extends WebDriverTestBase {

  use StringTranslationTrait;

  /**
   * {@inheritdoc}
   */
  protected $profile = 'standard';

  /**
   * {@inheritdoc}
   */
  protected $defaultTheme = 'vartheme_bs4';

  /**
   * {@inheritdoc}
   */
  protected $strictConfigSchema = FALSE;

  /**
   * {@inheritdoc}
   */
  protected static $modules = [
    'varbase_core',
    'varbase_media',
    'varbase_editor',
    'varbase_admin',
    'varbase_seo',
    'varbase_workflow',
    'varbase_layout_builder',
    'vlplb',
    'varbase_blog',
  ];

  /**
   * {@inheritdoc}
   */
  protected function setUp(): void {
    parent::setUp();

    // Insall the Claro admin theme.
    $this->container->get('theme_installer')->install(['claro']);

    // Set the Claro theme as the default admin theme.
    $this->config('system.theme')->set('admin', 'claro')->save();

  }

  /**
   * Check Varbase Blog content type.
   */
  public function testCheckVarbaseBlogContentType() {

    // Given that the root super user was logged in to the site.
    $this->drupalLogin($this->rootUser);

    // Navigate to Content Types.
    $this->drupalGet('admin/structure/types');

    $content_types_text = $this->t('Content types');
    $this->assertSession()->pageTextContains($content_types_text);

    $blog_post_text = $this->t('Blog post');
    $this->assertSession()->pageTextContains($blog_post_text);

    $blog_post_description_text = $this->t('Use Blog to publish blog post by different authors in the Blog section of the site.');
    $this->assertSession()->pageTextContains($blog_post_description_text);

    // Navigate to Add Content.
    $this->drupalGet('node/add');

    $add_content_text = $this->t('Add content');
    $this->assertSession()->pageTextContains($add_content_text);
    $this->assertSession()->linkExists($blog_post_text);
    $this->assertSession()->pageTextContains($blog_post_description_text);

  }

  /**
   * Check Varbase Blog Ready Layout Library.
   */
  public function testCheckVarbaseBlogReadyLayoutLibrary() {

    // Given that the root super user was logged in to the site.
    $this->drupalLogin($this->rootUser);

    // Navigate to Varbase Blog site section.
    $this->drupalGet('admin/structure/layouts');

    $layout_library_text = $this->t('Layout library');
    $this->assertSession()->pageTextContains($layout_library_text);

    $lead_media_1_column_text = $this->t('Lead media 1 column');
    $this->assertSession()->pageTextContains($lead_media_1_column_text);

    $lead_media_2_columns_text = $this->t('Lead media 2 columns');
    $this->assertSession()->pageTextContains($lead_media_2_columns_text);

    $edge_to_edge_lead_media_1_column_text = $this->t('Edge to Edge lead media 1 column');
    $this->assertSession()->pageTextContains($edge_to_edge_lead_media_1_column_text);

    $edge_to_edge_lead_media_2_columns_text = $this->t('Edge to Edge lead media 2 columns');
    $this->assertSession()->pageTextContains($edge_to_edge_lead_media_2_columns_text);

  }

}
