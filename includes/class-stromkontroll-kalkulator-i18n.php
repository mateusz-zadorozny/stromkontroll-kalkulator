<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://mpress.cc
 * @since      1.0.0
 *
 * @package    Stromkontroll_Kalkulator
 * @subpackage Stromkontroll_Kalkulator/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Stromkontroll_Kalkulator
 * @subpackage Stromkontroll_Kalkulator/includes
 * @author     Mateusz Zadorożny <mateusz@mpress.cc>
 */
class Stromkontroll_Kalkulator_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'stromkontroll-kalkulator',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
