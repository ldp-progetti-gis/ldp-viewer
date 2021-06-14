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
	$GLOBALS['resources_file'] = 'etc/strings_ENG.inc.php';
	require_once $GLOBALS['resources_file'];

	/**
	 * APP SETTINGS
	 * here it is possible to override the general values defined in the config.inc.php configuration file
	 */
	$GLOBALS[$GLOBALS['package']]['app_title_short']	= $GLOBALS['app_title_short_default'];	// used in the name of the app
	$GLOBALS[$GLOBALS['package']]['app_title_long']		= $GLOBALS['app_title_long_default'];	// used in the title bar
	$GLOBALS[$GLOBALS['package']]['app_department']		= $GLOBALS['app_department_default'];	// used in the title bar

	$GLOBALS[$GLOBALS['package']]['language']			= $GLOBALS['language_default'];			// used in metadata

	// OVD $GLOBALS[$GLOBALS['package']]['login']['gruppi viewers'] = array();
	// OVD $GLOBALS[$GLOBALS['package']]['login']['url denied'] = $GLOBALS['exit_url_default'];
	
	/* OVD DB used by DATABASE extension
	$GLOBALS[$GLOBALS['package']]['db']['connect'] = $GLOBALS['aa_dbConnect']['default'];
	$GLOBALS[$GLOBALS['package']]['db']['connectOptions_readOnly'] = array();
	$GLOBALS[$GLOBALS['package']]['db']['connectOptions'] = array(
		'useTransaction' => true,
	);
	*/
	
	/* OVD MAPGUIDE used by MAPGUIDE extension
	/*
	/* ***   NON ELIMINARE   ***
	/*
	//mapServerUrl			base-url del visualizzatore. Non dichiarare l'host per maggiore portabilita'
	//webLayout				layout della carta del catasto (nella library del MapGuideServer)
	$GLOBALS[$GLOBALS['package']]['mapguide']['mapServerUrl'] = '/mapguide/ldpviewer';
	$GLOBALS[$GLOBALS['package']]['mapguide']['webLayout'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/02_layouts/app.WebLayout";
	$GLOBALS[$GLOBALS['package']]['mapguide']['mappa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/app.MapDefinition";
	$GLOBALS[$GLOBALS['package']]['mapDefinition']=$GLOBALS[$GLOBALS['package']]['mapguide']['mappa'];

	*/

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
																							
	// OVD MENUPAGE $GLOBALS[$GLOBALS['package']]['menu_page'] = '';
	
	/**
	 * MAP SETTINGS
	 * definition of the map to be shown:
	 * - general info (title, ...)
	 * - map definition (layers, projection, ...)
	 */
	$GLOBALS[$GLOBALS['package']]['map_title']="Test Comune Pisa (3003)";
	$GLOBALS[$GLOBALS['package']]['map_description']="Map of Comune Pisa to visualize the buildings and some related administration documents.<br>&nbsp;<br>The map is projected using the GaussBoaga coordinates: this projection is not supported by some global data server as, for example, the NASA Earth Observations Server, which thereforecannot be overlaid on the map.";
	$GLOBALS[$GLOBALS['package']]['map_options']=array(
			'data_projection'=>'EPSG:3003',					// default projection (used for example to set the initial zoom, to calculate the scale, to measure the distances, ...
			'initial_map_center'=>array(1673500, 4815330),	// coordinate of the center of the default view (based on data_projection)
			'initial_zoom'=>17,								// zoom level of the default view
			'default_base_layer'=>"open_street_map",		// 
			'map_projection'=>'EPSG:3003',					// projection used for the map rendering and for the visualization of the coordinates while moving the mouse
			'map_measure_threshold'=>1000,					// threshold for the defaults measure tooltip visualization
			'map_measure_units'=>'km',						// symbol used in the measure tooltip when the value is > map_measure_threshold
			'map_measure_sub_units_number'=>1,				// number of subunits for 1 unit
			'map_measure_sub_units'=>'m',					// symbol used in the measure tooltip when the value is <= map_measure_threshold
			'show_coordinates_mouse'=>true,					// used to enable/disable the display of the coordinates while moving the mouse over the map
			'show_number_selected_features'=>true,			// used to enable/disable the display of the number of selected features
			'show_view_scale'=>true,						// used to enable/disable the display of the scale of the current view
			'show_view_crs'=>true,							// used to enable/disable the display of the CRS of the current view
			'show_feature_attribute_without_ctrl'=>true		// enable the visualization of the feature attribute also without pressing the CTRL key
			//'show_epsg_on_coordinates'=>true,				// show the "data" coordinate system beside the coordinates related to the mouse position
	);
	/*
	$GLOBALS[$GLOBALS['package']]['map_title']="Test Comune Pisa (3857)";
	$GLOBALS[$GLOBALS['package']]['map_description']="Map of Comune Pisa to visualize the buildings and some related administration documents.<br>&nbsp;<br>The map is projected using the metric projection Spherical Mercator: this projection is widely supported by the most global data server, even if the accuracy is quite low.";
	$GLOBALS[$GLOBALS['package']]['map_options']=array(
			'data_projection'=>'EPSG:3003',					// default projection (used for example to set the initial zoom, to calculate the scale, to measure the distances, ...
			'initial_map_center'=>array(1673500, 4815330),	// coordinate of the center of the default view (based on data_projection)
			'initial_zoom'=>17,								// zoom level of the default view
			'default_base_layer'=>"open_street_map",		// 
			'map_projection'=>'EPSG:3857',					// projection used for the map rendering and for the visualization of the coordinates while moving the mouse
			'map_measure_threshold'=>1000,					// threshold for the defaults measure tooltip visualization
			'map_measure_units'=>'km',						// symbol used in the measure tooltip when the value is > map_measure_threshold
			'map_measure_sub_units_number'=>1,				// number of subunits for 1 unit
			'map_measure_sub_units'=>'m',					// symbol used in the measure tooltip when the value is <= map_measure_threshold
			'show_coordinates_mouse'=>true,					// used to enable/disable the display of the coordinates while moving the mouse over the map
			'show_number_selected_features'=>true,			// used to enable/disable the display of the number of selected features
			'show_view_scale'=>true,						// used to enable/disable the display of the scale of the current view
			'show_view_crs'=>true,							// used to enable/disable the display of the CRS of the current view
			'show_feature_attribute_without_ctrl'=>true		// enable the visualization of the feature attribute also without pressing the CTRL key
			//'show_epsg_on_coordinates'=>true,				// show the "data" coordinate system beside the coordinates related to the mouse position
	);
	*/
/*
*/
//$GLOBALS[$GLOBALS['package']]['map_options']['data_projection'] = 'EPSG:4326';                  // OVD ELIMINARE
//$GLOBALS[$GLOBALS['package']]['map_options']['initial_map_center'] = array(11.15, 43.47);       // OVD ELIMINARE - PISA
//$GLOBALS[$GLOBALS['package']]['map_options']['initial_map_center'] = array(1673500.0, 4815330.0);       // OVD ELIMINARE - PISA
//$GLOBALS[$GLOBALS['package']]['map_options']['map_projection'] = 'EPSG:4326';                   // OVD ELIMINARE  'EPSG:3857';
/*
	$GLOBALS[$GLOBALS['packagee']]['map_options']=array(
			'data_projection'=>'EPSG:4326',					// default projection (used for example to set the initial zoom, to calculate the scale, to measure the distances, ...
			'initial_map_center'=>array(11.355, 43.317),	// coordinate of the center of the default view (based on data_projection)
			'initial_zoom'=>17,								// zoom level of the default view
			'default_base_layer'=>"open_street_map",		// 
			'map_projection'=>'EPSG:4326',					// projection used for the map rendering and for the visualization of the coordinates while moving the mouse
			'map_measure_threshold'=>1,						// threshold for the defaults measure tooltip visualization
			'map_measure_units'=>'dd',						// symbol used in the measure tooltip when the value is > map_measure_threshold
			'map_measure_sub_units_number'=>60,				// number of subunits for 1 unit
			'map_measure_sub_units'=>'min'					// symbol used in the measure tooltip when the value is <= map_measure_threshold
			//'show_epsg_on_coordinates'=>true,				// show the "data" coordinate system beside the coordinates related to the mouse position
	);
*/	
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
	
	// OVD handles in another way		,"aggiungiWMS" => true

	/**
	 * MAIN LAYERS SETTINGS
	 * definition of the "main layers" (MapGuide, WMS, ...) to be handled:
	 */
//	$GLOBALS[$GLOBALS['package']]['map_definition']=array(                            // OVD delete this example
// 			"mapguide"=> array(
// 					"tipo"=> "mapguide",
// 					"mapDefinition"=>$GLOBALS[$GLOBALS['package']]['mapDefinition'],
// 					"url"=>"/mapguide/mapagent/mapagent.fcgi?USERNAME=Anonymous",
// 					"api_url"=>"/mapguide/ldpolviewer/api.php",
// 					"layers_info" => array()
// 			)
//	);
	
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
// OVD

//										'layer_title' => 'World Imagery (ESRI ArcGisOnLine)',
//										'layer_description' => 'World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide. The map includes 15m TerraColor imagery at small and mid-scales (~1:591M down to ~1:288k) for the world. The map features Maxar imagery at 0.3m resolution for select metropolitan areas around the world, 0.5m resolution across the United States and parts of Western Europe, and 1m resolution imagery across the rest of the world. In addition to commercial sources, the World Imagery map features high-resolution aerial photography contributed by the GIS User Community. This imagery ranges from 0.3m to 0.03m resolution (down to ~1:280 in select communities).',
//										'layer_copyright' => 'Sources: Esri, Maxar, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', // max_zoom = 18 (1:1.200)
//										'max_zoom' => 18,

//										'layer_title' => 'World Topographic Map (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map is designed to be used as a basemap by GIS professionals and as a reference map by anyone. The map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports overlaid on land cover and shaded relief imagery for added context. The map provides coverage for the world down to a scale of ~1:72k. Coverage is provided down to ~1:4k for the following areas: Australia and New Zealand; India; Europe; Canada; Mexico; the continental United States and Hawaii; South America and Central America; Africa; and most of the Middle East. Coverage down to ~1:1k and ~1:2k is available in select urban areas. This basemap was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey (USGS), U.S. Environmental Protection Agency (EPA), U.S. National Park Service (NPS), Food and Agriculture Organization of the United Nations (FAO), Department of Natural Resources Canada (NRCAN), GeoBase, Agriculture and Agri-Food Canada, Garmin, HERE, Esri, OpenStreetMap contributors, and the GIS User Community.',
//										'layer_copyright' => 'Sources: Esri, HERE, Garmin, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), (c) OpenStreetMap contributors, and the GIS User Community',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 18 (1:1.200)
//										'max_zoom' => 18,

//										'layer_title' => 'World Street Map (ESRI ArcGisOnLine)',
//										'layer_description' => 'This worldwide street map presents highway-level data for the world. Street-level data includes the United States; much of Canada; Mexico; Europe; Japan; Australia and New Zealand; India; South America and Central America; Africa; and most of the Middle East. This comprehensive street map includes highways, major roads, minor roads, one-way arrow indicators, railways, water features, administrative boundaries, cities, parks, and landmarks, overlaid on shaded relief imagery for added context. The map also includes building footprints for selected areas. Coverage is provided down to ~1:4k with ~1:1k and ~1:2k data available in select urban areas. The street map was developed by Esri using Esri basemap data, Garmin basemap layers, U.S. Geological Survey (USGS) elevation data, Intact Forest Landscape (IFL) data for the world; HERE data for Europe, Australia and New Zealand, North America, South America and Central America, Africa, India, and most of the Middle East; OpenStreetMap contributors for select countries in Africa and Pacific Islands; NGCC data for China; and select data from the GIS user community.',
//										'layer_copyright' => 'Esri, HERE, Garmin, USGS, Intermap, INCREMENT P, NRCan, Esri Japan, METI, Esri China (Hong Kong), Esri Korea, Esri (Thailand), NGCC, (c) OpenStreetMap contributors, and the GIS User Community',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 18 (1:1.200)
//										'max_zoom' => 18,

//										'layer_title' => 'World Boundaries and Places (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map presents country boundaries, first order (State/Province) internal administrative boundaries for most countries, second order administrative boundaries for the United States (counties) and some countries in Europe, and place names for the world. The map was developed by Esri using administrative and cities data from Esri; Garmin basemap layers for the world; HERE data for North America, Europe, Australia, New Zealand, South America and Central America, Africa, India, and most of the Middle East; OpenStreetMap data for some features in select African countries; and feature names from the GIS user community. This map is designed for use with maps with darker backgrounds, such as World Imagery.',
//										'layer_copyright' => 'Sources: Esri, HERE, Garmin, (c) OpenStreetMap contributors, and the GIS user community',
//										'wms_url' => 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', // max_zoom = 18 (1:1.200)
//										'max_zoom' => 18,

//										'layer_title' => 'World Transportation (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map presents transportation data, including highways, roads, railroads, and airports for the world. The map was developed by Esri using Esri highway data; Garmin basemap layers; HERE street data for North America, Europe, Australia, New Zealand, South America and Central America, India, select countries in Africa, and most of the Middle East. Data from OpenStreetMap contributors in select countries in Africa. ',
//										'layer_copyright' => 'Sources: Esri, HERE, Garmin, (c) OpenStreetMap contributors',
//										'wms_url' => 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', // max_zoom = 18 (1:1.200)
//										'max_zoom' => 18,

//										'layer_title' => 'World Hillshade (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map portrays elevation as an artistic hillshade. This map is designed to be used as a backdrop for topographical, soil, hydro, landcover or other outdoor recreational maps. The map was compiled from a variety of sources from several data providers. The basemap has global coverage down to a scale of ~1:577k. In North America, South America, Africa, Australia, the East Indies, New Zealand, islands of the western Pacific, in most of Europe and continental Asia the coverage is available down to ~1:144k. In the United States, Western Europe, Finland and Norway coverage is provided to ~1:18k. Additionally, Netherlands, Denmark, Finland and select areas of the U.S. are provided down to ~1:9k.',
//										'layer_copyright' => 'Sources: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, Intermap and the GIS user community',
//										'wms_url' => 'https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}', // max_zoom = 15.4 (1:13.600)
//										'max_zoom' => 15.4,

//										'layer_title' => 'World Hillshade Dark (ESRI ArcGisOnLine)',
//										'layer_description' => 'The World Hillshade (Dark) map provides a terrain hillshade rendering of 24-meter elevation data globally and 10-meter or better in many parts of the world. Compiled from a variety of sources, including contributions from the GIS User Community, this hillshade map is designed to be used as a backdrop for various other types of maps and mapping data.',
//										'layer_copyright' => 'Sources: Esri, Airbus DS, USGS, NGA, NASA, CGIAR, N Robinson, NCEAS, NLS, OS, NMA, Geodatastyrelsen, Rijkswaterstaat, GSA, Geoland, FEMA, Intermap and the GIS user community',
//										'wms_url' => 'https://server.arcgisonline.com/arcgis/rest/services/Elevation/World_Hillshade_Dark/MapServer/tile/{z}/{y}/{x}', // max_zoom = 15.4 (1:13.600)
//										'max_zoom' => 15.4,

//										'layer_title' => 'World Shaded Relief (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map portrays surface elevation as shaded relief. This map is used as a basemap layer to add shaded relief to other GIS maps, such as the ArcGIS Online World Street Map. It is especially useful in maps that do not contain orthoimagery. The map resolution (cell size) is as follows: 30 Meters for the U.S. 90 Meters for all land areas between 60 degrees north and 56 degrees south latitude. 1 KM resolution above 60 degrees north and 56 degrees south. The shaded relief imagery was developed by Esri using GTOPO30, Shuttle Radar Topography Mission (SRTM), and National Elevation Data (NED) data from the USGS.',
//										'layer_copyright' => 'Copyright:(c) 2014 Esri',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', // max_zoom = 13.4 (1:55.000)
//										'max_zoom' => 13.4,

//										'layer_title' => 'National Geographic World Map (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map is designed to be used as a general reference map for informational and educational purposes as well as a base map by GIS professionals and other users for creating web maps and web mapping applications. The map was developed by National Geographic and Esri and reflects the distinctive National Geographic cartographic style in a multi-scale reference map of the world. The map was authored using data from a variety of leading data providers, including Garmin, HERE, UNEP-WCMC, NASA, ESA, USGS, and others. This reference map includes administrative boundaries, cities, protected areas, highways, roads, railways, water features, buildings and landmarks, overlaid on shaded relief and land cover imagery for added context. The map currently includes global coverage down to ~1:144k scale and more detailed coverage for North America down to ~1:9k scale.',
//										'layer_copyright' => 'Sources: National Geographic, Esri, Garmin, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 12.4 (1:110.000)
//										'max_zoom' => 12.4,

//										'layer_title' => 'World Boundaries and Places Alternate(ESRI ArcGisOnLine)',
//										'layer_description' => 'This map presents country boundaries, first order (State/Province) internal administrative boundaries for most countries, second order administrative boundaries for the United States (counties) and some countries in Europe, and place names for the world. The map was developed by Esri using administrative and cities data from Esri, HERE, and Garmin basemap layers for the world. Hydrographic names for select countries in Africa from (c) OpenStreetMap contributors, and select features from the GIS user community. This map is designed for use with maps with lighter backgrounds, such as World Shaded Relief.',
//										'layer_copyright' => 'Sources: Esri, HERE, Garmin, (c) OpenStreetMap contributors, and the GIS user community',
//										'wms_url' => 'https://server.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}', // max_zoom = 12.4 (1:110.000)
//										'max_zoom' => 12.4,

//										'layer_title' => 'DeLorme World Base Map (ESRI ArcGisOnLine)',
//										'layer_description' => 'Garmin\'s basemap is designed to be used by GIS technicians and other mapping professionals, across a variety of industries. The Garmin World Basemap is a seamless global data set with horizontal accuracy of +/- 50 meters. The map accurately portrays major transportation layers, inland and shoreline hydrography, agreed and disputed jurisdiction boundaries, and major geographic features. The map provides coverage for the world down to a scale of approximately 1:144k. In designing the map, Garmin applied a rich cartographic look and feel to create a seamless view of the world, combining accurate object placement and projection with a compelling topographic visualization of the Earth.',
//										'layer_copyright' => 'Copyright:(c) 2018 Garmin',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/DeLorme_World_Base_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 12.4 (1:110.000)
//										'max_zoom' => 12.4,

//										'layer_title' => 'World Ocean Reference (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map service is designed to be used as the reference layer for the ocean base map. The reference layer includes marine water body names, undersea feature names, and derived depth values in meters. Land features include administrative boundaries, cities, inland waters, roads, overlaid on land cover and shaded relief imagery. The reference layer was compiled from a variety of best available sources from several data providers, including General Bathymetric Chart of the Oceans GEBCO_08 Grid, IHO-IOC GEBCO Gazetteer of Undersea Feature Names, National Oceanic and Atmospheric Administration (NOAA), and National Geographic, Garmin, HERE, Geonames.org, and Esri, and various other contributors. The base map currently provides coverage for the world down to a scale of ~1:577k, and coverage down to 1:72k in US coastal areas, and various other areas. Coverage down to ~ 1:9k is available limited areas based on regional hydrographic survey data. The base map was designed and developed by Esri. NOTE: Data from the GEBCO_08 grid shall not to be used for navigation or for any other purpose relating to safety at sea. The GEBCO_08 Grid is largely based on a database of ship-track soundings with interpolation between soundings guided by satellite-derived gravity data. In some areas, data from existing grids are included. The GEBCO_08 Grid does not contain detailed information in shallower water areas, information concerning the generation of the grid can be found on GEBCO\'s web site: GEBCO. The GEBCO_08 Grid is accompanied by a Source Identifier (SID) Grid which indicates which cells in the GEBCO_08 Grid are based on soundings or existing grids and which have been interpolated. The latest version of both grids and accompanying documentation is available to download, on behalf of GEBCO, from the British Oceanographic Data Centre (BODC) BODC. The names of the IHO (International Hydrographic Organization), IOC (intergovernmental Oceanographic Commission), GEBCO (General Bathymetric Chart of the Oceans), NERC (Natural Environment Research Council) or BODC (British Oceanographic Data Centre) may not be used in any way to imply, directly or otherwise, endorsement or support of either the Licensee or their mapping system.', 
//										'layer_copyright' => 'Sources: Esri, GEBCO, NOAA, National Geographic, Garmin, HERE, Geonames.org, and other contributors',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}', // max_zoom = 10.4 (1:440.000)
//										'max_zoom' => 10.4,

//										'layer_title' => 'World Ocean Base (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map is designed to be used as a base map by marine GIS professionals and as a reference map by anyone interested in ocean data. The base map features marine bathymetry. Land features include inland waters and roads overlaid on land cover and shaded relief imagery. The map was compiled from a variety of best available sources from several data providers, including General Bathymetric Chart of the Oceans GEBCO_08 Grid, National Oceanic and Atmospheric Administration (NOAA), and National Geographic, Garmin, HERE, Geonames.org, and Esri, and various other contributors. The base map currently provides coverage for the world down to a scale of ~1:577k, and coverage down to 1:72k in US coastal areas, and various other areas. Coverage down to ~ 1:9k is available limited areas based on regional hydrographic survey data. The base map was designed and developed by Esri. NOTE: Data from the GEBCO_08 grid shall not to be used for navigation or for any other purpose relating to safety at sea. The GEBCO_08 Grid is largely based on a database of ship-track soundings with interpolation between soundings guided by satellite-derived gravity data. In some areas, data from existing grids are included. The GEBCO_08 Grid does not contain detailed information in shallower water areas, information concerning the generation of the grid can be found on GEBCO\'s web site: GEBCO. The GEBCO_08 Grid is accompanied by a Source Identifier (SID) Grid which indicates which cells in the GEBCO_08 Grid are based on soundings or existing grids and which have been interpolated. The latest version of both grids and accompanying documentation is available to download, on behalf of GEBCO, from the British Oceanographic Data Centre (BODC) BODC. The names of the IHO (International Hydrographic Organization), IOC (intergovernmental Oceanographic Commission), GEBCO (General Bathymetric Chart of the Oceans), NERC (Natural Environment Research Council) or BODC (British Oceanographic Data Centre) may not be used in any way to imply, directly or otherwise, endorsement or support of either the Licensee or their mapping system.',
//										'layer_copyright' => 'Sources: Esri, Garmin, GEBCO, NOAA NGDC, and other contributors',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}', // max_zoom = 10.4 (1:440.000)
//										'max_zoom' => 10.4,

//										'layer_title' => 'World Terrain Base (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map is designed to be used as a base map by GIS professionals to overlay other thematic layers such as demographics or land cover. The base map features shaded relief imagery, bathymetry, and coastal water features designed to provide a neutral background for other data layers. The map was compiled from a variety of sources from several data providers, including the U.S. Geological Survey, NOAA, and Esri. The base map currently provides coverage for the world down to a scale of ~1:1m and coverage for the continental United States and Hawaii to a scale of ~1:70k.',
//										'layer_copyright' => 'Sources: Esri, USGS, NOAA',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', // max_zoom = 9.4 (1:880,000)
//										'max_zoom' => 9.4,

//										'layer_title' => 'World Reference Overlay  (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map is designed to be used by GIS professionals to overlay base maps and thematic maps such as demographics or land cover for reference purposes. The reference map includes administrative boundaries, cities, water features, physiographic features, parks, landmarks, highways, roads, railways, and airports on a transparent background. The map was compiled from a variety of best available sources from several data providers, including the U.S. Geological Survey, National Park Service, Garmin, and ESRI. The reference map currently provides coverage for the world down to a scale of ~1:1m and coverage for the continental United States and Hawaii to a scale of ~1:70k.',
//										'layer_copyright' => 'Sources: Esri, Garmin, USGS, NPS',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}', // max_zoom = 9.4 (1:880.000)
//										'max_zoom' => 9.4,

//										'layer_title' => 'World Navigation Charts (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map presents a digital version of the Operational Navigation Charts (ONC) at 1:1,000,000-scale, produced by the US National Geospatial-Intelligence Agency (NGA). The map includes over 200 charts across the world, excluding parts of North America, Europe, Asia, and Oceania where charts are not publicly available.',
//										'layer_copyright' => 'Copyright:(c) 2013 East View Cartographic',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Navigation_Charts/MapServer/tile/{z}/{y}/{x}', // max_zoom = 9.4 (1:880.000)
//										'max_zoom' => 9.4,

//										'layer_title' => 'World Physical Map (ESRI ArcGisOnLine)',
//										'layer_description' => 'This map presents the Natural Earth physical map at 1.24km per pixel for the world and 500m for the coterminous United States.',
//										'layer_copyright' => 'Sources: US National Park Service',
//										'wms_url' => 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}', // max_zoom = 8.4 (1:1.750.000)
//										'max_zoom' => 8.4,

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
/*
			'ortofoto_regione_toscana_2016' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'http://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&map_resolution=91&',
										'wms_layers_names' => 'rt_ofc.5k16.32bit',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:3003', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_title' => 'Ortofoto Regione Toscana (2016)',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'ortofoto_regione_toscana_2016'),
										'is_basemap_layer' => true
										),
			'ortofoto_regione_toscana_2013' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc&map_resolution=91&language=ita&',
										'wms_layers_names' => 'rt_ofc.10k13',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:3003', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_title' => 'Ortofoto Regione Toscana (2013)',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'ortofoto_regione_toscana_2013'),
										'is_basemap_layer' => true
										),
			'limiti_regione_toscana' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&',
										'wms_layers_names' => 'rt_ambamm.idcomuni.rt.poly',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:3003', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_title' => 'Limiti Regione Toscana',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'limiti_regione_toscana'),
										'is_basemap_layer' => true
										),
			'catasto_regione_toscana' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'http://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&',
										'wms_layers_names' => 'rt_cat.idcatbdfog.rt,rt_cat.idcatpart.rt,rt_cat.idcatfabbr.rt',
										'wms_query_layers_names' => 'rt_cat.idcatbdfog.rt,rt_cat.idcatpart.rt,rt_cat.idcatfabbr.rt',
										'wms_info_format' => 'text/html',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:3003', // $GLOBALS[$GLOBALS['package']]['map_options']['data_projection']
										'layer_title' => 'Catasto (Regione Toscana)',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'catasto_regione_toscana'),
										'is_basemap_layer' => true
										),
*/
			'ndvi_neo' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'https://neo.sci.gsfc.nasa.gov/wms/wms?version=1.3.0&service=WMS&',
										'wms_layers_names' => 'MOD_NDVI_M',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'CRS:84',
										'layer_title' => 'Vegetation Index (NASA Earth Observation)',
										'layer_description' => 'Vegetation Index [NDVI] (1 month - Terra/MODIS).',
										'layer_copyright' => 'Sources: NASA Earth Observatory, MODIS Satellite',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'ndvi_neo'),
										'is_basemap_layer' => true
										),
			'land_cover_neo' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'https://neo.sci.gsfc.nasa.gov/wms/wms?version=1.3.0&service=WMS&',
										'wms_layers_names' => 'MCD12C1_T1',
										'wms_query_layers_names' => '',
										'wms_info_format' => '',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'CRS:84',
										'layer_title' => 'Land Cover Classification (NASA Earth Observation)',
										'layer_description' => 'Land Cover derived from MODIS satellite data.',
										'layer_copyright' => 'Sources: NASA Earth Observatory, MODIS Satellite',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'land_cover_neo'),
										'is_basemap_layer' => true
										),
                                      
/*
			'cartografia_catastale' => array(
										'source_type' => 'TileWMS',
										'wms_url' => 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
										'wms_layers_names' => 'CP.CadastralZoning,CP.CadastralParcel,fabbricati',
										'wms_query_layers_names' => 'CP.CadastralZoning,CP.CadastralParcel',
										'wms_info_format' => 'text/html',
										'wms_server_type' => 'geoserver',
										'wms_layer_projection' => 'EPSG:25832',
										'layer_title' => 'Catasto (Agenzia delle Entrate)',
										'layer_visible' => ($GLOBALS[$GLOBALS['package']]['map_options']['default_base_layer'] == 'cartografia_catastale'),
										'is_basemap_layer' => true
										),

*/

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
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio",
					"server_url"		=> "http://www502.regione.toscana.it/geoscopio_qg/cgi-bin/qgis_mapserv?map=dbtm_rt.qgs&"
			),
			"geoscopio_rt_cat"=> array(
					"title"				=> "Geoscopio Regione Toscana (Catasto)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio",
					"server_url"		=> "http://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&"
			),
			"geoscopio_rt_orto"=> array(
					"title"				=> "Geoscopio Regione Toscana (Ortofoto)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio",
					"server_url"		=> "http://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&map_resolution=91&"
			),
			"geoscopio_rt_limamm"=> array(
					"title"				=> "Geoscopio Regione Toscana (Limiti Amministrativi)",
					"description_url"	=> "https://www.regione.toscana.it/-/geoscopio",
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

	 
	 
	 
	 /* FINE Nuovo visualizzatore */

/* OVD - USATO DALLE FUNZIONI DELL?APPLICAZIONE (RICERCHE, INTERROGAZIONI, EXPORT)

	// ---------- IMMAGINI ---------- 
	$GLOBALS[$GLOBALS['package']]['imgPath'] ='/share/catasto/include/img/';
	
	// ------------ CSS ------------- 
	//screen				css per la visualizzazione
	//print					css per la stampa
	//report				css per i report
	if($_SESSION['viewer']=="myOV" || $_GET['viewer']=="myOV") {
		$GLOBALS[$GLOBALS['package']]['css'] = array(
												"screen"        => "/share/catasto/include/css/screen_ldpviewer.css",
												"print"         => "/share/catasto/include/css/cts_print.css",
												"report"        => "/share/catasto/include/css/cts_report.css"
		);
	}
	else{
				$GLOBALS[$GLOBALS['package']]['css'] = array(
												"screen"        => "/share/catasto/include/css/cts_screen.css",
												"print"         => "/share/catasto/include/css/cts_print.css",
												"report"        => "/share/catasto/include/css/cts_report.css",
		);
	}

	// ------------ HTML ------------- 
	//attesa				codice html da mostrare nell'attesa delle chiamate ajax
	//errore				codice html da mostrare in caso di errore generico
	//erroreTimeout			codice html da mostrare in caso di errore di timeout
	$GLOBALS[$GLOBALS['package']]['html']['attesa'] ="<div class='wait'>Attendere prego...</div>";
	$GLOBALS[$GLOBALS['package']]['html']['errore'] ="<div class='error'>Ooops, c'&egrave; stato un errore</div>";
	$GLOBALS[$GLOBALS['package']]['html']['erroreParametri'] ="<div class='error'>Sono presenti degli errori nei dati passati. Impossibile proseguire</div>";
	$GLOBALS[$GLOBALS['package']]['html']['erroreTimeout'] ="<div class='error'>Questa ricerca &egrave; troppo vasta.<br />Si prega di scegliere parametri pi&ugrave; restrittivi</div>";

	// ------------ AJAX ------------- 
	//timeout				valore di timeout in ms delle chiamate ajax. Va armonizzato con statement_limit in postgresql.conf (30000)
	// OVD $GLOBALS[$GLOBALS['package']]['ajax']['timeout']=35000;

	// ------------ DEFAULT ------------- 
	//scalaZoom						scala per gli zoom sulla mappa
	//a_resultsPerPage				array del numero di elementi da mostrare per pagina nelle ricerche
	//a_resultsPerPage_single		numero di elementi da mostrare per pagina nelle pagine un solo connettore
	//a_resultsPerPage_multiple		numero di elementi da mostrare per pagina nelle pagine con più connettori contemporaneamente
	$GLOBALS[$GLOBALS['package']]['default']['scalaZoom']=1000;
	$GLOBALS[$GLOBALS['package']]['default']['resultsPerPage']=array('10','20','50','100','tutti');
	$GLOBALS[$GLOBALS['package']]['default']['resultsPerPage_single']=20;
	$GLOBALS[$GLOBALS['package']]['default']['resultsPerPage_multiple']=10;

	// ------------ RICERCHE ------------- 
	$GLOBALS['ricerche']['localita']=true;
	$GLOBALS['ricerche']['toponimo_civico']=true;
	$GLOBALS['ricerche']['sezione_foglio_particella']=true;
	
	// ------------ ??????? ------------- 
	$GLOBALS[$GLOBALS["package"]]["ov_layers_selection_extra_fields"]='';
*/

?>
