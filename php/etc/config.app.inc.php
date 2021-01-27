<?php
	/* inclusione del file config.inc.php generale */
	require_once 'config.inc.php';
	
	session_start();
	
	$GLOBALS['package']="app";
	
	$GLOBALS['app']['login']['gruppi viewers'] = array();
	$GLOBALS['app']['login']['url denied'] = $GLOBALS['site_url'];
	
	/* ------------ DATABASE ------------- */
	$GLOBALS['app']['db']['connect'] = $GLOBALS['aa_dbConnect']['default'];
	$GLOBALS['app']['db']['connectOptions_readOnly'] = array();
	$GLOBALS['app']['db']['connectOptions'] = array(
		'useTransaction' => true,
	);
	
	/* ------------ MAPGUIDE ------------- */
	//mapServerUrl			base-url del visualizzatore. Non dichiarare l'host per maggiore portabilita'
	//webLayout				layout della carta del catasto (nella library del MapGuideServer)
	$GLOBALS['app']['mapguide']['mapServerUrl'] = '/mapguide/ldpviewer';
	$GLOBALS['app']['mapguide']['webLayout'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/02_layouts/app.WebLayout";
	$GLOBALS['app']['mapguide']['mappa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/app.MapDefinition";

	/* Nuovo visualizzatore */

	$GLOBALS['app']['LdpViewer_exit_url'] = "{$GLOBALS['site_url']}/?q=cartobase";
	$GLOBALS['app']['tabs_view'] = array('ldpviewer_link_menu'=>false,'ldpviewer_tab_info' => false);
	$GLOBALS['app']['menu_page'] = '';
	
	$GLOBALS['app']['mapDefinition']=$GLOBALS['app']['mapguide']['mappa'];
	$GLOBALS['app']['LdpViewer_map_title']="Catasto";

	$GLOBALS['app']['LdpViewer_exit_url'] = "{$GLOBALS['site_url']}/?q=cartobase";

	$GLOBALS['app']['LdpViewer_map_options']=array(
			"centro"=>array(1689072, 4798215),
			"zoom"=>12.5,
			"default_base_layer"=>"OpenStreetMap",
			"dataProjection"=>'EPSG:3003',
			"mapProjection"=>'EPSG:3003',
			"aggiungiWMS" => true
	);

	$GLOBALS['app']['LdpViewer_map_definition']=array(
// 			"mapguide"=> array(
// 					"tipo"=> "mapguide",
// 					"mapDefinition"=>$GLOBALS['app']['mapDefinition'],
// 					"url"=>"/mapguide/mapagent/mapagent.fcgi?USERNAME=Anonymous",
// 					"api_url"=>"/mapguide/ldpolviewer/api.php",
// 					"layers_info" => array()
// 			)
	);
	
	//Valori ammissibili di base_layers: dbt_regione_toscana,ortofoto_regione_toscana,osm,limiti_regione_toscana,nessuno . Vanno immessi in un array ed encodato json.
		$GLOBALS['app']['base_layers'] = json_encode(array("osm"));
	
	/* FINE Nuovo visualizzatore */


	/* ---------- IMMAGINI ---------- */
	$GLOBALS['app']['imgPath'] ='/share/catasto/include/img/';
	
	/* ------------ CSS ------------- */
	//screen				css per la visualizzazione
	//print					css per la stampa
	//report				css per i report
	if($_SESSION['viewer']=="ldp" || $_GET['viewer']=="ldp") {
		$GLOBALS['app']['css'] = array(
												"screen"        => "/share/catasto/include/css/screen_ldpviewer.css",
												"print"         => "/share/catasto/include/css/cts_print.css",
												"report"        => "/share/catasto/include/css/cts_report.css"
		);
	}
	else{
				$GLOBALS['app']['css'] = array(
												"screen"        => "/share/catasto/include/css/cts_screen.css",
												"print"         => "/share/catasto/include/css/cts_print.css",
												"report"        => "/share/catasto/include/css/cts_report.css",
		);
	}

	/* ------------ HTML ------------- */
	//attesa				codice html da mostrare nell'attesa delle chiamate ajax
	//errore				codice html da mostrare in caso di errore generico
	//erroreTimeout			codice html da mostrare in caso di errore di timeout
	$GLOBALS['app']['html']['attesa'] ="<div class='wait'>Attendere prego...</div>";
	$GLOBALS['app']['html']['errore'] ="<div class='error'>Ooops, c'&egrave; stato un errore</div>";
	$GLOBALS['app']['html']['erroreParametri'] ="<div class='error'>Sono presenti degli errori nei dati passati. Impossibile proseguire</div>";
	$GLOBALS['app']['html']['erroreTimeout'] ="<div class='error'>Questa ricerca &egrave; troppo vasta.<br />Si prega di scegliere parametri pi&ugrave; restrittivi</div>";

	/* ------------ AJAX ------------- */
	//timeout				valore di timeout in ms delle chiamate ajax. Va armonizzato con statement_limit in postgresql.conf (30000)
	$GLOBALS['app']['ajax']['timeout']=35000;

	/* ------------ DEFAULT ------------- */
	//scalaZoom						scala per gli zoom sulla mappa
	//a_resultsPerPage				array del numero di elementi da mostrare per pagina nelle ricerche
	//a_resultsPerPage_single		numero di elementi da mostrare per pagina nelle pagine un solo connettore
	//a_resultsPerPage_multiple		numero di elementi da mostrare per pagina nelle pagine con più connettori contemporaneamente
	$GLOBALS['app']['default']['scalaZoom']=1000;
	$GLOBALS['app']['default']['resultsPerPage']=array('10','20','50','100','tutti');
	$GLOBALS['app']['default']['resultsPerPage_single']=20;
	$GLOBALS['app']['default']['resultsPerPage_multiple']=10;

	/* ------------ RICERCHE ------------- */
	$GLOBALS['ricerche']['localita']=true;
	$GLOBALS['ricerche']['toponimo_civico']=true;
	$GLOBALS['ricerche']['sezione_foglio_particella']=true;
?>
