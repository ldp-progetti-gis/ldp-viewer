<?php
	/* inclusione del file config.inc.php generale */
	require_once 'config.inc.php';
    
	$GLOBALS['package']="pratiche_edilizie_pub";

	/* ------------ LOGIN ------------- */
	//gruppi viewers		gruppi ai quali l'utente deve appartenere per poter accedere in lettura alle pagine non pubbliche del gestionale (AND dei gruppi)
	//gruppi users			gruppi ai quali l'utente deve appartenere per poter fare modifiche nelle pagine non pubbliche del gestionale (AND dei gruppi)
	//gruppi supervisors	gruppi ai quali l'utente deve appartenere per poter le funzioni speciali da supervisore (AND dei gruppi)
	//url denied			dove viene rediretto l'utente non ammesso?
	$GLOBALS['pratiche_edilizie_pub']['login']['gruppi viewers'] = array('pratiche_edilizie_pub');
	$GLOBALS['pratiche_edilizie_pub']['login']['url denied'] = $GLOBALS['site_url'];

	/*SPID*/
	$GLOBALS['pratiche_edilizie_pub']['login_spid']['auth_source_id'] = 'poggibonsi_pratiche_edilizie-sp';
	$GLOBALS['pratiche_edilizie_pub']['login_spid']['login_url'] = 'https://sit.spid.comune.poggibonsi.si.it/pratiche_edilizie/pub/login_spid.php';

	/*EMAIL*/
	$GLOBALS['pratiche_edilizie_pub']['email']['to']="pratiche-edilizie@comune.poggibonsi.si.it";
	$GLOBALS['pratiche_edilizie_pub']['email']['bcc']="fanetti@ldpgis.it";

	/* ------------ DATABASE ------------- */
	$GLOBALS['pratiche_edilizie_pub']['db']['connect'] = $GLOBALS['aa_dbConnect']['default'];
	$GLOBALS['pratiche_edilizie_pub']['db']['connectOptions_readOnly'] = array();
	$GLOBALS['pratiche_edilizie_pub']['db']['connectOptions'] = array(
		'useTransaction' => true,
	);
	$GLOBALS['pratiche_edilizie_pub']['a_config']=array(
		"dns"						=>	$GLOBALS['pratiche_edilizie_pub']['db']['connect'],
		"dns_options"					=>	$GLOBALS['pratiche_edilizie_pub']['db']['connectOptions_readOnly'],
		"cliente"					=>	$GLOBALS['cliente'],
		"uid"						=>	$GLOBALS['uid'],
		"package"					=>	$GLOBALS['package'],
		"filerepository_basepath"			=>	$GLOBALS['PATHFilerepository'].'/',	//slash in fondo!
		"tolerance"					=>	0.01,
		"useLogger"					=>	true,
		"debug"						=>	false,
		"atti"						=>	true,
		"allegati"					=>	true,
		"log_accessi_pubblici"				=>	true
	);

	$GLOBALS['pratiche_edilizie_pub']['LdpViewer_exit_url']="https://sit.spid.comune.poggibonsi.si.it/pratiche_edilizie/pub/login_spid.php";

	$GLOBALS['pratiche_edilizie_pub']['LdpViewer_map_title']="Pratiche Edilizie";

	$GLOBALS['pratiche_edilizie_pub']['LdpViewer_map_options']=array(
        "centro"=>array(1675399, 4814436),
        "zoom"=>12.8,
        "default_base_layer"=>"Nessuno",
        "dataProjection"=>'EPSG:3003',
        "mapProjection"=>'EPSG:3003',
        "aggiungiWMS" => true
	);

	$GLOBALS['pratiche_edilizie_pub']['LdpViewer_map_definition']=array(
		"wms_geoserver"=> array(
			"tipo"=> "wms_geoserver",
			"url"=>"https://sit.spid.comune.poggibonsi.si.it/services/wms",
			"layers_info"=>  array(
				"view_pratiche_punti"=> array(
// 					"max_scale"=>50000,
					"tooltip"=> "Pratica n. %numero_pratica%",
					"hyperlink"=> "ricerca_info_pratica_edilizia.php?id=%ogc_fid%",
					"selectable"=>true,
					"visible"=>true,
					"legend_label"=> "Pratiche edilizie schedario",
					"image_legend_layer"=>"view_pratiche_punti",
					"feature_name"=> "view_pratiche_punti",
					"group"=> "pratiche_edilizie"
				),
				"view_accessi_principali"=> array(
 					"max_scale"=>1000,
					"tooltip"=> "%label_toponimo% n. %label%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Accessi Principali",
					"image_legend_layer"=>"view_accessi_principali",
					"feature_name"=> "view_accessi_principali",
					"group"=> "civici"
				),
				"edifici"=> array(
					"max_scale"=>10000,
					"tooltip"=> "Edificio %id%",
					"hyperlink"=> "extra_info/info_edifici.php?id=%id%",
					"selectable"=>true,
					"visible"=>true,
					"legend_label"=> "Edifici",
					"image_legend_layer"=>"edifici",
					"feature_name"=> "edifici",
					"group"=> "edifici"
				),
				"unita_volumetriche"=> array(
					"max_scale"=>10000,
					"tooltip"=> "Unità volumetrica %id%",
					"hyperlink"=> "extra_info/info_unita_volumetriche.php?id=%id%",
					"selectable"=>true,
					"visible"=>true,
					"legend_label"=> "Unità volumetriche",
					"image_legend_layer"=>"unita_volumetriche",
					"feature_name"=> "unita_volumetriche",
					"group"=> "edifici"
				),
				"view_particelle"=> array(
					"max_scale"=>5000,
					"tooltip"=> "Fg. %foglio% Pt. %particella%",
					"hyperlink"=> "extra_info/info_particelle.php?id=%gid%",
					"selectable"=>true,
					"visible"=>true,
					"legend_label"=> "Particelle",
					"image_legend_layer"=>"view_particelle",
					"feature_name"=> "view_particelle",
					"group"=> "catasto"
				),
				"aree_stradali_view"=> array(
					"max_scale"=>5000,
					"tooltip"=> "%label% (%codice_toponimi_stradali%)",
					"selectable"=>true,
					"visible"=>true,
					"legend_label"=> "Aree stradali",
					"image_legend_layer"=>"aree_stradali_view",
					"feature_name"=> "aree_stradali_view",
					"group"=> "strade"
				),
				"toponimi_2k_10k"=> array(
					"max_scale"=>3000,
					//"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Toponimi 2k_10k",
					"image_legend_layer"=>"toponimi_2k_10k",
					"feature_name"=> "toponimi_2k_10k",
					"group"=> "ctc"
				),
				"toponimi_10k"=> array(
					"min_scale"=>3000,
					"max_scale"=>10000,
					//"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Toponimi 10k",
					"image_legend_layer"=>"toponimi_10k",
					"feature_name"=> "toponimi_10k",
					"group"=> "ctc"
				),
				"elementi_lineari_2k_10k"=> array(
					"max_scale"=>3000,
					//"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Elementi lineari 2k_10k",
					"image_legend_layer"=>"elementi_lineari_2k_10k",
					"feature_name"=> "elementi_lineari_2k_10k",
					"group"=> "ctc"
				),
				"elementi_lineari_10k"=> array(
					"min_scale"=>3000,
					"max_scale"=>10000,
					//"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Elementi lineari 10k",
					"image_legend_layer"=>"elementi_lineari_10k",
					"feature_name"=> "elementi_lineari_10k",
					"group"=> "ctc"
				),
				"archi_idrici"=> array(
					"min_scale"=>10000,
					"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Archi idrici",
					"image_legend_layer"=>"archi_idrici",
					"feature_name"=> "archi_idrici",
					"group"=> "ctc"
				),
				"archi_viari"=> array(
					"min_scale"=>10000,
					"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Archi viari",
					"image_legend_layer"=>"archi_viari",
					"feature_name"=> "archi_viari",
					"group"=> "ctc"
				),
				"archi_ferroviari"=> array(
					"min_scale"=>10000,
					"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Archi ferroviari",
					"image_legend_layer"=>"archi_ferroviari",
					"feature_name"=> "archi_ferroviari",
					"group"=> "ctc"
				),
				"aree_urbane"=> array(
					"min_scale"=>10000,
					"tooltip"=> "%topon%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Aree urbane",
					"image_legend_layer"=>"aree_urbane",
					"feature_name"=> "aree_urbane",
					"group"=> "ctc"
				),
				"limiti_amministrativi"=> array(
					//"min_scale"=>10000,
					"tooltip"=> "%nome%",
					"selectable"=>false,
					"visible"=>true,
					"legend_label"=> "Limiti comunali",
					"image_legend_layer"=>"limiti_amministrativi",
					"feature_name"=> "limiti_amministrativi",
					"group"=> "ctc"
				)
				
			),
			"groups_info"=>array(
// 				"rifiuti_p2017"=> array(
// 					"visible"=>true,
// 					"legend_label"=> "Rifiuti PSE 2017",
// 					"expanded"=> true
// 				),
				"pratiche_edilizie"=> array(
					"visible"=>false,
					"legend_label"=> "Pratiche edilizie schedario",
					"expanded"=> false
				),
				"civici"=> array(
					"visible"=>true,
					"legend_label"=> "Civici",
					"expanded"=> false
				),
				"edifici"=> array(
					"visible"=>true,
					"legend_label"=> "Edifici",
					"expanded"=> false
				),
				"catasto"=> array(
					"visible"=>false,
					"legend_label"=> "Catasto",
					"expanded"=> false
				),
				"strade"=> array(
					"visible"=>true,
					"legend_label"=> "Strade",
					"expanded"=> false
				),
				"ctc"=> array(
					"visible"=>true,
					"legend_label"=> "Carta Tecnica Comunale",
					"expanded"=> false
				)
//				,
// 				"catasto"=> array(
// 					"visible"=>true,
// 					"legend_label"=> "Catasto",
// 					"expanded"=> false
// 				)
			//	,
			//	"limiti_amministrativi"=> array(
			//		"visible"=>true,
			//		"legend_label"=> "Limiti amministrativi",
			//		"expanded"=> true
			//	)
			)
		)
	);


	/* ------------ MAPGUIDE ------------- */
	//mapServerUrl			base-url del visualizzatore. Non dichiarare l'host per maggiore portabilita'
	//webLayout				layout della carta degli edifici (nella library del MapGuideServer)
	//mappa					carta degli edifici (nella library del MapGuideServer)
	//mappaInquadramento	carta di inquadramento degli edifici per il report delle schede (nella library del MapGuideServer)
	$GLOBALS['pratiche_edilizie_pub']['mapguide']['mapServerUrl'] = '/mapguide/ldpviewer';
	$GLOBALS['pratiche_edilizie_pub']['mapguide']['webLayout'] = "Library://{$GLOBALS['virtualhost']}/poggibonsi/02_layouts/pratiche_edilizie_pub.WebLayout";
	$GLOBALS['pratiche_edilizie_pub']['mapguide']['mappa'] = "Library://{$GLOBALS['virtualhost']}/poggibonsi/01_carte/pratiche_edilizie_pub.MapDefinition";
	//$GLOBALS['edifici']['mapguide']['mappaInquadramento'] = "Library://{$GLOBALS['virtualhost']}/poggibonsi/01_carte/pratiche_edilizie_inquadramento.MapDefinition";

	$GLOBALS['URLBaseMappa'] = 'http://poggibonsi.ldpgis.it/pratiche_edilizie/pub/index.php';

	/* ---------- IMMAGINI ---------- */
	$GLOBALS['pratiche_edilizie_pub']['imgPath'] ='/share/include/img/';

        /* ------------ CSS ------------- */
        //screen                                css per la visualizzazione
        //print                                 css per la stampa
        //report                                css per i report
        $GLOBALS['pratiche_edilizie_pub']['css'] = array(
                                                                        "screen"        => "/pratiche_edilizie/include/css/screen_pub.css",
                                                                        "print"         => "/pratiche_edilizie/include/css/print.css",
                                                                        "report"        => "/pratiche_edilizie/include/css/report.css",
                                                                        "treeview"      => "/pratiche_edilizie/include/css/jquery.treeview.css",
        );

	/* ------------ HTML ------------- */
	//attesa				codice html da mostrare nell'attesa delle chiamate ajax
	//errore				codice html da mostrare in caso di errore generico
	//erroreTimeout			codice html da mostrare in caso di errore di timeout
	$GLOBALS['pratiche_edilizie_pub']['html']['attesa'] ="<div class='wait'>Attendere prego...</div>";
	$GLOBALS['pratiche_edilizie_pub']['html']['attesaLunga'] ="<div class='wait'>Attendere prego...<br />L'operazione potrebbe durare qualche minuto...</div>";
	$GLOBALS['pratiche_edilizie_pub']['html']['errore'] ="<div class='error'>Ooops, c'&egrave; stato un errore</div>";
	$GLOBALS['pratiche_edilizie_pub']['html']['erroreParametri'] ="<div class='error'>Sono presenti degli errori nei dati passati. Impossibile proseguire</div>";
	$GLOBALS['pratiche_edilizie_pub']['html']['erroreTimeout'] ="<div class='error'>Questa ricerca &egrave; troppo vasta.<br />Si prega di scegliere parametri pi&ugrave; restrittivi</div>";

	/* ------------ AJAX ------------- */
	//longTimeout			valore di timeout in ms delle chiamate ajax lunghe (ad. es. esportazione)
	//timeout				valore di timeout in ms delle chiamate ajax. Va armonizzato con statement_limit in postgresql.conf (30000)
	//shortTimeout			valore di timeout in ms delle chiamate ajax brevi
	$GLOBALS['pratiche_edilizie_pub']['ajax']['longTimeout']=120000;
	$GLOBALS['pratiche_edilizie_pub']['ajax']['timeout']=35000;
	$GLOBALS['pratiche_edilizie_pub']['ajax']['shortTimeout']=5000;

	/* ------------ DIZIONARI ------------- */
	//url                           url della directory dei dizionari
	$GLOBALS['pratiche_edilizie_pub']['dizionari']['url']=$GLOBALS['PATHBase']."/share/pratiche_edilizie/pub/include/dizionari";
	$GLOBALS['pratiche_edilizie_pub']['dizionari']['fileXsl']=$GLOBALS['PATHBase']."/share/pratiche_edilizie/pub/include/dizionari/dizionario.xsl";
	$GLOBALS['pratiche_edilizie_pub']['dizionari']['fileXslOptions']=$GLOBALS['PATHBase']."/share/pratiche_edilizie/pub/include/dizionari/options.xsl";

	/* ------------ DEFAULT ------------- */
	//scalaZoom						scala per gli zoom sulla mappa
	//resultsPerPage				array del numero di elementi da mostrare per pagina nelle ricerche
	//resultsPerPage_single			numero di elementi da mostrare per pagina nelle pagine un solo connettore
	//resultsPerPage_multiple		numero di elementi da mostrare per pagina nelle pagine con più connettori contemporaneamente
	//fadeTimeOnSuccess				valore in ms dopo cui scompaiono i messaggi di conferma
	$GLOBALS['pratiche_edilizie_pub']['default']['scalaZoom']=1000;
	$GLOBALS['pratiche_edilizie_pub']['default']['resultsPerPage']=array('10','20','50','100','tutti');
	$GLOBALS['pratiche_edilizie_pub']['default']['resultsPerPage_single']=20;
	$GLOBALS['pratiche_edilizie_pub']['default']['resultsPerPage_multiple']=10;
	$GLOBALS['pratiche_edilizie_pub']['default']['fadeTimeOnSuccess']=4000;


	/* ------------ RICERCHE ------------- */
	$GLOBALS['pratiche_edilizie_pub']['ricerche']['soloAccessiPrincipaliPubblicati']=true;
	$GLOBALS['ricerche']['scalaZoom']['localita']=5000;

	$GLOBALS['ricerche']['localita']=true;
	$GLOBALS['ricerche']['toponimo_civico']=true;
	$GLOBALS['ricerche']['sezione_foglio_particella']=true;
?>
