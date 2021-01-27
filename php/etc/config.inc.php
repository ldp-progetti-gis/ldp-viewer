<?php

	/*
		Questo script contiene le definizioni comuni a tutti gli script.

		E' necessario configurare opportunamente tale script, soprattutto
		dove evidenziato con la stringa 'XXXX'.

		Questo script non sara' tipicamente incluso negli script; verra'
		piuttosto incluso dai file di configurazione specifici 'per-applicazione'
		(ad es.: 'config.catasto.inc.php', ...).

		LOGGING: durante lo sviluppo è possibile utilizzare firebug per il
			 logging degli errori, mentre in produzione l'output va
			 fatto sul file di log di PHP /var/log/php.log


		****		NON FARE OUTPUT!		****
		****   NON APPENDERE LINEE VUOTE ALLA FINE! 	****
		****      NON APRIRE E CHIUDERE PHP-TAG		****
	*/
	
	
	// ------------------------------------------------------------------------------------------------------
	// ************** BEGIN: Configurazione iniziale
	// ************** Questa configurazione stabilisce la base di funzionamento dei file di configurazione
	// ************** Viene sovrascritta da config.local.inc.php in sviluppo, staging, etc.
	// ------------------------------------------------------------------------------------------------------
	
	$GLOBALS['PATHHome']					= '';
	$GLOBALS['virtualhost']					= "";
	$GLOBALS['cliente']						= "xxx";
	$GLOBALS['label_cliente']				= 'XXX';
	$GLOBALS['nome_completo_cliente']  		= 'Comune di xxx';
	$GLOBALS['vhost']						= "{$GLOBALS['cliente']}.ldpgis.it";
	$GLOBALS['drupal_maps']					= "maps2";
	$GLOBALS['drupal_base']					= "http://{$GLOBALS['drupal_maps']}.ldpgis.it";
	$GLOBALS['LdpJSLogger_console']			= false;
	$GLOBALS['LdpJSLogger_div']				= false;
	$GLOBALS['logMonitor_level']			= 'warning';
	$GLOBALS['hostDbSviluppo'] 			= 'marte';
	$GLOBALS['hostDbProduzione'] 			= 'dbproduzione';
//	$GLOBALS['PATHFileLogger'] 				= '/home/www-data/capolona/vhproduction/filelog';
//	$GLOBALS['useFileLogger'] 				= true;
	
	// Parametri di default per il collegamento al database
	// Sono quelli di produzione, in sviluppo vengono sovrascritti in config.local.inc.php
	$GLOBALS['aa_dbConnect']			= array(
			'default' => array(
				'phptype'     => 'pgsql',
				'hostspec'    => $GLOBALS['hostDbProduzione'],
				'database'    => $GLOBALS['cliente'],
				'port'        => '5432',
				'username'    => $GLOBALS['cliente'],
				'password'    => $GLOBALS['cliente']
				)
	);
	
	if ( file_exists(dirname(__FILE__) . '/config.local.inc.php') ) 
		require(dirname(__FILE__) . '/config.local.inc.php');
	
	// ------------------------------------------------------------------------------------------------------
	// ************** END: Configurazione iniziale
	// ------------------------------------------------------------------------------------------------------
	
// 	require_once("/home/www-data/{$GLOBALS['virtualhost']}/etc/default_schemas.inc.php");
//         require_once("/home/www-data/{$GLOBALS['virtualhost']}/etc/default_roles.inc.php");
	
	$GLOBALS['PATHBase'] 					= "";
	$GLOBALS['PATHBaseInclude'] 			= "include";
	$GLOBALS['PATHBaseIncludeLocal'] 		= "include";
	$GLOBALS['PATHTmp'] 					= "{$GLOBALS['PATHHome']}/{$GLOBALS['virtualhost']}/tmp";
	$GLOBALS['PATHData'] 					= "{$GLOBALS['PATHHome']}/{$GLOBALS['virtualhost']}/data";
	$GLOBALS['PATHFilerepository'] 			= "{$GLOBALS['PATHHome']}/{$GLOBALS['virtualhost']}/filerepository";
	$GLOBALS['URLBase'] 					= '';
	$GLOBALS['URLBaseInclude'] 				= $GLOBALS['URLBase'].'/include';
	$GLOBALS['URLImg'] 						= $GLOBALS['URLBaseInclude'].'/img';
	$GLOBALS['URLBaseIncludeLocal'] 		= $GLOBALS['URLBase'].'/include';
	
	
	// ------------------------------------------------------------------------------------------------------
	// ************** BEGIN: LOG 
	// ------------------------------------------------------------------------------------------------------
	
	/* inclusione classe 'Log' */
	//require_once('Log.php');
	
	/* si specifica dove scrivere i log */
// 	$GLOBALS['logger'] 					= &Log::singleton('error_log',PEAR_LOG_TYPE_SYSTEM, $GLOBALS['cliente']);
// 	$GLOBALS['logger_mask'] 			= PEAR_LOG_ALL;
// 	$GLOBALS['logger']->setMask($GLOBALS['logger_mask']);
// 	
// 	/* --------------- LOGMONITOR --------------------------- */
// 	$GLOBALS['logMonitorBasePath'] 		= '/var/log/logmonitor';  								// Path base dove salvare i log di logmonitor
// 	$GLOBALS['logMonitorFilename'] 		= $GLOBALS['logMonitorBasePath'] . '/generale.log'; 	// File di default dove salvare i log
// 	$GLOBALS['logMonitorHandler'] 		= 'file'; 												// Tipo di salvataggio
// 	$GLOBALS['logMonitorLoglevel'] 		= $GLOBALS['logMonitor_level']; 						// Livello di logging
// 	$GLOBALS['jsloggerurl'] 			= $GLOBALS['URLBaseInclude'] . '/php/jslogger.php'; 	// URL del jslogger, lo script php per loggare su file gli errori javascript
// 	$GLOBALS['jslogfile'] 				= $GLOBALS['logMonitorBasePath'] . '/javascript.log'; 	// File di default dove salvare i log javascript
// 	/* -------------- LOGGER JAVASCRIPT -------------------- */
// 	$GLOBALS['LdpJSLogger'] 			= array('makediv' => $GLOBALS['LdpJSLogger_div'], 'enableconsole' => $GLOBALS['LdpJSLogger_console']);
	
	// ------------------------------------------------------------------------------------------------------
	// ************** END: LOG
	// ------------------------------------------------------------------------------------------------------
	
	$GLOBALS['fotoCivici'] 		= true;
	$GLOBALS['fotoTarghevia'] 	= true;
	
	// ------------------------------------------------------------------------------------------------------
	// ************** BEGIN: DRUPAL 
	// ------------------------------------------------------------------------------------------------------
	
	$GLOBALS['site_url']					= "{$GLOBALS['drupal_base']}/{$GLOBALS['cliente']}";
	$GLOBALS['login']['url virtualoffice']	= "{$GLOBALS['site_url']}/?q=virtualoffice";
	$GLOBALS['drupal']['url'] 				= $GLOBALS['site_url'];
	$GLOBALS['drupal']['major_version'] 	= '7';
	$GLOBALS['drupal']['path'] 				= '/home/www-data/maps/maps2';
	$GLOBALS['drupal']['table_prefix']		= 'drupal7_';
	$GLOBALS['drupal_prefix']				= 'drupal7_';

	/*
	* struttura di riferimento per migrazione utenti e relativi uid
	*    - deve essere ordinata per ts decrescente
	*    - per ogni riga deve essere indicato un ts e la tabella da usare per controllare gli uid prima di ts e fino al ts della riga successiva (se presente)
	*/
	$GLOBALS['login_uid_switch_dates'] = array(
		array('ts' => 1568811220, 'table' => 'public.drupal_users') //1570702148
	);

	
	// ------------------------------------------------------------------------------------------------------
	// ************** END: DRUPAL 
	// ------------------------------------------------------------------------------------------------------
	
	$GLOBALS['aa_dbConnect']['srvdati2_mssql'] = array(
		'phptype'  => 'mssql',
		'hostspec' => '172.16.0.33',
		'database' => 'siena',
		'username' => 'siena',
		'password' => 'siena'
	);
	
	$GLOBALS['codice_fiscale_cliente'] = '00050800523';
	$GLOBALS['codice_catastale'] = "I726";
	$GLOBALS['sigla_provincia'] = 'SI';
	$GLOBALS['label_cliente'] = 'Siena';  
	$GLOBALS['codice_istat_provincia'] = '052';
	$GLOBALS['codice_istat_comune'] = '032';
	
	 // Questi campi sono utilizzati per gli applicativi che compilano una propria anagrafica, come aree_edificabili ed esporpri
	$GLOBALS['nazione']="ITALIA";
	$GLOBALS['provincia']="SI";
	$GLOBALS['comune']="SIENA";
	$GLOBALS['cap'] = "53100";
	
	$GLOBALS['login']['url oldsite']='http://mapserver3.ldpassociati.it/siena/login/login_elenco.cfm';
	
	/* database */
	$GLOBALS['pgpass_file']="{$GLOBALS['PATHHome']}/.pgpass_www-data";
	$GLOBALS['a_dbConnect']=$GLOBALS['aa_dbConnect']['default']; /* connessione default */
	$GLOBALS['a_login_dbConnect']=$GLOBALS['aa_dbConnect']['default'];
	//$GLOBALS['a_login_dbConnect']=$GLOBALS['aa_dbConnect']['srvdati2_mssql']; /* connesione mssql per login (eliminata 20120828) */
	
	/* UTENTE */
	$GLOBALS['uid'] = 0;				//Utente anonimo. Viene valorizzato con l'uid dell'utente che effettua il login, nel caso si sia sotto login
	$GLOBALS['username'] = "anonimo";	//Utente anonimo. Viene valorizzato con l'username dell'utente che effettua il login, nel caso si sia sotto login
	
	/* FAVICON */
	$GLOBALS['favicon']=$GLOBALS['URLBaseInclude'].'/img/favicon.ico';
	
	/* CSS */
	$GLOBALS['aa_css']=array();
	$GLOBALS['aa_css']['default_screen'] ='/css/screen.css';
	$GLOBALS['aa_css']['default_print'] = '/css/print.css';
	$GLOBALS['aa_css']['default_report'] ='/css/report.css';
	
	/* VARIE */
	// renewSessionMilliseconds		tempo in millisecondi fra le chiamate della funzione che fa qualcosa per impedire alla sessione di scadere
	$GLOBALS['renewSessionMilliseconds'] = 1200000; // default 1200000, ossia 20 minuti
	
	/* AJAX */
	$GLOBALS['ajax']['timeout'] = 5000;	// default 5000 ms, timeout
	$GLOBALS['ajax']['message']['error_timeout'] = 'Connessione scaduta';
	
	/*MAPGUIDE SERVER*/
	$GLOBALS['mapguide']['webExtensionsDirectory'] = 'C:\Programmi\MapGuideOpenSource\WebServerExtensions\\';
	$GLOBALS['mapguide']['MapGuideServerDirectory'] = 'C:\Programmi\MapGuideOpenSource\Server\\';
	$GLOBALS['mapguide']['viewerFilesDirectory'] = $GLOBALS['mapguide']['webExtensionsDirectory'] . 'www\viewerfiles\\';
	$GLOBALS['mapguide']['schemaDirectory'] = $GLOBALS['mapguide']['MapGuideServerDirectory'] . 'Schema\\';
	$GLOBALS['mapguide']['webconfigDirectory'] = $GLOBALS['mapguide']['webExtensionsDirectory'] . 'www\\';
	$GLOBALS['mapguide']['webconfigFilePath'] = $GLOBALS['mapguide']['webconfigDirectory'] . 'webconfig.ini';
	$GLOBALS['mapguide']['tmpFilePath'] = 'C:\temp\\';
	
	$GLOBALS['mapguide']['mappaSezioniCensuarieStampa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/sezioni_censuarie_stampa.MapDefinition";
	$GLOBALS['mapguide']['mappaSezioniCensuarieTavoletteStampa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/sezioni_censuarie_stampa.MapDefinition";
	/*DISEGNO*/
	$GLOBALS['snap_layers']=array();
	
	/*SOVRAPPOSIZIONE*/
	$GLOBALS['intersect_tables_error']=array();
	$GLOBALS['intersect_tables_warning']=array();
	
	/*GRIGLIA*/
	$GLOBALS['griglia']['query']['limiti_amministrativi']="SELECT the_geom FROM ctr.limiti_amministrativi WHERE nome='SIENA'";
	$GLOBALS['griglia']['scala']=1000;
	$GLOBALS['griglia']['dimensione_area_stampa']=array("x"=>400,"y"=>277); //in mm (Foglio A3 420x297)
	$GLOBALS['griglia']['schema_output']="ctr";
	$GLOBALS['griglia']['tabella_output']="griglia_a3_".$GLOBALS['griglia']['scala'];
	$GLOBALS['griglia']['metri_altre_tavolette']=15;

	/*
	************************************************************************************************
	Definizione delle costanti per la generazione delle immagini della mappa
	************************************************************************************************
	*/
	$GLOBALS['altezza_pagina']= 0.297;
	$GLOBALS['larghezza_pagina']= 0.210;	//Formato (default A4 0.297m x 0.210m)
	$GLOBALS['margine'] = 0.015;		//Margine in ogni lato del foglio (default 0.02 m)
	$GLOBALS['dpi'] = 300;			//Dot per Inches (default 300)
	$GLOBALS['default_dpi']= 72;		//Dot per Inches dell'immagine generata di default
	$GLOBALS['pollice'] = 0.0254;		//Conversione del pollice in metri (default 1 pollice=0.0254 m)
	$GLOBALS['scala'] = 500;		//Scala dell'immagine di output (default 500)
	$GLOBALS['offset'] = 5;			//Metri di offset per la cornice che raccoglie gli accessi (default 5 m)
	/*
	************************************************************************************************
	FINE Definizione delle costanti per la generazione delle immagini della mappa
	************************************************************************************************
	*/
	
	$GLOBALS['remote_virtualoffice_blacklist']=['verde'];
	
?>
