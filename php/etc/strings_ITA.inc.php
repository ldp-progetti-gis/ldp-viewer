<?php
	/**
	 * RESOURCES FILE - STRINGS - VERSIONE ITALIANA
	 *
	 * This file contains the definition of all strings used in the application.
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
    
	$PREFIX = ''; //'(OV) ';

	/**
	 * Strings used by the general INTERFACE
	 */
	$GLOBALS['strings']['interface'] = array(
         'tab_query_title'              => $PREFIX . 'Risultati',
         'tab_query_content'            => 'Mostra le informazioni associate',
         'tab_search_title'             => $PREFIX . 'Ricerca',
         'tab_search_content'           => 'Cerca un luogo, una località o un indirizzo',
         'tab_custom_title'             => $PREFIX . 'Custom',
         'tab_custom_title'             => 'Info Mappa',
         'tab_custom_content'           => 'Mostra una pagina personalizzata',
         'tab_appinfo_title'            => $PREFIX . 'Info su',
         'tab_appinfo_content'          => 'Mostra le informazioni sull\'applicazione',

         'button_exitinteractivemap'    => 'Esci dalla mappa interattiva',
         'button_defaultstatus'         => 'Pan, zoom e selezione',
         'button_initialview'           => 'Vista iniziale',
         'button_zoomincenter'          => 'Zoom in centrato',
         'button_zoomoutcenter'         => 'Zoom out centrato',
         'button_zoomrectangle'         => 'Zoom rettangolo',
         'button_previousview'          => 'Vista precedente',
         'button_nextview'              => 'Vista successiva',
         'button_measuredistance'       => 'Misura una distanza',
         'button_measurearea'           => 'Misura un&apos;area',
         'button_clearmap'              => 'Pulisci la selezione, gli oggetti evidenziati ed i disegni',
         'button_printmap'              => 'Stampa la vista della mappa',
         'button_guidedtour'            => 'Tour guidato',

         'welcome_msg_statusbar'        => 'Pronto',
         'feature_selected_statusbar'   => 'oggetto selezionato',
         'features_selected_statusbar'  => 'oggetti selezionati',

         'wms_CRSunsupported'           => 'La proiezione usata nella mappa non &egrave; supportata dela server WMS',
         'wms_clicktogetlistwmslayers'  => 'Click per ottenere la lista dei layer WMS disponibili',
         'wms_filterlayers'             => 'Click qui e scrivi per filtrare i layer',
         'wms_inserturlwmsserver'       => 'Inserisci qui URL del WMS server',
         'wms_notavailable'             => 'Non disponibile',
         'wms_pagetitle'                => 'Aggiungi layer da servizi WMS',
         'wms_pagedescription1'         => 'Aggiungi strati cartografici alla mappa utilizzando il catalogo WMS interno ',
         'wms_pagedescription2'         => 'Oppure, aggiungi strati cartografici utilizzando cataloghi WMS esterni',
         'wms_pagedescription3'         => 'Aggiungi strati cartografici utilizzando cataloghi WMS esterni',
         'wms_sampleWMS'                => array('Geoportale nazionale', 'Geoscopio WMS Regione Toscana'),
         'wms_sampleWMSurl'             => array('http://www.pcn.minambiente.it/mattm/servizio-wms/','https://www.regione.toscana.it/-/geoscopio-wms'),
         'wms_insertWMSurl'             => 'inserisci URL del WMS',
         'wms_showavailablelayers'      => 'Mostra layer disponibili',
         'wms_supportedCRS'             => 'CRS supportati',
         'wms_showhidestyle'            => 'Mostra/Nascondi legenda',

         'word_actions'                 => 'Azioni',
         'word_add'                     => 'Aggiungi',
         'word_close'                   => 'Chiusi',
         'word_description'             => 'Descrizione',
         'word_feature'                 => 'Oggetto',
         'word_from'                    => 'Da',
         'word_in'                      => 'In',
         'word_information'             => 'Informazioni',
         'word_layer'                   => 'Layer',
         'word_legend'                  => 'Legenda',
         'word_libreria'                => 'Libreria',
         'word_license'                 => 'Licenza',
         'word_no'                      => 'No',
         'word_of'                      => 'Di',
         'word_open'                    => 'Aprire',
         'word_or'                      => 'Oppure',
         'word_original'                => 'Originale',
         'word_queryability'            => 'Interrogabilit&agrave;',
         'word_queryableas'             => 'Interrogabile come',
         'word_release'                 => 'Versione',
         'word_styles'                  => 'Stili',
         'word_themes'                  => 'Tematismi',
         'word_title'                   => 'Titolo',
         'word_to'                      => 'Fino a',
         'word_version'                 => 'Versione',
         'word_visible'                 => 'Visibile',
         'word_visibility'              => 'Visibilit&agrave;',
         
         'sentence_addlayertomap'               => 'Aggiungi questo layer alla mappa',
         'sentence_addtomap'                    => 'Aggiungi alla mappa',
         'sentence_addwmstomap'                 => 'Aggiungi WMS alla mappa',
         'sentence_atallscales'                 => 'A tutte le scale',
         'sentence_basemap'                     => 'Layer di base',
         'sentence_custompage'                  => 'Pagina personalizzata',
         'sentence_datasource'                  => 'Sorgente dati',
         'sentence_epsgsupported'               => 'Sistemi di coordinate supportati (EPSG)',
         'sentence_forexample'                  => 'Per esempio',
         'sentence_foundfeatures'               => 'Oggetti trovati',
         'sentence_generaldescription'          => 'Caratteristiche generali',
         'sentence_impossiblegetlayersfromurl'  => 'Impossibile recuperare la lista dei layers dall&apos;URL specificato',
         'sentence_increasetransparency'        => 'Aumenta la trasparenza',
         'sentence_insertscale'                 => 'Inserisci la scala desiderata e premi INVIO',
         'sentence_invalidurl'                  => 'URL non valido',
         'sentence_layeradded'                  => 'Il Layer &egrave; stato aggiunto alla mappa.',
         'sentence_layeraleradyexisting'        => 'Il layer non &egrave; stato aggiunto alla mappa. Un layer con lo stesso nome esiste gi&agrave;.',
         'sentence_layerwillbereprojected'      => 'Il layer non supporta il sistema di coordinate usato nella mappa; quindi sar&agrave riproiettato automaticamente.',
         'sentence_nobasemap'                   => 'Nessuna basemap',
         'sentence_noselectedobjects'           => 'Nessun oggetto selezionato',
         'sentence_noselfeaturesinsidelayer'    => 'Nessuna selezione all&apos;interno dei layer',
         'sentence_opencloselegend'             => 'Apri/Chiudi la legenda',
         'sentence_opencloseinfopanel'          => 'Apri/Chiudi il pannello delle informazioni',
         'sentence_openprintdialog'             => 'Stampa la vista corrente della mappa',
         'sentence_problemsgetcapabilities'     => 'Incontrati problemi durante la richiesta di GetCapabilities da',
         'sentence_queryresultpage'             => 'Pagina dei risultati',
         'sentence_reducetransparency'          => 'Riduci la trasparenza',
         'sentence_releasenote'                 => 'Note sulla versione',
         'sentence_removealluserwms'            => 'Rimuovi tutti i layer WMS aggiunti',
         'sentence_renderingprojection'         => 'Proiezione usata per il rendering della mappa',
         'sentence_retrievingtheinformation'    => 'Sto recuperando le informazioni, attendere prego ...',
         'sentence_scalevisibility'             => 'Visibile nell&apos;intervallo di scale ',
         'sentence_searchpage'                  => 'Pagina per la ricerca',
         'sentence_sendemailto'                 => 'Per informazioni invia una email a',
         'sentence_servercapabilities'          => 'Server capabilities',
         'sentence_showyourposonthemap'         => 'Mostra la tua posizione sulla mappa',
         'sentence_usedlibraries'               => 'Librerie open source utilizzate',
         'sentence_thirdpartyWMS'               => 'WMS terze parti',
         'sentence_trackingerror'               => 'Errore nella geolocalizzazione sulla mappa.\nControllare le impostazioni del proprio browser.\n&Egrave; necessario consentire l&apos;apertura di finestre popup da parte della pagina che si sta visualizzando.',
         'sentence_tooltip'                     => 'o tieni premuto per consultare le informazioni',
         'sentence_visitthewebsite'             => 'Visita il sito',
         'sentence_waitplease'                  => 'Attendere prego',

         'varempty'                     => '');

	/**
	 * Strings used by the TOUR/HELP functionality
	 */
	$GLOBALS['strings']['tour_help'] = array(
         'start_title'                  => $PREFIX . 'Usare le mappe interattive',
         'start_content'                => 'Segui il breve tour guidato per conoscere le funzionalità e gli strumenti delle mappe interattive.',

         'rightbar_title'               => $PREFIX . 'Sidebar destra',
         'rightbar_content'             => 'Apri/chiudi la barra laterale destra: contiene gli strumenti di ricerca (per Via e n. civico, per località, ecc.) e mostra le informazioni degli oggetti selezionati sulla mappa.',
    
         'leftbar_title'                => $PREFIX . 'Sidebar sinistra',
         'leftbar_content'              => 'Apri/chiudi la barra laterale sinistra: contiene la legenda della mappa con la quale puoi attivare o nascondere i livelli, il pannello WMS per aggiungere strati cartografici da servizi esterni e lo strumento <em>Vista su</em> per aprire un&apos;altra mappa mantenendo la vista corrente',

         'legend_title'                 => $PREFIX . 'Legenda',
         'legend_content'               => 'Mostra l&apos;elenco dei livelli (layer) presenti sulla mappa: puoi accendere o spegnere i diversi livelli per renderli visibili (e interrogabili) o per nasconderli.<br>Puoi anche aggiungere nuovi livelli utilizzando URL di servizi WMS.',
         'legend_content_old'               => 'Mostra l&apos;elenco dei livelli (layer) presenti sulla mappa: puoi accendere o spegnere i diversi livelli per rendere visibili (e interrogabili) o per nasconderli.<br>Puoi anche aggiungere nuovi livelli utilizzando URL di servizi WMS.',
    
         'legenditems_title'            => $PREFIX . 'Visibilità livelli della legenda',
         'legenditems_content'          => 'Apri/chiudi i raggruppamenti di livelli come <em>Tematismi</em> e <em>Layer di base</em>: accendere o spegnere i diversi livelli per rendere visibili (e interrogabili) o per nasconderli.',
               
         'wms_title'                    => $PREFIX . 'Aggiungi WMS',
         'wms_content'                  => 'Utilizza un servizio WMS (<em>Web Map Service</em>) per aggiungere nuovi livelli alla mappa: scegli nella lista dei layer disponibili o usa una fonte dati esterna.',

         'viewothermap_title'           => $PREFIX . 'Apri un&apos;altra mappa',
         'viewothermap_content'         => 'Apri un&apos,altra mappa mantenendo la vista corrente: la nuova mappa verrà aperta in una nuova finestra.<br>Sono disponibili anche mappe di terze parti come Google Maps, Open Street Map e Bing.',

         'toolbar_title'                => $PREFIX . 'Toolbar della mappa',
         'toolbar_content'              => 'Gli strumenti per navigare la mappa e selezionare gli oggetti, fare zoom, effettuare misurazioni, stampare la vista corrente, ecc.',

         'scalebar_title'               => $PREFIX . 'Scala della mappa',
         'scalebar_content'             => 'Mostra la scala attuale della cartografia visibile.<br />Puoi cambiare scala di visualizzazione digitando il nuovo valore all\'interno del campo e premendo &crarr;INVIO',

         'exit_title'                   => $PREFIX . 'Esci dalla mappa',
         'exit_content'                 => 'Chiudi la mappa interattiva e torna alle pagine del SIT.',

         'template_prev_title'          => 'Torna al passo precedente',
         'template_prev_back'           => '« Indietro',
         'template_next_title'          => 'Vai al passo successivo',
         'template_next_forward'        => 'Avanti »',
         'template_close_tour'          => 'Chiudi il tour',
         'template_close_close'         => 'Chiudi',

         'varempty'                     => '');
	 
	/**
	 * Strings used by the TOUR/HELP functionality
	 */
	$GLOBALS['strings']['application_info'] = array(
         'license_description'          => 'Questo programma &egrave; un software gratuito; &egrave; possibile ridistribuirlo e/o modificarlo '.
                                           'secondo i termini della GNU General Public License come pubblicata dalla Free Software Foundation; '.
                                           'o la versione 2 della licenza o (a tua scelta) qualsiasi versione successiva.'.
                                           '<br>&nbsp;<br>'.
                                           'Questo programma &egrave; distribuito nella speranza che possa essere utile, ma SENZA ALCUNA GARANZIA; '.
                                           'senza neppure la garanzia implicita di COMMERCIABILIT&Agrave; o IDONEIT&Agrave; PER UN PARTICOLARE SCOPO. '.
                                           'Vedi il '.
                                           '<u><i><a href="GNU General Public License v2.0 - GNU Project - Free Software Foundation.html" target="_blank">'.
                                           'GNU General Public License</a></i></u> '.
                                           'per maggiori dettagli.',
         'application_description'      => '&egrave; una applicazione internet che consente la pubblicazione di dati geografici. Il '.
                                           'visualizzatore interattivo permette agli utenti di navigare la mappa (zoom, pan, visualizzazione '.
                                           'ad una scala definita), modificare i livelli geografici visualizzati, aggiungere al volo strati '.
                                           'geografici pubblicati da server WMS, interrogare i dati associati e generare elaborati di stampa.',
         'application_mainfeatures'     => 'Dati supportati:<ul>'.
                                           '<li>fonti dati WMS</li>'.
                                           '<li>fonti dati MapGuide</li>'.
                                           '<li>basemap OpenStreetMap</li>'.
                                           '</ul>'.
                                           'Funzionalit&agrave;:<ul>'.
                                           '<li>panning e zoom su rettagolo interattivi</li>'.
                                           '<li>vista iniziale, zoom in, zoom out, vista precedente, vista successiva</li>'.
                                           '<li>misurazione di distanze e di aree</li>'.
                                           '<li>stampa</li>'.
                                           '</ul>',
         'application_noterelease1'     => 'Sviluppo iniziale dell/apos;applicazione, basato sulla revisione delle applicazioni pi/ugrave; '.
                                           'articolate e complete realizzate da LdpGIS per la gestione di dati geografici destinati '.
                                           'alla gestione del territorio.',

         'varempty'                     => '');

?>
