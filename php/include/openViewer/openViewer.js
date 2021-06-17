
/**
 * JAVASCRIPT CLASSES TO HANDLE THE VIEWER
 * 
 * Classes:
 * - openViewer: class to handle the main viewer functionalities
 * - ovLegendTreeItem: class to handle the single items of the legend tree of layers
 *
 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
 * @version: 1.0
 * @license: GNU General Public License v2.0
 */


/** MAIN CLASS: openViewer 
 * ---------------------------------------------------------------
 */
var openViewer = function(params) {
	
	// show console messages
	this.showConsoleMsg = params.flagConsMsg;
	
ov_utils.ovLog(params,'openViewer parameters'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	this.name = params.name;
	
	// ----------------------------------------------------------------------
	// SERVICE SETTINGS
	// ----------------------------------------------------------------------
	this.timeout_SaveHistory_Zoom = 300;
	this.timeout_SaveHistory_Pan = 1000;
	this.timeout_RefreshFeaturesAttributesInfo = 500;
	timeout_duration_readymsg = 5000; // defined "globally" in the TPL file
	
	this.correctionOffsetScaleMax = 0.00000001; // correction offset used to solve potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
	this.correctionOffsetScaleMin = 0;          // correction offset used to solve potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
	
	// interface
	this.leftPanelMinWidth = 270;
	this.rightPanelMinWidth = 300;
	
	// tools
	this.touchBuffer=15;	// number of pixel used as buffer for the touch events
	
	// ----------------------------------------------------------------------
	// SERVICE VARIABLES defined outside (in the CONFIG FILES)
	// ----------------------------------------------------------------------
	
	// main layers
	this.stato = params.stato;	// "stato" inherits the "map_definition" object defined in the PHP configuration
								// and contains the definition of the "main layers" (all layers but the basemap layers and the user WMS layers)
	
	// functionalities
	this.showGetCapButton = params.flagShowGetCapButton  // display the "GetCapabilities" in the window to add WMS on-the-fly layers
	this.showGetCapNewTab = params.flagShowGetCapNewTab; // set "where" to show the result of the GetCapabilities of a WMS service
	
	this.enableFeatAttrWithoutCtrl = params.mapOptions['show_feature_attribute_without_ctrl']; 	// enable the visualization of the feature attributes "without" pressing CTRL
	
	this.ProxySet = params.proxy; // vararible to handle the proxy (can be empty)
	this.internalWmsURL = params.components.wms.wmsInternalUrl; // internal WMS url
	
	// main interface components
	this.container					= $("#" + params.components.container.div);
	
	this.titleDiv					= $("#" + params.components.title.div);
	this.titleToggleInfo			= $("#" + params.components.title.toggleInfo);
	
	this.footerPanel 				= $("#" + params.components.footer.panel);
	this.footerPanelReady			= $("#" + params.components.footer.readyMsg);
	this.footerPanelInfoSelezione	= $("#" + params.components.footer.infoSelezione);
	this.footerPanelScala			= $("#" + params.components.footer.scala);
	this.footerPanelScalaInputId	= params.components.footer.scalaInputId;
	
	this.vistasuPanel				= $("#" + params.components.vistasu.panel);
	this.vistasuPanelContainer		= $("#" + params.components.vistasu.container);
	this.vistasuPanelBase			= $("#" + params.components.vistasu.base);
	
	// objects relatd to the MAIN LEGEND (Themes, User WMS layes, Basemap layers)
	this.legendPanel				= $("#" + params.components.legend.panel);
	this.legendToggleButton			= $("." + params.components.legend.buttonOpenClose);
	this.legendToolButton			= $("." + params.components.legend.buttonTool);
	this.legendPanelContainer		= $("#" + params.components.legend.container);
    this.legendPanelWmsUserLayers	= $("#" + params.components.legend.wmsUserLayers);
	this.legendPanelBasemapLayers	= $("#" + params.components.legend.basemaplayers);
	
	// objects related to the USER WMS LAYERS (added on the fly by the user)
	this.editWMSMainContainer		= $("#" + params.components.legend_wmsUser.mainContainer);
	this.editWMSBackground			= $("#" + params.components.legend_wmsUser.background);
	this.editWMSContainer			= $("#" + params.components.legend_wmsUser.container);
	this.editWMSselectorContainer	= $("#" + params.components.legend_wmsUser.wmsContainer);
	this.editLegendPanel			= $("#" + params.components.legend_wmsUser.panel);
	this.editOverlayMessages		= $("#" + params.components.legend_wmsUser.messages);
	this.buttonCloseWMSContainer	= $("#" + params.components.legend_wmsUser.button);
	this.inputWMSUrl				= $("#" + params.components.legend_wmsUser.inputUrl);
	
	// objects related to the WMS layers served by the Internal GeoServer (or by MetaRepo)
	this.legendPanelWMS				= $("#" + params.components.legend_wmsInternal.panel);
	this.legendPanelWMSContainer	= $("#" + params.components.legend_wmsInternal.container);
	
	// object related to the interface panels
	this.infoPanelContainer			= $("#" + params.components.info.container);
	this.infoPanelContainerMain		= $("#" + params.components.info.containerMain);
	this.infoPanelTabs				= $("#" + params.components.info.infoTabs);
	this.infoPanelTabsHeader		= $("#" + params.components.info.infoTabsHeader);
	this.infoPanelActiveTab			= params.components.info.activeTab;
	this.infoPanelQuery				= $("#" + params.components.info.tabQueryResult);
	this.infoPanelSearch			= $("#" + params.components.info.tabSearch);
	this.infoPanelCustom			= $("#" + params.components.info.tabCustom);
	this.infoPanelAppInfo			= $("#" + params.components.info.tabAppInfo);
	this.infoPanelHelp				= $("#" + params.components.info.help);
	this.infoPanelMenu				= $("#" + params.components.info.menu);
	this.infoPanelwmsGETFeature		= $("#" + params.components.info.wmsGETFeature);
	this.infoPanelClassTabs			= $("." + params.components.info.classTabs);
	
	this.toolbarPanel				= $("#" + params.components.toolbar.panel);
	this.toolbarPanelRight			= $("#" + params.components.toolbar.panelRight);
	this.toolbarPanelContainer		= $("#" + params.components.toolbar.container);
	this.toolbarPanelWMSlayer		= $("#" + params.components.toolbar.addWms);
	this.toolbarPanelToggleContainer= $("#" + params.components.toolbar.toggleContainer);
	this.toolbarPanelToggleVistasu	= $("#" + params.components.toolbar.toggleVistasu);
	this.toolbarPanelToggleLegend	= $("#" + params.components.toolbar.toggleLegend);
	this.toolbarPanelZoomSelection	= $("#" + params.components.toolbar.zoomSelection);
	this.toolbarPanelMeasureLine	= $("#" + params.components.toolbar.measureLine);
	this.toolbarPanelMeasureArea	= $("#" + params.components.toolbar.measureArea);
	this.toolbarPanelMeasure		= $("#" + params.components.toolbar.measure);
	this.toolbarPanelCursorMove		= $("#" + params.components.toolbar.cursorMove);
	this.toolbarPanelCursorSelect	= $("#" + params.components.toolbar.cursorSelect);
	
	// object used to print the map
	this.printMapDiv				= $("#" + params.components.print_map.div);
	
	// other objects
	this.tooltipDiv					= $("#" + params.components.tooltip.div);
	this.mapDiv 					= $("#" + params.components.map.div);
	this.mapBaseLayersList			= params.components.map.basemapLayersList;
	this.mapBaseLayersDefinition	= params.components.map.basemapLayersDefinition;
	this.drawWKTDiv					= $("#" + params.components.draw_wkt.div);
	
	// ----------------------------------------------------------------------
	// GENERAL SERVICE VARIABLES
	// ----------------------------------------------------------------------
	
	this.pluginWmsLayersAvailable = false;	// to handle the plugin WMS on-the-fly layers
	
	this.timeoutId=-1;						// to handle the timeouts
	this.timeoutIdChangeView=-1;			// to handle the timeouts
	this.timeoutReadyMsg='';				// to handle the timeouts
	
	this.legendTree = undefined;			// object with the structure of the layers legend
	
	this.lockWheel=false;
	this.startPixel=undefined;
	
	this.tour=null;							// to handle the HELP (created with Bootstrap Tour)
	
	this.htmlFeaturesInfo='';				// used to display the features info
	
	// ----------------------------------------------------------------------
	// CREATION OF THE OPENLAYERS MAP OBJECT
	// ----------------------------------------------------------------------
	
	// parameters setting
	var mapParams = {  
		'stato':				params.stato,
		'mapOptions':			params.mapOptions, 
		'mapDiv':				this.mapDiv[0],
		'tooltipDiv':			this.tooltipDiv,
		'drawWKTDiv':			this.drawWKTDiv,
		'ProxySet' :			this.ProxySet,
		'baseLayers':			this.mapBaseLayersList,
		'baseLayersDefinition':	this.mapBaseLayersDefinition,
		'showConsoleMsg':		this.showConsoleMsg
	};

    // creation of the map    
	this.map = new ovMap( mapParams );

	// ----------------------------------------------------------------------
	// EVENTS HANDLING "INTERFACE" - Events related to the general interface
	// ----------------------------------------------------------------------
	
	// event: resize of the window
	$(window).on("resize","",$.proxy(this.ev_window_resize,this));
	
	// event: back and forward of the info pages
	$(window).on("popstate","",$.proxy(this.ev_pop_state,this));
	
	// event: manual change of the scale (clicking on the text box of the scale)
	this.footerPanelScala.on("click",'',$.proxy(this.ev_footer_scala_click,this));
	
	// event: open/close the legend sub-sections (basemap layers, wms layers, themes, ...)
	this.legendPanelContainer.on("click", ".legend_toggle_container", $.proxy(this.ev_legend_buttonopenclose_click,this)); //ov_legend_title
	
	// event: close the panel to search and add User WMS layers
	this.buttonCloseWMSContainer.on("click", $.proxy(this.ev_wmscustom_pageadd_openclose_click,this));
	
	// event: load a new page inside the div of the information (instead of opening in a new window)
	this.infoPanelQuery.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelSearch.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelCustom.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelAppInfo.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelHelp.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelwmsGETFeature.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	
	// event: handling of the form "submit" inside a page
	this.infoPanelQuery.on("submit","form",$.proxy(this.ev_info_page_submit_form,this));
	
	// event: SimpleModal
	$(document).on("click","#simplemodal-container a",$.proxy(this.ev_simplemodal_href_click,this));
	
	// -----------------------------------------------------------------------------------------------
	// EVENTS HANDLING "LAYERS/GROUPS" - Events related to show/hide/expand/collapse layers or groups
	// -----------------------------------------------------------------------------------------------
	    
	// Events related to the legend panel of "MAIN LAYERS" (MapGuide, WMS GEOSERVER)
	// -----------------------------------------------------------------------------
	// event: show/hide "main layers" (clicking on the checkboxes)
	this.legendPanel.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this)); // main layers (MapGuide, default WMS)
	// event: show/hide groups of "main layers" (clicking on the checkboxes)
	this.legendPanel.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this)); // main layers (MapGuide, default WMS)
	
	// event: expand a group of "internal WMS" layers
	this.legendPanel.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));   // main layers (MapGuide, default WMS)
	// event: expand a group of "internal WMS" layers (similar to the previous event)
	this.legendPanel.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));   // main layers (MapGuide, default WMS)
    
	// event: collapse a group of "internal WMS" layers
	this.legendPanel.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this)); // main layers (MapGuide, default WMS)
	// event: collapse a group of "internal WMS" layers (similar to the previous event)
	this.legendPanel.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this)); // main layers (MapGuide, default WMS)
	
	// Events related to the legend panel of "WMS ON-THE_FLY LAYERS"
	// -----------------------------------------------------------------------------
	// event: show/hide groups of "WMS on-the-fly layers" (clicking on the checkboxes)
	this.legendPanelWmsUserLayers.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this)); // WMS on-the-fly layers
	
	// event: expand a group of "internal WMS" layers
	this.legendPanelWmsUserLayers.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));   // WMS on-the-fly layers
	// event: expand a group of "internal WMS" layers (similar to the previous event)
	this.legendPanelWmsUserLayers.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));   // WMS on-the-fly layers
    
	// event: collapse a group of "internal WMS" layers
	this.legendPanelWmsUserLayers.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this)); // WMS on-the-fly layers
	// event: collapse a group of "internal WMS" layers (similar to the previous event)
	this.legendPanelWmsUserLayers.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this)); // WMS on-the-fly layers
	
	// Events related to the legend panel of "INTERNAL WMS LAYERS"
	// -----------------------------------------------------------
	// event: show/hide "internal WMS" layers (clicking on the checkboxes)
	this.legendPanelWMS.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this)); // internal WMS layer
	// event: show/hide "internal WMS" groups of layers (clicking on the checkboxes)
	this.legendPanelWMS.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this)); // internal WMS layer
	
	// event: expand a group of "internal WMS" layers
	this.legendPanelWMS.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));   // internal WMS layer
	// event: expand a group of "internal WMS" layers (similar to the previous event)
	this.legendPanelWMS.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));   // internal WMS layer
    
	// event: collapse a group of "internal WMS" layers
	this.legendPanelWMS.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this)); // internal WMS layer
	// event: collapse a group of "internal WMS" layers (similar to the previous event)
	this.legendPanelWMS.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this)); // internal WMS layer
	
	// Events related to the legend panel of "BASEMAPS"
	// ------------------------------------------------
	// event: show a basemap layer (and automatically hide all the others, only one basemap can be shown)
	this.legendPanelBasemapLayers.on("click",".legend_basemap_item",$.proxy(this.ev_legend_basemap_click,this)); // basemap layers
	
	///TODO add here the additional events
	
};


/** PLUGINS SETTINGS
 * ---------------------------------------------------------------
 */

/** Configure the use of the plugin to import WMS layers */
openViewer.prototype.setPluginWmsLayers= function(flag) {
	this.pluginWmsLayersAvailable = flag;
	ov_wms_plugin.init(this.map, this.stato, this.correctionOffsetScaleMin, this.correctionOffsetScaleMax);
};


/** PROPERTIES GENERAL (get/set/is)
 * ---------------------------------------------------------------
 */

/** Return the current scale */
openViewer.prototype.getMapScale = function(flagMetricScale) {
	if(typeof flagMetricScale === 'undefined') flagMetricScale = true;
	return this.map.getScale(flagMetricScale);
};
/** Set the current scale */
openViewer.prototype.setMapScale = function(scale) {
	this.map.setScale(scale);
	// refresh the footer scale box
	this.footerPanelScala.html("1:"+Math.round(scale));
};
/** Return the current zoom level */
openViewer.prototype.getMapZoom = function() {
	return this.map.getZoom();
};
/** Return the coordinates of the current center of the map view (in the map projection) */
openViewer.prototype.getMapCenter = function() {
	return this.map.getCenter();
};
/** // Set the center of the current view, passing coordinates based on data projection */
openViewer.prototype.setMapCenter = function(center) {
	this.map.setCenterProjected(center.X, center.Y, this.map.dataProjection);
};
/** // Return the coordinates of the current center of the map view (in the data projection) */
openViewer.prototype.getMapCenterDataProjection = function() {
	return this.map.getCenterProjected(this.map.dataProjection);
};
/** // Return the width (in map units) of the current extents */
openViewer.prototype.getMapWidth = function() {
	return this.map.getWidth();
};
/** Return the height (in map units) of the current extents */
openViewer.prototype.getMapHeight = function() {
	return this.map.getHeight();
};
/** Return the scale to fit a rectangle, defined with coordinates in data projection, in the map area, taking into account an optional margin */
openViewer.prototype.getScaleToFit = function(xmin, xmax, ymin, ymax, marginFactor) {
	if (isNaN(parseFloat(xmin)) || isNaN(parseFloat(xmax)) || isNaN(parseFloat(ymin)) || isNaN(parseFloat(ymax)))
		return NaN;

	// transform the input coordinates, if they don't match the map projection
	if (this.map.dataProjection != this.map.mapProjection) {
		
		var map_min_coord = ol.proj.transform([parseFloat(xmin) , parseFloat(ymin)], this.map.dataProjection,this.map.mapProjection);
		var map_max_coord = ol.proj.transform([parseFloat(xmax) , parseFloat(ymax)], this.map.dataProjection,this.map.mapProjection);
		
		xmin=map_min_coord[0];
		ymin=map_min_coord[1];
		xmax=map_max_coord[0];
		ymax=map_max_coord[1];
	}
	
	marginFactor = (typeof marginFactor !== 'undefined' && !isNaN(parseFloat(marginFactor)) && marginFactor > 1) ? marginFactor : 1;
	var retScale = NaN;

	var width = this.getMapWidth();
	var height = this.getMapHeight();
	var scala = this.getMapScale();
	var scala_orizz=(xmax-xmin)*marginFactor/width*scala;
	var scala_vert=(ymax-ymin)*marginFactor/height*scala;
	retScale = Math.max(scala_orizz,scala_vert);

	return retScale;
};


/** PROPERTIES - MAIN LAYERS (WMS, WMS_GEOSERVER, ...) (get/set/is)
 * ---------------------------------------------------------------
 * These procedures are required to handle the "main layers" defined in the
 * variable "stato" (map_definition in the PHP configuration file)
 */

/** Retrieve the "name" of a "main layer" by a sub-group name (from the variable "stato" with the list of "main layers") */
openViewer.prototype.getMainLayerNameBySubGroupName = function(group_name) {
	var stato = this.getStato();
    
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, WMS)
	for (var i=0;i<a_ol_layers.length;i++) {
		groups=stato[a_ol_layers[i]].groups_info;
		var a_groups_info=Object.keys(groups);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_groups_info.length;j++) {
// ov_utils.ovLog(a_groups_info[j]+' vs '+group_name,'Layer name'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
			if(a_groups_info[j]==group_name) {
				// found
				return a_ol_layers[i];
			}
		}
	}
	
	// if it is not found
	return false;
}
/** Retrieve the "name" of a "main layer" by a sub-layer name (from the variable "stato" with the list of "main layers") */
openViewer.prototype.getMainLayerNameBySubLayerName = function(layer_name) {
	var stato = this.getStato();
	
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, WMS)
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {
			if(a_layers_info[j]==layer_name) {
				// found
				return a_ol_layers[i];
			}
		}
	}
	
	// if it is not found
	return false;
}
/** Retrieve the "name" of a "main layer" containing a sub-layer with a specific feature name (from the variable "stato" with the list of "main layers") */
openViewer.prototype.getMainLayerNameByFeature = function(feature_name) {
	var stato = this.getStato();
    
	var a_ol_layers=Object.keys(stato);
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers); // list of layers defined inside the "macro layer"
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].feature_name==feature_name) {
				// found
				return a_ol_layers[i];
			}
		}
	}
	
	// if it is not found
	return false;
}
/** Retrieve the "stato" of a "sub-group" (contained inside a macro "main layer") containing a layer with a specific feature name (from the variable "stato" with the list of "main layers") */
openViewer.prototype.getSubGroupStatoByFeature = function(feature_name) {
	var stato = this.getStato();
	
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, WMS)
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].feature_name==feature_name) {    
				// found
				var group_name = layers[a_layers_info[j]].group;
				return stato[a_ol_layers[i]].groups_info[group_name];
			}
		}
	}
	
	// if it is not found
	return false;
}
/** Retrieve the "stato" of a "sub-layer" (contained inside a macro "main layer") by its feature name (from the variable "stato" with the list of "main layers") */
openViewer.prototype.getSubLayerStatoByFeature = function(feature_name) {
	var stato = this.getStato();
	
	var a_ol_layers=Object.keys(stato);
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers); // list of layers defined inside the "macro layer"
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].feature_name==feature_name) {
				// found
				return layers[a_layers_info[j]]; // the sub-section /of the "stato" variable) related to the inforamtion of the specific sub-layer
			}
		}
	}
	
	// if it is not found
	return false;
}

/** INITIALIZATION OF THE APP
 * ---------------------------------------------------------------
 * - initialization of the panels
 * - load the initial map
 */

/** Initialization of the panels */
openViewer.prototype.initPanels = function(flagRightPanelActive) {
// ov_utils.ovLog('Initialization panels...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	if (typeof flagRightPanelActive == 'undefined') flagRightPanelActive = true;
	
	// LeftToolbar panel
	this.toolbarPanelContainer.resizable({
		handles: 'e',
		minWidth: this.leftPanelMinWidth, // 270,
		containment: this.container
	});
		
	// Right tabs panel
	this.infoPanelContainer.resizable({
		handles: 'w',
		minWidth: this.rightPanelMinWidth, // 300,
		containment: this.container
	});
	
	$(".ui-resizable").on('resize', function (e) {
		e.stopPropagation(); 
	});
	
	this.infoPanelTabs.tabs();
	this.toolbarPanel.tabs();
    
    if(!flagRightPanelActive) this.infoPanelContainer.hide();
}
/** Loading the initial map */
openViewer.prototype.loadMap = function() {
// ov_utils.ovLog('Loading map...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	this.map.LoadMap();
	// write the initial scale
	this.setMapScale(this.getMapScale());
	this.refreshLegend();
};
/** Initialization of the handled events "on the map" (these must by initialized after the "map" initialization */
openViewer.prototype.addEvents = function() {
// ov_utils.ovLog('Set the map events handled by the application...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	this.map.getMapView().on('propertychange', $.proxy(this.ev_map_cambio_view,this));
	
	// select and/or CTRL+click
	this.map.map.on('singleclick', $.proxy(this.ev_map_select,this));
	
	// tap or holded or held click
	this.map.map.getViewport().addEventListener('mousedown',$.proxy(this.ev_map_mouse_down,this));
	this.map.map.getViewport().addEventListener('mouseup', $.proxy(this.ev_map_mouse_up,this));
	this.map.map.getViewport().addEventListener('mousemove', $.proxy(this.ev_map_mouse_move,this));
	
	this.map.map.getViewport().addEventListener('touchstart',$.proxy(this.ev_map_mouse_down,this));
	this.map.map.getViewport().addEventListener('touchend', $.proxy(this.ev_map_mouse_up,this));
	this.map.map.getViewport().addEventListener('touchmove', $.proxy(this.ev_map_mouse_move,this));
	
	// avoid the contextual menu of the map
	this.map.map.getViewport().addEventListener('contextmenu', function(evt) { 
		evt.preventDefault();
	}, false);
};


/** EVENTS - HANDLING THE GENERAL FUNCTIONALITIES OF THE APP INTERFACE
 * ---------------------------------------------------------------
 * - window resize handling
 * - switch/open/close tabs and panels
 * - manual change of the view scale
 */

/** Window resize */
openViewer.prototype.ev_window_resize = function() {
	var this_viewer = this;
	
	var title_height=this.titleDiv.height();
	var footer_height=this.footerPanel.height();

	//var height = $(window).height() - 80;
	var height = $(window).height() - title_height - footer_height - 3;
	var width = $(window).width();
	this.mapDiv.height(height);
	this.mapDiv.width(width);
	
	var info_width=Math.max(this.infoPanelContainer.width(),300); // To keep the width of the right info panel

	setTimeout(function() {this_viewer.map.map.updateSize();}, 200); // setTimeout(function() {this_viewer.map.updateMapSize();}, 200);
	
	this.infoPanelContainer.css('height',(height-10)+'px');
	this.infoPanelContainerMain.css('height',(height-10)+'px');
	this.infoPanelTabs.css('height',(height-10)+'px');
	
	this.toolbarPanel.css( 'height', (height-10)+'px' );
	this.toolbarPanelRight.css( 'height', (height-10)+'px' );
	if(width <= 768){
		this.toolbarPanelContainer.css('width',(width-50)+'px');
		this.infoPanelContainer.css('width',(width-50)+'px');
		//Forzo la chiamata per bugfix IE
		this.infoPanelContainer.css('left',"50px");
		this.infoPanelContainer.css('right','0px');
	} else {
		this.toolbarPanelContainer.css('width', '280px');
		this.infoPanelContainer.css('width',info_width+'px');
	
		if(width <= 1024) {
			// Force the call because of bugfix IE
			this.infoPanelContainer.css('left',(width-info_width)+"px");
			this.infoPanelContainer.css('right','0px');
		} else {
			// Force tha call because of bugfix IE
			this.infoPanelContainer.css('left',(width-(info_width+42))+"px");
			this.infoPanelContainer.css('right','42px');
		}
		
	}
	
	this.toolbarPanelContainer.css('height', (height-10)+'px');
 	this.vistasuPanelContainer.css( 'height', (height-66)+'px' );
 	this.legendPanelContainer.css( 'height', (height-66)+'px' );
 	this.editWMSMainContainer.css( 'height', (height-66)+'px' );
	
	this.vistasuPanelContainer.css( 'overflow', 'auto' );
	this.legendPanelContainer.css( 'overflow', 'auto' );
	this.editWMSMainContainer.css( 'overflow', 'auto' );
	
	var height_info_tabs_header=this.infoPanelTabsHeader.height();
	
	this.infoPanelQuery.css( 'height', (height-15-height_info_tabs_header)+'px' );
	this.infoPanelSearch.css( 'height', (height-15-height_info_tabs_header)+'px' );
	this.infoPanelCustom.css( 'height', (height-15-height_info_tabs_header)+'px' );
	this.infoPanelAppInfo.css( 'height', (height-15-height_info_tabs_header)+'px' );
	
	this.infoPanelQuery.css( 'overflow', 'auto' );
	this.infoPanelSearch.css( 'overflow', 'auto' );
	this.infoPanelCustom.css( 'overflow', 'auto' );
	this.infoPanelAppInfo.css( 'overflow', 'auto' );
	
	this.infoPanelContainer.find( '.ui-resizable-w' ).css( 'height', (height)+'px' );
	this.toolbarPanelContainer.find( '.ui-resizable-e' ).css( 'height', (height)+'px' );
	//this.infoPanelContainer.css( 'height', (height)+'px' ).css( 'right', '0px' ).css( 'left', '' );
	
};
/** Handle the change of scale (resolution) and center */
openViewer.prototype.ev_map_cambio_view = function(event) {
// ov_utils.ovLog('ViewChange event '+event.key); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	switch (event.key) {
		case 'resolution':
			clearTimeout(this.timeoutIdChangeView);
			this.timeoutIdChangeView = setTimeout($.proxy(function() {

				var scala=this.map.getScale();
				this.refreshLegend();
				this.footerPanelScala.html("1:"+Math.round(scala));

				this.map.saveViewHistory();
			
			},this), this.timeout_SaveHistory_Zoom, false);
				
			
		break;
		case 'center':
			clearTimeout(this.timeoutIdChangeView);
			this.timeoutIdChangeView = setTimeout($.proxy(function() {

				var scala=this.map.getScale();
				this.refreshLegend();
				this.footerPanelScala.html("1:"+Math.round(scala));

				this.map.saveViewHistory();
			
			},this), this.timeout_SaveHistory_Pan, false);
				
			
		break;
	}
};
/** Visualization of the tabs */
openViewer.prototype.ev_pop_state = function(event) {
	var e = event.originalEvent;
	if (e.state!=null) {
		this.loadInfoPage(e.state.tabName,e.state.url,e.state.spinner,e.state.data,false);
	}
};
/** Open/Close the legend of the map layers */
openViewer.prototype.toggleLegend = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	// the legend panel is alternative to the VistaSu panel, then if the legend is visible, the VistaSu must be hidden
	if (!this.toolbarPanelToggleLegend.hasClass("active")) {
		if(this.toolbarPanelToggleVistasu.hasClass("active")) {
			this.toolbarPanelToggleVistasu.removeClass("active");
			this.vistasuPanelContainer.hide();
		}
		
		// on small device it is necessary to close the info panel too
		if (this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
			open_viewer.toggleInfo(0);
		}
	}
	
	this.toolbarPanelToggleLegend.toggleClass("active");
	this.legendPanelContainer.animate({width:'toggle'} ,transition_time);
}
/** OVD CURRENLT UNUSED - Open/Close the VistaSu panel */
openViewer.prototype.toggleVistaSu = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	// the VistaSu panel is alternative to the legend panel, then if the VistaSu is visible, the legend must be hidden
	if (!this.toolbarPanelToggleVistasu.hasClass("active")) {
		if (this.toolbarPanelToggleLegend.hasClass("active")) {
			this.toolbarPanelToggleLegend.removeClass("active");
			this.legendPanelContainer.hide();
		}
		
		// on small device it is necessary to close the info panel too
		if (this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
			open_viewer.toggleInfo(0);
		}
	}
	
	this.toolbarPanelToggleVistasu.toggleClass("active");
	this.vistasuPanelContainer.animate({width:'toggle'} ,transition_time);
}
/** Open/Close the left panel (legend and VistaSu) */
openViewer.prototype.toggleLeftTabs = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	// on small device it is necessary to close the info panel too
	if ($(document).width() <= 1024) {
		this.titleToggleInfo.removeClass("active");
		this.infoPanelContainer.hide();
	}
	
	this.toolbarPanelToggleContainer.toggleClass("active");
	this.toolbarPanelContainer.animate({width:'toggle'} ,transition_time);
}
/** Open/Close the right info panel */
openViewer.prototype.toggleInfo = function(transition_time) {
	var that=this;
	
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	// on small device it is necessary to close the legend and VistaSu panels too
	if (!this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
		this.toolbarPanelContainer.hide();
	}
	
	var width = $(window).width();
	
	this.titleToggleInfo.toggleClass("active");
	
	// force the call to fix_css_left_info_panel because of bugfix IE
	var panel_width=this.infoPanelContainer.width();
	this.infoPanelContainer.animate({width:'toggle'}, transition_time,"swing",function(){that.fix_css_left_info_panel(panel_width);}).css('left','');
}
/** Specific routine to fix a IE bug */
openViewer.prototype.fix_css_left_info_panel = function(panel_width) {
	var width = $(window).width();
	
	if(width <= 1024){
		this.infoPanelContainer.css('width',panel_width+'px');
		this.infoPanelContainer.css('left',(width-panel_width)+"px");
	}
	else{
		this.infoPanelContainer.css('width',panel_width+'px');
		//Forzo la chiamata a ev_window_resize per bugfix IE
		this.infoPanelContainer.css('left',(width-panel_width-42)+"px");
// 		this.infoPanelContainer.css('right','42px');

	}
}
/** Toggle the tabs in the right info panel */
openViewer.prototype.ev_info_page_href_click = function(event) {
	var element = event.currentTarget;
    // if the link points to a php page, we load it into the div, otherwise no
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('tabQueryResult',element.href);
	} else {
		// nothing to do
	}
};
/** Close a modal window */
openViewer.prototype.ev_simplemodal_href_click = function(event) {
	var element = event.currentTarget;
    // if the link points to a php page, we load it into the div, otherwise no
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('tabQueryResult',element.href);
		// if the click happens in a modal window, this page is closed
		if (typeof ($.modal) !== "undefined") {;
			$.modal.close();
		}
	} else {
		// nothing to do
	}
};
/** Handle the "submit" on a form */
openViewer.prototype.ev_info_page_submit_form = function(event) {
	///TODO check ID of the form, method=POST, etc... 

	var element = event.currentTarget;

	// The submit is handled only if the form has "no" no-action class, or the target is not "blank", otherwise we skip
	if(!$(element).hasClass('no-action') && (element.target!='_blank' && element.target!='blank') && (element.target!='_top' && element.target!='top') ) {  

		var id_form=$(element).attr("id");
		// the parameters are pased in POST
		var obj_form=$("#"+id_form).serializeArray();

		$(this.infoPanelQuery).load(element.action,obj_form);
	} else if (element.target=='_blank' || element.target=='blank' || element.target=='_top' || element.target=='top') {
		element.submit();
	}
	return false;
};
/** Manual scale change by typing a number (integer) on the footer scale */
openViewer.prototype.ev_footer_scala_click = function(event) {
// ov_utils.ovLog('FooterScaleClick event'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var element = event.target;

	var oldScale = this.getMapScale();

	$(element).html("<input id='" + this.footerPanelScalaInputId + "' type='text' value='' />");
	var footerPanelScalaInput = $("#" + this.footerPanelScalaInputId);
	footerPanelScalaInput.focus().keypress($.proxy(function( ev ) {
		// if the pressed key is RETURN
		if ( ev.which == 13 ) {
			// if the number is not integer, we reset to oldScale
			if ( ! isNaN( parseInt( footerPanelScalaInput.val() ) ) )
				this.setMapScale( footerPanelScalaInput.val() );
			else
				this.setMapScale(oldScale);
		}
	},this));
};

/** Search an address or a location by coordinates (based on the settings of the "search" tab */
openViewer.prototype.ev_run_location_search = function(params) {
// ov_utils.ovLog('RunLocationSearch'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
    var that = this;
    
	var aType=params.aType;
    var FA=params.objFoundAddress;     // JQuery object to show the result of the search in the "search" tab
    var FC=params.objFoundCoordinates; // JQuery object to show the result of the search in the "search" tab
    var FL=params.objFoundLicence;     // JQuery object to show the result of the search in the "search" tab
    var flagKeepScale=params.keepCurrentScale;
    
	switch(aType) {
		case 'coords':
			var coordX = params.coordX;
			var coordY = params.coordY;
			
			var data = {
				"format": "json",
				"lat": coordY,
				"lon": coordX
			};
			
			var serviceUrl = "https://nominatim.openstreetmap.org/reverse";
			break;
		default: // case 'text'
			var searchText = params.searchText;
			
			var data = {
				"format": "json",
				"addressdetails": 1,
				"q": searchText,
				"limit": 1
			};
			
			var serviceUrl = "https://nominatim.openstreetmap.org";
			break;
		}
		
	$.ajax({
		method: "GET",
		url: serviceUrl,
		data: data
	})
	.done(function( msg ) {
	switch(aType) {
		case 'coords':
ov_utils.ovLog(msg, 'AddressFounded'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
			if(msg===undefined) {
				FA.html(strings_interface.sentence_searchunsuccessful);
				FC.html('');
				FL.html('');
				return;
			}
			var coordX = parseFloat(msg['lon']);
			var coordY = parseFloat(msg['lat']);
			var latlonProj = 'EPSG:4326';
			
			var foundAddress = '';
			if(msg['display_name']!=='') foundAddress = msg['display_name'];
			
			var foundLocation = '';
			if(msg['lon']!==''&&msg['lat']!=='') foundLocation = msg['lon'] +' , ' + msg['lat'];
			
			var foundLicence = '';
			if(msg['licence']!=='') foundLicence = msg['licence'];
			
			break;
		default: // case 'text'
ov_utils.ovLog(msg[0], 'AddressFounded'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
			if(msg.length<=0) {
				FA.html(strings_interface.sentence_searchunsuccessful);
				FC.html('');
				FL.html('');
				return;
			}
			var coordX = parseFloat(msg[0]['lon']);
			var coordY = parseFloat(msg[0]['lat']);
			var latlonProj = 'EPSG:4326';
			
			var foundAddress = '';
			if(msg[0]['display_name']!=='') foundAddress = msg[0]['display_name'];
			
			var foundLocation = '';
			if(msg[0]['lon']!==''&&msg[0]['lat']!=='') foundLocation = msg[0]['lon'] +' , ' + msg[0]['lat'];
			
			var foundLicence = '';
			if(msg[0]['licence']!=='') foundLicence = msg[0]['licence'];
			
			break;
		}
		
		FA.html(foundAddress);
		FC.html(foundLocation);
		FL.html(foundLicence);
		
		// zoom to the founded location
		open_viewer.map.setCenterProjected(coordX, coordY, latlonProj);
		if(!flagKeepScale) open_viewer.map.setZoom(18);
		
		});         
    return;
};

/** EVENTS - HANDLING OF LAYERS ON THE LEGEND
 * ---------------------------------------------------------------
 */

/** Open/Close the legend sub-sections (basemap layers, wms layers, themes, ...) */
openViewer.prototype.ev_legend_buttonopenclose_click = function (e) {
	var element = e.target;
	var id=$(element).attr("id").replace("toggle_","");
	$("#"+ id).toggle();
	if($("#"+ id ).is(":visible"))
		$(element).removeClass("legend_close").addClass("legend_open");
	else
		$(element).removeClass("legend_open").addClass("legend_close");
};
/** Show/Hide a basemap layer */
openViewer.prototype.ev_legend_basemap_click = function(event) {
	var element = event.target;

	name=$(element).attr("id");

	ol_layers=this.map.getMapLayers();
	ol_layers.forEach(function(element,index,ar) {
		if (element.get('baselayer')) {
			if(element.get('name')==name) {
				element.setVisible(true);
			} else {
				element.setVisible(false);
			}
		}
		
	},this);
};
/** Open/Close the dialog to add custom WMS layer */
openViewer.prototype.ev_wmscustom_pageadd_openclose_click = function(){
	if (this.editWMSBackground.hasClass("show")) {
		this.editWMSBackground.removeClass('show').addClass('hide');
		this.editWMSContainer.removeClass('show').addClass('hide');
	}
	else{
		this.editWMSBackground.removeClass('hide').addClass('show');
		this.editWMSContainer.removeClass('hide').addClass('show');
	}
}
/** Remove all custom WMS layers from the legend and from the map */
openViewer.prototype.ev_wmscustom_remove_all_click = function() {
	ov_wms_plugin.removeAllWmsUserLayers(); // this.map.removeAllWmsUserLayers(layer);
	// refresh the legend
	this.refreshLegend();
}


/** EVENTS - HANDLING OF "MAIN LAYERS" ON THE LEGEND (MAPGUIDE, WMS_GEOSERVER, INTERNAL WMS)
 * ------------------------------------------------------------------------------------------
 */

/** Show/Hide a group of layer (different from the basemap layer) */
openViewer.prototype.ev_legenda_group_checkbox_click = function(event) {
	var element = event.target;
	var id = $(element).attr("id");
	this.showHideGroupLayers(id, $(element).is(":checked"));
};
/** Show/Hide a layer (different from the basemap layer) */
openViewer.prototype.ev_legenda_layer_checkbox_click = function(event) {
	var element = event.target;
	var id=$(element).attr("id");
	this.showHideLayer(id, $(element).is(":checked"));
};
/** OVD CURRENTLY UNUSED - Expand a group of "INTERNAL WMS LAYERS"
 *  - similar to "ev_legenda_plus_stile_click"
 */
openViewer.prototype.ev_legenda_plus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).show();
	$(element).removeClass("plus").addClass("minus");

	var ol_layer=this.getMainLayerNameBySubGroupName(id);
	stato[ol_layer].groups_info[id]['expanded']=true;
	
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - Collapse a group of "INTERNAL WMS LAYERS"
 *  - similar to "ev_legenda_minus_stile_click"
 */
openViewer.prototype.ev_legenda_minus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).hide();
	$(element).removeClass("minus").addClass("plus");
	
	var ol_layer=this.getMainLayerNameBySubGroupName(id);
	stato[ol_layer].groups_info[id]['expanded']=false;
	
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - Expand a group of "INTERNAL WMS LAYERS"
 *  - similar to "ev_legenda_plus_click"
 */
openViewer.prototype.ev_legenda_plus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	//$("#stile_"+id.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" )).show();
	$('#'+ov_utils.jQescape('stile_'+id)).show();
	$(element).removeClass("plus_stile").addClass("minus_stile");
	
	var ol_layer=this.getMainLayerNameBySubLayerName(id);
	if(ol_layer==false) {
		// special case: the group is a "one layer group" (like the WMS on-the-fly layers)
		var sub_element_stato=this.getSubGroupStatoByFeature(id);
	} else {
		var sub_element_stato = stato[ol_layer].layers_info[id];
	}
	sub_element_stato['expanded']=true;
    
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION
 *  - similar to "ev_legenda_minus_click"
 */
openViewer.prototype.ev_legenda_minus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$('#'+ov_utils.jQescape('stile_'+id)).hide();
	$(element).removeClass("minus_stile").addClass("plus_stile");
	
	var ol_layer=this.getMainLayerNameBySubLayerName(id);
	if(ol_layer==false) {
		// special case: the group is a "one layer group" (like the WMS on-the-fly layers)
		var sub_element_stato=this.getSubGroupStatoByFeature(id);
	} else {
		var sub_element_stato = stato[ol_layer].layers_info[id];
	}
	sub_element_stato['expanded']=false;
	
	this.setStato(stato);
};


/** EVENTS - HANDLING THE USER INTERACTION WITH THE MAP
 * ---------------------------------------------------------------
 * - mouse down/move/up
 * - features selection
 */

/** Mouse-up reset the general app status after a mouse-down */
openViewer.prototype.ev_map_mouse_up = function(event) {
// ov_utils.ovLog(event,'MAP MOUSE UP EVENT'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	clearTimeout(this.timeoutId); 
	this.startPixel = undefined; 
};
/** Mouse-move set the startPixel variable */
openViewer.prototype.ev_map_mouse_move = function(event) {
// ov_utils.ovLog(event.clientX+','+event.clientY,'MAP MOUSE MOVE EVENT'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	if (this.startPixel) { 
		var pixel = this.map.map.getEventPixel(event); 
		var deltaX = Math.abs(this.startPixel[0] - pixel[0]); 
		var deltaY = Math.abs(this.startPixel[1] - pixel[1]); 

		if (deltaX + deltaY > 24) {
			clearTimeout(this.timeoutId); 
			this.startPixel = undefined; 
		} 
	} 
};
/** Make the device "vibrating" (if this functionality is enabled by the device) */
openViewer.prototype.ev_map_mouse_down = function(event) {
// ov_utils.ovLog(event,'MAP MOUSE DOWN EVENT'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)

	event.preventDefault();
	clearTimeout(this.timeoutId);

	this.timeoutId = setTimeout($.proxy(function() { 
		// on devices where the "vibration" is enable
		var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
		if (canVibrate && !("vibrate" in navigator)) {
			navigator.vibrate = navigator.mozVibrate;
		}
			
		if (canVibrate) {
			// vibrate for 50 ms
			navigator.vibrate(50);
		}
		
	},this), 300, false); 
};
/** Identify/Selection of geographical features (MAIN LAYERS INTEGRATION)
 *  - select (new/add) the geographical features and highlight them (always)
 *  - identify selected features and show the related information (if CTRL is pressed or if enableFeatAttrWithoutCtrl=true)
 */
openViewer.prototype.ev_map_select = function(event) {
// ov_utils.ovLog(event,'MAP SELECT EVENT','warning'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
    
	var flag_found_something = false; // used to know if we have selected something (if not we must clear the result window)
	
	var this_viewer = this;
	
	event.preventDefault();
	switch (this.map.getStatusInteraction()) {
		case "draw":
		case "measure_line":
		case "measure_area":
			//Do nothing
		break;
		default:
			var stato = this.getStato();
			
			var pointerType = event.originalEvent.pointerType;
			
			var flagNewSelection = !event.originalEvent.shiftKey;  // !shiftKeyPressed;
			var flagShowFeaturesAttributes = event.originalEvent.ctrlKey||this.enableFeatAttrWithoutCtrl; // ctrlKeyPressed;
			var flagShowOnlyLastSelected = false&&flagShowFeaturesAttributes; 
			
			var wms_url_internal = this.internalWmsURL; // some procedures changes if the wms server is internal
			
			// reset the global variable to hold the inforamtion of the selected features (filled in the procedure showFeaturesAttributes)
			if(flagShowFeaturesAttributes) {
				this.htmlFeaturesInfo = '';
				$("#ov_info_wms_container").html(strings_interface.sentence_retrievingtheinformation); 
				this.loadInfoPage('tabQueryResult',this.infoPanel); // this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
				if (this.titleToggleInfo.hasClass("active")) {this.toggleInfo(0);} // OVD strange behviour
			}
			
			// search "queryable" layers
			var a_ol_layers_names=[];
			var a_ol_layers_names_all=Object.keys(stato);
			for(var i=0; i<a_ol_layers_names_all.length; i++){
				if(stato[a_ol_layers_names_all[i]].list_layers_selectable!='') {
					a_ol_layers_names.push(a_ol_layers_names_all[i]);
				}
			}
			
			// start looping over the "queryable main layers"
			var flagLastLayerToProcess = false	// it is useful to inform the callback procedure to "refresh" the page with the "global" query results
												// that is:
												// the "global" query results are temporarly stored in a "global" variable, and at the end of the
												// processing of the last layer, a timeout function is launched to refresh the page
												// the timeout is necessary to allow async functions to end
			for(var i=0; i<a_ol_layers_names.length; i++){
				
				// check if it is the last layer to be processed
				if(i==a_ol_layers_names.length-1) flagLastLayerToProcess = true;
				
				// layer properties
				var ol_layer_name=a_ol_layers_names[i];
				var ol_layer_type=stato[ol_layer_name].tipo;
				var ol_layer_url=stato[ol_layer_name].url;
				var ol_layer_source=this.map.getMapLayerSourceByName(ol_layer_name);
				
				// **************************************************************************
				// 
				// SELECTION - macro task
				// - it is always executed, even if the CTRL has been pressed
                // - check if the "macro" layer contains selectable layers
				// - handle the feature selection (new selection, add to selection)
				// - highlight the selected features
				// 
				// **************************************************************************
				if(stato[ol_layer_name].list_layers_selectable!='') {
					
ov_utils.ovLog('****************************************');
ov_utils.ovLog('macro-layer '+ol_layer_name+' '+(i+1)+'/'+a_ol_layers_names.length,'SELECTION & IDENTIFY (if required)');
ov_utils.ovLog('****************************************');
ov_utils.ovLog(stato[ol_layer_name],'stato[ol_layer_name]');
					
					switch(ol_layer_type) {		// OVD it was ol_layer_name, but it is better to use the "tipo" properties
												// this allows to have many "macro-layers" of the same type (wms, wms_geoserver, ...)
												// with different names
												
						// OVD "wms" case to be checked (no examples available)
						case "wms":
							var array_layers = stato[ol_layer_name].list_layers_hyperlinked.split(",");
							var list_name_hyperlinked='';
							for(var j=0; j < array_layers.length; j++){
								var name_layer = stato[ol_layer_name].layers_info[array_layers[j]].name; 
									list_name_hyperlinked = name_layer + "," + list_name_hyperlinked;

							}   
							var name_length = parseInt(list_name_hyperlinked.length)-1;
							var list_name_trunk = list_name_hyperlinked.substring(0,name_length);
						
							if(flagNewSelection) { // flagNewSelection = !shiftKeyPressed  // !shiftKeyPressed
								if(pointerType=='mouse') {
									var url = ol_layer_source.getFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = ol_layer_source.getFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
									
								}

								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) { ov_wms_plugin.getWMSlayerSelection(response); }); // OVD it was this_viewer.getWMSlayerSelection(response)
							} else {
								if(pointerType=='mouse') {
									var url = ol_layer_source.getFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = ol_layer_source.getFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
								}
								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) {
									// to know if we have selected something (if not we must clear the result window)
									if(response!=undefined) flag_found_something = true; // OVD: to be checked if response!=undefined "really" means "found something"
									this_viewer.addFeaturesToSelection(response);
									});
							}
						break;
						
						// OVD checked and working correctly
                        // functionality based on the procedure defined in the WMS plugin, and based on an AJAX call 
						case "wms_geoserver":
							// if the plugin WMsLayers is installed
							if(this.pluginWmsLayersAvailable) {
								
								// optionally clear the previous selection
								if(flagNewSelection) {
									// retrieve the layer where "copying" the selected features (to be highlighted)
									var selectOverlay=this_viewer.map.getMapLayerByName('selection');
									// clear the previous selection
									selectOverlay.getSource().clear();
								}
								
								// set the callback function
								var cbFunc = this_viewer.addFeaturesToSelection; // it is defined in this class because it is used by other "standard" functionalities
								
								// run the "query" and:
								// - select the feature
								// - optionally show the attributes info of the last selected feature (flagShowFeaturesAttributes AND flagShowOnlyLastSelected) 
								// - optionally show the attributes info of "all" selected features (flagShowFeaturesAttributes AND NOT flagShowOnlyLastSelected) 
								var aResponse = ov_wms_plugin.getWmsInfoByCoordinates(ol_layer_name, ol_layer_source, event.coordinate,
																			this_viewer.map.getMapView().getResolution(),
																			this_viewer.map.mapProjection, stato[ol_layer_name].gfi_format, 
																			stato[ol_layer_name].list_layers_selectable,
																			pointerType, this_viewer.touchBuffer, cbFunc,
																			false, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess);
								if(aResponse==true) flag_found_something = true; // to know if we have selected something (if not we must clear the result window)
								
							} else {
ov_utils.ovLog('Plugin WMS LAYERS not installed, impossible to get wms feature info','MAP SELECT EVENT','warning'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
							}
						break;
                        
						// OVD to be made working
						case "wms_onthefly":
							// if the plugin WMsLayers is installed
							if(this.pluginWmsLayersAvailable) {
								
								// optionally clear the previous selection
								if(flagNewSelection) {
									// retrieve the layer where "copying" the selected features (to be highlighted)
									var selectOverlay=this_viewer.map.getMapLayerByName('selection');
									// clear the previous selection
									selectOverlay.getSource().clear();
								}
								
								// set the callback function
								var cbFunc = this_viewer.addFeaturesToSelection; // it is defined in this class because it is used by other "standard" functionalities
									
								// run the "query" and:
								// - optionally show the attributes info of the selected feature
								var aResponse = ov_wms_plugin.getWmsInfoByCoordinates(ol_layer_name, ol_layer_source, event.coordinate,
																			this_viewer.map.getMapView().getResolution(),
																			this_viewer.map.mapProjection, stato[ol_layer_name].gfi_format, 
																			stato[ol_layer_name].list_layers_selectable,
																			pointerType, this_viewer.touchBuffer, cbFunc,
																			false, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess);
								if(aResponse==true) flag_found_something = true; // to know if we have selected something (if not we must clear the result window)
								
							} else {
ov_utils.ovLog('Plugin WMS LAYERS not installed, impossible to get wms feature info','MAP SELECT EVENT','warning'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
							}
						break;
						                        
					}
				}
				
				
				
				else { // it is not selectable
					
ov_utils.ovLog('****************************************');
ov_utils.ovLog('macro-layer '+ol_layer_name+' '+(i+1)+'/'+a_ol_layers_names.length,'NOT SELECTABLE');
ov_utils.ovLog('****************************************');
ov_utils.ovLog(stato[ol_layer_name],'stato[ol_layer_name]');
					
				}
			} // end the loop over the selectable layers
			
			if(flag_found_something==false) {
				setTimeout(function(){
					if(this_viewer.htmlFeaturesInfo=='') {
						$("#ov_info_wms_container").html(strings_interface.sentence_noselectedobjects); 
						this_viewer.loadInfoPage('tabQueryResult',this_viewer.infoPanel); // this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
						if (this_viewer.titleToggleInfo.hasClass("active")) {this_viewer.toggleInfo(0);} // OVD strange behviour
					}
				}, this_viewer.timeout_RefreshFeaturesAttributesInfo*3);
			}
			
		break;
	}
};


/** INTERFACE - SERVICE PROCEDURES TO FILL/HANDLE THE PANELS/TABS
 * ---------------------------------------------------------------
 * - "right" tabs (query result, search, cusxtom, app info)
 * - "VistaSu" panel
 */

/** Load info/page into the "QueryResult" tab (used by LibViewer.js) */
openViewer.prototype.documentLocationWrapper = function(url) {
	this.loadInfoPage('tabQueryResult',url);
}
/** Load info/page into the tabs */
openViewer.prototype.loadInfoPage = function(tabName,url,spinner,data,newHistoryState) {

	spinner = (typeof spinner !== 'undefined') ?  spinner : false;
	data = (typeof data !== 'undefined') ?  data : false;
	newHistoryState = (typeof newHistoryState !== 'undefined') ?  newHistoryState : true;
	
	var tab = undefined;
	switch (tabName) {
		case 'tabQueryResult':

			// Handling history to allow back/forward from info tab
			if(newHistoryState) {
				history.pushState({"tabName": tabName,"url": url,"spinner":spinner,"data":data}, "titolo", "");
			} else {
                // nothing to do
			}
			
			tab = this.infoPanelQuery;
			//alert('QueryResult: '+tabName+' '+url);
			break;
		case 'tabSearch':
			tab = this.infoPanelSearch;
			//alert('Search: '+tabName+' '+url);
			break;
		case 'tabCustom':
			tab = this.infoPanelCustom;
			//alert('Search: '+tabName+' '+url);
			break;
		case 'tabAppInfo':
			tab = this.infoPanelAppInfo;
			//alert('AppInfo: '+tabName+' '+url);
			break;
		case 'help':
			//tab = this.infoPanelHelp;
			break;

	}

	if (tab) {
		if(spinner) {
			$(tab).html("<div class='ov_spinner'>"+strings_interface.sentence_waitplease+"...</div>");
		}
		if (data) 
			$(tab).load(url,data);
		else
			$(tab).load(url);
	}

	this.infoPanelTabs.tabs({ active: 0 });
};
/** Load info/page into the "VistaSu" panel */
openViewer.prototype.loadVistaSu = function(url) {
	if (this.vistasuPanel)
		$(this.vistasuPanel).load(url);
};


/** INTERFACE - SERVICE PROCEDURES TO HANDLE THE HELP/GUIDED TOUR
 * ---------------------------------------------------------------
 */

/** Initialization of the tour components - HELP/ GUIDED TOUR (developed with Bootstrap Tour - http://bootstraptour.com/ ) */
openViewer.prototype.setTourElement = function(){
	var tour = new Tour({
		steps: [
			{
				title: strings_tour_help['start_title'],
				content: strings_tour_help['start_content'],
				orphan: true
			},
			{
				element: "#ov_show_hide_info",
				title: strings_tour_help['rightbar_title'],
				content: strings_tour_help['rightbar_content'],
				placement: "left"
			},
			{
				element: "#ov_show_hide_leftTabs",
				title: strings_tour_help['leftbar_title'],
				content: strings_tour_help['leftbar_content'],
				placement: "right"
			},
			{
				element: "#ov_show_hide_legend",
				title: strings_tour_help['legend_title'],
				content: strings_tour_help['legend_content'],
				placement: "bottom"
			},
			{
				element: "#ov_legend_container",
				title: strings_tour_help['legenditems_title'],
				content: strings_tour_help['legenditems_content'],
			},
			{
				element: "#ov_legend_add_wms_layer",
				title: strings_tour_help['wms_title'],
				content: strings_tour_help['wms_content'],
				placement: "bottom"
			},
			{
				element: "#ov_show_hide_vistasu",
				title: strings_tour_help['viewothermap_title'],
				content: strings_tour_help['viewothermap_content'],
				placement: "bottom"
			},			
			{
				element: "#tools",
				title: strings_tour_help['toolbar_title'],
				content: strings_tour_help['toolbar_content'],
			},
			{
				element: "#footer_scala",
				title: strings_tour_help['scalebar_title'],
				content: strings_tour_help['scalebar_content'],
				placement: "top"
			},
			{
				element: "#exit",
				title: strings_tour_help['exit_title'],
				content: strings_tour_help['exit_content'],
				placement: "right",
                template: "<div class='popover tour tour-tour' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><div class='btn-group'><button class='btn btn-sm btn-primary' data-role='prev' title='"+strings_tour_help['template_prev_title']+"'>"+strings_tour_help['template_prev_back']+"</button><span data-role='separator'>&nbsp;</span><button class='btn btn-sm btn-secondary' data-role='next' title='"+strings_tour_help['template_next_title']+"'"+strings_tour_help['template_next_forward']+"</button></div><button class='btn btn-sm btn-success' data-role='end' title='"+strings_tour_help['template_close_tour']+"'>"+strings_tour_help['template_close_close']+"</button></div></div>"
			}
		],
		backdrop: true,
		template: "<div class='popover tour tour-tour' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><div class='btn-group'><button class='btn btn-sm btn-secondary' data-role='prev' title='"+strings_tour_help['template_prev_title']+"'>"+strings_tour_help['template_prev_back']+"</button><span data-role='separator'>&nbsp;</span><button class='btn btn-sm btn-primary' data-role='next' title='"+strings_tour_help['template_next_title']+"'>"+strings_tour_help['template_next_forward']+"</button></div><button class='btn btn-sm btn-secondary' data-role='end' title='"+strings_tour_help['template_close_tour']+"'>"+strings_tour_help['template_close_close']+"</button></div></div>"
	});
	
	return tour
}
/** Initialization and start of the tour - HELP/ GUIDED TOUR (developed with Bootstrap Tour - http://bootstraptour.com/ ) */
openViewer.prototype.loadTour = function(url) {
	var tour = this.setTourElement();
	// initialize the tour
	tour.init();
	    
	// start the tour
	tour.start();
};
/** Restart of the tour - HELP/ GUIDED TOUR (developed with Bootstrap Tour - http://bootstraptour.com/ ) */
openViewer.prototype.RestartTour = function(url) {
	var tour = this.setTourElement();
	// Initialize the tour
	tour.init();
	
	// Start the tour
	tour.restart();
};


/** INTERFACE - SERVICE PROCEDURES TO CREATE/FILL/HANDLE THE LEGEND
 * -----------------------------------------------------------------
 */

/** Build the LegendTree object, holding the structure of the layers legend (groups and layers) */
openViewer.prototype.legendBuildLayerTree = function() {
// ov_utils.ovLog('Building legened layer tree...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var stato = this.getStato();
	var tree = new Array();
	var knownGroups = new Array();
	var unresolved = new Array();
	//var groups = Object.keys(groups_info);
	
	
	// retrieve the list of "main layers" and "WMS on-the-fly layers" from OpenLayers
    // with the layers drawn on top at the beginning of the array (use unshift)
	var ol_layers=this.map.getMapLayers();
	
	var sortedLayersNames = [];
	ol_layers.forEach(function(element,index,ar) {
		var layerName = element.get('name');
		var layerStato = stato[layerName];
		if(typeof layerStato != 'undefined') {
			sortedLayersNames.unshift(layerName);
		}
	},this);
	
	// for each "main layer" or "WMS on-the-fly layer" (no basemap)
	var a_ol_layers=Object.keys(stato);

	for (var i=0;i<sortedLayersNames.length;i++) {         // OVD old version: for (var i=0;i<a_ol_layers.length;i++) {
		var layerName = sortedLayersNames[i];
		
		ol_layer=stato[layerName];                        // OVD old version: ol_layer=stato[a_ol_layers[i]];
		layers_info=ol_layer.layers_info;
		groups_info=ol_layer.groups_info;
		layers=Object.keys(layers_info);
		groups=Object.keys(groups_info);
		// loop over the groups
		for (var j=0;j<groups.length;j++) {
			rtGroup = groups_info[groups[j]];
            rtGroup['source_type']=ol_layer.tipo; // OVD add a new property (it is used to distinguish WMS on-the-fly layers and dispaly in a separate section of the legend
			node = new ovLegendTreeItem(groups[j], true, rtGroup, null);
			knownGroups[groups[j]] = node;

			parentGroup = rtGroup.group;
			if(parentGroup == undefined) {
				tree.push(node);
			} else {
				parentName = parentGroup;
				parentNode = knownGroups[parentName];
				if(parentNode != undefined)
					parentNode.Attach(node);
				else
				{
					node.parentName = parentName;
					unresolved.push(node);
				}
			}
		}
		if(unresolved.length > 0) {
			for(var j= 0; i < unresolved.length; j++) {
				node = unresolved[j];
				parentNode = knownGroups[node.parentName];
				if(parentNode != undefined)
					parentNode.Attach(node);
				else
					tree.push(node); // it should not happen, place group in the root if parent is not known
			}
		}
		// get the layers
		layers = Object.keys(layers_info);

		for(var j = 0; j < layers.length; j++)
		{
			rtLayer = layers_info[layers[j]];
			node = new ovLegendTreeItem(layers[j], false, rtLayer, null); //$layersData->GetItem($i) come 4° argomento
			parentGroup = rtLayer.group;
			if(parentGroup == undefined)
				tree.push(node);
			else {
				parentNode = knownGroups[parentGroup];
				if(parentNode != undefined)
					parentNode.Attach(node);
				else
					tree.push(node); // it should not happen, place layer in the root if parent is not known
			}
		}
	
	}
	this.legendTree = tree;
}
/** Return the scale range of a group of layers (identified by the node), by cyclying all the "children" layers */
openViewer.prototype.getScaleMinMaxGroup = function(node) {
	var range_scale={"scaleMin":9999999999,"scaleMax":0};

	if (node.children != null) {
		for(var c = 0; c < node.children.length; c++) {
			
			///TODO implement with a recursive call
			if (!node.children[c].isGroup) {
			
				if(node.children[c].tObject.min_scale == undefined) {
					range_scale.scaleMin = 0;
				}

				if(node.children[c].tObject.max_scale == undefined) {
					range_scale.scaleMax = 9999999999;
				}
				
				if(node.children[c].tObject.min_scale != undefined && parseInt(node.children[c].tObject.min_scale)<parseInt(range_scale.scaleMin)) {
					range_scale.scaleMin=parseInt(node.children[c].tObject.min_scale);
				}
				if(node.children[c].tObject.max_scale != undefined && parseInt(node.children[c].tObject.max_scale)>parseInt(range_scale.scaleMax)) {
					range_scale.scaleMax=parseInt(node.children[c].tObject.max_scale);
				}
				

			} else {
				var range_temp=this.getScaleMinMaxGroup(node.children[c]);
				
				if(range_temp.scaleMin < range_scale.scaleMin) {
					range_scale.scaleMin=parseInt(range_temp.scaleMin);
				}
				if(range_temp.scaleMax > range_scale.scaleMax) {
					range_scale.scaleMax=parseInt(range_temp.scaleMax);
				}
				
			}
		}
	}
	return range_scale;
}
/** Return the HTML string to display the layers in the legend (different options)
 *  - layersToProcess can be 'main_layers' or 'wms_onthefly_layers'
 *  - layers of type "wms_onthefly_layers" are processed as "simplified groups"
 *    (each layer is also a separate group)
 */
openViewer.prototype.legendBuildClientSideTree = function(tree, parent, parentName, layersToProcess) {
// ov_utils.ovLog('Buildind Client Side legened tree...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var that = this;
	var stato = this.getStato();
	var scala = this.getMapScale();
	var node = undefined;
	
	var htmlLegenda="";
	var groupName = '';
	var expandClass = '';
	var htmlExpandCollapse = '';
	var checked = '';
	var legendLabel = '';
	var groupScaleMin = 9999999999;
	var groupScaleMax = 0;

	if(layersToProcess === undefined) {
		layersToProcess = 'main_layers';
	}
	
	treeIndex = 0;
	for(var i = 0; i < tree.length; i++) {
		node = tree[i];

		if(node.isGroup) {
			if(layersToProcess=='main_layers')	{
				if(	(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false) ||
					(typeof node.tObject.source_type !== 'undefined' && node.tObject.source_type == 'wms_onthefly') )	{

					continue;
				}
			} else if (layersToProcess=='wms_onthefly_layers')	{
				if(	(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false) ||
					(typeof node.tObject.source_type !== 'undefined' && node.tObject.source_type != 'wms_onthefly') )	{
					
					continue;
				}
			} else {
				if(typeof node.tObject.internal === 'undefined' || node.tObject.internal != false){
					
					continue;
				}
			}
			
			groupName = node.name;
			            
			// expand/collapse
			if(node.tObject.expanded) {
				expandClass = 'minus';
			} else {
				expandClass = 'plus';
			}
			
			if(node.tObject.visible == true) {
				checked = 'checked=true';
			} else {
				checked = '';
			}
			
			if(node.tObject.legend_label!=undefined) {
				legendLabel = node.tObject.legend_label;
			} else {
				legendLabel = node.name;
			}
			
			var range_scale=this.getScaleMinMaxGroup(node);
			groupScaleMin= range_scale.scaleMin;
			groupScaleMax= range_scale.scaleMax;
						
			// the group is hidden if the current scale is outside its scale range
			if((groupScaleMin<Math.round(scala)) && (groupScaleMax>=Math.round(scala))) {
				                
				if(layersToProcess=='main_layers')	{
					displayStyle = 'block';
					
					style = 'style="display:' + displayStyle +';"';
					
					htmlLegenda+='<li ' + style + '>';
					htmlLegenda+="<div id='ov_legend_item_container_div'>";  // added
					
					htmlLegenda+="<div id='ov_legend_item_label_div'>"; // added
					htmlLegenda+=htmlExpandCollapse;
					htmlLegenda+='<input id="' + groupName + '" type="checkbox" ' + checked + ' class="legenda_group_checkbox" />';
					htmlLegenda+='<label for="' + groupName + '">';
					htmlLegenda+='<img src="/include/img/openViewer/legend/lc_group.gif" alt="icona del gruppo" />';
					htmlLegenda+=legendLabel;
					htmlLegenda+='</label>';
					htmlLegenda+='</div>'; // ADDED
					
					htmlLegenda+='</div>'; // ADDED
					htmlLegenda+='</li>';
					
					// create the div containing the layers of the group
					if (node.children != null) {
						// the layer is hidden if the current scale is outside its scale range
						if(node.tObject.expanded) {
							style="style=\"display:block;\"";
						} else {
							style="style=\"display:none;\"";
						}
						
						htmlLegenda+="<ul class='childrenof' id='childrenof_"+groupName+"' "+style+">";
						
						// recursive call to get the HTML of the sub branch
						htmlLegenda += this.legendBuildClientSideTree(node.children, node, groupName, layersToProcess);
						htmlLegenda+="</ul>";
					}
					
				} else if(layersToProcess=='wms_onthefly_layers')	{
					// retrieve the OL layer object
					var ol_layer=this.map.getMapLayerByName(this.getMainLayerNameBySubGroupName(groupName));
					
					// derive some information needed to build the html object
					var itemName = ol_layer.getProperties().name;
					var itemID = itemName; // the attribute ID of the tag INPUT must equal the name of the layer
					var itemChecked=''; if(node.tObject.visible == true) itemChecked = 'checked=true';
					
					// retrieve the scale limits and the CRS of the layer
					var scaleMax = this.map.getScaleFromResolution(ol_layer.getMaxResolution()+this.correctionOffsetScaleMax,true);
					var scaleMin = this.map.getScaleFromResolution(ol_layer.getMinResolution()+this.correctionOffsetScaleMin,true);
					var layerCrs = ol_layer.getSource().getProjection().getCode();
					if((scaleMin>0||scaleMax>0)&&scaleMax>scaleMin)
						var labelTip = strings_interface.sentence_scalevisibility+scaleMin+'-'+scaleMax+' ('+strings_interface.sentence_datasource+' '+layerCrs+')';
					else
						var labelTip = '('+strings_interface.sentence_datasource+' '+layerCrs+')';
					
					// retrieve the image legend and set its size
					var img_url = ol_layer.get('legendUrl');
					var hash = Math.floor(Math.random() * 1000000);
					var img_source_html = "";
					if(typeof img_url != 'undefined' && img_url != '') {
						img_source_html = " src=\""+img_url.trim()+"\" ";
						hash = ov_utils.hashCode(img_url);
					}
					var style_leg_width = ol_layer.get('legendWidth');
					var img_width_html = " style=\"width: "+this.leftPanelMinWidth * 0.9+"px\" ";
					if(typeof style_leg_width != 'undefined' && style_leg_width != '' && style_leg_width > 0) {
						img_width_html = " style=\"width: "+Math.min(this.leftPanelMinWidth * 0.9,style_leg_width)+"px\" ";
					}
					
					// set the component to expand/collapse the layer legend
					if(node.tObject.expanded) {
						htmlExpandCollapse="<a id='expand_"+itemID+"' class='minus_stile' href='javascript:;'></a>&nbsp;";
						stile_immagine="style=\"display:block;float:left;\"";
					} else {
						htmlExpandCollapse="<a id='expand_"+itemID+"' class='plus_stile' href='javascript:;'></a>&nbsp;";
						stile_immagine="style=\"display:none;float:left;\"";
					}
					
					// preset the tag according to the "visbility" of the layer
					if(node.tObject.visible==true) {
						checked='checked=true';
					} else {
						checked='';
					}
					
					// retrieve the legend label/title
					if(node.tObject.legend_label!=undefined) {
						legend_label=node.tObject.legend_label;
					} else {
						legend_label=node.name;
					}
					
					// the layer is hidden if the current scale is outside its scale range // OVD to be checked
					if((node.tObject.min_scale==undefined || node.tObject.min_scale<=Math.round(scala)) && (node.tObject.max_scale==undefined || node.tObject.max_scale>Math.round(scala))) {
						style='style="display:block;clear:left;"';
					} else {
						style='style="display:none;clear:left;"';
					}
					
					// define the component "layer legend"
					html_stile="<br/><img id='stile_"+itemID+"' "+stile_immagine+" src='"+img_url+"' title='' />";
					
					// start the definition of the legend entry
					htmlLegenda+="<li "+style+">";
					htmlLegenda+="<div id='ov_legend_item_container_div'>";
					
					// define the HTML of the legend entry
					htmlLegenda+="<div id='ov_legend_item_label_div'>";
					htmlLegenda+=htmlExpandCollapse;																						// expand/collapse the layer legend
					htmlLegenda+="<input id='"+itemID+"' type='checkbox' "+checked+" class='legenda_group_checkbox' />";					// show/hide the layer
					htmlLegenda+="<label for='"+itemID+"'>";	// entry
					htmlLegenda+="<img class='legend-small' src='"+img_url+"' title='' />";	// entry
					htmlLegenda+=legend_label;	// entry
					htmlLegenda+="</label>";	// entry
					htmlLegenda+=html_stile;																								// layer legend
					htmlLegenda+="</div>";
					
					// add the buttons to change the opacity of the layer
					// --------------------------------------------------
					var html_opacitytools="<div id='ov_legend_item_tools_div'>";
					html_opacitytools+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityminus' onclick='open_viewer.map.setLayerOpacity(\""+itemName.trim()+"\",-0.1)' title='"+strings_interface.sentence_increasetransparency+"'>"
					html_opacitytools+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityplus' onclick='open_viewer.map.setLayerOpacity(\""+itemName.trim()+"\",0.1)' title='"+strings_interface.sentence_reducetransparency+"'>"
					html_opacitytools+="</div>";
					htmlLegenda+=html_opacitytools;
					
					htmlLegenda+="</div>";
					htmlLegenda+="</li>";
				}
				
			} else {
				//displayStyle = 'none';
			}
			
			
		} else {
			
			// *****************************************************************************
			// HANDLE THE CHILD OF A GROUP
			// *****************************************************************************
			
			rtLayer = node.tObject;
			layerName = node.name;
			OL_layer_name = this.getMainLayerNameBySubLayerName(layerName);
			
			if(layersToProcess=='main_layers'){
				if(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false){
					continue;
				}
			} else if(layersToProcess=='wms_onthefly_layers') {
				if(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false){
					continue;
				}
			} else {
				if(typeof node.tObject.internal === 'undefined' || node.tObject.internal != false){
					continue;
				}
			}
			
			// expand/collapse
			if(node.tObject.expanded) {
				htmlExpandCollapse="<a id='expand_"+layerName+"' class='minus_stile' href='javascript:;'></a>";
			} else {
				htmlExpandCollapse="<a id='expand_"+layerName+"' class='plus_stile' href='javascript:;'></a>";
				//htmlExpandCollapse="";
			}
			
			// layer shown/hidden
			if(node.tObject.visible==true) {
				checked='checked=true';
			} else {
				checked='';
			}
			
			// legend
			if(node.tObject.legend_label!=undefined) {
				legend_label=node.tObject.legend_label;
			} else {
				legend_label=node.name;
			}
			
			if(node.tObject.image_legend_layer!=undefined) {
				image_legend_layer=node.tObject.image_legend_layer;
			} else {
				image_legend_layer=node.name;
			}
			
			// the layer is hidden if the current scale is outside its scale range
			if((node.tObject.min_scale==undefined || node.tObject.min_scale<=Math.round(scala)) && (node.tObject.max_scale==undefined || node.tObject.max_scale>Math.round(scala))) {
				style='style="display:block;"';
			} else {
				style='style="display:none;"';
			}

			var ol_layer = this.getMainLayerNameBySubLayerName(layerName);

			var url = stato[ol_layer].url;

			if(node.tObject.expanded) {
					stile_immagine="style=\"display:block;\"";
			} else {
					stile_immagine="style=\"display:none;\"";
			}
					
			switch (stato[ol_layer].tipo) {
				case "wms":
					htmlLegenda+="<li "+style+"><input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'>"+legend_label+"</label>"+html_stile+"</li>";
				break;
				case "wms_geoserver":
					if(that.ProxySet == true){
						var returned_img = ov_wms_plugin.getWMSlegendViaProxy(url, scala, image_legend_layer,stato[ol_layer].tipo);
						html_stile="<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='data:image/png;base64," + returned_img + "' title='' />";
						htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'>"+legend_label+"</label>"+html_stile+"</li>";
					}
					else{
						
						// define the component "layer legend"
						html_stile="<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='"+url+"?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LEGEND_OPTIONS=fontName:Serif;fontAntiAliasing:true;fontSize:9;dpi:100&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />";
						
						// start the definition of the legend entry
						htmlLegenda+="<li "+style+">";
						htmlLegenda+="<div id='ov_legend_item_container_div'>";
					
						// define the HTML of the legend entry
						htmlLegenda+="<div id='ov_legend_item_label_div'>";
						htmlLegenda+=htmlExpandCollapse;
						htmlLegenda+="<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' />";
						htmlLegenda+="<label for='"+layerName+"'>";
						htmlLegenda+="<img class='legend-small' src='"+url+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />";
						htmlLegenda+=legend_label;
						htmlLegenda+="</label>";
						htmlLegenda+=html_stile;
						htmlLegenda+="</div>";
						
						// add the buttons to change the opacity of the layer
						// --------------------------------------------------
                        // TODO implements handling the layer opacity
                        // here it is quite difficult because a "layer" is on "OL layer",
                        // but is one layer of a multiple wms layer
						var html_opacitytools="<div id='ov_legend_item_tools_div'>";
						html_opacitytools+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityminus' onclick='open_viewer.map.setLayerOpacity(\""+OL_layer_name.trim()+"\",-0.1)' title='"+strings_interface.sentence_increasetransparency+"'>"
						html_opacitytools+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityplus' onclick='open_viewer.map.setLayerOpacity(\""+OL_layer_name.trim()+"\",0.1)' title='"+strings_interface.sentence_reducetransparency+"'>"
						html_opacitytools+="</div>";
						htmlLegenda+=html_opacitytools;
						
						htmlLegenda+="</div>";
						htmlLegenda+="</li>";
                    
					}
				break;

			} // switch (stato[ol_layer].tipo)
		} // else if(node.isGroup)
	}  

	return htmlLegenda;
}
/** Refresh the layers legend
 *  It is based on additional specific procedures to generate specific
 *  sections of the legend:
 *  - legendBuildLayerTree      (build the "tree" object with the structure of the legend, groups and layers)
 *  - legendBuildClientSideTree (uses the "tree" object to generate the HTMl, with different options)
 *  Basemap layers are processed directly inside this procedure
 */
openViewer.prototype.refreshLegend = function() {
ov_utils.ovLog('Start refreshLegend ...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var stato = this.getStato();
	
	a_layers_legenda=new Array();
	
	// build the legend tree
	this.legendBuildLayerTree();
	
	// define the section related to the "main layers"
	var htmlLegendaMainLayers = this.legendBuildClientSideTree(this.legendTree, null, null, 'main_layers');
	this.legendPanel.html("<ul class='layerslegend'>" + htmlLegendaMainLayers + "</ul>");
	
	// define the section related to the user WMS layers
	var htmlLegendaWMS = this.legendBuildClientSideTree(this.legendTree, null, null, 'wms_onthefly_layers');
	this.legendPanelWmsUserLayers.html("<ul class='layerslegend'>" + htmlLegendaWMS + "</ul>");
	
	// retrieve the OL Layers
	ol_layers=this.map.getMapLayers();
	
	// process basemap layers
	html_layers_list="";
	ol_layers.forEach(function(element,index,ar) {
		if(element.get('baselayer')) {       // only if it is a basemap layer
			if(element.get('visible')) {
				str_checked="checked=true";
			} else {
				str_checked="";
			}
			html_layers_list+="<li><input type='radio' class='legend_basemap_item' name='legend_basemap_item' id='"+element.get('name')+"' "+str_checked+" ><label for='"+element.get('name')+"'>&nbsp;"+element.get('name')+"</label></li>";
		}
	},this);
	    
	this.legendPanelBasemapLayers.html("<ul class='layerslegend'>"+html_layers_list+"</ul>");
ov_utils.ovLog(ol_layers,'List of refreshed layers'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	return false;
};
/** Show/Hide a layer (used for the "main layers" and "WMS on-the-fly layers")
 *  - update the "stato" variable
 *  - call "map.refreshStatus" to re-calculate all derived properties of the "stato" variable
 *  - call "map.refreshLayerVisibility" to really update the visibility of layers in the displayed map
 */
openViewer.prototype.showHideLayer = function(layer_name, flagShow) {
	var stato = this.getStato();
	
	// retrieve the "status" of the passed layer
	var ol_layer=this.getMainLayerNameBySubLayerName(layer_name);
	var ol_type=stato[ol_layer].tipo;
	if(ol_layer == false) { // it is a User WMS layer
		this.map.layerViewToggle(layer_name, flagShow);
	}
    else {
		var old_flagShow=stato[ol_layer].layers_info[layer_name]['visible'];
		if (flagShow==true) {
			stato[ol_layer].layers_info[layer_name]['visible']=true;
		} else {
			stato[ol_layer].layers_info[layer_name]['visible']=false;
		}
		this.setStato(stato);
		this.map.refreshStatus();
		if (stato[ol_layer].list_layer_visible!='') {
			// refresh the visibility of the passed layer and the map
			this.map.refreshLayerVisibility(ol_layer,ol_type);
		} else {
			// if it is the unique layer visible, it cannot be hidden
			stato[ol_layer].layers_info[layer_name]['visible']=old_flagShow;
			            
			this.setStato(stato);
			
			// rollback of the change of "status"
			this.map.refreshStatus();
			
			$("#"+layer_name).prop("checked",old_flagShow);
		}
	}
}
/** Show/Hide a group of layer (used for the "main layers" and "WMS on-the-fly layers")
 *  - update the "stato" variable
 *  - call "map.refreshStatus" to re-calculate all derived properties of the "stato" variable
 *  - call "map.refreshLayerVisibility" to really update the visibility of layers in the displayed map
 */
openViewer.prototype.showHideGroupLayers = function(group_name, flagShow) {
	    
	// retrieve the OL layer
	var ol_layer=this.getMainLayerNameBySubGroupName(group_name);
	if(ol_layer==false) {
        group_name = 'group_'+group_name;
		ol_layer=this.getMainLayerNameBySubGroupName(group_name);
	}
	
	// retrieve the "stato" of the passed group
	var stato = this.getStato();
	var ol_type=stato[ol_layer].tipo;
	old_flagShow=stato[ol_layer].groups_info[group_name]['visible'];
	
	// retrieve the name of the "group" to be toggled
    var real_group_name=group_name;
	if(ol_type=='wms_onthefly') real_group_name = real_group_name

	// update the "stato"
	if (flagShow==true) {
		stato[ol_layer].groups_info[group_name]['visible']=true;
	} else {
		stato[ol_layer].groups_info[group_name]['visible']=false;
	}
	this.setStato(stato);
	
	// update all derived variables in the "stato" variable
	// (layers_visible, layers_tooltip, ...)
	this.map.refreshStatus();
	
	// update the real visibility of layers
	// ------------------------------------
	// USUALLY: it is not possible to "hide" all the layers of a source
	//           at least one group must be visible
	// SPECIAL CASE: for the WMS loaded on the fly by the user (type wms_onthefly)
	//           this constraint is not valid
	if (stato[ol_layer].list_layers_visible!=''||stato[ol_layer].tipo=='wms_onthefly') {
		// refresh the visibility of the passed group and the map
		this.map.refreshLayerVisibility(ol_layer,ol_type);
	} else {
		// if it is the unique layer visible, it cannot be hidden
		stato[ol_layer].groups_info[group_name]['visible']=old_flagShow;
		
		// rollback of the change of "status"
		this.setStato(stato);
		this.map.refreshStatus();
		
		$("#"+group_name).prop("checked",old_flagShow);
	}
}
/** Show/Hide a custom WMS layer */
openViewer.prototype.userWmsLayerViewToggle = function(name, layer_name) {
	if ( $('#custom_wms_layer_checkbox_' + name).is(':checked') )
		this.map.layerViewToggle(layer_name, true);
	else
		this.map.layerViewToggle(layer_name, false);
}


/** INTERFACE - OTHER PROCEDURES
 * ------------------------------
 */

/** Update the footer box with the number od selected features */
openViewer.prototype.footerUpdateText = function() {
	var selectOverlay=this.map.getMapLayerByName('selection');
	var numeroFeature = selectOverlay.getSource().getFeatures().length;
	if (numeroFeature == 1)
		this.footerPanelInfoSelezione.html(numeroFeature + " " + strings_interface.feature_selected_statusbar);
	else
		this.footerPanelInfoSelezione.html(numeroFeature + " " + strings_interface.features_selected_statusbar);
}


/** TOOLS - NAVIGATION FUNCTIONS (ZOOM, ETC.)
 * ---------------------------------------------------------------
 */

openViewer.prototype.initialMapView = function() {          // refresh the view to the initial settings (center and scale)
// ov_utils.ovLog('Set the initial map view...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	this.map.getMapView().setCenter(this.map.initialView.center);
	this.map.getMapView().setZoom(this.map.initialView.zoom);
};
openViewer.prototype.previousMapView = function() {         // recall the previous view (zoom and scale) from the views history
ov_utils.ovLog('Previous map view...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	if(this.map.historyViewIndex > 0) {

		this.map.historyViewIndex--;
		var previousIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[previousIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[previousIndex].resolution);
		this.map.historyViewCaller='ZoomPrev';


	} else {
// ov_utils.ovLog('No previous map view'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	}
};
openViewer.prototype.nextMapView = function() {             // recall the next historical view (zoom and scale) from the views history
ov_utils.ovLog('Next map view'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	if(this.map.historyView.length-1 > this.map.historyViewIndex) {
		this.map.historyViewIndex++;
		var nextIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[nextIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[nextIndex].resolution);
		this.map.historyViewCaller='ZoomNext';
	
	} else {
// ov_utils.ovLog('No next map view'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	}
};
openViewer.prototype.zoomIn = function() {                  // cantered zoomin (+1 zoom level)
ov_utils.ovLog('Zoom in...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	//this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()+1);
    this.map.historyViewCaller='ZoomIn';
}
openViewer.prototype.zoomOut = function() {                 // centerd zoomout (-1 zoom level)
ov_utils.ovLog('Zoom out...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	//this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()-1); 
    this.map.historyViewCaller='ZoomOut';
}
openViewer.prototype.zoomToView = function(x,y,scale) {     // Set the current view (center coordinates, based on data projection, and scale, in map units)
	this.map.setCenterProjected(x, y, this.map.dataProjection);
	this.setMapScale(scale);
};


/** TOOLS - MAP INTERACTION (SELECTION, MESURE)
 * ---------------------------------------------------------------
 */

/** Toggle the interaction status (handling of the user click over the map) */
openViewer.prototype.toggleToolStatus = function(toolname) {
	$(".tool-on-off").removeClass("active");
	this.toolbarPanelMeasure.removeClass("group");
	switch (toolname) {
		case "zoom_selection":
			this.map.setStatusInteraction("zoom_selection");

            this.toolbarPanelZoomSelection.addClass("active");
			this.map.map.removeInteraction(this.map.extraInteractions.select);
			this.map.map.removeInteraction(this.map.extraInteractions.draw);
			this.map.map.removeInteraction(this.map.extraInteractions.snap);
			this.map.map.removeInteraction(this.map.extraInteractions.measure);
			this.map.map.addInteraction(this.map.extraInteractions.zoom_selection);
			this.map.historyViewCaller='ZoomRectangle';
			
		break;

		case "pan":
			this.map.setStatusInteraction("pan");

            this.toolbarPanelCursorMove.addClass("active");
			this.map.map.removeInteraction(this.map.extraInteractions.select);
			this.map.map.removeInteraction(this.map.extraInteractions.zoom_selection);
			this.map.map.removeInteraction(this.map.extraInteractions.draw);
			this.map.map.removeInteraction(this.map.extraInteractions.snap);
			this.map.map.removeInteraction(this.map.extraInteractions.measure);
		break;

		case "select":
			this.map.setStatusInteraction("select");

            this.toolbarPanelCursorSelect.addClass("active");
			this.map.map.removeInteraction(this.map.extraInteractions.zoom_selection);
			this.map.map.removeInteraction(this.map.extraInteractions.measure);
			// the TimeOut function is necessary because of a bug of OpenLayers (when the user double clicks to end drawing, the interaction DoubleClickZoom is fired)
			setTimeout($.proxy(function () {this.map.map.removeInteraction(this.map.extraInteractions.draw);},this),300);
			this.map.map.removeInteraction(this.map.extraInteractions.snap);
  			//this.map.map.addInteraction(this.map.extraInteractions.select);
			this.map.historyViewCaller='ZoomSelectPan';
		break;

		case "draw":
			this.map.setStatusInteraction("draw");
						
			//this.toolbarPanelCursorSelect.addClass("active");
			this.map.map.removeInteraction(this.map.extraInteractions.select);
			this.map.map.removeInteraction(this.map.extraInteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extraInteractions.draw);
			this.map.map.removeInteraction(this.map.extraInteractions.measure);
		break;

		case "measure_line":
			this.map.setStatusInteraction("measure_line");
			
			this.toolbarPanelMeasureLine.addClass("active");
			this.toolbarPanelMeasure.addClass("group");
			this.map.map.removeInteraction(this.map.extraInteractions.select);
			this.map.map.removeInteraction(this.map.extraInteractions.draw);
			this.map.map.removeInteraction(this.map.extraInteractions.snap);
			this.map.map.removeInteraction(this.map.extraInteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extraInteractions.measure_line);
		break;

		case "measure_area":
			this.map.setStatusInteraction("measure_area");
			
			this.toolbarPanelMeasureArea.addClass("active");
			this.toolbarPanelMeasure.addClass("group");
			this.map.map.removeInteraction(this.map.extraInteractions.select);
			this.map.map.removeInteraction(this.map.extraInteractions.draw);
			this.map.map.removeInteraction(this.map.extraInteractions.snap);
			this.map.map.removeInteraction(this.map.extraInteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extraInteractions.measure_line);
		break;
		default:

		break;
	} 
}
/** Callback of an "add to" current selection of features
 *  - response contains the features selected (in GeoJSON format)
 *  - layer_name is the layer of the selected features
 */
openViewer.prototype.addFeaturesToSelection = function(response, infoFormat, layer_name, flag_new_selection, flag_show_attributes, flag_show_attribute_of_last_selected_only, flag_last_layer_to_process) {
	if(typeof flag_new_selection == 'undefined') flag_new_selection = false;
	if(typeof flag_show_attributes == 'undefined') flag_show_attributes = false;
	if(typeof flag_show_attribute_of_last_selected_only == 'undefined') flag_show_attribute_of_last_selected_only = false;
	var that = open_viewer; // as "this" does not work because it is a callback from another class
	var stato = that.getStato();
	var responseType = infoFormat;
	
ov_utils.ovLog('****************************************');
ov_utils.ovLog('Layer name: '+layer_name+'\ntype of data to be processed: '+responseType, 'ADD FEATURE TO SELECTION');
ov_utils.ovLog('****************************************');
	
	switch (responseType) {
		case 'text/plain':
			// in this case, it is not possible to retrive the geographical object from the response/string,
			// and, optionally, add to the current selection; then
			// - we clear the selection
			// - we show only the information of this layer
ov_utils.ovLog(response.query_url,'url','consolelog'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
			
			if(flag_new_selection) {
				// retrieve the layer of the selected features
				var selectOverlay=that.map.getMapLayerByName('selection');
				// clear the layer of the selected features
				selectOverlay.getSource().clear();
				// refresh the footer message with the number of selected features
				that.footerUpdateText();
			}
			
			// optionally retrieve and show the attributes information of the selected features
			if(flag_show_attributes) {
				var layer_title = that.getSubLayerStatoByFeature(layer_name).legend_label; // the "stato" ID equals the name of the OL layer
				var layer_type = that.getStato()[layer_name].tipo;
				that.showFeaturesAttributes (response.datatext, layer_title, layer_type, flag_last_layer_to_process);
			}
			
		break;
		        
		default: // text/javascript
			var geojsonFormat = new ol.format.GeoJSON();
			
			// get the selected features ("response" is a geoJson object)
			features=geojsonFormat.readFeatures(response,{dataProjection: that.map.dataProjection,featureProjection: that.map.mapProjection});
			
			// retrieve the layer where "copying" the selected features (to be highlighted)
			var selectOverlay=that.map.getMapLayerByName('selection');
			
			// optionally clear the previous selection
			if(flag_new_selection) selectOverlay.getSource().clear();
			
			// add the features selected to the ones already selected
			if(features.length > 0) {
				// TODO We should check if the feature is already included in the previous selection (to avoid doubling it)
				selectOverlay.getSource().addFeatures(features);
			}
	
			// optionally retrieve and show the attributes information of the selected features
			if(flag_show_attributes) {
				if(flag_show_attribute_of_last_selected_only) that.showFeaturesAttributes (features,layer_name,'',flag_last_layer_to_process)
				else that.showFeaturesAttributes (selectOverlay.getSource().getFeatures(),layer_name,'',flag_last_layer_to_process)
			}
			
			// refresh the footer message with the number of selected features
			that.footerUpdateText();
			
		break;
    }
	
	
	
}
/** Display the "features attributes" on the "query result" page
 *  - if the parameter "features" is undefined, the information of all selected features are processed and displayed
 *  - if one or more feature are passed as parameter, the information of those features are displayed
 */
openViewer.prototype.showFeaturesAttributes = function(features, layer_name, layer_type, flag_last_layer_to_process) {
    var that = open_viewer;
	
	// special case, the function is called without a valid parameter
	// then show the attributes of all currently selected features (if any)
	if(typeof features == 'undefined') {
		var selectOverlay = that.map.getMapLayerByName('selection');
		var features = selectOverlay.getSource().getFeatures();
	}
	
	var typeFeatures = (typeof features);
	
	// fill the info results page with the information contained in the parameter "features"
	var html='';
	switch(typeFeatures) {
		case 'string':
			if(features!=undefined&&features!='') {
				
				var isHTML = false;
				
				// parse the string
				var chkmatch = features.match(/\r\n|\r|\n/g);
				if(chkmatch!=null&&chkmatch!=undefined&&chkmatch.length > 0) {				// the string already contains cr or lf
					// nothing to do
				} else {
					chkmatch = features.match(/\<br\>|\<p\>/g);
					if(chkmatch!=null&&chkmatch!=undefined&&chkmatch.length > 0) {			// the string is HTML
						isHTML = true;
					} else {
						chkmatch = features.match(/;/g);
						if(chkmatch!=null&&chkmatch!=undefined&&chkmatch.length > 0) {		// the string contains ';', the we split on it
							features = features.replace(/;/g,'\r\n');
						} else {
							chkmatch = features.match(/,/g);
							if(chkmatch!=null&&chkmatch!=undefined&&chkmatch.length > 0) {	// the string contains ',', the we split on it
								features = features.replace(/,/g,'\r\n');
							}
						}
					}
				}
					
				// WARNING: the variable "response", even if nothing is selected, not always is blank
				
				//html+='<br><h1 class="page_container">'+layer_type+' '+strings_interface.word_layer+' '+layer_name+'</h1>'; // strings_interface.word_feature
				html+='<br><h1 class="page_container">'+layer_type+' '+layer_name+'</h1>';
				if(isHTML) 
					html+='<p class="page_container">'+features+'</p>';
				else {
					html+='<p class="page_container"><pre>'+features+'</pre></p>';
				}
			}   
		break;
		
		default:
			// here it is assumed that the type of the "features" parameter is really "features"
			if(features.length > 0) {
				
				html+='<p class="page_container">'+strings_interface.sentence_foundfeatures+' : '+features.length+' '+strings_interface.word_in.toLowerCase()+' '+layer_name.toUpperCase()+'</p>';
				for(var i=0;i<features.length;i++) {
					var ol_ID = features[i].getId();
					var feature_type = features[i].getGeometry().getType();
					var layer_name = ol_ID.split('.')[0]; // here get the layer name from the feature iD, without taking into account the parameter passed to the function
					layer_name = that.getSubLayerStatoByFeature(layer_name).legend_label;
					var feature_ID = ol_ID.substring(layer_name.length+1);
					
					html+='<br><h1 class="page_container">'+feature_type+' ('+feature_ID+') '+strings_interface.word_layer+' '+layer_name+'</h1>'; // strings_interface.word_feature
					
					// retrieve the feature attributes
					properties=features[i].getProperties();
					
					// format the attributes
					html+=ov_utils.createElementsFromJSON(properties);
				}
			}
		break;
	}
	
	// add the information related to the current feature to the global variable
	that.htmlFeaturesInfo+=html;
	
	// refresh the info results page - query results (if it is the last layer to be processed)
	if(flag_last_layer_to_process) {
		setTimeout(function(){
			$("#ov_info_wms_container").html(that.htmlFeaturesInfo); 
			that.loadInfoPage('tabQueryResult',that.infoPanel); // this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
			if (that.titleToggleInfo.hasClass("active")) {that.toggleInfo(0);} // OVD strange behviour
		}, that.timeout_RefreshFeaturesAttributesInfo);
	}
}
/** Format and display the feature attributes information (callback after CTRL+click or after holding tap) */
openViewer.prototype.openInfo = function(response) {
ov_utils.ovLog('Start...','OpenInfo'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();
    
	// response is a geoJson object
	features=geojsonFormat.readFeatures(response,{dataProjection: this.map.dataProjection, featureProjection: this.map.mapProjection});

	if(features.length > 0) {
		//Per generare l'hyperlink mi prendo solamente la prima feature dell'array
		feature=features[0];

		// retrieve the layer name
		fid=feature.getId();

		a_fid=fid.split(".");
		var nome_feature=a_fid[0];
		var id_feature=a_fid[1];

		var layer_name=this.getSubLayerStatoByFeature(nome_feature);
		var ol_layer=this.getMainLayerNameBySubLayerName(layer_name);
		
		// retrieve the feature attributes
		properties=feature.getProperties();

		// add to the properties the feature ID
		// if properties.id doesn't exist, add a default one, and set it as primary_key (useful only if "Expose primary keys" is not exposed in the data store)
		if ( typeof properties.id == "undefined" ) {
				properties.id=id_feature;
		}

		this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
		var html = ov_utils.createElementsFromJSON(properties);

		setTimeout(function(){$("#ov_info_wms_container").html(html);}, 500);
		this.titleToggleInfo.addClass("active");
ov_utils.ovLog('... completed.','OpenInfo'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	}
}
/** Additional function to manage the "measure line" and "measure area" interactive tools */
openViewer.prototype.measure = function(type, callback_function){
	if(type == 'measure_line'){
		this.toggleToolStatus("measure_line");
		this.map.measure('line',callback_function);
	}
	else{
		this.toggleToolStatus("measure_area");
		this.map.measure('area',callback_function);
	}
}
/** Clear all "service" layers or one of them, and optionally cancel the features selection */
openViewer.prototype.clearTempLayers = function(layers_names, flag_clear_service_layers, flag_cancel_selection) {
	if (typeof flag_clear_service_layers == 'undefined') {flag_clear_service_layers=true;}
	if (typeof layers_names !== 'undefined') {
		var a_layers_names=layers_names.split(",");
		for (var i=0;i < a_layers_names.length;i++) {
			this.map.clearTempLayers(a_layers_names[i],flag_clear_service_layers,flag_cancel_selection);
		}
	} else {
		this.map.clearTempLayers(undefined,true,flag_cancel_selection);
	}
	$("#ov_info_wms_container").html('');
};


/** OTHER PROCEDURES
 * ---------------------------------------------------------------
 */

/** Return the settings of the main layers ("stato") */
openViewer.prototype.getStato = function() {
	return this.map.getStato();
};
/** Set the settings of the main layers ("stato") */
openViewer.prototype.setStato = function(stato) {
	return this.map.setStato(stato);
};
/** Return the current range scale */
openViewer.prototype.getCurrentRange = function (ranges) {
	var currentRange = null;
	var currentScale=this.getMapScale();
	if (ranges.length > 0) {
		for(var i=0;i < ranges.length; i++) {
			if (parseInt(ranges[i].min_scale) <= parseInt(currentScale) && parseInt(ranges[i].max_scale) > parseInt(currentScale)) {
				currentRange=ranges[i];
			}
		}
	} 
	
	return currentRange;
}
/** Open/Close a DIV by adding/removing the classes "hide" or "show" */
openViewer.prototype.openCloseDiv = function(div){
	var div = $('#'+div);
	if ( div.is(':visible') ){
		div.removeClass('show').addClass('hide');
	}
	else{
		div.removeClass('hide').addClass('show');
	}
}




/** CLASS: ovLegendTreeItem (used with layers provided by MAPGUIDE)
 * ----------------------------------------------------------------
 */
var ovLegendTreeItem = function(name, isGroup, tObject, layerData) { // Create an object TreeItem
	this.name = name;
	this.isGroup = isGroup;
	this.tObject = tObject;
	this.layerData = layerData;
	if(isGroup)
		this.children = new Array();
	else
		this.children = null;
	this.parent = null;
	this.parentName=null;
};
ovLegendTreeItem.prototype.Attach = function(child) { // Add a child to a TreeItem
	if(this.children == null)
		this.children = new Array();

	this.children.push(child);
};


