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

	$GLOBALS[$GLOBALS['package']]['map_definition']=array(
// 			"mapguide"=> array(
// 					"tipo"=> "mapguide",
// 					"mapDefinition"=>$GLOBALS[$GLOBALS['package']]['mapDefinition'],
// 					"url"=>"/mapguide/mapagent/mapagent.fcgi?USERNAME=Anonymous",
// 					"api_url"=>"/mapguide/ldpolviewer/api.php",
// 					"layers_info" => array()
// 			)
	);
	
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
	$GLOBALS[$GLOBALS['package']]['map_title']="Test Map";

	$GLOBALS[$GLOBALS['package']]['map_options']=array(
			'data_projection'=>'EPSG:3003',					// default projection (used for example to set the initial zoom, to calculate the scale, to measure the distances, ...
			'initial_map_center'=>array(1691030, 4798730),	// coordinate of the center of the default view (based on data_projection)
			'initial_zoom'=>17,								// zoom level of the default view
			'default_base_layer'=>"open_street_map",		// 
			'map_projection'=>'EPSG:3003',					// projection used for the map rendering and for the visualization of the coordinates while moving the mouse
			'map_measure_threshold'=>1000,					// threshold for the defaults measure tooltip visualization
			'map_measure_units'=>'km',						// symbol used in the measure tooltip when the value is > map_measure_threshold
			'map_measure_sub_units_number'=>1,				// number of subunits for 1 unit
			'map_measure_sub_units'=>'m',					// symbol used in the measure tooltip when the value is <= map_measure_threshold
			'show_coordinates_mouse'=>true,					// used to enable/disable the display of the coordinates while moving the mouse over the map
			'show_number_selected_features'=>false,			// used to enable/disable the display of the number of selected features
			'show_view_scale'=>true,						// used to enable/disable the display of the scale of the current view
			'show_view_crs'=>true							// used to enable/disable the display of the CRS of the current view
			//'show_epsg_on_coordinates'=>true,				// show the "data" coordinate system beside the coordinates related to the mouse position
	);
$GLOBALS[$GLOBALS['package']]['map_options']['map_projection'] = 'EPSG:4326'; // OVD ELIMINARE       'EPSG:3857';

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
	 * LAYERS SETTINGS
	 * definition of the layers to be handled:
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
	 * EXAMPLE WMS SERVER - ATTUALMENTE INUTILIZZATO
	 * used for the "example" panel
	 */
	$GLOBALS[$GLOBALS['package']]['wms_example_server']['title'] = "Cartografia di base - IGM 100.000  ";
	$GLOBALS[$GLOBALS['package']]['wms_example_server']['source'] = "Geoportale Nazionale";
	$GLOBALS[$GLOBALS['package']]['wms_example_server']['portal_url'] = "http://www.pcn.minambiente.it/mattm/servizio-wms/";
	$GLOBALS[$GLOBALS['package']]['wms_example_server']['description_url'] = "http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_100000.map&service=wms&request=getCapabilities&version=1.3.0";
	$GLOBALS[$GLOBALS['package']]['wms_example_server']['server_url'] = "http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/IGM_100000.map";
	
	
	
	/**
	 * OTHER SETTINGS
	 */
	 $GLOBALS[$GLOBALS['package']]['show_console_messages'] = true;
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
