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
// if(this.showConsoleMsg) console.log("openViewer parameters: ",params);

	this.name = params.name;
	
	// service variables
	this.timeout_SaveHistory_Zoom = 300;
	this.timeout_SaveHistory_Pan = 1000;
	
	this.correctionOffsetScaleMax = 0.00000001; // correction offset used to solve potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
	this.correctionOffsetScaleMin = 0;          // correction offset used to solve potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
	
	this.leftPanelMinWidth = 270;
	this.rightPanelMinWidth = 300;
	
	// main interface components
	this.container					= $("#" + params.components.container.div);
	
	this.titleDiv					= $("#" + params.components.title.div);
	this.titleToggleInfo			= $("#" + params.components.title.toggleInfo);
	
	this.footerPanel 				= $("#" + params.components.footer.panel);
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
	
	this.internalWmsURL				= params.components.wms.wmsInternalUrl;
	
	this.timeoutId=-1;
	this.timeoutIdChangeView=-1;
	
	this.legendTree = undefined;
	
	this.lockWheel=false;
	this.startPixel=undefined;
	this.stato = params.stato;	// "stato" inherits the "map_definition" object defined in the PHP configuration
								// and contains the definition of the "main layers" (all layers but the basemap layers and the user WMS layers)
	
	// variable to handle the HELP (created with Bootstrap Tour)
	this.tour=null;
	
	// number of pixel used as buffer for the touch events
	this.touchBuffer=15;
	
	// handling of the User WMS layers
	this.userWmsLayersList = null; // list of WMS layers returned by the AJAX call
	this.userWmsURL = null;        // URL of the WMS called
	this.userWmsFormats = null;    // array of the formats supported by the WMS server
	
	// varaible to handle the proxy (can be empty)
	this.ProxySet = params.proxy;
    
    // show console messages
    this.showConsoleMsg = params.flagConsMsg;
	
	// CREATION OF THE OPENLAYERS MAP OBJECT
    // -------------------------------------
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
// if(this.showConsoleMsg) console.log('Map parameters (mapParams):', mapParams);

    // creation of the map    
	this.map = new ovMap( mapParams );
	
	// this.initPanels();
	// this.ev_window_resize();
	
	// EVENTS HANDLING
	// -------------------------------
	// event: resize of the window
	$(window).on("resize","",$.proxy(this.ev_window_resize,this));
	
	// event: back and forward of the info pages
	$(window).on("popstate","",$.proxy(this.ev_pop_state,this));
	
	//event: manual change of the scale (clicking on the text box of the scale)
	this.footerPanelScala.on("click",'',$.proxy(this.ev_footer_scala_click,this));
	
	// event: open/close the legend sub-panels
	//this.legendPanel.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));
	//this.legendPanel.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this));
	
	//this.legendPanel.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));
	//this.legendPanel.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this));
	
	//this.editLegendPanel.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));
	//this.editLegendPanel.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this));
	
	this.legendPanelContainer.on("click", ".legend_toggle_container", $.proxy(this.ev_legend_buttonopenclose_click,this)); //ov_legend_title
	
	// event: show/hide a layer (clicking on the checkboxes)
	this.legendPanel.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this)); // Main layers (MapGuide, default WMS)
	this.legendPanel.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this)); // Main layers (MapGuide, default WMS)
	
	this.legendPanelWmsUserLayers.on("click",".legend_item",$.proxy(this.ev_legenda_layer_checkbox_click,this)); // User WMS layers
	
	this.legendPanelWMS.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this)); // internal WMS layer
	this.legendPanelWMS.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this)); // internal WMS layer
	
	this.legendPanelWMS.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));   // internal WMS layer
	this.legendPanelWMS.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this)); // internal WMS layer
	
	this.legendPanelWMS.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));   // internal WMS layer
	this.legendPanelWMS.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this)); // internal WMS layer
	
	// event: select the basemap layer
	this.legendPanelBasemapLayers.on("click",".legend_basemap_item",$.proxy(this.ev_legend_basemap_click,this));
	
	// event: load a new page inside the div of the information (instead of opening in a new window)
	this.infoPanelQuery.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelSearch.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelCustom.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelAppInfo.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelHelp.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelwmsGETFeature.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	
	// event: handling of the form "submit" inside a page
	this.infoPanelQuery.on("submit","form",$.proxy(this.ev_info_page_submit_form,this));
	
	// event: close the panel to search and add User WMS layers
	this.buttonCloseWMSContainer.on("click", $.proxy(this.ev_wmsadd_page_close_click,this));
	
	// event: SimpleModal
	$(document).on("click","#simplemodal-container a",$.proxy(this.ev_simplemodal_href_click,this));
	
	///TODO add here the additional events
	
// if(this.showConsoleMsg) console.log("openViewer END");
};


/** PROPERTIES GENERAL (get/set/is)
 * ---------------------------------------------------------------
 */

/** Return the current scale */
openViewer.prototype.getMapScale = function() {                 
	return this.map.getScale();
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


/** PROPERTIES - MAPGUIDE, DEFAULT WMS  (get/set/is)
 * ---------------------------------------------------------------
 */

/* OVD CURRENTLY UNUSED: getMapGuideLayersNamesByIDs (return an array of the names of the layers served by MapGuide - used also by LibViewer.js)
openViewer.prototype.getMapGuideLayersNamesByIDs = function(arrayID) {
	var stato = this.getStato();

	var lys= new Array();
	// check the type for each "main layer" (MapGuide, default WMS)
	for (var i=0;i<arrayID.length;i++) {
		layers=stato['mapguide'].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {

			if(layers[a_layers_info[j]].id==arrayID[i]) {
				// found
				lys.push(layers[a_layers_info[j]].name);
			}
		}
	}

	return lys;
}
*/
/* OVD CURRENTLY UNUSED: getMapGuideVisibleLayersNames (return an array of the names of the layers served by MapGuide and visible at the current scale - used also by LibViewer.js)
openViewer.prototype.getMapGuideVisibleLayersNames = function(a,b) {
	var stato = this.getStato();
	var ol_layer="mapguide";
// 
	var list_visible_layers=stato[ol_layer].list_layers_visible;
// 	console.log(stato[ol_layer]);
	if (list_visible_layers.indexOf(',') > -1){
		var single_layer = list_visible_layers.split(",");
		var visible_layer_array = [];
		for(var i = 0; i < single_layer.length; i++){
			var layer_id = single_layer[i];
			
			var layer_name = stato[ol_layer].layers_info[layer_id].name;
// 			console.log(layer_name);
				var currentRange = this.getCurrentRange(stato[ol_layer].layers_info[layer_id].ranges);
			if (currentRange!=null){
				var single_visible_layer=[];
				single_visible_layer.name=layer_name;
				visible_layer_array.push(single_visible_layer);
			}
		}
	}
	return visible_layer_array;
}
*/
/* OVD CURRENTLY UNUSED: getMainLayerByName (retrieve a "main layer" - from MapGuide, default WMS - by its name)
openViewer.prototype.getMainLayerByName = function(layer_name) {
	var stato = this.getStato();
	
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, default WMS)
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
*/
/* OVD CURRENTLY UNUSED: getMainLayerNameByFeature (retrieve a "main layer" - from MapGuide, default WMS - by its feature name)
openViewer.prototype.getMainLayerNameByFeature = function(feature_name) {
	var stato = this.getStato();
    
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, default WMS)
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].feature_name==feature_name) {
				// found
				return a_layers_info[j];
			}
		}
	}
	
	// if it is not found
	return false;
}
*/
/* OVD CURRENTLY UNUSED: getMainLayerByGroup (retrieve a "main layer" - from MapGuide, default WMS - by its group name)
openViewer.prototype.getMainLayerByGroup = function(group_name) {
	var stato = this.getStato();
    
	var a_ol_layers=Object.keys(stato);
	// check the type of each "main layer" (MapGuide, default WMS)
	for (var i=0;i<a_ol_layers.length;i++) {
		groups=stato[a_ol_layers[i]].groups_info;
		var a_groups_info=Object.keys(groups);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_groups_info.length;j++) {
			if(a_groups_info[j]==group_name) {
				// found
				return a_ol_layers[i];
			}
		}
	}
	
	// if it is not found
	return false;
}
*/


/** INITIALIZATION OF THE APP
 * ---------------------------------------------------------------
 * - initialization of the panels
 * - load the initial map
 */

/** Initialization of the panels */
openViewer.prototype.initPanels = function(flagRightPanelActive) {
// if(this.showConsoleMsg) console.log("initPanels");
	
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
// if(this.showConsoleMsg) console.log('loadMap');
	this.map.LoadMap();
	// write the initial scale
	this.setMapScale(this.getMapScale());
	this.refreshLegend();
};
/** Initialization of the handled events "on the map" (these must by initialized after the "map" initialization */
openViewer.prototype.addEvents = function() {
// if(this.showConsoleMsg) console.log('Set the map events handled by the application...');
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


/** EVENTS - GENERAL FUNCTIONALITIES OF THE APP INTERFACE
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

	setTimeout(function() {this_viewer.map.updateMapSize();}, 200);
	
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
// if(this.showConsoleMsg) console.log('VIEW CHANGE EVENT',event.key);
	switch (event.key) {
		case 'resolution':
			clearTimeout(this.timeoutIdChangeView);
// console.log'view change '+event.key);
			this.timeoutIdChangeView = setTimeout($.proxy(function() {

				var scala=this.map.getScale();
				this.refreshLegend();
				this.footerPanelScala.html("1:"+Math.round(scala));

				this.map.saveViewHistory();
			
			},this), this.timeout_SaveHistory_Zoom, false);
				
			
		break;
		case 'center':
			clearTimeout(this.timeoutIdChangeView);
// console.log'view change '+event.key);
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
	
// 	this.vistasuPanelContainer.toggle("slide",500);
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
	
// 	this.infoPanelContainer.toggle().css('left','').css('width','');
	this.titleToggleInfo.toggleClass("active");
	//this.infoPanelContainer.animate({width:'toggle'}, transition_time).css('left','');
	
	// force the call to fix_css_left_info_panel because of bugfix IE
	var panel_width=this.infoPanelContainer.width();
	this.infoPanelContainer.animate({width:'toggle'}, transition_time,"swing",function(){that.fix_css_left_info_panel(panel_width);}).css('left','');
}
/** Specifi routine to fix a IE bug */
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
//console.log($(element).hasClass('no-overwrite-href'));
	//&& !element.href.match(/proxyfile/g) 
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('tabQueryResult',element.href);
	} else {
// console.log("default case...");
	}
};
/** Close a modal window */
openViewer.prototype.ev_simplemodal_href_click = function(event) {
	var element = event.currentTarget;
    // if the link points to a php page, we load it into the div, otherwise no
//console.log($(element).hasClass('no-overwrite-href'));
	//&& !element.href.match(/proxyfile/g) 
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('tabQueryResult',element.href);
		// if the click happens in a modal window, this page is closed
		if (typeof ($.modal) !== "undefined") {;
			$.modal.close();
		}
	} else {
// console.log("default case...");
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
//console.log("defaul case...");
		element.submit();
	}
	return false;
};
/** Manual scale change by typing a number (integer) on the footer scale */
openViewer.prototype.ev_footer_scala_click = function(event) {
// if(this.showConsoleMsg) console.log('FOOTER SCALE CLICK EVENT')
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
/** Show/Hide a layer (different from the basemap layer) */
openViewer.prototype.ev_legenda_layer_checkbox_click = function(event) {
	var element = event.target;
	var id=$(element).attr("id");
// console.log(id);
	this.showHideLayer(id, $(element).is(":checked"));
};
/** Show/Hide a group of layer (different from the basemap layer) */
openViewer.prototype.ev_legenda_group_checkbox_click = function(event) {
	var element = event.target;
	var id = $(element).attr("id");
// 	console.log(id);
	this.showHideGroupLayers(id, $(element).is(":checked"));
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
/** Open the dialog to add custom WMS layer */
openViewer.prototype.ev_wmsadd_page_close_click = function(){
	if (this.editWMSBackground.hasClass("show")) {
		this.editWMSBackground.removeClass('show').addClass('hide');
		this.editWMSContainer.removeClass('show').addClass('hide');
	}
	else{
		this.editWMSBackground.removeClass('hide').addClass('show');
		this.editWMSContainer.removeClass('hide').addClass('show');
	}
}


/** EVENTS - HANDLING OF "MAIN LAYERS" ON THE LEGEND (MAPGUIDE, DEFAULT WMS)
 * ---------------------------------------------------------------
 */

/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION */
openViewer.prototype.ev_legenda_plus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).show();
	$(element).removeClass("plus").addClass("minus");

	var ol_layer=this.getMainLayerByGroup(id);
	stato[ol_layer].groups_info[id]['expanded']=true;
	
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION */
openViewer.prototype.ev_legenda_minus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).hide();
	$(element).removeClass("minus").addClass("plus");
	
	var ol_layer=this.getMainLayerByGroup(id);
	stato[ol_layer].groups_info[id]['expanded']=false;
	
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION */
openViewer.prototype.ev_legenda_plus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#stile_"+id.replace(':','\\:')).show();
	$(element).removeClass("plus_stile").addClass("minus_stile");

	var ol_layer=this.getMainLayerByName(id);
	stato[ol_layer].layers_info[id]['expanded']=true;
	
	this.setStato(stato);
};
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION */
openViewer.prototype.ev_legenda_minus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#stile_"+id.replace(':','\\:')).hide();
	$(element).removeClass("minus_stile").addClass("plus_stile");
	
	var ol_layer=this.getMainLayerByName(id);
	stato[ol_layer].layers_info[id]['expanded']=false;
	
	this.setStato(stato);
};


/** EVENTS - USER INTERACTION WITH THE MAP
 * ---------------------------------------------------------------
 * - mouse down/move/up
 * - features selection
 */

/** Mouse-up reset the general app status after a mouse-down */
openViewer.prototype.ev_map_mouse_up = function(event) {
if(this.showConsoleMsg) console.log('MAP MOUSE UP EVENT')    
	clearTimeout(this.timeoutId); 
	this.startPixel = undefined; 
};
/** Mouse-move set the startPixel variable */
openViewer.prototype.ev_map_mouse_move = function(event) {
// if(this.showConsoleMsg) console.log('MAP MOUSE MOVE EVENT')    
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
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION - Mouse-down, retrieve information about the "clicked object" */
openViewer.prototype.ev_map_mouse_down = function(event) {
// if(this.showConsoleMsg) console.log('MAP MOUSE DOWN EVENT',event);
	event.preventDefault();
	clearTimeout(this.timeoutId);

	var this_viewer = this;
	var stato = this.getStato();

	var eventType = event.type;

	this.startPixel = this.map.map.getEventPixel(event);

	event.coordinate = this.map.map.getCoordinateFromPixel(this.startPixel);
	this.timeoutId = setTimeout($.proxy(function() { 
		//Sui dispositivi abilitati alla vibrazione
		var canVibrate = "vibrate" in navigator || "mozVibrate" in navigator;
		if (canVibrate && !("vibrate" in navigator)) {
			navigator.vibrate = navigator.mozVibrate;
		}
			
		if (canVibrate) {
			// vibrate for 50 ms
			navigator.vibrate(50);
		}
		
		var a_ol_layers=Object.keys(stato);
		for(var i=0; i<a_ol_layers.length; i++){
			//var ol_layer=a_ol_layers[0];
			var ol_layer=a_ol_layers[i];

			//var ol_layer=a_ol_layers[0];
			var source=this.map.getMapLayerSourceByName(ol_layer);

			//if(stato[ol_layer].list_layers_hyperlinked!='') {
			if(false) {
				switch(ol_layer) {
					case "wms_geoserver":
						if(eventType=='mousedown') {
							var url = source.getGetFeatureInfoUrl(
								event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
								{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_hyperlinked, 'format_options': 'callback:parseResponse'}
							);
						} else {
							var url = source.getGetFeatureInfoUrl(
								event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
								{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_hyperlinked, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponse'}
							);
						}

						$.ajax({
							url: url,
							dataType: 'jsonp',
							jsonpCallback: 'parseResponse'
						}).then(function(response) { this_viewer.openInfo(response); });

					break;
					case "mapguide":
						var mapguide_coordinate = ol.proj.transform(event.coordinate, this.map.mapProjection,this.map.dataProjection);

						var view = this_viewer.map.getMapView();
						var resolution = view.getResolution();

						if(eventType=='mousedown') {
							var bufferPx=5;
						} else {
							var bufferPx=this.touchBuffer;
						}

						var buffer=resolution*bufferPx;

						var x1=mapguide_coordinate[0] - buffer;
						var x2=mapguide_coordinate[0] + buffer;
						var y1=mapguide_coordinate[1] - buffer;
						var y2=mapguide_coordinate[1] + buffer;

						var geom="POLYGON(("+x1+" "+y2+","+x2+" "+y2+","+x2+" "+y1+","+x1+" "+y1+","+x1+" "+y2+"))";

						var a_layers_hyperlinked=stato[ol_layer].list_layers_hyperlinked.split(",");


						if (a_layers_hyperlinked.length > 0) {
							var a_layernames=new Array();

							for(var i=0;i<a_layers_hyperlinked.length; i++) {
								a_layernames.push(stato[ol_layer].layers_info[a_layers_hyperlinked[i]].name);
							}

							var layernames=a_layernames.join();
							data2send={
								action:"GET_TOOLTIP_HYPERLINK",
								mapName:stato[ol_layer].mg_session_info.mapName,
								mapSession:stato[ol_layer].mg_session_info.mapSession,
								layers:layernames,
								geometry:geom,
								maxfeatures:"1"
							};


							$.ajax({
								url: stato[ol_layer].api_url,
								method: 'POST',
								dataType: 'json',
								data: data2send,
								error: function(a, b, c) {
									console.log("GET_TOOLTIP_HYPERLINK() - ERROR");
								},
								success: function(response) {
									if(response.status=="ok") {
										if(response.data.hyperlink!='') {
											
											if(response.data.hyperlink.match(/getCoords/g)){
												var data='&x='+event.coordinate[0]+'&y='+event.coordinate[1];
												response.data.hyperlink +=data;
												
											}
											this_viewer.loadInfoPage('tabQueryResult',response.data.hyperlink,true);

											// if the layer is hidden, it is toggled to visible
											this_viewer.infoPanelContainer.show(500);
// 											this_viewer.titleToggleInfo.addClass("active");
										}
									}
								}
							});
						}
					break;
				}
			}       
		}
	},this), 300, false); 
};
/** OVD CURRENTLY UNUSED - MAIN LAYERS (MAPGUIDE, DEFAULT WMS) INTEGRATION - Selection of geographical features */
openViewer.prototype.ev_map_select = function(event) {
//if(this.showConsoleMsg) console.log('MAP SELECT EVENT',this.map.getStatusInteraction())
	event.preventDefault();
	switch (this.map.getStatusInteraction()) {
		case "draw":
		case "measure_line":
		case "measure_area":
			//Do nothing
		break;
		default:
			var stato = this.getStato();

			var this_viewer = this;
			
			var pointerType = event.originalEvent.pointerType;
			
			var ctrlKeyPressed = event.originalEvent.ctrlKey;
			var shiftKeyPressed = event.originalEvent.shiftKey;
			
			
			// the selection takes into account only the first OL layer (of the "main layers" defined inside "stato")
			var a_ol_layers=Object.keys(stato);
			// start looping over the "main layers"
			for(var i=0; i<a_ol_layers.length; i++){

				//var ol_layer=a_ol_layers[0];
				var ol_layer=a_ol_layers[i];
				var source=this.map.getMapLayerSourceByName(ol_layer);
				
				// selection: it is always executed (even after a CTRL-click)
				if(stato[ol_layer].list_layers_selectable!='') {
				
					switch(ol_layer) {
						case "wms":
							var array_layers = stato[ol_layer].list_layers_hyperlinked.split(",");
							var list_name_hyperlinked='';
							for(var j=0; j < array_layers.length; j++){
								var name_layer = stato[ol_layer].layers_info[array_layers[j]].name; 
									list_name_hyperlinked = name_layer + "," + list_name_hyperlinked;

							}   
							var name_length = parseInt(list_name_hyperlinked.length)-1;
							var list_name_trunk = list_name_hyperlinked.substring(0,name_length);
						
							if(!shiftKeyPressed) {
								if(pointerType=='mouse') {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
									
								}

								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) { this_viewer.getWMSlayerSelection(response); });
							} else {
								if(pointerType=='mouse') {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': list_name_trunk, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
								}
								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) { this_viewer.mapAddFeatureSelection(response); });
							}
						break;

						case "wms_geoserver":
							// if the key "SHIFT" is held, we add to the existing selection, otherwise we start a new selection
							if(!shiftKeyPressed) {
								if(pointerType=='mouse') {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_selectable, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_selectable, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
									
								}
							
								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) { this_viewer.getWMSlayerSelection(response); });
							} else {
								if(pointerType=='mouse') {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_selectable, 'format_options': 'callback:parseResponseSelect'}
									);
								} else {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_selectable, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponseSelect'}
									);
								}
								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponseSelect'
								}).then(function(response) { this_viewer.mapAddFeatureSelection(response); });
							}
						break;
						
						case "mapguide":
							
							// the selection is performed if the key CTRL has not been pressed
							if(!ctrlKeyPressed) {
							
								var mapguide_coordinate = ol.proj.transform(event.coordinate, this_viewer.map.mapProjection,this_viewer.map.dataProjection);

								var view = this_viewer.map.getMapView();
								var resolution = view.getResolution();
								
								if(pointerType=='mouse') {
									var bufferPx=5;
								} else {
									var bufferPx=this.touchBuffer;
								}

								var buffer=resolution*bufferPx;

								var x1=mapguide_coordinate[0] - buffer;
								var x2=mapguide_coordinate[0] + buffer;
								var y1=mapguide_coordinate[1] - buffer;
								var y2=mapguide_coordinate[1] + buffer;
								
								var geom="POLYGON(("+x1+" "+y2+","+x2+" "+y2+","+x2+" "+y1+","+x1+" "+y1+","+x1+" "+y2+"))";
								var a_layers_selectable=stato[ol_layer].list_layers_selectable.split(",");

								if (a_layers_selectable.length > 0) {
									var a_layernames=new Array();

									for(var i=0;i<a_layers_selectable.length; i++) {

										// if the layer is not visible at the current scale, the selection does not happen
										if(this_viewer.getMapScale() >= stato[ol_layer].layers_info[a_layers_selectable[i]].min_scale && this_viewer.getMapScale() <= stato[ol_layer].layers_info[a_layers_selectable[i]].max_scale) {
											a_layernames.push(stato[ol_layer].layers_info[a_layers_selectable[i]].name);
										}
									}
									
									if(a_layernames.length > 0) {
										var layernames=a_layernames.join();
										
										data2send={
											action:"GET_FEATURE_INFO",
											mapName:stato[ol_layer].mg_session_info.mapName,
											mapSession:stato[ol_layer].mg_session_info.mapSession,
											layers:layernames,
											geometry:geom,
											maxfeatures:"1",
											layers_extra_properties:ov_layers_selection_extra_fields
										};


										$.ajax({
											url: stato[ol_layer].api_url,
											method: 'POST',
											dataType: 'json',
											data: data2send,
											error: function(a, b, c) {
												console.log("GET_FEATURE_INFO() - ERROR");
											},
											success: function(response) {

												if(response.status=="ok") {
													//console.log(response.data);
													if(!shiftKeyPressed) {
														this_viewer.mapClearSelection();
														this_viewer.mapSetSelection(response.data);
													} else {
														this_viewer.mapSetSelection(response.data);
													}
												
												}
											}
										});
									
									}
								}
							
							}
						break;
					}
				}

				if(ctrlKeyPressed) {
					// if the layer is an external WMS layer
					var BreakException = {};
					var map_ol_layers=this_viewer.map.getMapLayers();

					try{
						map_ol_layers.forEach(function(item,index) {
							if(item.getVisible()) {
								var layer_name = item.get('name');

								var baselayer=item.get('baselayer');
								
								
//	 							if(this_viewer.map.ol_map_layers.indexOf(layer_name) == -1) {
								if(item.getSource() instanceof ol.source.TileWMS || item.getSource() instanceof ol.source.ImageWMS) {							
									
									var wms_url = this.userWmsURL;
									var wms_url_internal = this.internalWmsURL;

									var source=this_viewer.map.getMapLayerSourceByName(layer_name);
									
									if (typeof source.getParams().INFO_FORMAT != 'undefined') {
										var info_format=source.getParams().INFO_FORMAT;
									} else {
										// the basemap layers are queried only if INFO_FORMAT is set
                                        // all the other layers are queried always (for backward compatibility
										if (!baselayer) {
											var info_format="text/javascript";
										} else {
											var info_format=null;
										}
									}
									
									if(pointerType=='mouse') {
										var url = source.getGetFeatureInfoUrl(
											event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
											{'INFO_FORMAT': info_format}
										);
									} else {
										var url = source.getGetFeatureInfoUrl(
											event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
											{'INFO_FORMAT': info_format, 'buffer': this.touchBuffer}
										);
									}

									// internal WMS
									if(wms_url==wms_url_internal) {
										
										var url_argument=url.split("?");
										
										$.ajax({
											url: OpenViewer_proxy,
											method: "POST",
											dataType: "json",
											async: false,
											data: {'service_type': 'featureinfo', 'service_url': wms_url, 'action': 'GetFeatureInfo', 'request': url_argument[1]},
											success: function(ret) {
												response = ret.data;

												// if the answer is not null
												if(response != null) {
													if(response.features.length > 0) {
														this_viewer.openInfoExtWMS(response);
														throw BreakException;
													}
												}
												
												return;
											},
											error: function() {
													return;
											}
										});
									
									} else {
										
										switch (info_format) {
											case "text/javascript":
												
												$.ajax({
													url: url,
													dataType: 'jsonp',
													jsonpCallback: 'parseResponse'
												}).then(function(response) { 
													if(response != null) {
														if (response.features.length > 0) {
															if (typeof response.features[0].properties.GRAY_INDEX == "undefined" || response.features[0].properties.GRAY_INDEX != 0) {
																this_viewer.openInfoExtWMS(response);
																//throw BreakException;
															}
														}
													}
												});
												
											break;
											
											case "text/html":
												
												var data={'service_type': 'featureinfoHtml', 'service_url': url, 'action': 'GetFeatureInfo', 'request': null};
												this_viewer.loadInfoPage('tabQueryResult',OpenViewer_proxy,null, data,false);
												
											break;
											
											case null:
// 												console.log("info_format null! we do nothing", info_format);
											break;
											
											default:
												console.log("info_format not expected!", info_format);
											break;
											
										}
									}
								}
							}
						},this);
					}catch (e) {
						if (e === BreakException) return;
						
					}

					// retrive information if the key CTRL is pressed
					if(stato[ol_layer].list_layers_hyperlinked!='') {
						switch(ol_layer) {
							case "wms":
								
								var array_layers = stato[ol_layer].list_layers_hyperlinked.split(",");
								var list_name_hyperlinked='';
								for(var j=0; j < array_layers.length; j++){
									var name_layer = stato[ol_layer].layers_info[array_layers[j]].name; 
									list_name_hyperlinked = name_layer + "," + list_name_hyperlinked;
									
								}
								var name_length = parseInt(list_name_hyperlinked.length)-1;
								var list_name_trunk = list_name_hyperlinked.substring(0,name_length);
									if(pointerType=='mouse') {
											var url = source.getGetFeatureInfoUrl(
													event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
													{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS':list_name_trunk, 'format_options': 'callback:parseResponse'}
											);
									} else {
											var url = source.getGetFeatureInfoUrl(
													event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
													{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_hyperlinked, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponse'}
											);
									}
									$.ajax({
											url: url,
											dataType: 'jsonp',
											jsonpCallback: 'parseResponse'
									}).then(function(response) { 
										this_viewer.openInfo(response);
									});
							break;

							case "wms_geoserver":
								if(pointerType=='mouse') {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_hyperlinked, 'format_options': 'callback:parseResponse'}
									);
								} else {
									var url = source.getGetFeatureInfoUrl(
										event.coordinate, this.map.getMapView().getResolution(), this.map.mapProjection,
										{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': stato[ol_layer].list_layers_hyperlinked, 'buffer': this.touchBuffer, 'format_options': 'callback:parseResponse'}
									);
								}

								$.ajax({
									url: url,
									dataType: 'jsonp',
									jsonpCallback: 'parseResponse'
								}).then(function(response) { this_viewer.openInfo(response); });
							break;

							case "mapguide":

								var mapguide_coordinate = ol.proj.transform(event.coordinate, this.map.mapProjection,this.map.dataProjection);

								var view = this_viewer.map.getMapView();
								var resolution = view.getResolution();
								
								if(pointerType=='mouse') {
									var bufferPx=5;
								} else {
									var bufferPx=this.touchBuffer;
								}

								var buffer=resolution*bufferPx;

								var x1=mapguide_coordinate[0] - buffer;
								var x2=mapguide_coordinate[0] + buffer;
								var y1=mapguide_coordinate[1] - buffer;
								var y2=mapguide_coordinate[1] + buffer;
								
								var geom="POLYGON(("+x1+" "+y2+","+x2+" "+y2+","+x2+" "+y1+","+x1+" "+y1+","+x1+" "+y2+"))";
								
								var a_layers_hyperlinked=stato[ol_layer].list_layers_hyperlinked.split(",");
								

								if (a_layers_hyperlinked.length > 0) {
									var a_layernames=new Array();

									for(var i=0;i<a_layers_hyperlinked.length; i++) {
										a_layernames.push(stato[ol_layer].layers_info[a_layers_hyperlinked[i]].name);
									}

									var layernames=a_layernames.join();


									
									data2send={
										action:"GET_TOOLTIP_HYPERLINK",
										mapName:stato[ol_layer].mg_session_info.mapName,
										mapSession:stato[ol_layer].mg_session_info.mapSession,
										layers:layernames,
										geometry:geom,
										maxfeatures:"1"
									};

									$.ajax({
										url: stato[ol_layer].api_url,
										method: 'POST',
										dataType: 'json',
										data: data2send,
										error: function(a, b, c) {
											console.log("GET_TOOLTIP_HYPERLINK() - ERROR");
										},
										success: function(response) {

											if(response.status=="ok") {
												if(response.data.hyperlink!='') {
													
													if(response.data.hyperlink.match(/getCoords/g)){
														var data='&x='+event.coordinate[0]+'&y='+event.coordinate[1];
														response.data.hyperlink +=data;
														
													}

													this_viewer.loadInfoPage('tabQueryResult',response.data.hyperlink,true);

													// if the info panel is hidden, it is toggled on
													this_viewer.infoPanelContainer.show(500);
												}
											}

											// we try to select in any case
											var a_layers_selectable=stato[ol_layer].list_layers_selectable.split(",");
									
											if (a_layers_selectable.length > 0) {
												var a_layernames=new Array();

												for(var i=0;i<a_layers_selectable.length; i++) {

													// if the layer is not visible at the current scale, the selection does not happen
													if(this_viewer.getMapScale() >= stato[ol_layer].layers_info[a_layers_selectable[i]].min_scale && this_viewer.getMapScale() <= stato[ol_layer].layers_info[a_layers_selectable[i]].max_scale) {
														a_layernames.push(stato[ol_layer].layers_info[a_layers_selectable[i]].name);
													}
												}
												
												if(a_layernames.length > 0) {
													var layernames=a_layernames.join();
													
													data2send={
														action:"GET_FEATURE_INFO",
														mapName:stato[ol_layer].mg_session_info.mapName,
														mapSession:stato[ol_layer].mg_session_info.mapSession,
														layers:layernames,
														geometry:geom,
														maxfeatures:"1",
														layers_extra_properties:ov_layers_selection_extra_fields
													};

													$.ajax({
														url: stato[ol_layer].api_url,
														method: 'POST',
														dataType: 'json',
														data: data2send,
														error: function(a, b, c) {
															console.log("GET_FEATURE_INFO() - ERROR");
														},
														success: function(response) {

															if(response.status=="ok") {
																//console.log(response.data);
																if(!shiftKeyPressed) {
																	this_viewer.mapClearSelection();
																	this_viewer.mapSetSelection(response.data);
																} else {
																	this_viewer.mapSetSelection(response.data);
																}
															
															}
														}
													});
												
												}
											}
										}
									});
								}
							break;
						}
					}
				}
			}
		break;
	}
};


/** INTERFACE - SERVICE PROCEDURES TO FILL/HANDLE THE PANELS/TABS
 * ---------------------------------------------------------------
 * - "right" tabs (query result, search, cusxtom, app info)
 * - "VistaSu" panel
 * - help/guided tour
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

			//Gestione history per fare back e forward dal tab info
			if(newHistoryState) {
				history.pushState({"tabName": tabName,"url": url,"spinner":spinner,"data":data}, "titolo", "");
			} else {
				//console.log("replaceState: "+url);
				//history.replaceState({"tabName": tabName,"url": url,"spinner":spinner,"data":data}, "titolo", "");
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


/** LEGEND HANDLING
 * ---------------------------------------------------------------
 */

/** Build the LegendTree object, holding the structure of the layers legend (groups and layers) */
openViewer.prototype.legendBuildLayerTree = function() {
// if(this.showConsoleMsg) console.log("legendBuildLayerTree");
	var stato = this.getStato();
	var tree = new Array();
	var knownGroups = new Array();
	var unresolved = new Array();
	//var groups = Object.keys(groups_info);
	
	// for each "main layer" (no basemap, no custom WMS)
	var a_ol_layers=Object.keys(stato);

	for (var i=0;i<a_ol_layers.length;i++) {
		
		ol_layer=stato[a_ol_layers[i]];
		layers_info=ol_layer.layers_info;
		groups_info=ol_layer.groups_info;
		layers=Object.keys(layers_info);
		groups=Object.keys(groups_info);
		// loop over the groups
		for (var j=0;j<groups.length;j++) {
			rtGroup = groups_info[groups[j]];
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
/** Return the HTML string to build the layers legend */
openViewer.prototype.legendBuildClientSideTree = function(tree, parent, parentName, internal) {
// if(this.showConsoleMsg) console.log("legendBuildClientSideTree");
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

	if(internal === undefined) {
		internal = true;
	}
	
	treeIndex = 0;
	for(var i = 0; i < tree.length; i++) {
		node = tree[i];

		if(node.isGroup) {
			if(internal== true){
				if(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false){
					
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
			htmlExpandCollapse = '<a id="expand_' + groupName + '" class="' + expandClass + '" href="javascript:;"></a>';
			
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
				displayStyle = 'block';
				
				style = 'style="display:' + displayStyle +';"';
				htmlLegenda += '<li ' + style + '>' + htmlExpandCollapse + '<input id="' + groupName + '" type="checkbox" ' + checked + ' class="legenda_group_checkbox" /><label for="' + groupName + '"><img src="/include/img/openViewer/legend/lc_group.gif" alt="icona del gruppo" />' + legendLabel + '</label></li>';

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
					htmlLegenda += this.legendBuildClientSideTree(node.children, node, groupName, internal);
					htmlLegenda+="</ul>";
				}
				
			} else {
				//displayStyle = 'none';
			}
			
			
		} else {
			rtLayer = node.tObject;
			layerName = node.name;
			
			if(internal== true){
				if(typeof node.tObject.internal !== 'undefined' && node.tObject.internal == false){
					continue;
				}
			}
			else{
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
			
			if(node.tObject.visible==true) {
				checked='checked=true';
			} else {
				checked='';
			}

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

			var ol_layer = this.getMainLayerByName(layerName);

			var url = stato[ol_layer].url;

			if(node.tObject.expanded) {
					stile_immagine="style=\"display:block;\"";
			} else {
					stile_immagine="style=\"display:none;\"";
			}

			switch (stato[ol_layer].tipo) {
				case "wms":
// 					var layerData = this.getWMSLegendFromProxy(url, scala, image_legend_layer,stato[ol_layer].tipo);
// 					html_stile='';
// 					for (var style_name in layerData.styles) {
// 						html_stile += "<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='"+layerData.styles[style_name].legend_url_href+"' style='width: \'"+ layerData.styles[style_name].legend_url_width + "\'px; height: \'" + layerData.styles[style_name].legend_url_height + "\' px;/>";
// 					}

// 					htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'>"+legend_label+"</label>"+html_stile+"</li>";
					htmlLegenda+="<li "+style+"><input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'>"+legend_label+"</label>"+html_stile+"</li>";
				break;
				case "wms_geoserver":
					if(that.ProxySet == true){
						var returned_img = this.getWMSLegendFromProxy(url, scala, image_legend_layer,stato[ol_layer].tipo);
						html_stile="<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='data:image/png;base64," + returned_img + "' title='' />";
						//htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='data:image/png;base64," + returned_img + "' title='' />"+legend_label+"</label>"+html_stile+"</li>";
						htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'>"+legend_label+"</label>"+html_stile+"</li>";
					}
					else{
						html_stile="<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='"+url+"?REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LEGEND_OPTIONS=fontName:Serif;fontAntiAliasing:true;fontSize=6;dpi:100&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />";
						htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />"+legend_label+"</label>"+html_stile+"</li>";
					}
				break;

				case "mapguide":
					layerDefinition=rtLayer.layerDefinition;

					// derive the current range related to the current scale
					currentRange=this.getCurrentRange(rtLayer.ranges);

					// if the layer must be hidden, we do nothing
					if (rtLayer.display_in_legend!==false) {

						//Il layer non si deve vedere a questa scala, per cui nella legenda non va mostrato
						if(currentRange != null) {

							// on the current range, we check if there are multiple thematizations
							if (currentRange.rules.length > 1) {
								html_stile="";
								for(k=0;k < currentRange.rules.length; k++) {
									themecategory=k;
									geomtype=currentRange.rules[k].type_num;
									label=currentRange.rules[k].label;

									html_stile=html_stile+"<img class='stile_"+layerName+"' id='stile_"+layerName+"_"+k+"' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY="+themecategory+"&TYPE="+geomtype+"&CLIENTAGENT=LdP%20Viewer' alt='icona tematizzazione del layer' title='' /> "+label+"<br/>";
								}

								html_stile="<div id='stile_"+layerName+"' "+stile_immagine+">"+html_stile+"</div>";

								htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='/include/img/openViewer/legend/lc_theme.gif' alt='icona multi regole' title='' />"+legend_label+"</label>"+html_stile+"</li>";

							} else {
								htmlLegenda+="<li "+style+"><input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY=-1&TYPE=-1&CLIENTAGENT=LdP%20Viewer' alt='icona tematizzazione del layer' title='' />"+legend_label+"</label></li>";
							}

						} else {
							// if the layer shoud be hide, it is not added in the HTML
							//htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY=-1&TYPE=-1&CLIENTAGENT=LdP%20Viewer' title='' />"+legend_label+"</label></li>";
						}
					} // if (rtLayer.display_in_legend!==false)
				break;
			} // switch (stato[ol_layer].tipo)
		} // else if(node.isGroup)
	}

// if(this.showConsoleMsg) console.log("htmlLegenda", htmlLegenda);
	return htmlLegenda;
}
/** Refresh the layers legend */
openViewer.prototype.refreshLegend = function() {
// if(this.showConsoleMsg) console.log("Start refreshLegend ...");
	a_layers_legenda=new Array();
	
	// build the legend tree
	this.legendBuildLayerTree();

    // define the section related to the basemap layers
    var htmlLegenda = this.legendBuildClientSideTree(this.legendTree, null, null, true);
	this.legendPanel.html("<ul class='layerslegend'>" + htmlLegenda + "</ul>");

    // define the section related to the user WMS layers
	var htmlLegendaWMS = this.legendBuildClientSideTree(this.legendTree, null, null,false);
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
    
    // process user WMS layers
    // -------------------------------------------------------------
	// retrieve WMS user layers and temporarly store to an array
	html_layerswms_list="";
	var tmpWmsUserLayers = [];
		ol_layers.forEach(function (layer) {
		if (layer.get('name') != undefined && layer.get('wmsUserLayer')) {
			tmpWmsUserLayers.push(layer);
		}
	});
	// reverse the array (to have a legend with on top the "last" drawn layers)
	tmpWmsUserLayers.reverse();
    // add user WMS layers to the legend
	for (i = 0; i < tmpWmsUserLayers.length; i++) {
		element = tmpWmsUserLayers[i];
			
			// check the visibility of the layer
			if(element.get('visible')) {
				str_checked="checked=true";
			} else {
				str_checked="";
			}
			
			// retrieve the scale limits and the CRS of the layer
			var scaleMax = this.map.getScaleFromResolution(element.getMaxResolution()+this.correctionOffsetScaleMax,true);
			var scaleMin = this.map.getScaleFromResolution(element.getMinResolution()+this.correctionOffsetScaleMin,true);
			var layerCrs = element.getSource().getProjection().getCode();
			if((scaleMin>0||scaleMax>0)&&scaleMax>scaleMin)
				var labelTip = strings_interface.sentence_scalevisibility+scaleMin+'-'+scaleMax+' ('+strings_interface.sentence_datasource+' '+layerCrs+')';
			else
				var labelTip = '('+strings_interface.sentence_datasource+' '+layerCrs+')';
			
			// retrieve the image legend and set its size
			var img_url = element.get('legendUrl');
			var hash = Math.floor(Math.random() * 1000000);
			var img_source_html = "";
			if(typeof img_url != 'undefined' && img_url != '') {
				img_source_html = " src=\""+img_url.trim()+"\" ";
                hash = this.hashCode(img_url);
			}
			var style_leg_width = element.get('legendWidth');
			var img_width_html = " style=\"width: "+this.leftPanelMinWidth * 0.9+"px\" ";
			if(typeof style_leg_width != 'undefined' && style_leg_width != '' && style_leg_width > 0) {
				img_width_html = " style=\"width: "+Math.min(this.leftPanelMinWidth * 0.9,style_leg_width)+"px\" ";
			}
			
			// set the LayerID
			var layerID = 'leg_item_checkbox_'+element.get('name');
			// the attribute ID of the tag INPUT must equal the name of the layer
			
			html_layerswms_list+='<li>';
			
			// add the checkbox and the name of the layer
			// ------------------------------------------
			html_layerswms_list+='<div id="ov_legend_item_with_tools" class="ov_legend_item_with_tools">';
			html_layerswms_list+="<input type='checkbox' class='legend_item' name='legend_item' id='"+element.get('name')+"' "+str_checked+" >";
			html_layerswms_list+="<label for='"+element.get('name')+"' title='"+labelTip+"'>&nbsp;"+element.get('name')+"</label>";
			html_layerswms_list+='</div>';
			
/* OVD ELIMINARE
			//html_layerswms_list+="<button id='ov_button_style' class='ov_legend_item_tool_container showstyle' onclick='open_viewer.showStyle(\""+element.get('name').trim()+"\",-0.1)' title='Aggiungi WMS'>"
			if(typeof img_url != 'undefined' && img_url != '') {
				var hash = this.hashCode(img_url);
				var img_source_html = " src='"+img_url.trim().replace('/','//')+"' ";
console.log('OVD Legend URL:',img_url,img_source_html);  
				html_layerswms_list+="<button id='ov_button_style' class='ov_legend_item_tool_container showstyle' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")' title='Aggiungi WMS'>";
				// write below the div with the image, as a new row
				//html_layerswms_list+="<br><img id='img_" + hash + "_" + i +img_source_html+" class='show' style='width: "+ style_leg_width + "px; height: " + style_leg_height + "px;'/>"
			}
            
//				legend_html = "<a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")' title='"+strings_interface.wms_showhidestyle+"'><img id='img_" + hash + "_" + i +img_source_html+" class='hide' style='width: "+ style_leg_width + "px; height: " + style_leg_height + "px;'/><span class='fa fa-eye'></span>";
				//legend_html += " "+strings_interface.wms_showhidestyle.toLowerCase();
//				legend_html += "</a>";
*/            
			
			// add the button to open/close the legend
			// ---------------------------------------
			if(typeof img_url != 'undefined' && img_url != '') {
				html_layerswms_list+="<button id='ov_button_style' class='ov_legend_item_tool_container showstyle' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")' title='"+strings_interface.sentence_opencloselegend+"'>";
			}
			
			// add the buttons to change the opacity of the layer
			// --------------------------------------------------
			html_layerswms_list+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityplus' onclick='open_viewer.setLayerOpacity(\""+element.get('name').trim()+"\",0.1)' title='"+strings_interface.sentence_reducetransparency+"'>"
			html_layerswms_list+="<button id='ov_button_opacity' class='ov_legend_item_tool_container setopacityminus' onclick='open_viewer.setLayerOpacity(\""+element.get('name').trim()+"\",-0.1)' title='"+strings_interface.sentence_increasetransparency+"'>"
			
			html_layerswms_list+="</li>"
			
			// add the image of the legend (out of <li> to avoid problems of visualization
			// ---------------------------------------------------------------------------
            if(typeof img_url != 'undefined' && img_url != '') {
				html_layerswms_list+="<a href=\"" + img_url + "\" target=\"_blank\">";
				html_layerswms_list+="<img id=\"img_" + hash + "_" + i + "\" class=\"hide\"" + img_source_html + img_width_html + "/>"
				html_layerswms_list+="</a>";
			}
    };
	
    this.legendPanelWmsUserLayers.html("<ul class='layerslegendwms'>"+html_layerswms_list+"</ul>");
	this.legendPanelBasemapLayers.html("<ul class='layerslegend'>"+html_layers_list+"</ul>");
if(this.showConsoleMsg) console.log(' List of refreshed layers:',ol_layers);
// if(this.showConsoleMsg) console.log("... refreshLegend completed.");
	return false;
};
/** Show/Hide a layer (used for the "main layers" (MapGuide, default WMS) */
openViewer.prototype.showHideLayer = function(layer_name, flagShow) {
	var stato = this.getStato();
	
	// retrieve the "status" of the passed layer
	var ol_layer=this.getMainLayerByName(layer_name);
	
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
		this.mapRefreshStatus();
		if (stato[ol_layer].list_layer_visible!='') {
			// refresh the passed layer and the map
			this.map.refreshMapLayer(ol_layer);
		} else {
			// if it is the unique layer visible, it cannot be hidden
			stato[ol_layer].layers_info[layer_name]['visible']=old_flagShow;
			            
			this.setStato(stato);
			
			// rollback of the change of "status"
			this.mapRefreshStatus();
			
			$("#"+layer_name).prop("checked",old_flagShow);
		}
	}
}
/** Show/Hide a group of layer (used for the "main layers" (MapGuide, default WMS) */
openViewer.prototype.showHideGroupLayers = function(group_name, flagShow) {
	var stato = this.getStato();
	// retrieve the "status" of the passed group
	var ol_layer=this.getMainLayerByGroup(group_name);
	old_flagShow=stato[ol_layer].groups_info[group_name]['visible'];

	if (flagShow==true) {
		stato[ol_layer].groups_info[group_name]['visible']=true;
	} else {
		stato[ol_layer].groups_info[group_name]['visible']=false;
	}

	this.setStato(stato);
	this.mapRefreshStatus();

	if (stato[ol_layer].list_layers_visible!='') {
		// refresh the passed group and the map
		this.map.refreshMapLayer(ol_layer);
	} else {
		// if it is the unique layer visible, it cannot be hidden
		stato[ol_layer].groups_info[group_name]['visible']=old_flagShow;
		
		// rollback of the change of "status"
		this.setStato(stato);
		this.mapRefreshStatus();
		
		$("#"+group_name).prop("checked",old_flagShow);
	}
}
/** Refresh the status of the "main" layers" (MapGuide, default WMS) */
openViewer.prototype.mapRefreshStatus = function() {
// if(this.showConsoleMsg) console.log("refreshStatus");
	this.map.refreshStatus();
};


/** TOOLS - HANDLING THE USER INTERACTION TOOLS
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
/** Additional function to manage the "measure" interactive tool */
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


/** TOOLS - NAVIGATION FUNCTIONS (ZOOM, ETC.)
 * ---------------------------------------------------------------
 */

openViewer.prototype.initialMapView = function() {          // refresh the view to the initial settings (center and scale)
// if(this.showConsoleMsg) console.log("initialMapView");
	this.map.getMapView().setCenter(this.map.initialView.center);
	this.map.getMapView().setZoom(this.map.initialView.zoom);
};
openViewer.prototype.previousMapView = function() {         // recall the previous view (zoom and scale) from the views history
// if(this.showConsoleMsg) console.log("previousMapView");
	
	if(this.map.historyViewIndex > 0) {

		this.map.historyViewIndex--;
		var previousIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[previousIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[previousIndex].resolution);
		this.map.historyViewCaller='ZoomPrev';


	} else {
// if(this.showConsoleMsg) console.log("No previous view");
	}
};
openViewer.prototype.nextMapView = function() {             // recall the next historical view (zoom and scale) from the views history
// if(this.showConsoleMsg) console.log("nextMapView");
	
	if(this.map.historyView.length-1 > this.map.historyViewIndex) {
		this.map.historyViewIndex++;
		var nextIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[nextIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[nextIndex].resolution);
		this.map.historyViewCaller='ZoomNext';
	
	} else {
// if(this.showConsoleMsg) console.log("Non esiste nessuna vista successiva");
	}
};
openViewer.prototype.zoomIn = function() {                  // cantered zoomin (+1 zoom level)
// if(this.showConsoleMsg) console.log("zoomIn");
	//this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()+1);
    this.map.historyViewCaller='ZoomIn';
}
openViewer.prototype.zoomOut = function() {                 // centerd zoomout (-1 zoom level)
// if(this.showConsoleMsg) console.log("zoomOut");
	//this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()-1); 
    this.map.historyViewCaller='ZoomOut';
}
openViewer.prototype.zoomToView = function(x,y,scale) {     // Set the current view (center coordinates, based on data projection, and scale, in map units)
	this.map.setCenterProjected(x, y, this.map.dataProjection);
	this.setMapScale(scale);
};


/** TOOLS - LAYER SETTINGS/INFORMATION
 * ---------------------------------------------------------------
 */

/** Set the opacity/transparency of a layer */
openViewer.prototype.setLayerOpacity = function(layerName,opacityDelta){
	var ol_layer = this.map.getMapLayerByName(layerName)
	if (ol_layer==false) return false;
	var newOpacity = ol_layer.getOpacity();
	if(newOpacity == undefined) newOpacity = 1;
	var newOpacity = Math.max(0.1, Math.min(1,newOpacity+opacityDelta));
	ol_layer.setOpacity(newOpacity);
	return true;
}


/** MAIN LAYERS INTEGRATION (MAPGUIDE, DEFAULT WMS) - CURRENTLY "ALMOST" UNUSED
 * -------------------------------------------------------------------------------
 */

/* OVD CURRENTLY UNUSED: startDraw
openViewer.prototype.startDraw = function(type,callback_function) {
	this.toggleToolStatus("draw");
	this.map.startDraw(type,callback_function);
}
*/
/* OVD CURRENTLY UNUSED: endDraw
openViewer.prototype.endDraw = function() {
	this.toggleToolStatus("select");
	//this.map.endDraw();
}
*/
/* OVD CURRENTLY UNUSED: cancelDraw
openViewer.prototype.cancelDraw = function() {
	this.map.cancelDraw();
}
*/
/* OVD CURRENTLY UNUSED: digitizePoint
openViewer.prototype.digitizePoint = function(callback_function) {
	this.startDraw('Point',callback_function);
}
*/
/* OVD CURRENTLY UNUSED: isDigitizing
openViewer.prototype.isDigitizing = function() {
	var stato_interazione=this.map.getStatusInteraction();
	if (stato_interazione=='draw') {
		return true;
	} else {
		return false;
	}
}
*/
/* OVD CURRENTLY UNUSED: cancelDigitization (used for backward compatibility)
openViewer.prototype.cancelDigitization = function() {
	this.endDraw();
}
*/
/* OVD CURRENTLY UNUSED: fit 
openViewer.prototype.fit = function(wkt, crs, pixelPadding) {
	this.map.fit(wkt, crs, pixelPadding);
}
*/
/* OVD CURRENTLY UNUSED: footerUpdateText
openViewer.prototype.footerUpdateText = function() {
// 	console.log("footerUpdateText");
	var stato = this.getStato();
	
	var selectOverlay=this.map.getMapLayerByName('selection');
	var numeroFeature = selectOverlay.getSource().getFeatures().length;
	if (numeroFeature == 1)
		this.footerPanelInfoSelezione.html(numeroFeature + " feature selezionata");
	else
		this.footerPanelInfoSelezione.html(numeroFeature + " feature selezionate");
}
*/
/* OVD CURRENTLY UNUSED: mapClearSelection
openViewer.prototype.mapClearSelection = function() {
	var stato = this.getStato();
	var selectOverlay=this.map.getMapLayerByName('selection');

	//Si ripulisce la selezione precedente
	selectOverlay.getSource().clear();
	
	//Footer
	this.footerUpdateText();
}
*/
/* OVD CURRENTLY UNUSED: mapClearSnap
openViewer.prototype.mapClearSnap = function() {
	var stato = this.getStato();
	var snapOverlay=this.map.getMapLayerByName('snap');

	//Si ripulisce la selezione precedente
	snapOverlay.getSource().clear();
}
/* OVD CURRENTLY UNUSED: mapGetSelectedFeatures
openViewer.prototype.mapGetSelectedFeatures = function(xml,a_layers,callback,primary_key,extra_field) {
	var selection=this.map.getSelectedFeatures(xml,a_layers,callback,primary_key,extra_field);
	return selection;
}
*/
/* OVD CURRENTLY UNUSED: refreshSnapVector
openViewer.prototype.refreshSnapVector = function(layers,tipo_snap,tolleranza) {	
	var stato = this.getStato();

	var this_viewer = this;
	
	//Ci si ricava la vista della mappa
	var center = this.getMapCenter();
	var width = this.getMapWidth();
	var height = this.getMapHeight();
	
	
	//Per la selezione si considera solo il primo OL layer
	var a_ol_layers=Object.keys(stato);
	//inizio a ciclare su tutti i layers
	for(var i=0; i<a_ol_layers.length; i++){
		
		//var ol_layer=a_ol_layers[0];
		var ol_layer=a_ol_layers[i];
		var source=this.map.getMapLayerSourceByName(ol_layer);
		
		switch(ol_layer) {
			case "wms":
				///TODO
			break;

			case "wms_geoserver":
				///TODO
			break;
			
			case "mapguide":
				
				var mapguide_coordinate = ol.proj.transform([center.X , center.Y], this_viewer.map.mapProjection,this_viewer.map.dataProjection);

				var x1=mapguide_coordinate[0] - (width/2);
				var x2=mapguide_coordinate[0] + (width/2);
				var y1=mapguide_coordinate[1] - (height/2);
				var y2=mapguide_coordinate[1] + (height/2);
				
				var geom="POLYGON(("+x1+" "+y2+","+x2+" "+y2+","+x2+" "+y1+","+x1+" "+y1+","+x1+" "+y2+"))";

				var a_layernames=layers.split("|");
				
// 				var a_layers_selectable=stato[ol_layer].list_layers_selectable.split(",");

				if (a_layernames.length > 0) {
					
					
					var layernames=a_layernames.join();

					data2send={
						action:"GET_FEATURES_INFO",
						mapName:stato[ol_layer].mg_session_info.mapName,
						mapSession:stato[ol_layer].mg_session_info.mapSession,
						layers:layernames,
						geometry:geom,
						maxfeatures:"100"
					};


					$.ajax({
						url: stato[ol_layer].api_url,
						method: 'POST',
						dataType: 'json',
						data: data2send,
						error: function(a, b, c) {
							console.log("GET_FEATURES_INFO() - ERROR");
						},
						success: function(response) {

							if(response.status=="ok") {
								//console.log(response.data);
								this_viewer.mapClearSnap();
								this_viewer.mapSetSnap(response.data);
								
							}
						}
					});
					
					
				}
			break;
		}

	
//break;
}

}
*/
/* OVD CURRENTLY UNUSED: getMapGuideSelection
openViewer.prototype.getMapGuideSelection = function() {
	var selection=this.map.getMapGuideSelection();
	
	return selection;
}
*/
/* OVD CURRENTLY UNUSED: getWMSlayerSelection (callback of the selection over a default WMS layer)
openViewer.prototype.getWMSlayerSelection = function(response) {
//console.log("getWMSlayerSelection",response);
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=this.map.getMapLayerByName('selection');

	//Si ripulisce la selezione precedente
	selectOverlay.getSource().clear();
	
	//response è un oggetto geoJson
	features=geojsonFormat.readFeatures(response,{dataProjection: this.map.dataProjection,featureProjection: this.map.mapProjection});
// console.log(features);
	if(features.length > 0) {
		selectOverlay.getSource().addFeatures(features);
	}

	//Footer
	this.footerUpdateText();
}
*/
/* OVD CURRENTLY UNUSED: setSelection_legacy (valid only for MapGuide)
openViewer.prototype.setSelection_legacy = function(layer, ids, primary_key) {
	var this_viewer=this;

	if ( typeof primary_key == "undefined" ) {
		var primary_key="id";
	}
	
	var stato = this.getStato();

	var ol_layer="mapguide";
	
	// valid for MapGuide

	var data2send={
		action:"SET_SELECTION",
		mapName:stato[ol_layer].mg_session_info.mapName,
		mapSession:stato[ol_layer].mg_session_info.mapSession,
		layer:layer,
		ids:ids,
		primary_key: primary_key
	};


	$.ajax({
		url: stato[ol_layer].api_url,
		method: 'POST',
		dataType: 'json',
		data: data2send,
		error: function(a, b, c) {
			console.log("SET_SELECTION() - ERROR");
		},
		success: function(response) {

			if(response.status=="ok") {
				//console.log(response.data);
				this_viewer.mapClearSelection();
				this_viewer.mapSetSelection(response.data);
			}
		}
	});
	
}
*/
/* OVD CURRENTLY UNUSED: setSelection_multilayer_legacy (valid only for MapGuide)
openViewer.prototype.setSelection_multilayer_legacy = function(selection_string) {
	var this_viewer=this;
	
	var stato = this.getStato();

	var ol_layer="mapguide";
	
	// valid for MapGuide
	
	var data2send={
		action:"SET_SELECTION_MULTI",
		mapName:stato[ol_layer].mg_session_info.mapName,
		mapSession:stato[ol_layer].mg_session_info.mapSession,
		selection_string:selection_string
	};


	$.ajax({
		url: stato[ol_layer].api_url,
		method: 'POST',
		dataType: 'json',
		data: data2send,
		error: function(a, b, c) {
			console.log("SET_SELECTION_MULTI() - ERROR");
		},
		success: function(response) {

			if(response.status=="ok") {
				this_viewer.mapClearSelection();
				for(var i=0; i<response.data.length; i++){
					
						this_viewer.mapSetSelection(response.data[i]);
				}
				
			}
		}
	});
}
*/
/* OVD CURRENTLY UNUSED: mapSetSnap
openViewer.prototype.mapSetSnap = function(response, crs) {
	var stato = this.getStato();
	if ( typeof crs == "undefined" ) crs = "EPSG:3003";

	var wktformat = new ol.format.WKT();
	var snapOverlay = this.map.getMapLayerByName('snap');
	var snapOverlaySource = snapOverlay.getSource();
	var viewProjectionCode = this.map.getMapView().getProjection().getCode();
	
	if(response.length > 0) {
		for (var k = 0; k < response.length; k++) {
			
			var wkt=response[k].geometry;
			var layer=response[k].layer;
			var feature_id=response[k].feature_id;

			var features=wktformat.readFeatures(wkt, { dataProjection: crs,featureProjection: viewProjectionCode } );
			
			if(features.length > 0) {
				for (var i = 0; i < features.length; i++) {
					var feature = features[i];
					// faccio l'hash della geometria e lo uso come id della feature, per poterla poi ricercare
					feature.setId( this.simpleHash( wktformat.writeFeature(feature) ) );
					feature.set("layer",layer,true);
					feature.set("feature_id",feature_id,true);
					var featureId = feature.getId();
		//  			console.log("featureId",featureId, "feature", feature );
					if ( snapOverlaySource.getFeatureById(featureId) === null ) {
						snapOverlaySource.addFeature(feature);
					} else {
						// feature già presente
		// 				console.log('feature ' + featureId + ' già presente');
					}
				}
			}
		}
	}
}
*/
/* OVD CURRENTLY UNUSED: mapSetSelection
openViewer.prototype.mapSetSelection = function(response, crs) {
// console.log("mapSetSelection");
// 
// console.log(response);
	
	var wkt=response.geometry;
	var layer=response.layer;
	var feature_id=response.feature_id;
	var extra_fields=response.extra_fields;
	
	var stato = this.getStato();
	if ( typeof crs == "undefined" ) crs = "EPSG:3003";
	
	var wktformat = new ol.format.WKT();
	
	var selectOverlay = this.map.getMapLayerByName('selection');
	var selectOverlaySource = selectOverlay.getSource();
	var viewProjectionCode = this.map.getMapView().getProjection().getCode();
	
	if (wkt != null) {
		var features=wktformat.readFeatures(wkt, { dataProjection: crs,featureProjection: viewProjectionCode } );
	 
		if(features.length > 0) {
			for (var i = 0; i < features.length; i++) {
				var feature = features[i];
				// faccio l'hash della geometria e lo uso come id della feature, per poterla poi ricercare
				feature.setId( this.simpleHash( wktformat.writeFeature(feature) ) );
				feature.set("layer",layer,true);
				feature.set("feature_id",feature_id,true);
				feature.set("extra_fields",extra_fields,true);
				var featureId = feature.getId();
	//  			console.log("featureId",featureId, "feature", feature );
				if ( selectOverlaySource.getFeatureById(featureId) === null ) {
					selectOverlaySource.addFeature(feature);
				} else {
					// feature già presente
	// 				console.log('feature ' + featureId + ' già presente');
				}
			}
		}
	
	}
	
	//Footer
	this.footerUpdateText();
}
*/
/* OVD CURRENTLY UNUSED: mapAddFeatureSelection
openViewer.prototype.mapAddFeatureSelection = function(response) {
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=this.map.getMapLayerByName('selection');
	
	//response è un oggetto geoJson
	features=geojsonFormat.readFeatures(response,{dataProjection: this.map.dataProjection,featureProjection: this.map.mapProjection});
	
	if(features.length > 0) {
		///TODO Per evitare di aggiungere più volte la stessa feature alla selezione si dovrebbe controllare che non sia già presente tra le feature
		
		selectOverlay.getSource().addFeatures(features);
	}

	//Footer
	this.footerUpdateText();
}
*/
/* OVD CURRENTLY UNUSED: openInfo (callback after CTRL+click or after holding tap)
openViewer.prototype.openInfo = function(response) {
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();
	//response è un oggetto geoJson
	features=geojsonFormat.readFeatures(response,{dataProjection: this.map.dataProjection,featureProjection: this.map.mapProjection});

	if(features.length > 0) {
		//Per generare l'hyperlink mi prendo solamente la prima feature dell'array
		feature=features[0];

		//Mi ricavo il nome del layer
		fid=feature.getId();
		// console.log(fid);
		a_fid=fid.split(".");
		var nome_feature=a_fid[0];
		var id_feature=a_fid[1];

		var layer_name=this.getMainLayerNameByFeature(nome_feature);
		var ol_layer=this.getMainLayerByName(layer_name);
		
		//Mi ricavo gli attributi
		properties=feature.getProperties();

		//Aggiungo anche l'id alle properties
		// Se properties.id non esiste lo aggiungo, definendolo come la primary_key (dovrebbe servire solo se "Expose primary keys" non è impostato nel data store)
		if ( typeof properties.id == "undefined" ) {
				properties.id=id_feature;
		}

// 		console.log(properties);
		//Questo è dovuto al fatto che non sempre il nome del layer del wms è uguale al nome della feature source (tabella)
		//Mi devo ricavare il nome del layer a cui appartiene la feature
		//Nel caso particolare in cui più layer fanno riferimento alla stessa tabella del db, prendo solo il primo layer trovato

		var a_layers_hyperlinked=stato[ol_layer].list_layers_hyperlinked.split(",");

		var ind=a_layers_hyperlinked.indexOf(layer_name);
		if(ind != -1) {
			if(stato[ol_layer].layers_info[layer_name].hyperlink != 'standard'){
				stringa_hyperlink = stato[ol_layer].layers_info[layer_name].hyperlink.replace(/%\w+%/g, function(all) {
					return eval("properties."+all.replace(/%/g,''));
				});

				this.loadInfoPage('tabQueryResult',stringa_hyperlink);

				//Se è nascosto, si mostra
				this.infoPanelContainer.show(500);
				this.titleToggleInfo.addClass("active");
				
			}
			else{
				//return properties;
				this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
				var html = this.createElementsFromJSON(properties);
				setTimeout(function(){$("#ov_info_wms_container").html(html);}, 500);
				this.titleToggleInfo.addClass("active");
			}
		}
	}
}
*/
/* OVD CURRENTLY UNUSED: mapRefresh
openViewer.prototype.mapRefresh = function() {
	var centro = ol.proj.transform([this.getMapCenter().X , this.getMapCenter().Y], this.map.mapProjection,this.map.dataProjection);
	this.zoomToView(centro[0]-1,centro[1], this.getMapScale());
}
*/
/** Return the settings of the main layers ("stato") */
openViewer.prototype.getStato = function() {
	return this.map.getStato();
};
/** Set the settings of the main layers ("stato") */
openViewer.prototype.setStato = function(stato) {
	return this.map.setStato(stato);
};
/* OVD CURRENTLY UNUSED: addPolygonsInLayer_legacy (valid only for MapGuide)
openViewer.prototype.addPolygonsInLayer_legacy = function(wkt,layer_name,doRefresh, onSuccess, onFail) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...
	var a_wkt=wkt.split("|");
	if (empty(layer_name)){
		layer_name='redline';
	}
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(layer_name,a_wkt[i]);
		} else {
			this.addRedlineWKT(layer_name,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}
*/
/* OVD CURRENTLY UNUSED: addPointsInLayer_legacy (valid only for MapGuide)
openViewer.prototype.addPointsInLayer_legacy = function(wkt,layer_name,doRefresh, onSuccess, onFail, emptyLayerBefore) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...
	var a_wkt=wkt.split("|");
	if (empty(layer_name)){
		layer_name='redline';
	}
	
	if (typeof emptyLayerBefore === 'undefined') {
		emptyLayerBefore=true;
	}
	
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(layer_name,a_wkt[i],emptyLayerBefore);
		} else {
			this.addRedlineWKT(layer_name,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}
*/
/* OVD CURRENTLY UNUSED: putLabelInLayer_legacy (valid only for MapGuide)
openViewer.prototype.putLabelInLayer_legacy = function(layer_name,wkt,labelText,size, angle, sizex, doRefresh,onSuccess) {
	var clear=1;
	this.map.addLabelInLayer(layer_name,wkt,labelText,size, angle,clear);
}
*/
/* OVD CURRENTLY UNUSED: putLabelsInLayer_legacy (valid only for MapGuide)
openViewer.prototype.putLabelsInLayer_legacy = function(layer_name,params,sizex,doRefresh,onSuccess) {
	
// il primo si fa putlabelinlayer per gli altri si fa addLabelInLayer
	for (var i=0; i<params.length; i++)
		{
			this.map.addLabelInLayer(layer_name,params[i].wkt,params[i].text,params[i].size, params[i].angle,params[i].clear);
		}
}
*/
/* OVD CURRENTLY UNUSED: creaPointLayer_legacy (valid only for MapGuide)
openViewer.prototype.creaPointLayer_legacy = function(nome, colore, spessore, angolo, height, group, groupLabel, onSuccess, onFail) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(spessore) ) { spessore = 4; }
	if ( empty(nome) ) { nome = "tmp_punti"; }
	this.map.createTempLayer(nome,colore,'',spessore);
}
*/
/* OVD CURRENTLY UNUSED: creaLineLayer_legacy (valid only for MapGuide)
openViewer.prototype.creaLineLayer_legacy = function(nome, colore, spessore, group, groupLabel, onSuccess, onFail) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(nome) ) { nome = "tmp_linee"; }
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(spessore) ) { spessore = 4; }
	this.map.createTempLayer(nome,colore,'',spessore);
}
*/
/* OVD CURRENTLY UNUSED: creaPolygonLayer_legacy (valid only for MapGuide)
openViewer.prototype.creaPolygonLayer_legacy = function(nome, colore, spessore_bordo, colore_bordo, group, groupLabel, onSuccess, onFail, setVisible) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(nome) ) { nome = "tmp_poligoni"; }
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(colore_bordo) ) { colore_bordo = "bf00ff"; }
	if ( empty(spessore_bordo) ) { spessore_bordo = 4; }
	this.map.createTempLayer(nome,colore,colore_bordo,spessore_bordo);
}
*/
/* OVD CURRENTLY UNUSED: creaGeneralLayers_legacy (valid only for MapGuide)
openViewer.prototype.creaGeneralLayers_legacy = function(nomi, tipologie, colori, spessori_bordo, colori_bordo, nomiGruppi, onSuccess) {

	//controllo parametri. Se vuoti passo valori di default
	if ( empty(nomi) ) { nomi = "tmp_layer"; }
	if ( empty(colori) ) { colori = "c519ff"; }
	if ( empty(colori_bordo) ) { colori_bordo = "bf00ff"; }
	if ( empty(spessori_bordo) ) { spessori_bordo = 4; }
	
	var a_layers=nomi.split(',');
	var a_colori=colori.split(',');
	var a_spessori_bordo=spessori_bordo.toString().split(',');

	var a_colori_bordo=colori_bordo.split(',');

	for(i=0;i<a_layers.length;i++){
		
		if ( empty(a_colori[i]) ) { a_colori[i] = "c519ff"; }
		if ( empty(a_colori_bordo[i]) ) { a_colori_bordo[i] = "bf00ff"; }
		if ( empty(a_spessori_bordo[i]) ) { a_spessori_bordo[i] = 4; }

		//nel vecchio visualizzatore si passa il colore e la trasparanza (primi due caratteri) in un'unica stringa, mentro adesso il colore e l'opacità devono essere divisi quindi si splitta la stringa del colore per ogni layer temporaneo. Si considera anche il caso in cui sia stato passato solo il colore e non la trasparenza. Per la trasparenza si deve convertire il vaore da esadecimale a decimale.
		if (a_colori[i].length=='8'){
			var fill_opacity=this.hex2dec(a_colori[i].substr(0,2));
			var fill_color = '#'+a_colori[i].substr(2,6);
		}else{
			var fill_opacity=1;
			var fill_color='#'+a_colori[i];
		}
		
		if (a_colori_bordo[i].length=='8'){
			var stroke_opacity=this.hex2dec(a_colori_bordo[i].substr(0,2));
			var stroke_color = '#'+a_colori_bordo[i].substr(2,6);
		}else{
			var stroke_opacity=1;
			var stroke_color='#'+a_colori_bordo[i];
		}

		//Per definire la trasparenza il colore va passato come un array rgba, dove l'elemento di posizione 3 rappresenta la trasparenza.
		var fill_color_array= ol.color.asArray(fill_color);
		fill_color_array[3]=fill_opacity;
		
		var stroke_color_array= ol.color.asArray(stroke_color);
		stroke_color_array[3]=stroke_opacity;
		//lo spessore del bordo si cabla qui invece che in openViewerMap.js, sostituendo una modifica del 2020-03-02. Questo permette di usare al funzione createTempLayer per creare layer temporanei con spessori diversi da 2, senza passare da creaGeneralLayers_legacy
		a_spessori_bordo[i]=2;
		this.map.createTempLayer(a_layers[i],fill_color_array,stroke_color_array,a_spessori_bordo[i]);
	}
}
*/
/* OVD CURRENTLY UNUSED: creaLabelLayer_legacy (valid only for MapGuide)
openViewer.prototype.creaLabelLayer_legacy = function(layer_name,colore,spessore,doRefresh,onSuccess) {
	this.map.createTempLayer(layer_name,colore,colore,spessore);
}
*/
/* OVD CURRENTLY UNUSED: addLinesInLayer_legacy (valid only for MapGuide)
openViewer.prototype.addLinesInLayer_legacy = function(wkt,layer_name,doRefresh, onSuccess, onFail) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...

	var a_wkt=wkt.split("|");
	if (empty(layer_name)){

		layer_name='redline';
	}
	
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(layer_name,a_wkt[i]);
		} else {
			this.addRedlineWKT(layer_name,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}
*/
/* OVD CURRENTLY UNUSED: emptyLayers_legacy (valid only for MapGuide)
openViewer.prototype.emptyLayers_legacy = function(layers_names,mapRefresh) {
	var lista_layer=layers_names.split("|");
	
	for (var i=0;i < lista_layer.length;i++) {
		this.clearTempLayers(lista_layer[i]);
	}
	if(mapRefresh===true){
		setTimeout($.proxy(function () {this.mapRefresh();},this),500);

	}
}
*/


/** WMS LAYERS INTEGRATION - CURRENTLY UNUSED
 * ---------------------------------------------------------------
 */

/* OVD CURRENTLY UNUSED - Fill the "QueryResult" page with plain text, and open it
openViewer.prototype.openInfoExtWMS = function(response) {
	if (typeof ov_WMSGetFeatureInfoCustomPage !== "undefined") {
		this.loadInfoPage('tabQueryResult',ov_WMSGetFeatureInfoCustomPage, false, response);
	} else {
		this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
		//var json = this.map.gmlToJson(response);
		var features = response.features;
		if(features.length > 0) {
			var html="<h1>Oggetti trovati: "+features.length+"</h1>";
			for(var i=0;i<features.length;i++) {
				html = html + "<h2>Oggetto</h2>";
	// 			//Per generare l'hyperlink mi prendo solamente la prima feature dell'array
	// 			feature=features[0];
				
				//Mi ricavo gli attributi
				properties=features[i].properties;
				//Mi ricavo il nome del layer
				var html = html + this.createElementsFromJSON(properties);
			
			}
			
			setTimeout(function(){$("#ov_info_wms_container").html(html);}, 500);
		}
	}
}
*/
/* OVD CURRENTLY UNUSED: createElementsFromJSONCustom
openViewer.prototype.createElementsFromJSONCustom = function(json, html){
	var html = "<ul>" + json + "</ul>";
	return html;
}
*/
/* OVD CURRENTLY UNUSED: createElementsFromJSON
openViewer.prototype.createElementsFromJSON = function(json){
	//console.log(json);
	var key;
	var html = "<ul>";
	for (key in json) {
		if (json.hasOwnProperty(key)) {
			//console.log(key + " = " + json[key]);
			html = html + "<li><label>" + key + "</label>:&nbsp;<span>" + json[key] + "</span>"; 
		}

	}  
	html = html + "</ul>";
	return html;
}
*/


/** CUSTOM WMS LAYERS INTEGRATION
 * ---------------------------------------------------------------
 */

/** Retrive the information/capabilities associated to a WMS url - STEP 1 (call overlayWmsSelectorScanUrl) */
openViewer.prototype.WMSopenCatalog = function(anUrl){
// 	$("#overlay_wms_selector_url").val(anUrl);
	this.inputWMSUrl.val(anUrl);
	this.overlayWmsSelectorScanUrl();
}
/* OVD ELIMINARE - NECESSARIO PRIMA CORREGGERE IL CODICE: this function has been renamed WMSopenCatalog (the original was unused) */
openViewer.prototype.WMSInternalCatalog = function(internalUrl){
    this.WMSopenCatalog(internalUrl);
}
/** Retrive the information/capabilities associated to a WMS url - STEP 2 (call urlToProxyWMS) */
openViewer.prototype.overlayWmsSelectorScanUrl = function(){
	var wms_url = this.inputWMSUrl.val();
	this.urlToProxyWMS(wms_url);
}
/** Retrive the information/capabilities associated to a Proxy WMS - STEP 3 (run an AJAX call) */
openViewer.prototype.urlToProxyWMS = function(wms_url){
	var that = this;
	var wms_url = wms_url.trim();
	
	this.editWMSselectorContainer.append("<span class='fa fa-spinner fa-spin'></div>");
	
	// console.log(OpenViewer_proxy);
	if ( this.ValidURL(wms_url) == true ) {
		// console.log(wms_url);
		$.ajax({
			url: OpenViewer_proxy,
			method: "POST",
			dataType: "json",
			data: {'service_type': 'wms', 'service_url': wms_url, 'action': 'GetCapabilities'},
			success: function(ret) {
if(this.showConsoleMsg) console.log(' WMS layer retrieved:',ret.data);
               
                if ( typeof ret == 'undefined' || typeof ret.success == 'undefined' || ret.success == false ) {
						that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_impossiblegetlayersfromurl+'</span>','warning',true);
						that.editWMSContainer.scrollTop(0);
				} else {
						that.editWMSselectorContainer.empty("");
						
						that.userWmsLayersList = ret.data;
						that.userWmsURL = wms_url;
						that.userWmsFormats = ret.formats;
						that.editWMSselectorContainer.html('<div id="ov_wms_selector_filter"><input id="ov_wms_selector_filter_text" placeholder="'+strings_interface.wms_filterlayers+'" title="'+strings_interface.wms_filterlayers+'"/></div>');
						that.editWMSselectorContainer.append('<div id="overlay_wms_selector_layers"></div>');
						that.overlayWmsSelectorShowData();
						$("#ov_wms_selector_filter_text").on("keyup", function() { that.overlayWmsSelectorShowData(); } );
				}
			},
			error: function() {
				that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_impossiblegetlayersfromurl+'</span>','warning',true);
				that.editWMSContainer.scrollTop(0);
			}
		});

	} else {
		this.editWMSselectorContainer.empty("");
		this.printMessages(this.editOverlayMessages,'<span>'+strings_interface.sentence_invalidurl+'</span>','warning',true);
		this.editWMSContainer.scrollTop(0);
	}
}
/** Retrieve the bitmap of the legend for a WMS layer */
openViewer.prototype.getWMSLegendFromProxy = function(url, scala, layer, tipo) {

	var that = this;
	var url_legend_action = "REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LEGEND_OPTIONS=fontName:Serif;fontAntiAliasing:true;fontSize=6;dpi:100&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+layer;
	var returned = '';
	$.ajax({
		url: OpenViewer_proxy,
		method: "POST",
		dataType: "json",
		async: false,
		data: {'service_type': 'legends', 'service_url': url, 'action': 'GetLegendGraphic', 'request': url_legend_action, 'tipo': tipo, 'layer' : layer },
		success: function(ret) {
			//html_stile="<br/><img id='stile_"+layerName+"' "+stile_immagine+" src='"+url+"REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LEGEND_OPTIONS=fontName:Serif;fontAntiAliasing:true;fontSize=6;dpi:100&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />";
			//htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+image_legend_layer+"' title='' />"+legend_label+"</label>"+html_stile+"</li>";
			returned = ret.data;
		},
		error: function() {
			return;
		}
	});
	return returned;
}
/** Show the list of available WMS layer as a table - STEP 4 */
openViewer.prototype.overlayWmsSelectorShowData = function(){
    var flagTwoLinesVersion = true;
	var layersData = this.userWmsLayersList;
	var wms_url = this.userWmsURL;
	var hash = this.hashCode(wms_url);
	
	var filterText = $('#ov_wms_selector_filter_text').val();
	filterText = filterText.toLowerCase();
	var abs_class=""
	//var img_scroll="<td class=\"scroll_y\">";
    var html = '';
	var img_html= '';
    
	// OVD added the visualization of the supported coordinates systems 
	// --------------------------------------------------------------------------------
	// We assume that the CRS supported by the server are the same for each layer
	// then we only look to the supported CRSs of the first layer found (layersData[0])
	html += '<table id="overlay_wms_selector_layers_table">';
	html += '<thead><tr class="head"><th scope="col" id="CRSsupported">'+strings_interface.wms_supportedCRS+'</th></tr></thead>';
	html += '<tbody><td headers="CRSsupported">';
	if (layersData[0].crs_supported.includes(this.map.mapProjection)) {
		html += '<div id="overlay_wms_selector_layers_table_crs_supported">';
		html += layersData[0].crs_supported.join(' ')+'</div></td></tbody>';
	}
	else if (layersData[0].crs_supported.includes('CRS:84')&&(this.map.mapProjection=='EPSG:4326'||this.map.mapProjection=='EPSG:3857'||this.map.mapProjection=='EPSG:900913')) {
		// very special case: WMS supporting CRS:84 (for example some data from te Nasa Earth Obvservation service) can provide data to map projected similarly to EPSG 4326
		html += '<div id="overlay_wms_selector_layers_table_crs_supported">';
		html += layersData[0].crs_supported.join(' ')+'</div></td></tbody>';
	}
	else {
		html += '<div id="overlay_wms_selector_layers_table_crs_notsupported">';
		html += layersData[0].crs_supported.join(' ')+'<br>';
		html += strings_interface.wms_CRSunsupported+'</div></td></tbody>';
	}
	html += '</table>';
	html += '&nbsp;<br>&nbsp;';
    
	// creation of the table to display the characteristics of the layers provided by the current WMS server
	// -----------------------------------------------------------------------------------------------------
	html += '<table id="overlay_wms_selector_layers_table"><thead><tr class="head">';
	html += '<th scope="col" id="title">'+strings_interface.word_title+'</th>';
	html += '<th scope="col" id="layer">'+strings_interface.word_layer+'</th>';
    if(flagTwoLinesVersion != true) html += '<th scope="col" id="description">'+strings_interface.word_description+'</th>';
	//html += '<th scope="col" id="addlayer"><span class="fa fa-plus-circle"></span> '+strings_interface.word_add+'</th>';
	html += '<th scope="col" id="addlayer"><center>'+strings_interface.word_add+'</center></th>';
	html += '<th scope="col" id="layerstyles"><center>'+strings_interface.word_styles+'</center></th>';
	html += '<th scope="col" id="scalevisibility">'+strings_interface.word_visibility+'</th>';
	//html += '<th>'+strings_interface.word_actions+'</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for (var i=0; i < layersData.length; i++) {
		
		var layer_name = layersData[i].name;  // this.userWmsLayersList[i].name;
		var layer_title = layersData[i].title; // this.userWmsLayersList[i].title;
		var layer_abstract = layersData[i].abstract.trim();
		var layer_minscale = layersData[i].min_scale; // minimum scale of visibility allowed by the server
		var layer_maxscale = layersData[i].max_scale; // maximum scale of visibility allowed by the server
		
		if ( layer_title.toLowerCase().indexOf(filterText) == -1 && 
			layer_name.toLowerCase().indexOf(filterText) == -1 && 
			layer_abstract.toLowerCase().indexOf(filterText) == -1)
			continue;
			
		// calculate the minimum and maximum supported resolution
		//var correctionFactor = 0.00000001; // correction factor used to fix potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
		var scaleToResolution = this.map.getMapView().getResolution()/this.map.getScale();
		if (layer_minscale != undefined && layer_minscale != '' && layer_minscale > 0)
			layersData[i].minResolution = Math.max(this.map.getMapView().getMinResolution(), (layer_minscale * scaleToResolution)+this.correctionOffsetScaleMin);
		else
			layersData[i].minResolution = this.map.getMapView().getMinResolution();
        
		if (layer_maxscale != undefined && layer_maxscale != '' && layer_maxscale > 0 && layer_maxscale > layer_minscale)
			layersData[i].maxResolution = Math.min(this.map.getMapView().getMaxResolution(), (layer_maxscale * scaleToResolution)+this.correctionOffsetScaleMax);
		else
			layersData[i].maxResolution = this.map.getMapView().getMaxResolution();
            
		//layersData[i].minZoom = this.map.getMapView().getZoomForResolution(layersData[i].maxResolution);
		//layersData[i].maxZoom = this.map.getMapView().getZoomForResolution(layersData[i].minResolution);
//console.log(layer_title+':\n- min resolution '+layersData[i].minResolution +'\n- max resolution '+layersData[i].maxResolution +'\n- min scale '+layer_minscale +'\n- max scale '+layer_maxscale +'\n- scaleToResolution '+scaleToResolution );

		html += '<tr class="';
		if ( (i % 2) == 0 ) { html += 'odd'; } else { html += 'even'; }
//		if (layersData[i].styles[style_name].legend_url_height > 200){
//			img_scroll="class=\"scroll_y\"";
//		}
		// fill column "TITLE"
		html += '"><td headers="title">' + layer_title + '</td>';
		        
		// fill column "NAME"
		html += '<td class="scroll" headers="layer">' + layer_name + '</td>';
		
		// fill column "DESCRIPTION" (1 line version)
		if(flagTwoLinesVersion != true) html += '<td '+abs_class+' headers="description">' + layer_abstract + '</td>';
		
		// fill columns "ADDLAYER" and "STYLES"
        
		for (var style_name in layersData[i].styles) {
            // style_name equals layersData[i].styles[style_name].name
            var style_leg_url = layersData[i].styles[style_name].legend_url_href;
			var style_leg_width = layersData[i].styles[style_name].legend_url_width;
			
/* OVD OLD VERSION - DELETE
			if(style_leg_height<200){
				img_html = '<td headers="addlayer"><center>';
			}
			else{
				//style_leg_height=200;
                var img_scroll="<td class=\"scroll_y\">";
				img_html = img_scroll;
			}
			html+=img_html;
*/	
/* OVD OLD VERSION - DELETE
			if ( typeof style_leg_url != 'undefined' && style_leg_url != '') {
				legend_html = "<a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")' title='"+strings_interface.wms_showhidestyle+"'><img id='img_" + hash + "_" + i +"' src='"+style_leg_url+"' class='hide' style='width: "+ style_leg_width + "px; height: " + style_leg_height + "px;'/><span class='fa fa-eye'></span>";
				//legend_html += " "+strings_interface.wms_showhidestyle.toLowerCase();
				legend_html += "</a>";
            } else {
                legend_html = strings_interface.wms_notavailable.toLowerCase();
            }
*/            
			// If the source is an internal WMS server, we call the Proxy to get the legend image server
			var wms_url_internal = this.internalWmsURL;
/* OVD OLD VERSION - DELETE
			if(wms_url == wms_url_internal) {
				var scala=""; //Non serve?
				var returned_img = this.getWMSLegendFromProxy(wms_url, scala, layer_name,'wms');
			
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='layerstyles' class='nowrap'><a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='data:image/png;base64," + returned_img + "' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> "+strings_interface.wms_showhidestyle.toLowerCase()+"</a><br/>";
			} else if (false) {
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='layerstyles' class='nowrap'><a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='"+layersData[i].styles[style_name].legend_url_href+"' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> "+strings_interface.wms_showhidestyle.toLowerCase()+"</a><br/>";
			}
*/
            if(wms_url == wms_url_internal) { // wms_url is the URL selected by the user, from which we must retrieve the layers
				var scala="";
				var returned_img = this.getWMSLegendFromProxy(wms_url, scala, layer_name,'wms');
                var img_source_html = " src='data:image/png;base64," + returned_img+"' ";
			
/* OVD OLD VERSION - DELETE
				// fill column "ADDLAYER"
				html += '<td headers="addlayer"><center>';
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'/><span class='fa fa-plus-circle'></span>";
				//html += " "+strings_interface.sentence_addtomap.toLowerCase();
				html += "</a></div></center></td>";
				
				// fill column "LAYERSTYLES"
				html += "<td headers='layerstyles' class='nowrap'><a href='javascript:;' onclick='open_viewer   .openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='data:image/png;base64," + returned_img + "' class='hide' style='width: \'"+ style_leg_width + "\'px; height: \'" + style_leg_height + "\' px; title='"+strings_interface.wms_showhidestyle+"'/><center><span class='fa fa-eye'></span>";
				//html += " "+strings_interface.wms_showhidestyle.toLowerCase();
				html += "</a><br/>";
*/
                
			} else {
                var img_source_html = "' src='"+style_leg_url+"' ";
/* OVD OLD VERSION - DELETE
				// fill column "ADDLAYER"
				html += '<td headers="addlayer"><center>';
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'><center><span class='fa fa-plus-circle'></span>";
				//html += " "+strings_interface.sentence_addtomap.toLowerCase();
				html += "</a></div></center></td>";
				
				// fill column "LAYERSTYLES"
				html += "<td headers='layerstyles' class='nowrap'><center>" + legend_html + "<br/>";
*/
			}
			
			// create the content of the column "LAYERSTYLES"
			if ( typeof style_leg_url != 'undefined' && style_leg_url != '') {
				legend_html = "<a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")' title='"+strings_interface.wms_showhidestyle+"'>";
				//legend_html = "<img id='img_" + hash + "_" + i +img_source_html+" class='hide' style='width: "+ style_leg_width + "px; height: " + style_leg_height + "px;'/><span class='fa fa-eye'></span>";
				legend_html += "<img id='img_" + hash + "_" + i +img_source_html+" class='hide' style='width: "+ style_leg_width + "px;'/><span class='fa fa-eye'></span>";
				//legend_html += " "+strings_interface.wms_showhidestyle.toLowerCase();
				legend_html += "</a>";
			} else {
				legend_html = strings_interface.wms_notavailable.toLowerCase();
			}
			
			// fill column "ADDLAYER"
			html += '<td headers="addlayer"><center>';
			html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'><center><span class='fa fa-plus-circle'></span>";
			//html += " "+strings_interface.sentence_addtomap.toLowerCase();
			html += "</a></div></center></td>";
			
			// fill column "LAYERSTYLES"
			html += "<td headers='layerstyles' class='nowrap'><center>" + legend_html + "<br/>";
// 	
		}
		html += '</center></td>';
	
		// fill column "SCALEVISIBILITY" (SCALE LIMITS)
		html += '<td headers="scalevisibility">'+strings_interface.word_visible;
		if ( typeof layer_minscale != 'undefined' && layer_minscale != '')
			html += ' '+strings_interface.word_from.toLowerCase()+' 1:' + Math.round(layer_minscale);
		if ( typeof layer_maxscale != 'undefined' && layer_maxscale != '' )
			html += ' '+strings_interface.word_to.toLowerCase()+' 1:' + Math.round(layer_maxscale);
		if ( (typeof layer_minscale == 'undefined' || layer_minscale == '') && (typeof layer_maxscale == 'undefined' || layer_maxscale == '' ) )
			html += ' '+strings_interface.sentence_atallscales.toLowerCase();
		html += '</td>';

        html += '</tr>';
        
		// fill row "DESCRIPTION" (2 lines version)
		if(flagTwoLinesVersion && layer_abstract != '') {
			html += '<tr><td '+abs_class+' colspan=5><span id="overlay_wms_selector_layers_table_description">'+strings_interface.word_description+':<br>'+layer_abstract + '</span></td></tr>';
		}
	
	}
	
	html += '</tbody>';
	html += '</table>';
	
	$('#overlay_wms_selector_layers').html(html);
}
/** Add a WMS layer to the map */
openViewer.prototype.overlayWmsSelectorAdd = function(wms_url, i, style_name, style_url){
	if (typeof style_url == 'undefined') style_url='';

	var layersData = this.userWmsLayersList;
	var formats = this.userWmsFormats;
	var wms_url = this.userWmsURL;
	var wms_url_internal = this.internalWmsURL;

    // set the best format among the supported ones (priorities: PNG8, PNG, JPEG)
	var format = '';
	formats.forEach(function(f) {
		if (f == 'image/png; mode=8bit')
			format = 'image/png; mode=8bit';
	});
	if (format == '') {
		formats.forEach(function(f) {
			if (f == 'image/png8')
				format = 'image/png8';
		});
	}
	if (format == '') {
		formats.forEach(function(f) {
			if (f == 'image/png')
				format = 'image/png';
		});
	}
	if (format == '') {
		formats.forEach(function(f) {
			if (f == 'image/jpeg')
				format = 'image/jpeg';
		});
	}
	if (format == '') {
		// PNG is the fallback
		format = 'image/png';
	}
	
	var hash = this.hashCode(wms_url);
	var layer_name = layersData[i].name;
	var layer_title = layersData[i].title;
	
	if(wms_url == wms_url_internal) {
		var newLayer = this.map.addWmsInternalLayer(wms_url, layersData, i, style_name, format);
	} else {
		var newLayer = this.map.addWmsLayer(wms_url, layersData, i, style_name, format);
	}
	//if (typeof newLayer != "undefined" && newLayer != '') newLayer.set('legendUrl','uffa'); //style_url);

	var responseMsg = '';
	var responseType = 'ok';

	if (layersData[i].crs_supported.includes(this.map.mapProjection)) {
		// nothing to do
	}
	else {
		responseMsg += strings_interface.sentence_layerwillbereprojected+'<br>';
		//responseType = 'warning';
		responseType = 'ok';
	}
		
	if(this.map.WmsLayerAdded != true) {
		responseMsg += strings_interface.sentence_layeraleradyexisting+'<br>';
        responseType = 'warning';
		this.printMessages(this.editOverlayMessages,'<span>'+responseMsg+'</span>',responseType,true);
	}
	else {
		var layerCrs = newLayer.getSource().getProjection().getCode();
        
        responseMsg += strings_interface.sentence_layeradded+'<br>';
		this.printMessages(this.editOverlayMessages,'<span>'+responseMsg+'</span>',responseType,true);
	
		if ( $('#map_wms_custom_label').length == 0 ) {
			var label = $('<div>');
			label.attr('id','map_wms_custom_label');
			label.html(strings_interface.sentence_thirdpartyWMS);
			$('#ov_legend_wmsUser').append(label);
			var div = $('<div>');
			div.attr('id','map_wms_custom_container');
			div.addClass('form-checkboxes');
			$('#ov_legend_wmsUser').append(div);
			var ul = $('<ul>');
			ul.attr('id','map_ul_legenda_wms_custom');
			ul.attr('class', 'legenda childrenof');
			$('#map_wms_custom_container').append(ul);
		}

		if(wms_url == wms_url_internal) {
			var scale=''; // needed?
			var returned_img = this.getWMSLegendFromProxy(wms_url, scale, layer_name,'wms');
			
			///TODO check why the legend is not visible
			var div_legend_html = '<div id="custom_wms_layer_legend_' + hash + '_' + i + '" class="custom_wms_legend hide" style="background: url(\'data:image/png;base64,' + returned_img + '\'); width: '+ layersData[i].styles[style_name].legend_url_width +'px; height: '+ layersData[i].styles[style_name].legend_url_height +'px;""></div>';
			
		} else {
			var div_legend_html = '<div id="custom_wms_layer_legend_' + hash + '_' + i + '" class="custom_wms_legend hide" style="background: url(\'' + layersData[i].styles[style_name].legend_url_href +'\'); width: '+ layersData[i].styles[style_name].legend_url_width +'px; height: '+ layersData[i].styles[style_name].legend_url_height +'px;""></div>';
		}
	
		var labelTip = strings_interface.sentence_scalevisibility+layersData[i].min_scale+'-'+layersData[i].max_scale+' ('+layerCrs+')';
        var labelDef = '<li><a id="expand_' + hash + '_' + i +'" href="javascript:;" onclick="open_v/*i*/ewer.openCloseDiv(\'custom_wms_layer_legend_' + hash + '_' + i + '\')" class="plus_stile"></a><input id="custom_wms_layer_checkbox_' + hash + '_' + i + '" type="checkbox" checked="checked" onclick="open_viewer.userWmsLayerViewToggle(\'' + hash + '_' + i + '\', \'' + layer_title +'\')" class="form-checkbox">&nbsp;</input><label title="'+labelTip+'">'+ layer_title +'</label><br/>' + div_legend_html + '</li>';
		// OVD changed "append" to "prepend" to create a list of legend items coherent with the real list of layers
		$("#map_ul_legenda_wms_custom").prepend(labelDef);
	}
	this.editWMSContainer.scrollTop(0);
}
/** Write a notification message on the WMS adding panel */
openViewer.prototype.printMessages = function(div,message,status,timeout){
	div.empty();
	if(status=='ok'){
		div.html(message);
		div.css("color","black");
	}
	else{
		div.html(message);
		div.css("color","red");
	}
	if(timeout != false){
		setTimeout(function(){
			div.empty();
		}, 4000);
	}
}
/** Show/Hide a custom WMS layer */
openViewer.prototype.userWmsLayerViewToggle = function(name, layer_name) {
	if ( $('#custom_wms_layer_checkbox_' + name).is(':checked') )
		this.map.layerViewToggle(layer_name, true);
	else
		this.map.layerViewToggle(layer_name, false);
}
/** Remove all custom WMS layers */
openViewer.prototype.removeAllWmsUserLayers = function() {
	this.map.removeAllWmsUserLayers(layer);
	// refresh the legend
	this.refreshLegend();
}


/** REDLINE - CURRENTLY UNUSED
 * ---------------------------------------------------------------
 */

/* OVD CURRENTLY UNUSED: addRedlineWKT (add a WKT object to a layer)
openViewer.prototype.addRedlineWKT = function(layer_name,wkt,clear_before) {
// if(this.showConsoleMsg) console.log("addRedLineWkt");
	clear_before = (typeof clear_before !== 'undefined') ?  clear_before : true;
	return this.map.addRedlineWKT(layer_name,wkt,clear_before);
};
*/
/* OVD CURRENTLY UNUSED: clearRedline (clear the redline objects of a layer)
openViewer.prototype.clearRedline = function(layer_name) {
	return this.map.clearRedline(layer_name);
};
*/
/* OVD CURRENTLY UNUSED: clearTempLayers (clear all or a subset of layers)
openViewer.prototype.clearTempLayers = function(layers_names,clear_ol_layers) {
	if (typeof clear_ol_layers == 'undefined') {var clear_ol_layers=true;}
	if (typeof layers_names !== 'undefined') {
		var a_layers_names=layers_names.split(",");
		for (var i=0;i < a_layers_names.length;i++) {
			this.map.clearTempLayers(a_layers_names[i],clear_ol_layers);
		}
	} else {
		this.map.clearTempLayers();
	}
};
*/


/** MAP PRINT FUNCTIONALITY
 * ---------------------------------------------------------------
 */

/** Initialize and open the "print dialog" */
openViewer.prototype.loadPrintMap = function(url) {
	// handle the print dialog
	var div_print_dialog=$(this.printMapDiv);

	var dlg=$(this.printMapDiv).dialog({
		title: strings_interface.sentence_openprintdialog,
		resizable: true,
		autoOpen:false,
		modal: true,
		hide: 'fade',
		width:500,
		height:550
// 		,close: function () {
// console.log("dialog close");
// 			$(div_print_dialog).dialog("close");
// 		}
	});

	dlg.load(url, function(){
		dlg.dialog('open');
	}); 
};
/* OVD CURRENTLY UNUSED: getPrintablePage - COME RIATTIVARLA ?
openViewer.prototype.getPrintablePage = function(label,format,adatta_scala) {
	
	var ol_map=this.map.map;
	
	var dims = {	//mm
		a0: [1189, 841],
		a1: [841, 594],
		a2: [594, 420],
		a3: [420, 297],
		a4: [297, 210],
		a5: [210, 148]
	};

// 	var loading = 0;
// 	var loaded = 0;

// 	document.body.style.cursor = 'progress';

// console.log(format);
	
	//Cambiare i dpi se si vogliono stampe con più qualità!!!Controindicazioni: dimensione del pdf generato più grande, le etichette dei testi vengono più piccole per cui
	// non è garantito che la mappa stampata sia uguale a quella che si vede a schermo 
	var dpi = 150; //dpi
	
	var dim = dims[format];
		
	var current_center=this.getMapCenter();
	var current_scale=this.getMapScale();
	
	//Dimensione in pixel dell'immagine
	var width = Math.round(dim[0] * dpi / 25.4);
	var height = Math.round(dim[1] * dpi / 25.4);

	switch (adatta_scala) {
		
		case "adatta":
			var size = ol_map.getSize();
			var extent = ol_map.getView().calculateExtent(size);
		break;
		
		case "scala":
			//Dimensione in metri su mappa
			var width_reale_m = Math.round(dim[0]*current_scale/1000); 
			var height_reale_m = Math.round(dim[1]*current_scale/1000);
			
			var extent = [parseFloat(current_center.X-(width_reale_m/2)),parseFloat(current_center.Y-(height_reale_m/2)),parseFloat(current_center.X+(width_reale_m/2)),parseFloat(current_center.Y+(height_reale_m/2))];
		break;
	}
	
// console.log("dim",dim);
// console.log("width",width);
// console.log("height",height);
// 
// console.log("width_reale_m",width_reale_m);
// console.log("height_reale_m",height_reale_m);
// 
// console.log("size",size);
// console.log("extent",extent);

	var stato = this.getStato();

	var a_ol_layers=Object.keys(stato);

	//TODO Si prende il primo layer. Se ci sono wms esterni andranno presi tutti(?)
	var ol_layer=a_ol_layers[0];
	var source=this.map.getMapLayerSourceByName(ol_layer);

	var that=this;


	var imageLoadStart = function() {
		
// 		++loading;
	};

	var imageLoadEnd = function() {

// 		++loaded;
// 		if (loading === loaded) {

			var canvas = this;
			window.setTimeout(function() {
//				loading = 0;
// 				loaded = 0;
				
				///TODO sarebbe migliore la qualità, ma troppo pesante il file generato
// 				//PNG
// 				var data = canvas.toDataURL('image/png');
// 				var pdf = new jsPDF('landscape', 'mm', format,true);
// 				pdf.addImage(data, 'PNG', 0, 0, dim[0], dim[1],'','FAST');
				
				//workaround per aggirare il problema di stampa con sfondi con trasparenza:  con il jpeg lo sfondo in trasparenza viene nero (es. catasto senza limiti amministrativi), quindi si crea un altro canvas con sfondo bianco su cui poi copiare l'immagine jpeg creata con la funzione toDataURL.

				var destinationCanvas = document.createElement("canvas");
				destinationCanvas.width = canvas.width;
				destinationCanvas.height = canvas.height;

				var destCtx = destinationCanvas.getContext('2d');

				//create a rectangle with the desired color
				destCtx.fillStyle = "#FFFFFF";
				destCtx.fillRect(0,0,canvas.width,canvas.height);

				//draw the original canvas onto the destination canvas
				destCtx.drawImage(canvas, 0, 0);
				
				
				//JPEG
				var data = destinationCanvas.toDataURL('image/jpeg');
				var pdf = new jsPDF('landscape', 'mm', format);
				
				pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
				
				//pdf.setTextColor(100,100,100);
			
				//Si disegna il rettangolo che contiene titolo e scala
				pdf.setFillColor(255,255,255);
				pdf.rect(0, 0, dim[0], 7, 'F');
				
				//Si setta la dimensione del testo
				pdf.setFontSize(14);
				
				//Titolo (se compilato)
				if (label!="") {
					pdf.text(label,2,5);
				}
				
				if (adatta_scala=="scala") {
				
					//Scala
					//Si calcola la larghezza del testo della scala per posizionarlo correttamente
					var strWidth = pdf.getStringUnitWidth("Scala 1:"+current_scale) * pdf.internal.getFontSize() /(72/25.6);
					pdf.text("Scala 1:"+current_scale,dim[0]-strWidth-2,5);
					
				}
				
				//Si salva il pdf
				pdf.save('map.pdf');
				
				source.un('imageloadstart', imageLoadStart);
				source.un('imageloadend', imageLoadEnd, canvas);
				source.un('imageloaderror', imageLoadEnd, canvas);
// 				ol_map.setSize(size);
// 				ol_map.getView().fit(extent);
				
				ol_map.updateSize();
				
				that.setMapCenter(current_center);
				that.setMapScale(current_scale);
				
				ol_map.renderSync();

				document.body.style.cursor = 'auto';
			}, 200);
// 		}
	};

	ol_map.once('postcompose', function(event) {
		source.on('imageloadstart', imageLoadStart);
		source.on('imageloadend', imageLoadEnd, event.context.canvas);
		source.on('imageloaderror', imageLoadEnd, event.context.canvas);
	});

	ol_map.setSize([width, height]);
	//var size = @type {ol.Size} ;
	var size = (ol_map.getSize());
	ol_map.getView().fit(extent,{size: size, constrainResolution: false});
	ol_map.renderSync();
}
*/


/** TRACKING FUNCTIONALITY
 * ---------------------------------------------------------------
 */

/** tracking/Geolocation - E' POSSIBILE ATTIVARLO ??? */
openViewer.prototype.trackingPosition = function(){
	console.log("setTracking");
	this.map.mapSetTracking(true);
}


/** GENERAL UTILITIES
 * ---------------------------------------------------------------
 */

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
/** Calculate a simple hash code */
openViewer.prototype.simpleHash = function(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}
/** Calculate the hash code of an url (used to create unique ID for layers names) */
openViewer.prototype.hashCode = function(str) {
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
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
/** Check the validity of an URL */
openViewer.prototype.ValidURL = function(str) {
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if(!regex .test(str)) {
		return false;
	} else {
		return true;
	}
}
/** Convert an hexadecimal to decimal */
openViewer.prototype.hex2dec = function (theHex) {
   if ( (theHex.charAt(0) > "F") || (theHex.charAt(1) > "F") ) {
      console.log("Hexadecimal (00-FF) only, please...");
      return 0;
   }
   var retDec  = parseInt(theHex,16)/255;
   return retDec;
}



/* OVD ELIMINARE - AL MOMENTO NON E' USATO, MA POTREBBE ESSERE UTILE SE SI RIPRISTINA I WMS INTERNAL
openViewer.prototype.overlayWmsInternal = function() {
	var wms_url_internal = this.internalWmsURL;
	this.urlToProxyWMS(wms_url_internal);
}
*/
/* OVD ELIMINARE - UNUSED
openViewer.prototype.addLayer = function(layer){
	this.map.addingLayer(layer);
}
*/




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


