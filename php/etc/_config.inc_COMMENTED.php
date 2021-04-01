<?php

	/**
	 * MAIN CONFIGURATION FILE
	 *
	 * This file includes the general definitions common to all scripts.
	 * This file is very general, and it is not "directly" included inside the script, but it
	 * is referenced (included) by other more specific configuration files, focused on specific
	 * applications.
	 *
	 * Logging:  errors logging should be addressed to the PHP log file /var/log/php.log
	 * Warning:  avoid output,
	 *           avoid appending empy line at the end of the script,
	 *           do not open/close PHP tags
	 *
	 * @author:  Fanetti Duccio, Maffei Simone, Gentili Luca (LDP)
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
	
	
	// ------------------------------------------------------------------------------------------------------
	// ************** BEGIN: Configurazione iniziale
	// ************** Questa configurazione stabilisce la base di funzionamento dei file di configurazione
	// ************** Viene sovrascritta da config.local.inc.php in sviluppo, staging, etc.
	// ------------------------------------------------------------------------------------------------------
	
	// OVD MAPGUIDE $GLOBALS['virtualhost']					= "";     // OVD MAPGUIDE used by MAPGUIDE extension
	// OVD MAPGUIDE/LOGGER $GLOBALS['cliente']						= "xxx";  // OVD MAPGUIDE/LOGGER used by MAPGUIDE and LOGGER extensions
	
	/**
	 * DEFAULT SETTINGS
	 * these variables can be overrided in the specific config.app.inc.php configuration file
	 */
    $GLOBALS['app_title_short_default']	= 'OVorg';
	$GLOBALS['app_title_long_default']	= 'OV Organization';
	$GLOBALS['app_department_default']	= 'GIS';
	$GLOBALS['exit_url_default']		= "https://www.ldpgis.it/";

	// $GLOBALS['LdpJSLogger_console']			= false;     // OVD LOGGER used by LOGGER extension
	// $GLOBALS['LdpJSLogger_div']				= false;     // OVD LOGGER used by LOGGER extension
	// $GLOBALS['logMonitor_level']			= 'warning';     // OVD LOGGER used by LOGGER extension

	/* OVD DB used by DATABASE extension
	$GLOBALS['hostDbProduzione'] 			= 'dbproduzione';
	
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
	*/
	
	/* OVD LOCALCONFIG used by LOCAL CONFIG extension
	if ( file_exists(dirname(__FILE__) . '/config.local.inc.php') ) 
		require(dirname(__FILE__) . '/coPATHBaseIncludeLocalnfig.local.inc.php');
    */
	
	// ------------------------------------------------------------------------------------------------------
	// ************** END: Configurazione iniziale
	// ------------------------------------------------------------------------------------------------------
	
// 	require_once("/home/www-data/{$GLOBALS['virtualhost']}/etc/default_schemas.inc.php");
//         require_once("/home/www-data/{$GLOBALS['virtualhost']}/etc/default_roles.inc.php");
	
	$GLOBALS['PATHBase'] 					= "";
	$GLOBALS['PATHBaseInclude'] 			= "include";
	// OVD LOCALCONFIG $GLOBALS['PATHBaseIncludeLocal'] 	  = "include";
	$GLOBALS['URLBase'] 					= '';
	$GLOBALS['URLBaseInclude'] 				= $GLOBALS['URLBase'].'/include';
	// OVD $GLOBALS['URLImg'] 						= $GLOBALS['URLBaseInclude'].'/img';
	// OVD LOCALCONFIG $GLOBALS['URLBaseIncludeLocal'] 		= $GLOBALS['URLBase'].'/include';
	
	// OVD LOGGER used by LOGGER extension
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
	
	/* OVD CIVICI used by CIVICI extension
	$GLOBALS['fotoCivici'] 		= true;
	$GLOBALS['fotoTarghevia'] 	= true;
	*/
	
	/* OVD DB used by DATABASE extension

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
	$GLOBALS['codice_istat_provincia'] = '052';
	$GLOBALS['codice_istat_comune'] = '032';
	
	 // Questi campi sono utilizzati per gli applicativi che compilano una propria anagrafica, come aree_edificabili ed esporpri
	$GLOBALS['nazione']="ITALIA";
	$GLOBALS['provincia']="SI";
	$GLOBALS['comune']="SIENA";
	$GLOBALS['cap'] = "53100";
	
	$GLOBALS['login']['url oldsite']='http://mapserver3.ldpassociati.it/siena/login/login_elenco.cfm';
	
	// database
	// $GLOBALS['a_dbConnect']=$GLOBALS['aa_dbConnect']['default']; // connessione default        // OVD DB used by DATABASE extension
	// $GLOBALS['a_login_dbConnect']=$GLOBALS['aa_dbConnect']['default'];                         // OVD DB used by DATABASE extension

	*/
	
	/* UTENTE */
	// OVD $GLOBALS['uid'] = 0;                   //Utente anonimo. Viene valorizzato con l'uid dell'utente che effettua il login, nel caso si sia sotto login
	// OVD $GLOBALS['username'] = "anonimo";      //Utente anonimo. Viene valorizzato con l'username dell'utente che effettua il login, nel caso si sia sotto login
	
	/* FAVICON */
	$GLOBALS['favicon']=$GLOBALS['URLBaseInclude'].'/img/favicon.ico';
	
	/* AJAX */
	// OVD $GLOBALS['ajax']['timeout'] = 5000;	// default 5000 ms, timeout
	// OVD $GLOBALS['ajax']['message']['error_timeout'] = 'Connection timed out';
	
	/* OVD MAPGUIDE used by MAPGUIDE extension
	// MAPGUIDE SERVER
	$GLOBALS['mapguide']['webExtensionsDirectory'] = 'C:\Programmi\MapGuideOpenSource\WebServerExtensions\\';
	$GLOBALS['mapguide']['MapGuideServerDirectory'] = 'C:\Programmi\MapGuideOpenSource\Server\\';
	$GLOBALS['mapguide']['viewerFilesDirectory'] = $GLOBALS['mapguide']['webExtensionsDirectory'] . 'www\viewerfiles\\';
	$GLOBALS['mapguide']['schemaDirectory'] = $GLOBALS['mapguide']['MapGuideServerDirectory'] . 'Schema\\';
	$GLOBALS['mapguide']['webconfigDirectory'] = $GLOBALS['mapguide']['webExtensionsDirectory'] . 'www\\';
	$GLOBALS['mapguide']['webconfigFilePath'] = $GLOBALS['mapguide']['webconfigDirectory'] . 'webconfig.ini';
	$GLOBALS['mapguide']['tmpFilePath'] = 'C:\temp\\';
	
	$GLOBALS['mapguide']['mappaSezioniCensuarieStampa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/sezioni_censuarie_stampa.MapDefinition";
	$GLOBALS['mapguide']['mappaSezioniCensuarieTavoletteStampa'] = "Library://{$GLOBALS['virtualhost']}/{$GLOBALS['cliente']}/01_carte/sezioni_censuarie_stampa.MapDefinition";
	*/

	/* OVD other extensions
	//DISEGNO
	$GLOBALS['snap_layers']=array();
	
	//SOVRAPPOSIZIONE
	$GLOBALS['intersect_tables_error']=array();
	$GLOBALS['intersect_tables_warning']=array();
	
	//GRIGLIA
	$GLOBALS['griglia']['query']['limiti_amministrativi']="SELECT the_geom FROM ctr.limiti_amministrativi WHERE nome='SIENA'";
	$GLOBALS['griglia']['scala']=1000;
	$GLOBALS['griglia']['dimensione_area_stampa']=array("x"=>400,"y"=>277); //in mm (Foglio A3 420x297)
	$GLOBALS['griglia']['schema_output']="ctr";
	$GLOBALS['griglia']['tabella_output']="griglia_a3_".$GLOBALS['griglia']['scala'];
	$GLOBALS['griglia']['metri_altre_tavolette']=15;

	// ************************************************************************************************
	// Definizione delle costanti per la generazione delle immagini della mappa
	// ************************************************************************************************
	$GLOBALS['altezza_pagina']= 0.297;
	$GLOBALS['larghezza_pagina']= 0.210;	//Formato (default A4 0.297m x 0.210m)
	$GLOBALS['margine'] = 0.015;		//Margine in ogni lato del foglio (default 0.02 m)
	$GLOBALS['dpi'] = 300;			//Dot per Inches (default 300)
	$GLOBALS['default_dpi']= 72;		//Dot per Inches dell'immagine generata di default
	$GLOBALS['pollice'] = 0.0254;		//Conversione del pollice in metri (default 1 pollice=0.0254 m)
	$GLOBALS['scala'] = 500;		//Scala dell'immagine di output (default 500)
	$GLOBALS['offset'] = 5;			//Metri di offset per la cornice che raccoglie gli accessi (default 5 m)
	// ************************************************************************************************
	// FINE Definizione delle costanti per la generazione delle immagini della mappa
	// ************************************************************************************************
	*/


?>
