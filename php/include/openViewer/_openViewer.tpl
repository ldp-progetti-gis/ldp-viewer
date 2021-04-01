{* ************************************************************************************************************** *
 * ************************************************************************************************************** *
 * 
 * TEMPLATE SMARTY PER IL VISUALIZZATORE MOBILE LDP "LDPVIEWER"
 *
 * Questo template smarty deve essere incluso nella pagina in cui si vuole caricare il visualizzatore.
 * Esso crea il div principale in cui viene sparata la mappa e tutti gli elementi del viewer.
 *
 *
 * ************************************************************************************************************** *
 * ************************************************************************************************************** *}
<div id="ldpviewer_overlay_background" class="hide" onclick='ldp_viewer.openCloseWMSOverlayContainer()'></div>

<div id="ldpviewer_overlay_container" class="hide">
	<h1>{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/add-wms.svg"|file_get_contents} Aggiungi layer da servizi WMS <a class="exit" id="ldpviewer_overlay_container_close" title="Chiudi sezione Aggiungi WMS">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/multiply-filled.svg"|file_get_contents}</a></h1>
	
	<div id="wms-info">
		{if !empty($GLOBALS[$GLOBALS['package']]['LdpViewer_wms_url']) }
			<p>Aggiungi strati cartografici alla mappa utilizzando Cataloghi WMS esterni, come quelli del <a href="http://www.pcn.minambiente.it/mattm/servizio-wms/" title="Apri il Catalogo WMS del Geoportale nazionale" target="_blank" rel="noopener">Geoportale nazionale</a> o di <a href="{$GLOBALS[$GLOBALS['package']]['LdpViewer_wms_url']}" target="_blank" rel="noopener">{$GLOBALS[$GLOBALS['package']]['LdpViewer_wms_regione']}</a>.</p>
		{else}
			<p>Aggiungi strati cartografici alla mappa utilizzando Cataloghi WMS esterni, come quelli del <a href="http://www.pcn.minambiente.it/mattm/servizio-wms/" title="Apri il Catalogo WMS del Geoportale nazionale" target="_blank" rel="noopener">Geoportale nazionale</a> o di <a href="http://www.regione.toscana.it/-/geoscopio-wms" target="_blank" rel="noopener">Regione Toscana</a>.</p>
		{/if}
		{if !empty($GLOBALS[$GLOBALS['package']]['LdpViewer_wms_interno_url']) }
		<p>
			Oppure, aggiungi strati cartografici alla mappa utilizzando il Catalogo del <a href="javascript:;" onclick="ldp_viewer.WMSInternalCatalog('{$GLOBALS[$GLOBALS['package']]['LdpViewer_wms_interno_url']}');">server WMS dell'Amministrazione</a>.
		</p>
		{/if}
		{if !empty($GLOBALS[$GLOBALS['package']]['LdpViewer_wms_interno_url_customDescription']) }
			{$GLOBALS[$GLOBALS['package']]['LdpViewer_wms_interno_url_customDescription']}
		{/if}
		<input id='ldpviewer_overlay_wms_selector_url' value='' placeholder='inserisci URL del WMS' type='url'/>&nbsp;<button title='Apri l&apos;URL inserito e ottieni la lista dei layer' onclick='ldp_viewer.overlayWmsSelectorScanUrl()' value='Mostra layer'>Mostra layer disponibili</button>
		{if isset($GLOBALS['geoserver']['url_workspace']) && {$GLOBALS['package']} != 'archivio_cartografico' && {$GLOBALS['package']} != 'archivio_cartografico_pub' }
			<br/>
			<p>Oppure, visualizza i layer resi disponibili dall'Amministrazione. &nbsp;<button title='Apri l&apos;URL inserito e ottieni la lista dei layer' onclick='ldp_viewer.overlayWmsInternal()' value='Layer del Portale'>Mostra layer pubblicati da {$GLOBALS['label_cliente']}</button></p>
		{/if}
		<div id="ldp_viewer_overlay_wms_messages"></div>
	</div>
	
	<div id="wms-example"class="panel panel-default">
		<div class="panel-heading">
			<h3 class="panel-title">Esempio: utilizzare <em>PAI - Pericolosità idrogeologica</em> di Geoportale nazionale</h3>
		</div>
		<div class="panel-body">
			<ul>
				<li>apri il <a href="http://www.pcn.minambiente.it/mattm/servizio-wms/" title="Apri il Catalogo WMS del Geoportale nazionale" target="_blank" rel="noopener">Catalogo WMS di Geoportale nazionale</a>;</li> 
				<li>cerca la voce </em>PAI - Pericolosità idrogeologica</em> e copia l'URL corrispondente <code>http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/Vettoriali/PAI_pericolosita.map</code>;</li>
				<li>inserisci la stringa copiata in questa finestra, nel campo <i><b>"inserisci URL del WMS"</b></i>;</li> 
				<li>clicca su <i><b>"Mostra layer disponibili"</b></i>.</li>
				<li>scegli uno dei livelli cartografici disponibili e clicca su <i><span class="fa fa-plus-circle"></span> aggiungi</i> per visualizzare lo strato sulla mappa: esso apparirà all'interno della Legenda.</li>
			</ul>
		</div>
	</div>

	
	<!-- <p>Ad esempio, per utilizzare <em>Ambiti amministrativi</em> di Regione Toscana:</p>
	<ul>
		<li>apri l'elenco dei <a href="http://www.regione.toscana.it/-/geoscopio-wms" title="Elenco servizi WMS di Regione Toscana">Servizi WMS di Regione Toscana</a>;</li> 
		<li>cerca la voce </em>Ambiti amministrativi</em> e copia l'URL corrispondente <code>http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&map_resolution=91</code>;</li>
		<li>inserisci la stringa copiata in questa finestra, nel campo <i><b>"inserisci URL del WMS"</b></i>;</li> 
		<li>clicca su <i><b>"Mostra layer disponibili"</b></i>.</li>
		<li>scegli uno dei livelli cartografici disponibili e clicca su <i><span class="fa fa-plus-circle"></span> aggiungi</i> per visualizzare lo strato sulla mappa: esso apparirà all'interno della Legenda.</li>
	</ul> -->
	
	<div id="ldpviewer_wms_selector_container"></div>
</div>
 
<div id="ldpviewer_container">
	<div id="ldpviewer_title">
		<div id="intesta">
			{if !empty($GLOBALS[$GLOBALS['package']]['LdpViewer_exit_url']) }
			<a class="exit" id="exit" href="{$GLOBALS[$GLOBALS['package']]['LdpViewer_exit_url']}" title="Esci dalla Mappa interattiva" target="_top">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/exit.svg"|file_get_contents}</a>
			{else}
			<a class="exit" id="exit" href="{$GLOBALS['site_url']}/?q=virtualoffice" title="Esci dalla Mappa interattiva" target="_top">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/exit.svg"|file_get_contents}</a>
			{/if}
			<div class="titolo_cliente">
				{if !empty($GLOBALS[$GLOBALS.package].LdpViewer_map_group) }
					<span id="titolo_gruppo">{$GLOBALS[$GLOBALS.package].LdpViewer_map_group}</span>
				{/if}
				<span id="titolo_progetto">{$GLOBALS[$GLOBALS.package].LdpViewer_map_title}</span>
				<span id="nome_cliente">SIT {$GLOBALS['nome_completo_cliente']}</span>
			</div>
		</div>
		
		<div id="title_right">
			<a id="help" href="javascript:;" onclick="ldp_viewer.RestartTour()">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/help.svg"|file_get_contents}</a>
		</div>
	</div>

	<div id="ldpviewer_map_container">
		<div id="ldpviewer_toolbar">
			<div id="ldp_viewer_show_hide_leftTabs" onclick="ldp_viewer.toggleLeftTabs()" class="ov-icon-wrap active" title="Apri/chiudi il pannello delle informazioni">
				{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
			</div>
			<div id="ldp_viewer_tabs_container">
				<div id="ldpviewer_tabs_header">
					<div id="ldpviewer_close_panel" class="mobile" onclick="ldp_viewer.toggleLeftTabs()" >
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
					</div>
					<ul id="ldpviewer_tabs_left">
						<li><a href="#ldpviewer_legend_container" id="ldp_viewer_show_hide_legend">Legenda</a></li>
						{if $GLOBALS[$GLOBALS.package].map_options.aggiungiWMS == true}
							<li><a href="#ldpviewer_legend_aggiungi_wms_container" id="ldpviewer_legend_aggiungi_wms">WMS</a></li>
						{/if}
						<li><a href="#ldpviewer_vistasu_container"id="ldp_viewer_show_hide_vistasu">Vista Su</a></li>
					</ul>
				</div>
				
				<div id="ldpviewer_legend_container" class="ldpviewer_legend_docked">					
					{if {$GLOBALS['package']} == 'archivio_cartografico' || {$GLOBALS['package']} == 'archivio_cartografico_pub' ||  $GLOBALS[$GLOBALS.package].map_options.externalWms==true}
						<div id="ldpviewer_legendWMS_title">
							<button id="toggle_ldpviewer_legendWMS" class="ldpviewer_legend_toggle_container legend_open" title="Apri o chiudi la legenda"></button>
							{if !empty($GLOBALS[$GLOBALS['package']]['LdpViewer_label_external_wms'])}
								{$GLOBALS[$GLOBALS['package']]['LdpViewer_label_external_wms']}
							{else}
								WMS {$GLOBALS['label_cliente']}
							{/if}
						</div>
						<div id="ldpviewer_legendWMS"></div>
					{/if}
					
					<div id="ldpviewer_legend_title"><button id="toggle_ldpviewer_legend" class="ldpviewer_legend_toggle_container legend_open" title="Apri o chiudi la legenda"></button>Tematismi</div>
					<div id="ldpviewer_legend"></div>
					
					<div id="ldpviewer_legend_base_title"><button id="toggle_ldpviewer_legend_base" class="ldpviewer_legend_toggle_container legend_open" title="Apri o chiudi la legenda"></button>Layer di base</div>
					<div id="ldpviewer_legend_base"></div>
				</div>
				
				{if $GLOBALS[$GLOBALS.package].map_options.aggiungiWMS == true}
				<div id="ldpviewer_legend_aggiungi_wms_container">
					
					<div class="ldpviewer_legend_aggiungi_wms">
						<a href="javascript:;" onclick="ldp_viewer.openCloseWMSOverlayContainer()" title="Aggiungi layer da servizio WMS">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/add-wms.svg"|file_get_contents} Aggiungi WMS</a>
					</div>
					<p>Utilizza un servizio WMS per aggiungere strati cartografici alla mappa.</p>
					<div id="ldpviewer_legend_wmsExternal"></div>
				</div>
				{/if}

				
				<div id="ldpviewer_vistasu_container" class="ldpviewer_vistasu_docked">
					<p>Apri un&lsquo;altra mappa con la vista corrente:</p>
					<div id="ldpviewer_vistasu"></div>
				</div>

			</div>
			
			<span class="separator"></span>

			<div id="tools">
				{*i div intorno alle immagini svg servono solo per l'help: racchiudono i gruppi di tools da evidenziare *}
				<div id="ldpviewer_toolbar_cursor_select" onclick="ldp_viewer.toggleToolStatus('select')" class="ov-icon-wrap desktop tool-on-off">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/arrow-hand.svg"|file_get_contents}
				</div>
				<div onclick="ldp_viewer.initialMapView()" class="ov-icon-wrap" title="Vista iniziale">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-to-extents-filled.svg"|file_get_contents}
				</div>
				<div onclick="ldp_viewer.mapZoomIn()" class="ov-icon-wrap desktop" title="Zoom in">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-in.svg"|file_get_contents}
				</div>
				<div onclick="ldp_viewer.mapZoomOut()" class="ov-icon-wrap desktop" title="Zoom out">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-out.svg"|file_get_contents}
				</div>
				<div id="ldpviewer_toolbar_zoom_selection" onclick="ldp_viewer.toggleToolStatus('zoom_selection')" class="ov-icon-wrap desktop tool-on-off" title="Zoom su rettangolo">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-selection.svg"|file_get_contents}
				</div>
				<div onclick="ldp_viewer.previousMapView()" class="ov-icon-wrap desktop" title="Vista precedente">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-back.svg"|file_get_contents}
				</div>
				<div onclick="ldp_viewer.nextMapView()" class="ov-icon-wrap desktop" title="Vista successiva">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-forward.svg"|file_get_contents}
				</div>
				<span class="separator"></span>
				<div id="ldpviewer_toolbar_measure">
					<div id="ldpviewer_toolbar_measure_line" onclick="ldp_viewer.measure('measure_line')" class="ov-icon-wrap desktop tool-on-off" title="Misura lineare">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/length.svg"|file_get_contents}
					</div>
					<div id="ldpviewer_toolbar_measure_area" onclick="ldp_viewer.measure('measure_area')" class="ov-icon-wrap desktop tool-on-off" title="Misura superficie area">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/misura-area.svg"|file_get_contents}
					</div>
					<div id="ldpviewer_toolbar_eraser" onclick="ldp_viewer.mapClearTempLayers({$GLOBALS[$GLOBALS["package"]]["temporary_layers"]})" class="ov-icon-wrap desktop" title="Cancella selezione, elementi evidenziati e disegni">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/erase.svg"|file_get_contents}
					</div>
				</div>
				
				<span class="separator"></span>
				
				<div id="ldpviewer_print_map" onclick="ldp_viewer.loadPrintMap(LdpViewer_stampa_page);" class="ov-icon-wrap" title="Stampa la vista della mappa">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/print.svg"|file_get_contents}
				</div>
			</div>
			
			<span id="ldpviewer_progressbar"></span>
			
			<div id="ldpviewer_trova_posizione" onclick="ldp_viewer.trackingPosition()" class="ov-icon-wrap mobile" title="Mostra la tua posizione sulla mappa">
				{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/center-direction.svg"|file_get_contents}
			</div>
	
		</div>

		<div id="ldpviewer_map">
			<div id="ldpviewer_tooltip" class="ol-popup"></div>
			<div id="ldpviewer_draw_wkt"></div>
			<div id="ldpviewer_print_dialog"></div>
		</div>

		<div id="ldpviewer_toolbar_right">
			<div id="ldp_viewer_show_hide_info" onclick="ldp_viewer.toggleInfo()" class="ov-icon-wrap active" title="Apri/chiudi il pannello delle informazioni">
			{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
			</div>
		</div>	
		
		<div id="ov_info_container" class="ldpviewer_info_docked">
			<div id="ov_info_container_main">
				<div id="ov_info_tabs">
					<div id="ov_info_tabs_header">
						<div id="ov_close_info_panel" onclick="ldp_viewer.toggleInfo()" class="ov-icon-wrap mobile">
							{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
						</div>
						{*{if isset($GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_custom']) && $GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_custom'] != true}
						{else}
							<a href="javascript:;" id="ov_link_custom" title="Torna al menu principale" class="hide">Menu</a>
						{/if}*}
						<ul id="tabs">
							{if isset($GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_query']) && $GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_query'] != true}  
							{else}
								<li id="ov_link_query"><a href="#ov_info" title="Ultima pagina consultata" class="ov_info_tabs" title="Torna all'ultima pagina consultata">Info</a></li>
							{/if}         
							<li id="ldpviewer_tab_ricerca"><a href="#ov_tab_search" class="ov_info_tabs" title="Cerca un luogo, una località o un indirizzo">Ricerca</a></li>
							
							{if isset($GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_custom']) && $GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_custom'] != true}
							{else}
								<li id="ov_link_custom"><a title="Torna al menu principale" class="ov_info_tabs">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/menu.svg"|file_get_contents}</a></li>
							{/if}
						</ul>
					</div>
						
					<div id="ldpviewer_info" class="ov_info_tab_content {if isset($GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_query']) && $GLOBALS[$GLOBALS['package']]['tabs_view']['ov_link_query'] != true} hide {/if}"></div>
						
					<div id="ov_tab_search" class="ov_info_tab_content"></div>
				</div>
			</div>
		</div>
		
		<div id="ldpviewer_footer">
			{* controllare se l'utente è loggato *}
			<div id="user">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/circled-female-user.svg"|file_get_contents}<em>{$GLOBALS['username']}</em></div>
			{* <div id="mapscale"></div>
			<div id="risultatomisura"></div>
			<div id="coordinate"></div> *}
			<div id="footer_mouse_coordinates">&nbsp;</div>
			<div id="footer_info_selezione">0 features selezionate</div>
			<div id="footer_scala" title="Digita la scala desiderata e premi INVIO">&nbsp;</div>
			<div id="footer_poweredby"><a href="http://www.ldpgis.it" title="Vai al sito di ldp progetti gis"><img src="/include/img/openViewer/footer/logo_solo_ldp_20x25.png" alt="Logo di ldp progetti gis" /></a></div>
		</div>

	</div>

</div>

<script type="text/javascript">
	//Definizione iniziale della mappa
	var LdpViewer_map_definition={json_encode($GLOBALS[$GLOBALS["package"]]["LdpViewer_map_definition"])};
	var map_options={json_encode($GLOBALS[$GLOBALS["package"]]["map_options"])};

	var LdpViewer_info_help_init_params={json_encode($GLOBALS[$GLOBALS["package"]]["LdpViewer_info_help_init_params"])};
	
	//Configurazione per eventuali campi da salvare nelle feature selezionate
	var LdpViewer_layers_selection_extra_fields={json_encode($GLOBALS[$GLOBALS["package"]]["LdpViewer_layers_selection_extra_fields"])};

	//Pagina di default per il vistasu
	var LdpViewer_vistasu_page="{$GLOBALS.URLBaseInclude}/php/vistasu/vistasu_connector.ldpviewer.php";

	//Pagina di default per il dialog di stampa
	var LdpViewer_stampa_page="{$GLOBALS.URLBaseInclude}/php/stampa/stampa.ldpviewer.php";

	//LdpViewerProxy
	var proxy_set = false;
	if( typeof map_options.proxy !== 'undefined')
		proxy_set = map_options.proxy;
        
	var LdpViewer_proxy="{$GLOBALS.URLBaseInclude}/openViewer/openViewerProxy.php";
	
	//external WMS
	var external_wms = false;
	if( typeof map_options.externalWms !== 'undefined'){
		var external_wms = map_options.externalWms;
        var permitted_autentication =  map_options.permitted_autentication;
	}
	
	var LdpViewer_help_page="help.php";
	
{*
// OpSoRevision: info_page/menu_page are not used
*}
	//Pagina di default del menu
	var LdpViewer_info_page="menu.php";
	{if {$GLOBALS[$GLOBALS["package"]]["info_page"]}} 
		LdpViewer_info_page = '{$GLOBALS[$GLOBALS["package"]]["info_page"]}'; 
	{/if}
		
	//Pagina effettiva del menu
	var LdpViewer_menu_page = "menu.php";
	{if {$GLOBALS[$GLOBALS["package"]]["menu_page"]}}
		LdpViewer_menu_page = '{$GLOBALS[$GLOBALS["package"]]["menu_page"]}';
	{/if}
	
	//indirizzo del wms interno da caricare 
	var LdpViewer_internal_wms_url = '{$GLOBALS['geoserver']['url_workspace']}';
	
	//Pagina custom delle informazioni WMS esterni getFeatureInfo
	{if {$GLOBALS[$GLOBALS["package"]]["WMSGetFeatureInfoCustomPage"]}}
		LdpViewer_WMSGetFeatureInfoCustomPage = '{$GLOBALS[$GLOBALS["package"]]["WMSGetFeatureInfoCustomPage"]}';
	{/if}
	
{*
// OpSoRevision: info_page is not used
*}
	//Parametri aggiuntivi necessari per la mappa della normativa
	var string_info_help_init_params="";
	if(LdpViewer_info_help_init_params!=null) {
		string_info_help_init_params="?viewer=ldp&normativa="+LdpViewer_info_help_init_params.normativa+"&mappa="+LdpViewer_info_help_init_params.mappa;
		LdpViewer_info_page="help.php";
		LdpViewer_help_page=null;
	} 

	//Parametro di Default per la tab attiva all'apertura
	{if isset($GLOBALS[$GLOBALS['package']]['active_tab']) && $GLOBALS[$GLOBALS['package']]['active_tab'] == 'ricerca'}  
		var LdpViewer_active_tab = 'ricerca';
	{else}
		var LdpViewer_active_tab = 'info';
	{/if}
	{if {$GLOBALS[$GLOBALS["package"]]["active_tab"]}} 
		LdpViewer_active_tab = '{$GLOBALS[$GLOBALS["package"]]["active_tab"]}'; 
	{/if}
	
	//configurazione layer di base
	{if isset($GLOBALS[$GLOBALS["package"]]["base_layers"])}
		var LdpViewer_base_layers = {$GLOBALS[$GLOBALS["package"]]["base_layers"]};
		if(LdpViewer_base_layers == ''){
			$("#ldpviewer_legend_base_title").hide();
		}
	{else}
		var LdpViewer_base_layers = null;
	{/if}
	
        
	$(document).ready(function(){
		ldp_viewer = new LdpViewer( { 
			name: 'default', 
			stato: LdpViewer_map_definition, 
			mapOptions: map_options,
			components: {
				container: {
					div: 'ldpviewer_container'
				},
				map: {
					div: 'ldpviewer_map',
					base_layers: LdpViewer_base_layers
				},
				title: {
					div: 'ldpviewer_title',
					toggleInfo: 'ldp_viewer_show_hide_info'
				},
				legend: {
					panel:		'ldpviewer_legend',
					container:	'ldpviewer_legend_container',
					base:		'ldpviewer_legend_base',
					button:		'ldpviewer_legend_toggle_container'
				},
				legend_wmsExternal:{
					background:		'ldpviewer_overlay_background',
					mainContainer:	'ldpviewer_legend_aggiungi_wms_container',
					container:		'ldpviewer_overlay_container',
					wmsContainer:  	'ldpviewer_wms_selector_container',
					panel:			'ldpviewer_legend_wmsExternal',
					messages:		'ldp_viewer_overlay_wms_messages',
					button:    		'ldpviewer_overlay_container_close',
					inputUrl:		'ldpviewer_overlay_wms_selector_url'
				},
				legend_wmsInternal:{
						panel:		'ldpviewer_legendWMS',
						container:	'ldpviewer_legendWMS_container'
				},
				vistasu: {
					panel:		'ldpviewer_vistasu',
					container:	'ldpviewer_vistasu_container',
					base:		'ldpviewer_vistasu_base'
				},
				footer: {
					panel:			'ldpviewer_footer',
					infoSelezione:	'footer_info_selezione',
					scala:			'footer_scala',
					scalaInputId:	'input_scala'
				},
				info: {
					container:				menu_page: {
					page:   LdpViewer_menu_page,
					link:   'ov_link_custom'
				},
	'ov_info_container',
					containerMain:	'ov_info_container_main',
					infoTabs:	'ov_info_tabs',
					infoTabsHeader:	'ov_info_tabs_header',
					activeTab:      LdpViewer_active_tab,
					info:		'ldpviewer_info',
					ricerca:				menu_page: {
					page:   LdpViewer_menu_page,
					link:   'ov_link_custom'
				},
	'ov_tab_search',
					classTabs:	'ov_info_tabs',
					help:		'ldpviewer_help',
					wmsGETFeature:  'ldpviewer_info_wms_container'
				},
				toolbar: {
					container:		'ldp_viewer_tabs_container',
					panel:			'ldpviewer_toolbar',
					panelRight:	'ldpviewer_toolbar_right',
					addWms:			'ldpviewer_legend_aggiungi_wms',
					toggleContainer:	'ldp_viewer_show_hide_leftTabs',
					toggleVistasu:	'ldp_viewer_show_hide_vistasu',
					toggleLegend:	'ldp_viewer_show_hide_legend',
					zoomSelection:	'ldpviewer_toolbar_zoom_selection',
					cursorMove:		'ldpviewer_toolbar_cursor_move',
					cursorSelect:	'ldpviewer_toolbar_cursor_select',
					measureLine:	'ldpviewer_toolbar_measure_line',
					measureArea:	'ldpviewer_toolbar_measure_area',
					measure:		'ldpviewer_toolbar_measure'
				},
				tooltip: {
					div:	'ldpviewer_tooltip'
				},
				draw_wkt: {
					div:	'ldpviewer_draw_wkt'
				},
				print_map: {
					div:	'ldpviewer_print_dialog'
				},
				menu_page: {
					page:   LdpViewer_menu_page,
					link:   'ov_link_custom'
				},
				wms:{
					wmsInternalUrl : LdpViewer_internal_wms_url
				}
			},
			proxy: proxy_set
		} );


{*
// PRIMA DI 'ov_info_container',
// OpSoRevision: menu_page is not used
				info: {
					container:				menu_page: {
					page:   LdpViewer_menu_page,
					link:   'ov_link_custom'
				},
}*

{*
// PRIMA DI wms
// OpSoRevision: menu_page is not used
				menu_page: {
					page:   LdpViewer_menu_page,
					link:   'ov_link_custom'
				},
}*
		
console.log("inizio a caricare la mappa...");

		ldp_viewer.loadMap();

console.log("aggiungo gli eventi...");
		ldp_viewer.addEvents();

		ldp_viewer.toggleToolStatus('select');

{*
// OpSoRevision: info_page is not used
*}
		ldp_viewer.loadInfoPage('info',LdpViewer_info_page+string_info_help_init_params);

		ldp_viewer.loadInfoPage('ricerca','openViewerSearches.php'+string_info_help_init_params);

		//Si carica il contenuto del vistasu
		ldp_viewer.loadVistaSu(LdpViewer_vistasu_page);

		//Si carica il contenuto di HELP fatto con Bootstrap Tour
		ldp_viewer.loadTour();
		
		if(LdpViewer_help_page!=null) {
			ldp_viewer.loadInfoPage('help',LdpViewer_help_page+string_info_help_init_params);
		}

{*
// OpSoRevision: info_page is not used
*}		
		//Il link alla pagina principale dell'applicazione
		$("#ov_link_custom").on("click",function(){
			ldp_viewer.loadInfoPage('info',LdpViewer_info_page+string_info_help_init_params);
		});
		
		// se la larghezza della finestra è minore di 1024px (tablet/smartphone) lo stato iniziale della Legenda e Info è CHIUSO
		if ($(document).width() <= 1024) {
			ldp_viewer.toggleLegend(0);
			ldp_viewer.toggleInfo(0);
		}

		//si nasconde il pannello del vistasu
		ldp_viewer.toggleVistaSu(0);
		
		if($("#ldp_viewer_show_hide_leftTabs").hasClass("active") && $(document).width() <= 1024)
			$("#ldp_viewer_show_hide_leftTabs").removeClass("active");

		//Active TAb Di default
		var index = $('#tabs a[href="#ldpviewer_'+ LdpViewer_active_tab +'"]').parent().index();

		//$("#ov_info_tabs").tabs("option", "active", index);
		  $('#ov_info_tabs').tabs({ active: index });
				
		$("#ov_link_custom").hide();
		
		$("#ldpviewer_legend_aggiungi_wms_container").hide();
		$("#ldpviewer_vistasu_container").hide();
		$("#ldpviewer_legend_container").show();
		
		//Si carica la libreria libviewer (si può caricare solo dopo che è stato definito l'oggetto ldp_viewer, altrimenti non funziona)
		$.getScript('{$GLOBALS['URLBaseInclude']}/js/libviewer.js');
		
		ldp_viewer.initPanels();
		ldp_viewer.ev_window_resize();
		
	});
	
	$(".ov_info_tabs").on("click",function(){
		if(ldp_viewer.menu_link.length)
			ldp_viewer.menu_link.show(); 
	});
      

</script>
