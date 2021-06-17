<?php /* Smarty version Smarty-3.1.13, created on 2021-06-17 10:24:50
         compiled from "include/openViewer/openViewer.tpl" */ ?>
<?php /*%%SmartyHeaderCode:154155885660cb22f27cbf37-43437789%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c61582a8af6f5558bb09c4455611b0d9bfdf8634' => 
    array (
      0 => 'include/openViewer/openViewer.tpl',
      1 => 1623925266,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '154155885660cb22f27cbf37-43437789',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'GLOBALS' => 0,
    'WMSsource' => 0,
    'i' => 0,
    'ln' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_60cb22f28acd46_92896758',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_60cb22f28acd46_92896758')) {function content_60cb22f28acd46_92896758($_smarty_tpl) {?>
<div id="ov_overlay_background" class="hide" onclick='open_viewer.ev_wmscustom_pageadd_openclose_click()'></div>


<div id="ov_overlay_container" class="hide">

	<h1><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/add-wms.svg");?>
 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_pagetitle'];?>
 <a class="exit" id="ov_overlay_container_close" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['word_close'];?>
"><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/multiply-filled.svg");?>
</a></h1>
	
	<table><tr><td>
	
	<div id="wms-info">
		<?php if (!empty($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['wms_internal_server'])){?>
			<p><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_pagedescription1'];?>
:</p><ul>
			<?php  $_smarty_tpl->tpl_vars['WMSsource'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['WMSsource']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['wms_internal_server']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['WMSsource']->key => $_smarty_tpl->tpl_vars['WMSsource']->value){
$_smarty_tpl->tpl_vars['WMSsource']->_loop = true;
?>
				<li>
					<a href="javascript:;" onclick="ov_wms_plugin.WMSuserOpenCatalog('<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['server_url'];?>
')" title="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['server_url'];?>
" ><?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['title'];?>
</a> 
					<a href="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['description_url'];?>
" title="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['description_url'];?>
" target="_blank" rel="noopener">(<?php echo mb_strtolower($_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_visitthewebsite'], 'UTF-8');?>
)</a>
				</li>
			<?php } ?></ul>
		<?php }?>
		
		<?php if (!empty($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['wms_server'])){?>
			<?php if (!empty($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['wms_internal_server'])){?>
				<p><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_pagedescription2'];?>
. <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_forexample'];?>
:</p><ul>
			<?php }else{ ?>
				<p><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_pagedescription3'];?>
. <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_forexample'];?>
:</p><ul>
			<?php }?>
			<?php  $_smarty_tpl->tpl_vars['WMSsource'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['WMSsource']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['wms_server']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['WMSsource']->key => $_smarty_tpl->tpl_vars['WMSsource']->value){
$_smarty_tpl->tpl_vars['WMSsource']->_loop = true;
?>
				<li>
					<a href="javascript:;" onclick="ov_wms_plugin.WMSuserOpenCatalog('<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['server_url'];?>
')" title="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['server_url'];?>
" ><?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['title'];?>
</a> 
					<a href="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['description_url'];?>
" title="<?php echo $_smarty_tpl->tpl_vars['WMSsource']->value['description_url'];?>
" target="_blank" rel="noopener">(<?php echo mb_strtolower($_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_visitthewebsite'], 'UTF-8');?>
)</a>
				</li>
			<?php } ?></ul>
		<?php }?>
	</div>
	</td>
	</tr></table>
	
	<div id="ov_overlay_wms_messages"></div>
	
	<input id='ov_overlay_wms_selector_url' value='' placeholder='<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_inserturlwmsserver'];?>
' type='url'/>&nbsp;<button id='ov_overlay_wms_selector_button' title='<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_clicktogetlistwmslayers'];?>
' onclick='ov_wms_plugin.WMSuserLaunchScanUrl()' value='<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_showavailablelayers'];?>
'><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['wms_showavailablelayers'];?>
</button>
	
	<div id="ov_wms_selector_container"></div>
</div>




<div id="ov_container">
	<div id="ov_title">
		<div id="intesta">
			<?php if (!empty($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['exit_url'])){?>
			<a class="exit" id="exit" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['exit_url'];?>
" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_exitinteractivemap'];?>
" target="_top"><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/exit.svg");?>
</a>
			<?php }else{ ?>
			<a class="exit" id="exit" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['exit_url_default'];?>
" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_exitinteractivemap'];?>
" target="_top"><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/exit.svg");?>
</a>
			<?php }?>
			<div class="titolo_cliente">
				<?php if (!empty($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['ov_map_group'])){?>
					<span id="titolo_gruppo"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['ov_map_group'];?>
</span>
				<?php }?>
				<span id="titolo_progetto"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_title'];?>
</span>
				<span id="nome_cliente"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_department'];?>
 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_title_long'];?>
</span>
				<!-- <span id="nome_cliente"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['app_department'];?>
 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['app_title_long'];?>
</span> -->
			</div>
		</div>
		
		<div id="title_right">
			<a id="help" href="javascript:;" onclick="open_viewer.RestartTour()" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_guidedtour'];?>
"><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/help.svg");?>
</a>
		</div>
	</div>

	<div id="ov_map_container">
		<div id="ov_toolbar">
			<div id="ov_show_hide_leftTabs" onclick="open_viewer.toggleLeftTabs()" class="ov-icon-wrap active" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_opencloselegend'];?>
">
				<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/open-pane-filled.svg");?>

			</div>
			<div id="ov_tabs_container">
				<div id="ov_tabs_header">
					<div id="ov_close_panel" class="mobile" onclick="open_viewer.toggleLeftTabs()" >
						<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/open-pane-filled.svg");?>

					</div>
					<ul id="ov_tabs_left">
						<li><a href="#ov_legend_container" id="ov_show_hide_legend"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['word_legend'];?>
</a></li>
					</ul>
				</div>
				

				<div id="ov_legend_container" class="ov_legend_docked">
					<div id="ov_legend_title"><button id="toggle_ov_legend" class="legend_toggle_container legend_open" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_opencloselegend'];?>
"></button><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['word_themes'];?>
</div>
					<div id="ov_legend"></div>
					
					<div id="ov_legend_wmsuserlayers_title">
						<span><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_thirdpartyWMS'];?>
</span>
						<button id="toggle_ov_legend_wmsuserlayers" class="legend_toggle_container legend_open" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_opencloselegend'];?>
"></button>
						<button id="toggle_ov_legend_wmsuserlayers" class="ov_legend_tool_container add_wmsuserlayers" onclick="open_viewer.ev_wmscustom_pageadd_openclose_click()" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_addwmstomap'];?>
">
						<button id="toggle_ov_legend_wmsuserlayers" class="ov_legend_tool_container clear_wmsuserlayers" onclick="open_viewer.ev_wmscustom_remove_all_click()" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_removealluserwms'];?>
">
						</span>
                    </div>
					<div id="ov_legend_wmsuserlayers"></div>
					
					<div id="ov_legend_basemaplayers_title"><button id="toggle_ov_legend_basemaplayers" class="legend_toggle_container legend_open" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_opencloselegend'];?>
"></button><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_basemap'];?>
</div>
					<div id="ov_legend_basemaplayers"></div>
				</div>
				
			</div>
			
			<span class="separator"></span>
			

			<div id="tools">
				
				
				<div id="ov_toolbar_cursor_select" onclick="open_viewer.toggleToolStatus('select')" class="ov-icon-wrap desktop tool-on-off" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_defaultstatus'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/arrow-hand.svg");?>

				</div>
				<div id="ov_toolbar_zoom_selection" onclick="open_viewer.toggleToolStatus('zoom_selection')" class="ov-icon-wrap desktop tool-on-off" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_zoomrectangle'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-selection.svg");?>

				</div>
				<div id="ov_toolbar_measure_line" onclick="open_viewer.measure('measure_line')" class="ov-icon-wrap desktop tool-on-off" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_measuredistance'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/length.svg");?>

				</div>
				<div id="ov_toolbar_measure_area" onclick="open_viewer.measure('measure_area')" class="ov-icon-wrap desktop tool-on-off" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_measurearea'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/misura-area.svg");?>

				</div>
				
				<span class="separator"></span>
				
				<div onclick="open_viewer.initialMapView()" class="ov-icon-wrap" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_initialview'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-to-extents-filled.svg");?>

				</div>
				<div onclick="open_viewer.zoomIn()" class="ov-icon-wrap desktop" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_zoomincenter'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-in.svg");?>

				</div>
				<div onclick="open_viewer.zoomOut()" class="ov-icon-wrap desktop" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_zoomoutcenter'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-out.svg");?>

				</div>
				<div onclick="open_viewer.previousMapView()" class="ov-icon-wrap desktop" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_previousview'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-back.svg");?>

				</div>
				<div onclick="open_viewer.nextMapView()" class="ov-icon-wrap desktop" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_nextview'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/zoom-forward.svg");?>

				</div>
				
				<span class="separator"></span>
				
				<div id="ov_toolbar_eraser" onclick="open_viewer.clearTempLayers(<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["temporary_layers"];?>
)" class="ov-icon-wrap desktop" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['button_clearmap'];?>
">
					<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/erase.svg");?>

				</div>
				
			</div>
			
			<span id="ov_progressbar"></span>
			

			<div id="ov_trova_posizione" onclick="open_viewer.trackingPosition()" class="ov-icon-wrap mobile" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_showyourposonthemap'];?>
">
				<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/center-direction.svg");?>

			</div>
			
		</div>
		

		<div id="ov_map">
			<div id="ov_tooltip" class="ol-popup"></div>
			<div id="ov_draw_wkt"></div>
			<div id="ov_print_dialog"></div>
		</div>
		

		<div id="ov_toolbar_right">
			<div id="ov_show_hide_info" onclick="open_viewer.toggleInfo()" class="ov-icon-wrap active" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_opencloseinfopanel'];?>
">
			<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/open-pane-filled.svg");?>

			</div>
		</div>	
		
		<div id="ov_info_container" class="ov_info_docked">
			<div id="ov_info_container_main">
				<div id="ov_info_tabs">
					<div id="ov_info_tabs_header">
						<div id="ov_close_info_panel" onclick="open_viewer.toggleInfo()" class="ov-icon-wrap mobile">
							<?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/open-pane-filled.svg");?>

						</div>
						<ul id="tabs">
							<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_query_result'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_query_result']!=true){?>  
							<?php }else{ ?>
								<li id="ov_link_query_result"><a href="#ov_page_query_result" class="ov_info_tabs" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_query_content'];?>
"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_query_title'];?>
</a></li>
							<?php }?>
							
							<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_search'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_search']!=true){?>  
							<?php }else{ ?>
								<li id="ov_link_search"><a href="#ov_page_search" class="ov_info_tabs" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_search_content'];?>
"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_search_title'];?>
</a></li>
							<?php }?>
						
							<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_custom'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_custom']!=true){?>
							<?php }else{ ?>
								<li id="ov_link_custom"><a href="#ov_page_custom" class="ov_info_tabs" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_custom_content'];?>
"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_custom_title'];?>
</a></li>
							<?php }?>
							
							<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_app_info'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_app_info']!=true){?>  
							<?php }else{ ?>
								<li id="ov_link_app_info"><a href="#ov_page_app_info" class="ov_info_tabs" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_appinfo_content'];?>
"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['tab_appinfo_title'];?>
</a></li>
							<?php }?>
						</ul>
					</div>
						

					<div id="ov_page_query_result" class="ov_info_tab_content <?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_query_result'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_query_result']!=true){?> hide <?php }?>"></div>
					
					<div id="ov_page_search" class="ov_info_tab_content <?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_search'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_search']!=true){?> hide <?php }?>"></div>
					
					<div id="ov_page_custom" class="ov_info_tab_content <?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_custom'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_custom']!=true){?> hide <?php }?>"></div>
					
					<div id="ov_page_app_info" class="ov_info_tab_content <?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_app_info'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_enable']['ov_link_app_info']!=true){?> hide <?php }?>"></div>
				</div>
			</div>
		</div>
		

		<div id="ov_footer">
			<div id="ov_ready"><?php echo file_get_contents(((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/img/openViewer/toolbar/circled-female-user.svg");?>
<em><span id='ov_ready_message'><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['welcome_msg_statusbar'];?>
</span></em></div>
			<div id="footer_mouse_coordinates">&nbsp;</div>
			<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_number_selected_features'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_number_selected_features']==true){?>  
				<div id="footer_info_selezione">0 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['features_selected_statusbar'];?>
</div>
			<?php }else{ ?>
				<div id="footer_info_selezione">&nbsp;</div>
			<?php }?>
			<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_scale'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_scale']==true){?>  
				<div id="footer_scala" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_insertscale'];?>
">&nbsp;</div>
			<?php }else{ ?>
				<div id="footer_scala_void">&nbsp;</div>
			<?php }?>
			<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_crs'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_crs']==true){?>  
				<div id="footer_mapprojection" title="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']['sentence_renderingprojection'];?>
"><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['map_projection'];?>
</div>
			<?php }else{ ?>
				<div id="footer_mapprojection">&nbsp;</div>
			<?php }?>
			<div id="footer_poweredby"><a href="http://www.ldpgis.it" title="Website LDP Progetti GIS"><img src="/include/img/openViewer/footer/logo_solo_ldp_20x25.png" alt="Website LDP Progetti GIS" /></a></div>
		</div>

	</div>

</div>

<script type="text/javascript">

	// logging environment
	flag_console_messages=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["show_console_messages"]);?>
;
	flag_show_getcap_button=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["show_getcapabilities_button"]);?>
;
	flag_show_getcap_new_tab=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["show_getcapabilities_in_a_new_tab"]);?>
;
	footer_panel_ready = $("#ov_ready_message");
	timeout_id_readymsg=-1;
	timeout_duration_readymsg = 5000;

	// initial definition of the map
	var map_definition=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["map_definition"]);?>
;
	var map_options=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["map_options"]);?>
;
	
	// settings for the help
	var ov_info_help_init_params=<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["ov_info_help_init_params"]);?>
;
	
	// Pagina di default per il vistasu
	var ov_vistasu_page="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/php/vistasu/vistasu_connector.ldpviewer.php";

	// Default page for the print dialog
	// var ov_stampa_page="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/php/stampa/stampa.ldpviewer.php";
	var ov_stampa_page="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/print/print.openviewer.php";

	// Configuration of the Proxy
	var proxy_set = false;
	if( typeof map_options.proxy !== 'undefined')
		proxy_set = map_options.proxy;
	var OpenViewer_proxy="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/openViewer/openViewerProxy.php";
	
	// Configuration of external WMS
	var external_wms = false;
	if( typeof map_options.externalWms !== 'undefined'){
		var external_wms = map_options.externalWms;
        var permitted_autentication =  map_options.permitted_autentication;
	}

	// Default page for the "QueryResult" tab
	//var ov_info_page = "<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value['ov_page_query_result_default']);?>
";
	<?php ob_start();?><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_query_result'];?>
<?php $_tmp1=ob_get_clean();?><?php if ($_tmp1){?>
		//ov_info_page = '<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_query_result']);?>
'; 
	<?php }?>
	
	var ov_help_page="help.php";
	
	// URL of the interanl WMS server 
	var ov_internal_wms_url = '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['geoserver']['url_workspace'];?>
';
	
	// Configuration of the information page for external WMS (getFeatureInfo)
	<?php ob_start();?><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["WMSGetFeatureInfoCustomPage"];?>
<?php $_tmp2=ob_get_clean();?><?php if ($_tmp2){?>
		ov_WMSGetFeatureInfoCustomPage = '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["WMSGetFeatureInfoCustomPage"];?>
';
	<?php }?>
	
	// Configuration of the additional parameters for the map legislation
	var string_info_help_init_params="";
	if(ov_info_help_init_params!=null) {
		string_info_help_init_params="?viewer=myOV&normativa="+ov_info_help_init_params.normativa+"&mappa="+ov_info_help_init_params.mappa;
		ov_info_page="help.php";
		ov_help_page=null;
	} 
	
	// Configuration of the tab active when the app starts
	<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab'])&&($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab']=='page_query_result'||$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab']=='page_search'||$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab']=='page_custom'||$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab']=='page_app_info')){?>   
		var ov_active_tab = '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_active_tab'];?>
';
	<?php }else{ ?>
		var ov_active_tab = 'page_app_info';
	<?php }?>
	
	// Configuration of the basemap layers
	<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers"])){?>
	
if(flag_console_messages) console.log('Configuration of the base layers...');
		var mapBasemapListLayers = <?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers"]);?>
;
		if(mapBasemapListLayers == ''){
			$("#ov_legend_basemaplayers_title").hide();
		}
		var mapBasemapLayersDefinition = new Array();
		<?php $_smarty_tpl->tpl_vars['i'] = new Smarty_Variable;$_smarty_tpl->tpl_vars['i']->step = 1;$_smarty_tpl->tpl_vars['i']->total = (int)ceil(($_smarty_tpl->tpl_vars['i']->step > 0 ? count($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers"])+1 - (1) : 1-(count($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers"]))+1)/abs($_smarty_tpl->tpl_vars['i']->step));
if ($_smarty_tpl->tpl_vars['i']->total > 0){
for ($_smarty_tpl->tpl_vars['i']->value = 1, $_smarty_tpl->tpl_vars['i']->iteration = 1;$_smarty_tpl->tpl_vars['i']->iteration <= $_smarty_tpl->tpl_vars['i']->total;$_smarty_tpl->tpl_vars['i']->value += $_smarty_tpl->tpl_vars['i']->step, $_smarty_tpl->tpl_vars['i']->iteration++){
$_smarty_tpl->tpl_vars['i']->first = $_smarty_tpl->tpl_vars['i']->iteration == 1;$_smarty_tpl->tpl_vars['i']->last = $_smarty_tpl->tpl_vars['i']->iteration == $_smarty_tpl->tpl_vars['i']->total;?>
			<?php $_smarty_tpl->tpl_vars['ln'] = new Smarty_variable($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers"][$_smarty_tpl->tpl_vars['i']->value-1], null, 0);?>;
			var aLayer = new Array();
			var aLayer =	{
							key: '<?php echo $_smarty_tpl->tpl_vars['ln']->value;?>
',
							sourceType: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['source_type'];?>
',
							wms_url: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['wms_url'];?>
',
							wms_layers_names: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['wms_layers_names'];?>
',
							wms_server_type: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['wms_server_type'];?>
',
							wms_layer_projection: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['wms_layer_projection'];?>
',
							max_zoom: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['max_zoom'];?>
',
							layer_title: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['layer_title'];?>
',
							layer_description: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['layer_description'];?>
',
							layer_copyright: '<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['layer_copyright'];?>
',
							layer_visible: '<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['layer_visible']);?>
',
							is_basemap_layer: '<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value["package"]]["basemap_layers_definition"][$_smarty_tpl->tpl_vars['ln']->value]['is_basemap_layer']);?>
'
							};
			mapBasemapLayersDefinition.push(aLayer);
		<?php }} ?>

	<?php }else{ ?>
		var mapBasemapListLayers = null;
		var mapBasemapLayersDefinition = new Array();
	<?php }?>
	
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
					<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_number_selected_features'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_number_selected_features']==true){?>  
						infoSelezione:	'footer_info_selezione',
					<?php }else{ ?>
						infoSelezione:	'',
					<?php }?>
					<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_scale'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['map_options']['show_view_scale']==true){?>  
						scala:			'footer_scala',
						scalaInputId:	'input_scala'
					<?php }else{ ?>
						scala:			'',
						scalaInputId:	''
					<?php }?>
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
		
		
		
		<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['plugins']['wmslayers'])){?>  
			open_viewer.setPluginWmsLayers(true);
if(flag_console_messages) console.log("Plugin WMS Layers installed"); 
		<?php }?>
		
if(flag_console_messages) console.log("Start loading the map..."); 
		open_viewer.loadMap();
		
if(flag_console_messages) console.log("Start adding events handling...");
		open_viewer.addEvents();
		
		open_viewer.toggleToolStatus('select');
		
		// Configuration of the "right tabs"
		// OVD MODIFICA TEMPORANEA DEL TOOL (DA VERIFICARE SE/QUANDO VENGONO RIPRISTINATE LE FUNZIONALITA'
		//open_viewer.loadInfoPage('tabQueryResult',ov_info_page+string_info_help_init_params);
		//open_viewer.loadInfoPage('tabSearch','<?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_search']);?>
'+string_info_help_init_params);
		
		open_viewer.loadInfoPage('tabQueryResult','<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_query_result'];?>
'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabSearch','<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_search'];?>
'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabCustom','<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_custom'];?>
'+string_info_help_init_params);
		open_viewer.loadInfoPage('tabAppInfo','<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_page']['ov_page_app_info'];?>
'+string_info_help_init_params);
		
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
				
		$("#ov_legend_container").show();
		
		// Load the "libViewer" JavaScript library (it must be loaded after "open_viewer" object initialization, otherwise it does not work)
		$.getScript('<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/libviewer.js');
		
		// initialization of the "right tabs panel"
		<?php if (isset($_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_active_at_start'])&&$_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_right_tabs_active_at_start']==false){?>   
			open_viewer.initPanels(false);
		<?php }else{ ?>
			open_viewer.initPanels(true);
		<?php }?>
		
		// map window resize
		open_viewer.ev_window_resize();
		
	});

</script>
<?php }} ?>