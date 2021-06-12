{*
	/**
	 * TEMPLATE SMARTY - MAIN DIV
	 *
	 * This template defines the main DIV of the application, with all graphical components
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
*}
<div id="ov_overlay_background" class="hide" onclick='open_viewer.ev_wmscustom_pageadd_openclose_click()'></div>

{*
	/**
	 * DEFINITION OF THE PANEL "ADD USER WMS LAYER"
	 * --------------------------------------------
	 */
*}
<div id="ov_overlay_container" class="hide">

	<h1>{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/add-wms.svg"|file_get_contents} {$GLOBALS['strings']['interface']['wms_pagetitle']} <a class="exit" id="ov_overlay_container_close" title="{$GLOBALS['strings']['interface']['word_close']}">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/multiply-filled.svg"|file_get_contents}</a></h1>
	
	<table><tr><td>
	
	<div id="wms-info">
		{if !empty($GLOBALS[$GLOBALS['package']]['wms_internal_server']) }
			<p>{$GLOBALS['strings']['interface']['wms_pagedescription1']}:</p><ul>
			{foreach $GLOBALS[$GLOBALS['package']]['wms_internal_server'] as $WMSsource}
				<li>
					<a href="javascript:;" onclick="ov_wms_plugin.WMSuserOpenCatalog('{$WMSsource['server_url']}')" title="{$WMSsource['server_url']}" >{$WMSsource['title']}</a> 
					<a href="{$WMSsource['description_url']}" title="{$WMSsource['description_url']}" target="_blank" rel="noopener">({$GLOBALS['strings']['interface']['sentence_visitthewebsite']|lower})</a>
				</li>
			{/foreach}</ul>
		{/if}
		
		{if !empty($GLOBALS[$GLOBALS['package']]['wms_server']) }
			{if !empty($GLOBALS[$GLOBALS['package']]['wms_internal_server']) }
				<p>{$GLOBALS['strings']['interface']['wms_pagedescription2']}. {$GLOBALS['strings']['interface']['sentence_forexample']}:</p><ul>
			{else}
				<p>{$GLOBALS['strings']['interface']['wms_pagedescription3']}. {$GLOBALS['strings']['interface']['sentence_forexample']}:</p><ul>
			{/if}
			{foreach $GLOBALS[$GLOBALS['package']]['wms_server'] as $WMSsource}
				<li>
					<a href="javascript:;" onclick="ov_wms_plugin.WMSuserOpenCatalog('{$WMSsource['server_url']}')" title="{$WMSsource['server_url']}" >{$WMSsource['title']}</a> 
					<a href="{$WMSsource['description_url']}" title="{$WMSsource['description_url']}" target="_blank" rel="noopener">({$GLOBALS['strings']['interface']['sentence_visitthewebsite']|lower})</a>
				</li>
			{/foreach}</ul>
		{/if}
{* OVD ELIMINARE ??? (NECESSARIO DECIDERE SE CONSERVARE O MENO I WMS INTERNAL
		{if isset($GLOBALS['geoserver']['url_workspace']) && {$GLOBALS['package']} != 'archivio_cartografico' && {$GLOBALS['package']} != 'archivio_cartografico_pub' }
			<br/>
			<p>Oppure, visualizza i layer resi disponibili dall'Amministrazione. &nbsp;<button title='Apri l&apos;URL inserito e ottieni la lista dei layer' onclick='open_viewer.overlayWmsInternal()' value='Layer del Portale'>Mostra layer pubblicati da {$GLOBALS[$GLOBALS.package].app_title_short}</button></p>
		{/if}
*}
	</div>
	</td>
{* OVD ELIMINARE ???
	<td>
	<div id="wms-example" class="panel panel-default">
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
	
	</td
*}
	</tr></table>
	
	<div id="ov_overlay_wms_messages"></div>
	
	<input id='ov_overlay_wms_selector_url' value='' placeholder='{$GLOBALS['strings']['interface']['wms_inserturlwmsserver']}' type='url'/>&nbsp;<button id='ov_overlay_wms_selector_button' title='{$GLOBALS['strings']['interface']['wms_clicktogetlistwmslayers']}' onclick='ov_wms_plugin.WMSuserLaunchScanUrl()' value='{$GLOBALS['strings']['interface']['wms_showavailablelayers']}'>{$GLOBALS['strings']['interface']['wms_showavailablelayers']}</button>
	
{* OVD ELIMINARE ???
	<!-- <p>Ad esempio, per utilizzare <em>Ambiti amministrativi</em> di Regione Toscana:</p>
	<ul>
		<li>apri l'elenco dei <a href="http://www.regione.toscana.it/-/geoscopio-wms" title="Elenco servizi WMS di Regione Toscana">Servizi WMS di Regione Toscana</a>;</li> 
		<li>cerca la voce </em>Ambiti amministrativi</em> e copia l'URL corrispondente <code>http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&map_resolution=91</code>;</li>
		<li>inserisci la stringa copiata in questa finestra, nel campo <i><b>"inserisci URL del WMS"</b></i>;</li> 
		<li>clicca su <i><b>"Mostra layer disponibili"</b></i>.</li>
		<li>scegli uno dei livelli cartografici disponibili e clicca su <i><span class="fa fa-plus-circle"></span> aggiungi</i> per visualizzare lo strato sulla mappa: esso apparirà all'interno della Legenda.</li>
	</ul> -->
*}
	
	<div id="ov_wms_selector_container"></div>
</div>



{*
	/**
	 * DEFINITION OF THE "MAIN PANEL"
	 * ------------------------------
	 */
*}
<div id="ov_container">
	<div id="ov_title">
		<div id="intesta">
			{if !empty($GLOBALS[$GLOBALS['package']]['exit_url']) }
			<a class="exit" id="exit" href="{$GLOBALS[$GLOBALS['package']]['exit_url']}" title="{$GLOBALS['strings']['interface']['button_exitinteractivemap']}" target="_top">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/exit.svg"|file_get_contents}</a>
			{else}
			<a class="exit" id="exit" href="{$GLOBALS['exit_url_default']}" title="{$GLOBALS['strings']['interface']['button_exitinteractivemap']}" target="_top">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/exit.svg"|file_get_contents}</a>
			{/if}
			<div class="titolo_cliente">
				{if !empty($GLOBALS[$GLOBALS.package].ov_map_group) }
					<span id="titolo_gruppo">{$GLOBALS[$GLOBALS.package].ov_map_group}</span>
				{/if}
				<span id="titolo_progetto">{$GLOBALS[$GLOBALS.package].map_title}</span>
				<span id="nome_cliente">{$GLOBALS[$GLOBALS.package].app_department} {$GLOBALS[$GLOBALS.package].app_title_long}</span>
				<!-- <span id="nome_cliente">{$GLOBALS['app_department']} {$GLOBALS['app_title_long']}</span> -->
			</div>
		</div>
		
		<div id="title_right">
			<a id="help" href="javascript:;" onclick="open_viewer.RestartTour()" title="{$GLOBALS['strings']['interface']['button_guidedtour']}">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/help.svg"|file_get_contents}</a>
		</div>
	</div>

	<div id="ov_map_container">
		<div id="ov_toolbar">
			<div id="ov_show_hide_leftTabs" onclick="open_viewer.toggleLeftTabs()" class="ov-icon-wrap active" title="{$GLOBALS['strings']['interface']['sentence_opencloselegend']}">
				{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
			</div>
			<div id="ov_tabs_container">
				<div id="ov_tabs_header">
					<div id="ov_close_panel" class="mobile" onclick="open_viewer.toggleLeftTabs()" >
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
					</div>
					<ul id="ov_tabs_left">
						<li><a href="#ov_legend_container" id="ov_show_hide_legend">{$GLOBALS['strings']['interface']['word_legend']}</a></li>
						{if $GLOBALS[$GLOBALS.package].app_left_tabs_enable.ov_link_add_wms == true}
{* OVD ELIMINARE ???       <li><a href="#ov_legend_add_wms_layer" id="ov_legend_aggiungi_wms">WMS</a></li> *}
						{/if}
{* OVD ELIMINARE ???
						<li><a href="#ov_vistasu_container"id="ov_show_hide_vistasu">Vista Su</a></li>
*}
					</ul>
				</div>
				
{*
	/**
	 * DEFINITION OF THE "MAIN PANEL / LEGEND PANEL"
	 * ---------------------------------------------
	 */
*}
				<div id="ov_legend_container" class="ov_legend_docked">
{* OVD ELIMINARE ???
					{if {$GLOBALS['package']} == 'archivio_cartografico' || {$GLOBALS['package']} == 'archivio_cartografico_pub' ||  $GLOBALS[$GLOBALS.package].map_options.externalWms==true}
						<div id="ov_legendWMS_title">
							<button id="toggle_ov_legendWMS" class="legend_toggle_container legend_open" title="{$GLOBALS['strings']['interface']['sentence_opencloselegend']}"></button>
							{if !empty($GLOBALS[$GLOBALS['package']]['ov_label_external_wms'])}
								{$GLOBALS[$GLOBALS['package']]['ov_label_external_wms']}
							{else}
								WMS {$GLOBALS[$GLOBALS.package].app_title_short}
							{/if}
						</div>
						<div id="ov_legendWMS"></div>
					{/if}
*}
					<div id="ov_legend_title"><button id="toggle_ov_legend" class="legend_toggle_container legend_open" title="{$GLOBALS['strings']['interface']['sentence_opencloselegend']}"></button>{$GLOBALS['strings']['interface']['word_themes']}</div>
					<div id="ov_legend"></div>
					
					<div id="ov_legend_wmsuserlayers_title">
						<span>{$GLOBALS['strings']['interface']['sentence_thirdpartyWMS']}</span>
						<button id="toggle_ov_legend_wmsuserlayers" class="legend_toggle_container legend_open" title="{$GLOBALS['strings']['interface']['sentence_opencloselegend']}"></button>
						<button id="toggle_ov_legend_wmsuserlayers" class="ov_legend_tool_container add_wmsuserlayers" onclick="open_viewer.ev_wmscustom_pageadd_openclose_click()" title="{$GLOBALS['strings']['interface']['sentence_addwmstomap']}">
						<button id="toggle_ov_legend_wmsuserlayers" class="ov_legend_tool_container clear_wmsuserlayers" onclick="open_viewer.ev_wmscustom_remove_all_click()" title="{$GLOBALS['strings']['interface']['sentence_removealluserwms']}">
						</span>
                    </div>
					<div id="ov_legend_wmsuserlayers"></div>
					
					<div id="ov_legend_basemaplayers_title"><button id="toggle_ov_legend_basemaplayers" class="legend_toggle_container legend_open" title="{$GLOBALS['strings']['interface']['sentence_opencloselegend']}"></button>{$GLOBALS['strings']['interface']['sentence_basemap']}</div>
					<div id="ov_legend_basemaplayers"></div>
				</div>
				
{* OVD ELIMINARE ??? E' GIA' POSSIBILE AGGIUNGERE I WMS USER DAL BOTTONE SUL TITOLO DI SEZIONE
				{if $GLOBALS[$GLOBALS.package].app_left_tabs_enable.ov_link_add_wms == true}
				<div id="ov_legend_add_wms_layer">
					
					<div class="ov_legend_aggiungi_wms">
						<a href="javascript:;" onclick="open_viewer.ev_wmscustom_pageadd_openclose_click()" title="{$GLOBALS['strings']['interface']['wms_pagetitle']}">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/add-wms.svg"|file_get_contents} Aggiungi WMS</a>
					</div>
					<p>Utilizza un servizio WMS per aggiungere strati cartografici alla mappa.</p>
					<div id="ov_legend_wmsUser"></div>
				</div>
				{/if}
*}

{* OVD ELIMINARE ???
				<div id="ov_vistasu_container" class="ov_vistasu_docked">
					<p>Apri un&lsquo;altra mappa con la vista corrente:</p>
					<div id="ov_vistasu"></div>
				</div>
*}
			
			</div>
			
			<span class="separator"></span>
			
{*
	/**
	 * DEFINITION OF THE "MAIN PANEL / TOOLS (VERTICAL LEFT BAR)"
	 * ----------------------------------------------------------
	 */
*}
			<div id="tools">
				{*DIVs around the svg images are used only by the help function: they group the tools to be highlighted *}
				
				<div id="ov_toolbar_cursor_select" onclick="open_viewer.toggleToolStatus('select')" class="ov-icon-wrap desktop tool-on-off" title="{$GLOBALS['strings']['interface']['button_defaultstatus']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/arrow-hand.svg"|file_get_contents}
				</div>
				<div id="ov_toolbar_zoom_selection" onclick="open_viewer.toggleToolStatus('zoom_selection')" class="ov-icon-wrap desktop tool-on-off" title="{$GLOBALS['strings']['interface']['button_zoomrectangle']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-selection.svg"|file_get_contents}
				</div>
				
				<span class="separator"></span>
				
				<div onclick="open_viewer.initialMapView()" class="ov-icon-wrap" title="{$GLOBALS['strings']['interface']['button_initialview']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-to-extents-filled.svg"|file_get_contents}
				</div>
				<div onclick="open_viewer.zoomIn()" class="ov-icon-wrap desktop" title="{$GLOBALS['strings']['interface']['button_zoomincenter']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-in.svg"|file_get_contents}
				</div>
				<div onclick="open_viewer.zoomOut()" class="ov-icon-wrap desktop" title="{$GLOBALS['strings']['interface']['button_zoomoutcenter']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-out.svg"|file_get_contents}
				</div>
				<div onclick="open_viewer.previousMapView()" class="ov-icon-wrap desktop" title="{$GLOBALS['strings']['interface']['button_previousview']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-back.svg"|file_get_contents}
				</div>
				<div onclick="open_viewer.nextMapView()" class="ov-icon-wrap desktop" title="{$GLOBALS['strings']['interface']['button_nextview']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/zoom-forward.svg"|file_get_contents}
				</div>
				
				<span class="separator"></span>
				
				<div id="ov_toolbar_measure">
					<div id="ov_toolbar_measure_line" onclick="open_viewer.measure('measure_line')" class="ov-icon-wrap desktop tool-on-off" title="{$GLOBALS['strings']['interface']['button_measuredistance']}">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/length.svg"|file_get_contents}
					</div>
					<div id="ov_toolbar_measure_area" onclick="open_viewer.measure('measure_area')" class="ov-icon-wrap desktop tool-on-off" title="{$GLOBALS['strings']['interface']['button_measurearea']}">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/misura-area.svg"|file_get_contents}
					</div>
					<div id="ov_toolbar_eraser" onclick="open_viewer.clearTempLayers({$GLOBALS[$GLOBALS["package"]]["temporary_layers"]})" class="ov-icon-wrap desktop" title="{$GLOBALS['strings']['interface']['button_clearmap']}">
						{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/erase.svg"|file_get_contents}
					</div>
				</div>
				
				<span class="separator"></span>
				
				<div id="ov_print_map" onclick="open_viewer.loadPrintMap(ov_stampa_page);" class="ov-icon-wrap" title="{$GLOBALS['strings']['interface']['button_printmap']}">
					{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/print.svg"|file_get_contents}
				</div>
			</div>
			
			<span id="ov_progressbar"></span>
			
{* OVD E' POSSIBILE ATTIVARLO ??? *}
			<div id="ov_trova_posizione" onclick="open_viewer.trackingPosition()" class="ov-icon-wrap mobile" title="{$GLOBALS['strings']['interface']['sentence_showyourposonthemap']}">
				{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/center-direction.svg"|file_get_contents}
			</div>
			
		</div>
		
{*
	/**
	 * DEFINITION OF THE "MAIN PANEL / MAP"
	 * ------------------------------------
	 */
*}
		<div id="ov_map">
			<div id="ov_tooltip" class="ol-popup"></div>
			<div id="ov_draw_wkt"></div>
			<div id="ov_print_dialog"></div>
		</div>
		
{*
	/**
	 * DEFINITION OF THE "RIGHT PANEL"
	 * -------------------------------
	 */
*}
		<div id="ov_toolbar_right">
			<div id="ov_show_hide_info" onclick="open_viewer.toggleInfo()" class="ov-icon-wrap active" title="{$GLOBALS['strings']['interface']['sentence_opencloseinfopanel']}">
			{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
			</div>
		</div>	
		
		<div id="ov_info_container" class="ov_info_docked">
			<div id="ov_info_container_main">
				<div id="ov_info_tabs">
					<div id="ov_info_tabs_header">
						<div id="ov_close_info_panel" onclick="open_viewer.toggleInfo()" class="ov-icon-wrap mobile">
							{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/open-pane-filled.svg"|file_get_contents}
						</div>
						<ul id="tabs">
							{if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_query_result']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_query_result'] != true}  
							{else}
								<li id="ov_link_query_result"><a href="#ov_page_query_result" class="ov_info_tabs" title="{$GLOBALS['strings']['interface']['tab_query_content']}">{$GLOBALS['strings']['interface']['tab_query_title']}</a></li>
							{/if}
							
							{if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_search']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_search'] != true}  
							{else}
								<li id="ov_link_search"><a href="#ov_page_search" class="ov_info_tabs" title="{$GLOBALS['strings']['interface']['tab_search_content']}">{$GLOBALS['strings']['interface']['tab_search_title']}</a></li>
							{/if}
						
							{if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_custom']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_custom'] != true}
							{else}
								<li id="ov_link_custom"><a href="#ov_page_custom" class="ov_info_tabs" title="{$GLOBALS['strings']['interface']['tab_custom_content']}">{$GLOBALS['strings']['interface']['tab_custom_title']}</a></li>
							{/if}
							
							{if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_app_info']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_app_info'] != true}  
							{else}
								<li id="ov_link_app_info"><a href="#ov_page_app_info" class="ov_info_tabs" title="{$GLOBALS['strings']['interface']['tab_appinfo_content']}">{$GLOBALS['strings']['interface']['tab_appinfo_title']}</a></li>
							{/if}
						</ul>
					</div>
						
{*
	/**
	 * DEFINITION OF THE "RIGHT PANEL TABS"
	 * ------------------------------------
	 */
*}
					<div id="ov_page_query_result" class="ov_info_tab_content {if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_query_result']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_query_result'] != true} hide {/if}"></div>
					
					<div id="ov_page_search" class="ov_info_tab_content {if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_search']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_search'] != true} hide {/if}"></div>
					
{* OVD SOSTITUITO     <div id="ov_page_search" class="ov_info_tab_content"></div> *}
					
					<div id="ov_page_custom" class="ov_info_tab_content {if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_custom']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_custom'] != true} hide {/if}"></div>
					
					<div id="ov_page_app_info" class="ov_info_tab_content {if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_app_info']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_enable']['ov_link_app_info'] != true} hide {/if}"></div>
				</div>
			</div>
		</div>
		
{*
	/**
	 * DEFINITION OF THE "FOOTER"
	 * --------------------------
	 */
*}
		<div id="ov_footer">
			<div id="ov_ready">{"{$GLOBALS.PATHBaseInclude}/img/openViewer/toolbar/circled-female-user.svg"|file_get_contents}<em><span id='ov_ready_message'>{$GLOBALS['strings']['interface']['welcome_msg_statusbar']}</span></em></div>
			<div id="footer_mouse_coordinates">&nbsp;</div>
			{if isset($GLOBALS[$GLOBALS['package']]['map_options']['show_number_selected_features']) && $GLOBALS[$GLOBALS['package']]['map_options']['show_number_selected_features'] == true}  
				<div id="footer_info_selezione">0 {$GLOBALS['strings']['interface']['features_selected_statusbar']}</div>
			{else}
				<div id="footer_info_selezione">&nbsp;</div>
			{/if}
			{if isset($GLOBALS[$GLOBALS['package']]['map_options']['show_view_scale']) && $GLOBALS[$GLOBALS['package']]['map_options']['show_view_scale'] == true}  
				<div id="footer_scala" title="{$GLOBALS['strings']['interface']['sentence_insertscale']}">&nbsp;</div>
			{else}
				<div id="footer_scala_void">&nbsp;</div>
			{/if}
			{if isset($GLOBALS[$GLOBALS['package']]['map_options']['show_view_crs']) && $GLOBALS[$GLOBALS['package']]['map_options']['show_view_crs'] == true}  
				<div id="footer_mapprojection" title="{$GLOBALS['strings']['interface']['sentence_renderingprojection']}">{$GLOBALS[$GLOBALS['package']]['map_options']['map_projection']}</div>
			{else}
				<div id="footer_mapprojection">&nbsp;</div>
			{/if}
			<div id="footer_poweredby"><a href="http://www.ldpgis.it" title="Website LDP Progetti GIS"><img src="/include/img/openViewer/footer/logo_solo_ldp_20x25.png" alt="Website LDP Progetti GIS" /></a></div>
		</div>

	</div>

</div>

<script type="text/javascript">

	// logging environment
	flag_console_messages={json_encode($GLOBALS[$GLOBALS["package"]]["show_console_messages"])};
	flag_show_getcap_button={json_encode($GLOBALS[$GLOBALS["package"]]["show_getcapabilities_button"])};
	flag_show_getcap_new_tab={json_encode($GLOBALS[$GLOBALS["package"]]["show_getcapabilities_in_a_new_tab"])};
	footer_panel_ready = $("#ov_ready_message");
	timeout_id_readymsg=-1;
	timeout_duration_readymsg = 5000;

	// initial definition of the map
	var map_definition={json_encode($GLOBALS[$GLOBALS["package"]]["map_definition"])};
	var map_options={json_encode($GLOBALS[$GLOBALS["package"]]["map_options"])};
	
	// settings for the help
	var ov_info_help_init_params={json_encode($GLOBALS[$GLOBALS["package"]]["ov_info_help_init_params"])};
	
{* OVD ELIMINARE ???
	// configuration of optional field to be add to the selected features
	var ov_layers_selection_extra_fields={json_encode($GLOBALS[$GLOBALS["package"]]["ov_layers_selection_extra_fields"])};
*}

{* OVD ELIMINARE ??? E? NECESSARIO MODIFICARE ANCHE IL CODICE CHE GLI FA RIFERIMENTO *}
	// Pagina di default per il vistasu
	var ov_vistasu_page="{$GLOBALS.URLBaseInclude}/php/vistasu/vistasu_connector.ldpviewer.php";

{* OVD E' POSSIBILE FARLA FUNZIONARE ??? *}
	// Default page for the print dialog
	// var ov_stampa_page="{$GLOBALS.URLBaseInclude}/php/stampa/stampa.ldpviewer.php";
	var ov_stampa_page="{$GLOBALS.URLBaseInclude}/print/print.openviewer.php";

	// Configuration of the Proxy
	var proxy_set = false;
	if( typeof map_options.proxy !== 'undefined')
		proxy_set = map_options.proxy;
	var OpenViewer_proxy="{$GLOBALS.URLBaseInclude}/openViewer/openViewerProxy.php";
	
{* OVD A COSA SERVE ??? *}
	// Configuration of external WMS
	var external_wms = false;
	if( typeof map_options.externalWms !== 'undefined'){
		var external_wms = map_options.externalWms;
        var permitted_autentication =  map_options.permitted_autentication;
	}

{* OVD E' POSSIBILE ATTIVARE SOTTO ????            {json_encode($GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_custom)} *}
	// Default page for the "QueryResult" tab
	//var ov_info_page = "{json_encode($GLOBALS['ov_page_query_result_default'])}";
	{if {$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_query_result}}
		//ov_info_page = '{json_encode($GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_query_result)}'; 
	{/if}
	
{* OVD A COSA SERVE ??? *}
	var ov_help_page="help.php";
	
	// URL of the interanl WMS server 
	var ov_internal_wms_url = '{$GLOBALS['geoserver']['url_workspace']}';
	
{* OVD ELIMINARE ??? *}
{* OVD E' POSSIBILE FARLO FUNZIONARE CON GLI USER WMS ??? *}
	// Configuration of the information page for external WMS (getFeatureInfo)
	{if {$GLOBALS[$GLOBALS["package"]]["WMSGetFeatureInfoCustomPage"]}}
		ov_WMSGetFeatureInfoCustomPage = '{$GLOBALS[$GLOBALS["package"]]["WMSGetFeatureInfoCustomPage"]}';
	{/if}
	
{* OVD ELIMINARE ??? E' NECESSARIO MODIFICARE ANCHE IL CODICE *}
	// Configuration of the additional parameters for the map legislation
	var string_info_help_init_params="";
	if(ov_info_help_init_params!=null) {
		string_info_help_init_params="?viewer=myOV&normativa="+ov_info_help_init_params.normativa+"&mappa="+ov_info_help_init_params.mappa;
		ov_info_page="help.php";
		ov_help_page=null;
	} 
	
	// Configuration of the tab active when the app starts
	{if isset($GLOBALS[$GLOBALS['package']]['app_right_active_tab']) &&  ($GLOBALS[$GLOBALS['package']]['app_right_active_tab'] == 'page_query_result' ||
	                                                                      $GLOBALS[$GLOBALS['package']]['app_right_active_tab'] == 'page_search' ||
	                                                                      $GLOBALS[$GLOBALS['package']]['app_right_active_tab'] == 'page_custom' ||
	                                                                      $GLOBALS[$GLOBALS['package']]['app_right_active_tab'] == 'page_app_info' ) }   
		var ov_active_tab = '{$GLOBALS[$GLOBALS['package']]['app_right_active_tab']}';
	{else}
		var ov_active_tab = 'page_app_info';
	{/if}
	
	// Configuration of the basemap layers
	{if isset($GLOBALS[$GLOBALS["package"]]["basemap_layers"])}
	
if(flag_console_messages) console.log('Configuration of the base layers...');
		var mapBasemapListLayers = {json_encode($GLOBALS[$GLOBALS["package"]]["basemap_layers"])};
		if(mapBasemapListLayers == ''){
			$("#ov_legend_basemaplayers_title").hide();
		}
		var mapBasemapLayersDefinition = new Array();
		{for $i=1 to count($GLOBALS[$GLOBALS["package"]]["basemap_layers"])}
			{assign ln $GLOBALS[$GLOBALS["package"]]["basemap_layers"][$i-1]};
			var aLayer = new Array();
			var aLayer =	{
							key: '{$ln}',
							sourceType: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.source_type}',
							wms_url: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.wms_url}',
							wms_layers_names: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.wms_layers_names}',
							wms_server_type: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.wms_server_type}',
							wms_layer_projection: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.wms_layer_projection}',
							max_zoom: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.max_zoom}',
							layer_title: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.layer_title}',
							layer_description: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.layer_description}',
							layer_copyright: '{$GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.layer_copyright}',
							layer_visible: '{json_encode($GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.layer_visible)}',
							is_basemap_layer: '{json_encode($GLOBALS[$GLOBALS["package"]]["basemap_layers_definition"].$ln.is_basemap_layer)}'
							};
			mapBasemapLayersDefinition.push(aLayer);
		{/for}
{* if(flag_console_messages) console.log(mapBasemapLayersDefinition); *}

	{else}
		var mapBasemapListLayers = null;
		var mapBasemapLayersDefinition = new Array();
	{/if}
	
	// -------------------------------------------------------------------
	// Run the viewer
	// -------------------------------------------------------------------
	$(document).ready(function(){
		// initialize the "utilities" library
		ov_utils = new generalUtilities( { 
			flagConsMsg: flag_console_messages
		} );
		
		// initialize the "WMS" plugin
		ov_wms_plugin = new ovWmsLayers( { 
			flagConsMsg:	flag_console_messages,
			legend_wmsUser:	{
				container:		'ov_overlay_container',
				wmsContainer:  	'ov_wms_selector_container',   
				messages:		'ov_overlay_wms_messages',
				inputUrl:		'ov_overlay_wms_selector_url',
				inputFilter:	'ov_wms_selector_filter_text',
				layersSelector:	'overlay_wms_selector_layers'
			},
			wmsInternalUrl : ov_internal_wms_url,
			flagShowGetCapButton: flag_show_getcap_button
		} );
		
		// initialize the "openViewer"
		open_viewer = new openViewer( { 
			name: 'default', 
			stato: map_definition,
			mapOptions: map_options,
			components: {
				container: {
					div: 'ov_container'
				},
				map: {
					div: 'ov_map',
					basemapLayersList: mapBasemapListLayers,
					basemapLayersDefinition: mapBasemapLayersDefinition
				},
				title: {
					div: 'ov_title',
					toggleInfo: 'ov_show_hide_info'
				},
				legend: {
					panel:				'ov_legend',
					container:			'ov_legend_container',
					wmsUserLayers:		'ov_legend_wmsuserlayers',
					basemaplayers:		'ov_legend_basemaplayers',
					buttonOpenClose:	'legend_toggle_container',
					buttonTool:			'ov_legend_tool_container'
				},
				legend_wmsUser:{
					background:		'ov_overlay_background',
					mainContainer:	'ov_legend_add_wms_layer',
					container:		'ov_overlay_container',
					wmsContainer:  	'ov_wms_selector_container',   
					panel:			'ov_legend_wmsUser',
					messages:		'ov_overlay_wms_messages',
					button:    		'ov_overlay_container_close',
					inputUrl:		'ov_overlay_wms_selector_url',
					layersSelector:	'overlay_wms_selector_layers'
				},
				legend_wmsInternal:{
						panel:		'ov_legendWMS',
						container:	'ov_legendWMS_container'
				},
				vistasu: {
					panel:		'ov_vistasu',
					container:	'ov_vistasu_container',
					base:		'ov_vistasu_base'
				},
				footer: {
					panel:				'ov_footer',
					readyMsg:			'ov_ready_message',
					{if isset($GLOBALS[$GLOBALS['package']]['map_options']['show_number_selected_features']) && $GLOBALS[$GLOBALS['package']]['map_options']['show_number_selected_features'] == true}  
						infoSelezione:	'footer_info_selezione',
					{else}
						infoSelezione:	'',
					{/if}
					{if isset($GLOBALS[$GLOBALS['package']]['map_options']['show_view_scale']) && $GLOBALS[$GLOBALS['package']]['map_options']['show_view_scale'] == true}  
						scala:			'footer_scala',
						scalaInputId:	'input_scala'
					{else}
						scala:			'',
						scalaInputId:	''
					{/if}
				},
				info: {
					container:	    'ov_info_container',
					containerMain:	'ov_info_container_main',
					infoTabs:	    'ov_info_tabs',
					infoTabsHeader:	'ov_info_tabs_header',
					activeTab:      ov_active_tab,
					tabQueryResult:	'ov_page_query_result',
					tabSearch:	    'ov_page_search',
					tabCustom:	    'ov_page_custom',
					tabAppInfo:	    'ov_page_app_info',
					classTabs:	    'ov_info_tabs',
					help:		    'ov_help',
					wmsGETFeature:  'ov_info_wms_container'
				},
				toolbar: {
					container:		'ov_tabs_container',
					panel:			'ov_toolbar',
					panelRight:		'ov_toolbar_right',
					addWms:			'ov_legend_aggiungi_wms',
					toggleContainer:'ov_show_hide_leftTabs',
					toggleVistasu:	'ov_show_hide_vistasu',
					toggleLegend:	'ov_show_hide_legend',
					zoomSelection:	'ov_toolbar_zoom_selection',
					cursorMove:		'ov_toolbar_cursor_move',
					cursorSelect:	'ov_toolbar_cursor_select',
					measureLine:	'ov_toolbar_measure_line',
					measureArea:	'ov_toolbar_measure_area',
					measure:		'ov_toolbar_measure'
				},
				tooltip: {
					div:	'ov_tooltip'
				},
				draw_wkt: {
					div:	'ov_draw_wkt'
				},
				print_map: {
					div:	'ov_print_dialog'
				},
				wms:{
					wmsInternalUrl : ov_internal_wms_url
				}
			},
			proxy: proxy_set,
			flagConsMsg: flag_console_messages,
			flagShowGetCapNewTab: flag_show_getcap_new_tab,
			flagShowGetCapButton: flag_show_getcap_button,
		} );
		
		
		{* OPENVIEWER PLUGINS *}
		{if isset($GLOBALS[$GLOBALS.package]['plugins']['wmslayers']) }  
			open_viewer.setPluginWmsLayers(true);
if(flag_console_messages) console.log("Plugin WMS Layers installed"); 
		{/if}
		
if(flag_console_messages) console.log("Start loading the map..."); 
		open_viewer.loadMap();
		
if(flag_console_messages) console.log("Start adding events handling...");
		open_viewer.addEvents();
		
		open_viewer.toggleToolStatus('select');
		
		// Configuration of the "right tabs"
		// OVD MODIFICA TEMPORANEA DEL TOOL (DA VERIFICARE SE/QUANDO VENGONO RIPRISTINATE LE FUNZIONALITA'
		//open_viewer.loadInfoPage('tabQueryResult',ov_info_page+string_info_help_init_params);
		//open_viewer.loadInfoPage('tabSearch','{json_encode($GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_search)}'+string_info_help_init_params);
		
		open_viewer.loadInfoPage('tabQueryResult','{$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_query_result}'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabSearch','{$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_search}'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabCustom','{$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_custom}'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabAppInfo','{$GLOBALS[$GLOBALS['package']]['app_right_tabs_page'].ov_page_app_info}'+string_info_help_init_params);
		
{* OVD ELIMINARE ???
		//Si carica il contenuto del vistasu
		open_viewer.loadVistaSu(ov_vistasu_page);
		
		//si nasconde il pannello del vistasu
		open_viewer.toggleVistaSu(0);
*}
		
		// Load the HELP settings (implemented with Bootstrap Tour)
		open_viewer.loadTour();
		if(ov_help_page!=null) {
			open_viewer.loadInfoPage('help',ov_help_page+string_info_help_init_params);
		}
		
		// Adjust the interface based on the device (if the window width is < 1024px (tablet/smartphone), the legend is initially hidden
		// - Legend
		if ($(document).width() <= 1024) {
			open_viewer.toggleLegend(0);
			open_viewer.toggleInfo(0);
		}
		// Adjust the interface based on the device (if the window width is < 1024px (tablet/smartphone), the legend is initially hidden
		// - Left tabs panel
		if($("#ov_show_hide_leftTabs").hasClass("active") && $(document).width() <= 1024)
			$("#ov_show_hide_leftTabs").removeClass("active");

		// Activation of the default "right tab" (set in configuration .PHP file)
		var index = $('#tabs a[href="#ov_'+ ov_active_tab +'"]').parent().index();
        $('#ov_info_tabs').tabs({ active: index });
				
{* OVD ELIMINARE ???
		$("#ov_legend_add_wms_layer").hide();
		$("#ov_vistasu_container").hide();
*}
		$("#ov_legend_container").show();
		
		// Load the "libViewer" JavaScript library (it must be loaded after "open_viewer" object initialization, otherwise it does not work)
		$.getScript('{$GLOBALS['URLBaseInclude']}/js/libviewer.js');
		
		// initialization of the "right tabs panel"
		{if isset($GLOBALS[$GLOBALS['package']]['app_right_tabs_active_at_start']) && $GLOBALS[$GLOBALS['package']]['app_right_tabs_active_at_start'] == false}   
			open_viewer.initPanels(false);
		{else}
			open_viewer.initPanels(true);
		{/if}
		
		// map window resize
		open_viewer.ev_window_resize();
		
	});

</script>
