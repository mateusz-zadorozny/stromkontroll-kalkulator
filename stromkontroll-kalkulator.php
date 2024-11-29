<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://mpress.cc
 * @since             1.0.0
 * @package           Stromkontroll_Kalkulator
 *
 * @wordpress-plugin
 * Plugin Name:       StromKontroll kalkulator
 * Plugin URI:        https://stromkontroll.no
 * Description:       Allows you to include the simple kalkulator in your page, to calculate potential energy save.
 * Version:           1.3.1
 * Author:            Mateusz Zadorożny
 * Author URI:        https://mpress.cc
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       stromkontroll-kalkulator
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('STROMKONTROLL_KALKULATOR_VERSION', '1.3.1');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-stromkontroll-kalkulator-activator.php
 */
function activate_stromkontroll_kalkulator()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-stromkontroll-kalkulator-activator.php';
	Stromkontroll_Kalkulator_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-stromkontroll-kalkulator-deactivator.php
 */
function deactivate_stromkontroll_kalkulator()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-stromkontroll-kalkulator-deactivator.php';
	Stromkontroll_Kalkulator_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_stromkontroll_kalkulator');
register_deactivation_hook(__FILE__, 'deactivate_stromkontroll_kalkulator');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-stromkontroll-kalkulator.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_stromkontroll_kalkulator()
{

	$plugin = new Stromkontroll_Kalkulator();
	$plugin->run();

}
run_stromkontroll_kalkulator();

function cwpai_shortcode_function($atts)
{
	$atts = shortcode_atts(
		array(
			'style' => 'default',
		),
		$atts,
		'kalkulator_shortcode'
	);

	$style = sanitize_text_field($atts['style']);
	$css_file = plugin_dir_path(__FILE__) . 'public/css/stromkontroll-kalkulator-public_' . $style . '.css';

	if (!file_exists($css_file)) {
		$css_file = plugin_dir_path(__FILE__) . 'public/css/stromkontroll-kalkulator-public.css';
	}

	wp_enqueue_style('stromkontroll-kalkulator-public', plugin_dir_url(__FILE__) . 'public/css/' . basename($css_file), array(), STROMKONTROLL_KALKULATOR_VERSION, 'all');

	ob_start();
	include_once(plugin_dir_path(__FILE__) . 'public/form_source.php');
	return ob_get_clean();
}
add_shortcode('kalkulator_shortcode', 'cwpai_shortcode_function');

function new_shortcode_function()
{

	ob_start();
	include_once(plugin_dir_path(__FILE__) . 'public/new_form.php');
	return ob_get_clean();

}

add_shortcode('new_kalkulator_shortcode', 'new_shortcode_function');