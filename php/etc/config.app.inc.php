<?php

	/**
	 * APPLICATION SPECIFIC CONFIGURATION FILE
	 *
	 * This file includes the specific definitions common to all scripts.
	 * This file extends the general configuration file "config.inc.php" (this script is included).
	 *
	 * Logging:   errors logging should be addressed to the PHP log file /var/log/php.log
	 * Warning:   avoid output,
	 *            avoid appending empy line at the end of the script,
	 *            do not open/close PHP tags
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */

	require_once 'config.inc.php';
	
	session_start();
	
	$GLOBALS['package']='app';
	$GLOBALS['resources_file'] = 'etc/strings_ITA.inc.php';
	require_once $GLOBALS['resources_file'];

	/**
	 * APP SETTINGS
	 * here it is possible to override the general values defined in the config.inc.php configuration file
	 */
	$GLOBALS[$GLOBALS['package']]['app_title_short']	= $GLOBALS['app_title_short_default'];	// used in the name of the app
	$GLOBALS[$GLOBALS['package']]['app_title_long']		= $GLOBALS['app_title_long_default'];	// used in the title bar
	$GLOBALS[$GLOBALS['package']]['app_department']		= $GLOBALS['app_department_default'];	// used in the title bar

	$GLOBALS[$GLOBALS['package']]['language']			= $GLOBALS['language_default'];			// used in metadata

	/**
	 * ENABLE/DISABLE/SET INTERFACE COMPONENTS
	 * definition of the visibility and of the layout of the main interface components
	 */
	$GLOBALS[$GLOBALS['package']]['exit_url'] = $GLOBALS['exit_url_default'];				// used in the "exit" button of the title bar
																							
	$GLOBALS[$GLOBALS['package']]['app_right_tabs_enable'] = array(							// used to enable/disable the tabs in the right info panel
						'ov_link_query_result' => true,
						'ov_link_search' => true,
						'ov_link_custom' => true,
						'ov_link_app_info' => true);
	$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'] = array(							// used to "fill" the tabs in the right info panel
						'ov_page_query_result' => $GLOBALS['page_query_result_default'],
						'ov_page_search' => $GLOBALS['page_search_default'],
						'ov_page_custom' => $GLOBALS['page_custom_default'],
						'ov_page_app_info' => $GLOBALS['page_app_info_default']);
	$GLOBALS[$GLOBALS['package']]['app_right_tabs_active_at_start'] = false;				// used to set the initial state of the panel
																							// this setting can be override by other control (for example the type of device, etc.)
	$GLOBALS[$GLOBALS['package']]['app_right_active_tab'] = 'page_app_info';				// used to set the initial opened tab (values: page_app_info, page_query_result, page_search, page_custom)
																							
	
	/**
	 * MAP SETTINGS
	 * definition of the map to be shown:
	 * - general info (title, ...)
	 * - map definition (layers, projection, ...)
	 */
	$GLOBALS[$GLOBALS['package']]['map_title']="Test Comune Pisa (3003)";
	$GLOBALS[$GLOBALS['package']]['map_description']="Mappa del Comune di Pisa per la visualizzazione degli edifici e delle pratiche edilizie associate ad essi.<br>&nbsp;<br>la mappa &egrave; proiettata secondo le coordinate Gauss Boaga, fuso ovest: questa proiezione fornisce misurazioni accurate ma non è supportata da alcuni data server globali come, per esempio, il NASA Earth Observations Server: i dati distributi da stali server non sono quindi sovrapponibili alla mappa corrente.";
	$GLOBALS[$GLOBALS['package']]['map_options']=array(
			'data_projection'=>'EPSG:3003',					// default projection (used for example to set the initial zoom, to calculate the scale, to measure the distances, ...
			'initial_map_center'=>array(1673500, 4815330),	// coordinate of the center of the default view (based on data_projection)
			'initial_zoom'=>17,								// zoom level of the default view
			'default_base_layer'=>"open_street_map",		// 
			'map_projection'=>'EPSG:3003',					// projection used for the map rendering and for the visualization of the coordinates while moving the mouse
			'map_measure_threshold'=>700,					// threshold for the defaults measure tooltip visualization
			'map_measure_units_number'=>1000,				// number of map units for 1 "map_measure_units"
			'map_measure_units'=>'km',						// symbol used in the measure tooltip when the value is > map_measure_threshold
			'map_measure_sub_units_number'=>1,				// number of map units for 1 "map_measure_sub_units"
			'map_measure_sub_units'=>'m',					// symbol used in the measure tooltip when the value is <= map_measure_threshold
			'show_coordinates_mouse'=>true,					// used to enable/disable the display of the coordinates while moving the mouse over the map
			'show_number_selected_features'=>true,			// used to enable/disable the display of the number of selected features
			'show_view_scale'=>true,						// used to enable/disable the display of the scale of the current view
			'show_view_crs'=>true,							// used to enable/disable the display of the CRS of the current view
			'show_feature_attribute_without_ctrl'=>true		// enable the visualization of the feature attribute also without pressing the CTRL key
			//'show_epsg_on_coordinates'=>true,				// show the "data" coordinate system beside the coordinates related to the mouse position
	);
	
	/**
	 * NOTE ABOUT THE PROJECTIONS SUPPORTED BY THE APPLICATION
	 * The application supports all the projections defined in the folder include/js/proj/epsg.
	 * A projection, to be supported, needs to be defined as .js file, named like EPSG-xxxx.js, and declared using the Proj4js syntax.
	 */
	
	/**
	 * NOTE ABOUT AUTOMATIC REPROJECTION
	 * The application (thanks to OpenLayers) can manage on-the-fly reprojection of data. Then, in most cases, if the map projection is
	 * different from the data/layer projection (but both of them are "supported"), the data/layer will be reprojected to overlap on the map.
	 * Indeed, there are some limitations.
	 * With WMS layers, for example, if the WMS server does not support the map projection, can happen:
	 * - the map projection is 4326, or 3857, or 900913
	 * - but the WMS server does not support it
	 * - in this case, using CRS:84 usually make data usable
	 * Based on this, if the projection is not supported by the WMS server, and the map projection is one of 4326, 3857, 900913,
	 * the application automatically try to solve the problem by setting CRS:84 as projection for the WMS layer.
	 */
	
	/**
	 * MAIN LAYERS SETTINGS
	 * definition of the "main layers" (MapGuide, WMS, ...) to be handled:
	 */
	$GLOBALS[$GLOBALS['package']]['map_definition']= array(
			'wms_geoserver'=> array(
					'tipo'=> 'wms_geoserver',
					'url' => 'https://sit.spid.comune.poggibonsi.si.it/services/wms',
					'layers_info'=> array(
							'view_pratiche_punti'=> array(
									'min_scale'=> 1,
									'max_scale'=> 50000,
									'tooltip'=> 'Pratica n. %numero_pratica%',
									'hyperlink'=> 'ricerca_info_pratica_edilizia.php?id=%ogc_fid%',
									'selectable'=> true,
									'visible'=> true,
									'legend_label'=> 'Pratiche edilizie schedario',
									'image_legend_layer'=> 'view_pratiche_punti',
									'feature_name'=> 'view_pratiche_punti',
									'group'=> 'pratiche_edilizie'
							),
							'edifici'=> array(
									'min_scale'=> 1,
									'max_scale'=> 10000,
									'tooltip'=> 'Edificio %id%',
									'hyperlink'=> 'extra_info/info_edifici.php?id=%id%',
									'selectable'=> true,
									'visible'=> true,
									'legend_label'=> 'Edifici',
									'image_legend_layer'=> 'edifici',
									'feature_name'=> 'edifici',
									'group'=> 'pratiche_edilizie'
							),
							'elementi_lineari_2k_10k'=> array(
									'min_scale'=> 1,
									'max_scale'=> 5000,
									'tooltip'=> '%topon%',
									'hyperlink'=> '',
									'selectable'=> true,
									'visible'=> true,
									'legend_label'=> 'Elementi lineari 2k_10k',
									'image_legend_layer'=> 'elementi_lineari_2k_10k',
									'feature_name'=> 'elementi_lineari_2k_10k',
									'group'=> 'ctc'
							),
							'limiti_amministrativi'=> array(
									'min_scale'=> 500,
									'max_scale'=> 50000,
									'tooltip'=> '%nome%',
									'hyperlink'=> '',
									'selectable'=> false,
									'visible'=> false,
									'legend_label'=> 'Limiti comunali',
									'image_legend_layer'=> 'limiti_amministrativi',
									'feature_name'=> 'limiti_amministrativi',
									'group'=> 'ctc'
							)
					),
					'groups_info'=> array(
							'pratiche_edilizie'=> array(
									'visible'=> true,
									'legend_label'=> 'Pratiche edilizie schedario',
									'expanded'=> true
							),
							'ctc'=> array(
									'visible'=> true,
									'legend_label'=> 'Carta Tecnica Comunale',
									'expanded'=> true
							)
					)
			)
	);
	
	
	 /**
	 * BASEMAP LAYERS SETTINGS
	 * definition of the "basemap" layers to be handled:
	 */
	$GLOBALS[$GLOBALS['package']]['basemap_layers_definition']=array(
			'open_street_map' => array(	//open_street_map
										'source_type' => 'OSM',  
										'wms_url' => null,
										'wms_layers_names' => null,
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => null,
										'wms_layer_projection' => 'EPSG:4326',
										'layer_title' => 'OpenStreetMap',
										'layer_description' => 'OpenStreetMap is a free, editable map of the whole world that is being built by volunteers largely from scratch and released with an open-content license. The OpenStreetMap License allows free (or almost free) access to map images and all of our underlying map data. The project aims to promote new and interesting uses of this data.',
										'layer_copyright' => 'Copyright © OpenStreetMap contributors',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'open_street_map'),
										'is_basemap_layer' => true
										),
			'dbt_regione_toscana' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'http://www502.regione.toscana.it/geoscopio_qg/cgi-bin/qgis_mapserv?map=dbtm_rt.qgs&',
										'wms_layers_names' => 'Vestizione',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:4326', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_title' => 'DBT Regione Toscana',
										'layer_description' => 'Database Topografico Multiscala della Regione Toscana.',
										'layer_copyright' => 'Sources: Regione Toscana',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'dbt_regione_toscana'),
										'is_basemap_layer' => true
										),
			'esri_world_imagery' => array(
										'source_type' => 'XYZ',
										'layer_title' => 'World Imagery (ESRI ArcGisOnLine)',
										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // max_zoom = 19 (18)
										'max_zoom' => 19,
										
										'wms_layers_names' => null,
										'wms_query_layers_names' => null,
										'wms_info_format' => '',
										'wms_server_type' => null,
										'wms_layer_projection' => null, // 'EPSG:4326', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'esri_world_imagery'),
										'is_basemap_layer' => true
										),
			'world_topo_map' => array(
										'source_type' => 'XYZ',
										'layer_title' => 'World Topographic Map (ESRI ArcGisOnLine)',
										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 19 (18)
										'max_zoom' => 19,
										'wms_layers_names' => null,
										'wms_query_layers_names' => null,
										'wms_info_format' => '',
										'wms_server_type' => null,
										'wms_layer_projection' => null, // 'EPSG:4326', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'world_topo_map'),
										'is_basemap_layer' => true
										),

			'no_basemap' => array(
										'source_type' => '',
										'wms_url' => '',
										'wms_layers_names' => '',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => '',
										'wms_layer_projection' => '',
										'layer_title' => $GLOBALS['strings']['interface']['sentence_nobasemap'],
										'layer_description' => '',
										'layer_copyright' => '',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'no_basemap'),
										'is_basemap_layer' => true
										)
	);
	
	
	/**
	 * LAYERS VISIBILITY SETTINGS
	 * definition of the list of the layers to be shown as basemap
	 */
	// Create the list of the layers to be shown as basemap from the layers definition
	$GLOBALS[$GLOBALS['package']]['basemap_layers']=[];
	foreach (array_keys($GLOBALS[$GLOBALS['package']]['basemap_layers_definition']) as &$lk) {
		array_push($GLOBALS[$GLOBALS['package']]['basemap_layers'], $lk);
    }
	// It is also possible to make the list manually, taking into account to use only layers defined in basemap_layers_definition
	// Example: $GLOBALS[$GLOBALS['package']]['basemap_layers'] = array("open_street_map","no_basemap");
	
	
	/**
	 * PREDEFINED INTERNAL WMS SERVER
	 * definition of the internal WMS server
	 */
	$GLOBALS[$GLOBALS['package']]['wms_internal_server'] = array(
			"wms_internal_server"=> array(
					"title"				=> "Cartografia IGM 25.000 - Regioni Zona WGS84-UTM32",
					"portal_url"		=> "https://geodati.gov.it/geoportale/visualizzazione-metadati/scheda-metadati/?uuid=m_amte:299FN3:c5dd5d00-555e-493f-8380-080dc164633c",
					"description_url"	=> "https://geodati.gov.it/geoportale/visualizzazione-metadati/scheda-metadati/?uuid=m_amte:299FN3:c5dd5d00-555e-493f-8380-080dc164633c",
					"server_url"		=> "http://sgi2.isprambiente.it/arcgis/services/raster/igm25k_toscana_wgs/ImageServer/WMSServer?"
			)
	);
	
	
	/**
	 * PREDEFINED EXTERNAL WMS SERVERS
	 * definition of the list of the WMS servers listed by default in the window "Add layers from WMS service"
	 */
	$GLOBALS[$GLOBALS['package']]['wms_server'] = array(
			"neo_nasa"=> array(
					"title"				=> "NASA Earth Observation",
					"description_url"	=> "https://neo.sci.gsfc.nasa.gov/",
					"server_url"		=> "https://neo.sci.gsfc.nasa.gov/wms/wms?version=1.3.0&service=WMS"
			),
			"geoscopio_rt_ctr"=> array(
					"title"				=> "Geoscopio Regione Toscana (Cartografia Tecnica)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio-wms", // https://www.regione.toscana.it/-/geoscopio
					"server_url"		=> "http://www502.regione.toscana.it/geoscopio_qg/cgi-bin/qgis_mapserv?map=dbtm_rt.qgs&"
			),
			"geoscopio_rt_cat"=> array(
					"title"				=> "Geoscopio Regione Toscana (Catasto)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio-wms", // https://www.regione.toscana.it/-/geoscopio
					"server_url"		=> "http://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&"
			),
			"geoscopio_rt_orto"=> array(
					"title"				=> "Geoscopio Regione Toscana (Ortofoto)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio-wms", // https://www.regione.toscana.it/-/geoscopio
					"server_url"		=> "http://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&map_resolution=91&"
			),
			"geoscopio_rt_pit"=> array(
					"title"				=> "Geoscopio Regione Toscana (PIT)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio-wms", // https://www.regione.toscana.it/-/geoscopio
					"server_url"		=> "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmspiapae&map_resolution=91&"
			),
			//http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmspiapae&map_resolution=91&
			"geoscopio_rt_limamm"=> array(
					"title"				=> "Geoscopio Regione Toscana (Limiti Amministrativi)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio-wms", // https://www.regione.toscana.it/-/geoscopio
					"server_url"		=> "http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&"
			),
			"geoportale_nazionale"=> array(
					"title"				=> "Geoportale Cartografico Catastale",
					"description_url"	=> "https://geoportale.cartografia.agenziaentrate.gov.it/age-inspire/srv/ita/catalog.search#/home",
					"server_url"		=> "https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php"
			),
			"corine_2018"=> array(
					"title"				=> "Corine Land Cover 2018",
					"description_url"	=> "https://copernicus.discomap.eea.europa.eu/arcgis/rest/services/Corine/CLC2018_WM/MapServer",
					"server_url"		=> "https://copernicus.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer"
			)
	);
	
	
	/**
	 * PLUGINS SETTINGS
	 */
	 $GLOBALS[$GLOBALS['package']]['plugins'] = array(
	 	 	 'wmslayers' => array(
	 	 	 	 	 'jsLib' => 'include/openViewerPlugins/openViewerWms.js'
	 	 	 )
	 );
	
	
	 /**
	 * OTHER SETTINGS
	 */
	 $GLOBALS[$GLOBALS['package']]['show_console_messages'] = true;
	 $GLOBALS[$GLOBALS['package']]['show_getcapabilities_button'] = true;
	 $GLOBALS[$GLOBALS['package']]['show_getcapabilities_in_a_new_tab'] = true;

?>
