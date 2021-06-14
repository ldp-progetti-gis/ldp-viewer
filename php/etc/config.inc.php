<?php

	/**
	 * MAIN CONFIGURATION FILE
	 *
	 * This file includes the general definitions common to all scripts.
	 * This file is very general, and it is not "directly" included inside the script, but it
	 * is referenced (included) by other more specific configuration files, focused on specific
	 * applications.
	 *
	 * Warning:  avoid output,
	 *           avoid appending empy line at the end of the script,
	 *           do not open/close PHP tags
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
	
	/**
	 * APPLICATION SETTINGS
	 */
	$GLOBALS['app_title_short_default']	= 'OVorg';					// this variable can be overrided in the specific config.app.inc.php configuration file
	$GLOBALS['app_title_long_default']	= 'OV Organization';		// this variable can be overrided in the specific config.app.inc.php configuration file
	$GLOBALS['app_department_default']	= 'GIS';					// this variable can be overrided in the specific config.app.inc.php configuration file
	
    /**
	 * MAIN FOLDERS AND URLS
	 */
	$GLOBALS['PATHBase'] 				= '';
	$GLOBALS['PATHBaseInclude'] 		= 'include';
	$GLOBALS['URLBase'] 				= '';
	$GLOBALS['URLBaseInclude'] 			= $GLOBALS['URLBase'].'/include';
	
	/**
	 * INTERFACE SETTINGS
	 */
	$GLOBALS['favicon']					= $GLOBALS['URLBaseInclude'].'/img/favicon.ico';
	$GLOBALS['language_default']		= 'english';				// this variable can be overrided in the specific config.app.inc.php configuration file
	
	$GLOBALS['exit_url_default']		= 'https://www.ldpgis.it/';	// this variable can be overrided in the specific config.app.inc.php configuration file
	
	/* ************* PLEASE DO NOT CHANGE AFTER THIS LINE ************* */
	
	/**
	 * SERVICE SETTINGS
	 */
	$GLOBALS['page_query_result_default']	= 'ovQueryResult.php';	// this variable can be overrided in the specific config.app.inc.php configuration file
	$GLOBALS['page_search_default']			= 'ovSearch.php';		// this variable can be overrided in the specific config.app.inc.php configuration file
	$GLOBALS['page_custom_default']			= 'ovCustom.php';		// this variable can be overrided in the specific config.app.inc.php configuration file
	$GLOBALS['page_app_info_default']		= 'ovAppInfo.php';		// this variable can be overrided in the specific config.app.inc.php configuration file

	/**
	 * EXTERNAL LIBRARIES
	 */
	$GLOBALS['lib_openlayers_version']		= '6.5.0';
	$GLOBALS['lib_jquery_version']			= '3.5.x';
	$GLOBALS['lib_proj4_version']			= '2.7.2';
	$GLOBALS['epsg_supported']				= glob('include/js/proj4/epsg/EPSG-*.js');
	foreach ($GLOBALS['epsg_supported'] as &$epsg) { $epsg = str_replace('EPSG-','',basename($epsg, ".js")); }
		
	/**
	 * METADATA
	 */
	$GLOBALS['app_name']					= 'gisOpenViewer';
	$GLOBALS['app_maintainer']				= 'LdpGIS';
	$GLOBALS['app_version'] 				= 'beta';
	$GLOBALS['release_year'] 				= '2021';
	$GLOBALS['release_month'] 				= '06';
	$GLOBALS['license']						= 'GNU General Public License v20';
	$GLOBALS['contact_email']				= 'helpdesk@ldpgis.it';
	
?>
