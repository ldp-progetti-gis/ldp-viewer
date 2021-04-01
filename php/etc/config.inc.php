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
	$GLOBALS['language_default']		= 'italiano';				// this variable can be overrided in the specific config.app.inc.php configuration file
	
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
	$GLOBALS['year'] 						= '2021';
	$GLOBALS['license']						= 'GNU General Public License v20';
	$GLOBALS['license_description']			= 'This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License as published
                                               by the Free Software Foundation; either version 2 of the License, or (at your option) any later version.<br>&nbsp;<br>
                                               This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the <u><i><a href="GNU General Public License v2.0 - GNU Project - Free Software Foundation.html" target="_blank">GNU General Public License</a></i></u> for more details.';
	$GLOBALS['contact_email']				= 'helpdesk@ldpgis.it';

	$GLOBALS['general_description']			= '<b>'.$GLOBALS['app_name'].'</b> &egrave; una applicazione internet che consente la pubblicazione di dati geografici. Il visualizzatore
                                              interattivo permette agli utenti di navigare la mappa (zoom, pan, visualizzazione ad una scala definita), modificare i livelli geografici visualizzati, interrogare i dati associati e generare elaborati di stampa.';
	$GLOBALS['main_features']				= 'Dati supportati:<ul>
                                              <li>fonti dati WMS</li>
                                              <li>fonti dati MapGuide</li>
                                              <li>basemap OpenStreetMap</li>
                                              </ul>
                                              Funzionalit&agrave;:<ul>
                                              <li>panning e zoom su rettagolo interattivi</li>
                                              <li>vista iniziale, zoom in, zoom out, vista precedente, vista successiva</li>
                                              <li>misurazione di distanze e di aree</li>
                                              <li>stampa</li>
                                              </ul>';
	$GLOBALS['release_note_beta']			= '<u>Release BETA (2021.02)</u><br>'.
                                              'Sviluppo iniziale dell/apos;applicazione, basato sulla revisione delle applicazioni pi/ugrave; articolate e complete realizzate da LdpAssociati per la gestione di dati geografici destinati alla gestione del territorio.';	
?>
