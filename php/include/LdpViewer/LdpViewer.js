/**
 * 
 * 
 * File: ldpviewer.js
 * 
 * Codice javascript per il visualizzatore LdpViewer
 * 
 * 
 * 
 * 
 */
/*
 * LdpTreeItem
 */
var LdpTreeItem = function(name, isGroup, tObject, layerData) {
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

LdpTreeItem.prototype.Attach = function(child) {
	if(this.children == null)
		this.children = new Array();

	this.children.push(child);
};
/*
 * LdpTreeItem
 */


var LdpViewer = function(params) {
//console.log("LdpViewer",params);
	this.name = params.name;
	
	//componenti
	this.container					= $("#" + params.components.container.div);
	
	this.titleDiv			= $("#" + params.components.title.div);
	this.titleToggleInfo			= $("#" + params.components.title.toggleInfo);
	
	this.footerPanel 				= $("#" + params.components.footer.panel);
	this.footerPanelInfoSelezione	= $("#" + params.components.footer.infoSelezione);
	this.footerPanelScala			= $("#" + params.components.footer.scala);
	this.footerPanelScalaInputId	= params.components.footer.scalaInputId;
	
	this.vistasuPanel				= $("#" + params.components.vistasu.panel);
	this.vistasuPanelContainer		= $("#" + params.components.vistasu.container);
	this.vistasuPanelBase			= $("#" + params.components.vistasu.base);
	
	//Sezione Per WMS Esterni (tramite button Aggiungi WMS)
	
	this.editWMSMainContainer		= $("#" + params.components.legend_wmsExternal.mainContainer);
	this.editWMSBackground			= $("#" + params.components.legend_wmsExternal.background);
	this.editWMSContainer			= $("#" + params.components.legend_wmsExternal.container);
	this.editWMSselectorContainer	= $("#" + params.components.legend_wmsExternal.wmsContainer);
	this.editLegendPanel			= $("#" + params.components.legend_wmsExternal.panel);
	this.editOverlayMessages		= $("#" + params.components.legend_wmsExternal.messages);
	this.buttonCloseWMSContainer	= $("#" + params.components.legend_wmsExternal.button);
	this.inputWMSUrl				= $("#" + params.components.legend_wmsExternal.inputUrl);
	
	//Sezione Tematismi + Mappe di Base
	this.legendPanel				= $("#" + params.components.legend.panel);
	this.legendToggleButton			= $("." + params.components.legend.button);
	this.legendPanelContainer		= $("#" + params.components.legend.container);
	this.legendPanelBase			= $("#" + params.components.legend.base);
	
	//Sezione WMS da Geoserver INTERNO (o da MetaRepo)
	this.legendPanelWMS				= $("#" + params.components.legend_wmsInternal.panel);
	this.legendPanelWMSContainer	= $("#" + params.components.legend_wmsInternal.container);

	this.infoPanelContainer			= $("#" + params.components.info.container);
	this.infoPanelContainerMain			= $("#" + params.components.info.containerMain);
	this.infoPanelTabs				= $("#" + params.components.info.infoTabs);
	this.infoPanelTabsHeader				= $("#" + params.components.info.infoTabsHeader);
	this.infoPanelActiveTab			= params.components.info.activeTab;
	this.infoPanelInfo				= $("#" + params.components.info.info);
	this.infoPanelRicerca			= $("#" + params.components.info.ricerca);
	this.infoPanelHelp				= $("#" + params.components.info.help);
	this.infoPanelMenu				= $("#" + params.components.info.menu);
	this.infoPanelwmsGETFeature		= $("#" + params.components.info.wmsGETFeature);
	this.infoPanelClassTabs			= $("." + params.components.info.classTabs);

	this.toolbarPanel				= $("#" + params.components.toolbar.panel);
	this.toolbarPanelRight			= $("#" + params.components.toolbar.panelRight);
	this.toolbarPanelContainer		= $("#" + params.components.toolbar.container);
	this.toolbarPanelWMSlayer		= $("#" + params.components.toolbar.addWms);
	this.toolbarPanelToggleContainer	= $("#" + params.components.toolbar.toggleContainer);
	this.toolbarPanelToggleVistasu	= $("#" + params.components.toolbar.toggleVistasu);
	this.toolbarPanelToggleLegend	= $("#" + params.components.toolbar.toggleLegend);
	this.toolbarPanelZoomSelection	= $("#" + params.components.toolbar.zoomSelection);
	this.toolbarPanelMeasureLine	= $("#" + params.components.toolbar.measureLine);
	this.toolbarPanelMeasureArea	= $("#" + params.components.toolbar.measureArea);
	this.toolbarPanelMeasure		= $("#" + params.components.toolbar.measure);
	this.toolbarPanelCursorMove		= $("#" + params.components.toolbar.cursorMove);
	this.toolbarPanelCursorSelect	= $("#" + params.components.toolbar.cursorSelect);
	
	this.printMapDiv				= $("#" + params.components.print_map.div);
	
	this.tooltipDiv					= $("#" + params.components.tooltip.div);
	this.mapDiv 					= $("#" + params.components.map.div);
	this.mapBaseLayers				=  params.components.map.base_layers;
	this.drawWKTDiv					= $("#" + params.components.draw_wkt.div);
	
	this.internalWmsURL				= params.components.wms.wmsInternalUrl;

	this.timeoutId=-1;
	this.timeoutIdChangeView=-1;
	
	this.legendTree = undefined;
	
	this.lockWheel=false;
	this.startPixel=undefined;
	this.stato = params.stato;
	this.menu_page					= params.components.menu_page.page;
	this.menu_link					= $("#" + params.components.menu_page.link);

	//Variabile per gestire HELP con Bootstrap Tour
	this.tour=null;
	
	this.touchBuffer=15;	//Valore in pixel del buffer sugli eventi di tipo touch

	this.customWmsLayersList = null; //Lista dei Layer WMS ritornati dalla chiamata
	this.customWmsURL = null; //URL del WMS cercato
	this.customWmsFormats = null; //Array di formati supportati dal server WMS
	
	//this proxy set setta se il proxy è definito o meno
	this.ProxySet = params.proxy;
	
	var mapParams = { 
		'stato':		params.stato, 
		'mapOptions':	params.mapOptions, 
		'mapDiv':       this.mapDiv[0],
		'tooltipDiv':	this.tooltipDiv,
		'drawWKTDiv':	this.drawWKTDiv,
		'ProxySet' :    this.ProxySet,
		'baseLayers':   this.mapBaseLayers
	};
	//console.log('mapParams', mapParams);
	this.map = new LdpMap( mapParams );

//	this.initPanels();
// 	this.ev_window_resize();
	
	///Gestione eventi
	// resize della finestra
	$(window).on("resize","",$.proxy(this.ev_window_resize,this));
	
	//back e forward delle pagine di info
	$(window).on("popstate","",$.proxy(this.ev_pop_state,this));
	

	//Cambio manuale di scala
	this.footerPanelScala.on("click",'',$.proxy(this.ev_footer_scala_click,this));
	this.legendPanel.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this));
	this.legendPanel.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this));
	
	this.legendPanel.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));
	this.legendPanel.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this));

	this.legendPanel.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));
	this.legendPanel.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this));
	
	this.editLegendPanel.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));
	this.editLegendPanel.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this));

	this.legendPanelBase.on("click",".base_layers",$.proxy(this.ev_legend_base_click,this));

	this.legendPanelWMS.on("click",".legenda_layer_checkbox",$.proxy(this.ev_legenda_layer_checkbox_click,this));
	this.legendPanelWMS.on("click",".legenda_group_checkbox",$.proxy(this.ev_legenda_group_checkbox_click,this));
	
	this.legendPanelWMS.on("click",".plus",$.proxy(this.ev_legenda_plus_click,this));
	this.legendPanelWMS.on("click",".minus",$.proxy(this.ev_legenda_minus_click,this));

	this.legendPanelWMS.on("click",".plus_stile",$.proxy(this.ev_legenda_plus_stile_click,this));
	this.legendPanelWMS.on("click",".minus_stile",$.proxy(this.ev_legenda_minus_stile_click,this));

	//Evento per caricare una nuova pagina dentro al div di info, anzichè in una nuova pagina
	this.infoPanelInfo.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelRicerca.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelHelp.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	this.infoPanelwmsGETFeature.on("click","a",$.proxy(this.ev_info_page_href_click,this));
	
	this.infoPanelInfo.on("submit","form",$.proxy(this.ev_info_page_submit_form,this));
	
	//SimpleModal
	$(document).on("click","#simplemodal-container a",$.proxy(this.ev_simplemodal_href_click,this));
	
// console.log("LdpViewer FINE");
	///TODO aggiungere altri eventi qui

	this.legendToggleButton.on("click", $.proxy(this.toggleLegendContainer,this));
	this.buttonCloseWMSContainer.on("click", $.proxy(this.openCloseWMSOverlayContainer,this));
	
};

LdpViewer.prototype.initPanels = function() {
//console.log("initPanels");
	
	// LeftToolbar panel
	this.toolbarPanelContainer.resizable({
		handles: 'e',
		minWidth: 270,
		containment: this.container
	});
	
	
	// info panel
	this.infoPanelContainer.resizable({
		handles: 'w',
		minWidth: 300,
		containment: this.container
	});
	
	$(".ui-resizable").on('resize', function (e) {
		e.stopPropagation(); 
	});
	
	this.infoPanelTabs.tabs();
	this.toolbarPanel.tabs();
}

LdpViewer.prototype.ev_pop_state = function(event) {
	var e = event.originalEvent;
	if (e.state!=null) {
		this.loadInfoPage(e.state.tabName,e.state.url,e.state.spinner,e.state.data,false);
	}
}


LdpViewer.prototype.ev_window_resize = function() {
	var this_viewer = this;
	
	var title_height=this.titleDiv.height();
	var footer_height=this.footerPanel.height();

	//var height = $(window).height() - 80;
	var height = $(window).height() - title_height - footer_height - 3;
	var width = $(window).width();
	this.mapDiv.height(height);
	this.mapDiv.width(width);

	//Per mantenere la larghezza del pannello di info.
	var info_width=Math.max(this.infoPanelContainer.width(),300);

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
			//Forzo la chiamata per bugfix IE
			this.infoPanelContainer.css('left',(width-info_width)+"px");
			this.infoPanelContainer.css('right','0px');
		} else {
			//Forzo la chiamata per bugfix IE
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
	
	this.infoPanelInfo.css( 'height', (height-15-height_info_tabs_header)+'px' );
	this.infoPanelRicerca.css( 'height', (height-15-height_info_tabs_header)+'px' );
	
	this.infoPanelInfo.css( 'overflow', 'auto' );
	this.infoPanelRicerca.css( 'overflow', 'auto' );
	
	this.infoPanelContainer.find( '.ui-resizable-w' ).css( 'height', (height)+'px' );
	this.toolbarPanelContainer.find( '.ui-resizable-e' ).css( 'height', (height)+'px' );
	//this.infoPanelContainer.css( 'height', (height)+'px' ).css( 'right', '0px' ).css( 'left', '' );
	
}


LdpViewer.prototype.fix_css_left_info_panel = function(panel_width) {
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


LdpViewer.prototype.loadMap = function() {
// console.log('loadMap');
	this.map.LoadMap();
	// scrivo la scala iniziale
	this.setMapScale(this.getMapScale());
	this.refreshLegend();
};


LdpViewer.prototype.initialMapView = function() {
// console.log("initialMapView");
	this.map.getMapView().setCenter(this.map.initialView.center);
	this.map.getMapView().setZoom(this.map.initialView.zoom);
};

LdpViewer.prototype.previousMapView = function() {
// console.log("previousMapView");
	
	if(this.map.historyViewIndex > 0) {

		this.map.historyViewIndex--;
		var previousIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[previousIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[previousIndex].resolution);


	} else {
// console.log("Non esiste nessuna vista precedente");
	}
};


LdpViewer.prototype.nextMapView = function() {
// console.log("nextMapView");
	
	if(this.map.historyView.length-1 > this.map.historyViewIndex) {
		this.map.historyViewIndex++;
		var nextIndex=this.map.historyViewIndex;

		this.map.getMapView().setCenter(this.map.historyView[nextIndex].center);
		this.map.getMapView().setResolution(this.map.historyView[nextIndex].resolution);
	
		//Si elimina dall'array lo stato appena creato con questo cambio di vista
		if (this.map.historyView.length-1==this.map.historyViewIndex) {
			this.map.historyView.pop();
			this.map.historyViewIndex--;
		}

	} else {
// console.log("Non esiste nessuna vista successiva");
	}
};


LdpViewer.prototype.mapZoomIn = function() {
// console.log("mapZoomIn");
	this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()+1); 
}


LdpViewer.prototype.mapZoomOut = function() {
// console.log("mapZoomOut");
	this.map.getMapView().setResolution(this.map.getMapView().constrainResolution(this.map.getMapView().getResolution()))
	this.map.getMapView().setZoom(this.map.getMapView().getZoom()-1); 
}


LdpViewer.prototype.toggleLegend = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	//Deve essere alternativo al vistasu, in pratica quando si fa il toggle di questo elemento il pannello del vistasu deve chiudersi
	if (!this.toolbarPanelToggleLegend.hasClass("active")) {
		if(this.toolbarPanelToggleVistasu.hasClass("active")) {
			this.toolbarPanelToggleVistasu.removeClass("active");
			this.vistasuPanelContainer.hide();
		}
		
		//Su schermi piccoli si deve chiudere anche il pannello di info
		if (this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
			ldp_viewer.toggleInfo(0);
		}
	}
	
	this.toolbarPanelToggleLegend.toggleClass("active");
	this.legendPanelContainer.animate({width:'toggle'} ,transition_time);
}


LdpViewer.prototype.toggleVistaSu = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	//Deve essere alternativo alla legenda, in pratica quando si fa il toggle di questo elemento il pannello della legenda deve chiudersi
	if (!this.toolbarPanelToggleVistasu.hasClass("active")) {
		if (this.toolbarPanelToggleLegend.hasClass("active")) {
			this.toolbarPanelToggleLegend.removeClass("active");
			this.legendPanelContainer.hide();
		}
		
		//Su schermi piccoli si deve chiudere anche il pannello di info
		if (this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
			ldp_viewer.toggleInfo(0);
		}
	}
	
	
// 	this.vistasuPanelContainer.toggle("slide",500);
	this.toolbarPanelToggleVistasu.toggleClass("active");
	this.vistasuPanelContainer.animate({width:'toggle'} ,transition_time);
}


LdpViewer.prototype.toggleInfo = function(transition_time) {
	
	var that=this;
	
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	//Su schermi piccoli, quando si apre il pannello di info si devono chiudere gli altri pannelli (legenda o vistasu)
	if (!this.titleToggleInfo.hasClass("active") && $(document).width() <= 1024) {
		this.toolbarPanelContainer.hide();
	
	}
	
	var width = $(window).width();
	
// 	this.infoPanelContainer.toggle().css('left','').css('width','');
	this.titleToggleInfo.toggleClass("active");
	//this.infoPanelContainer.animate({width:'toggle'}, transition_time).css('left','');
	
	//Forzo la chiamata a fix_css_left_info_panel per bugfix IE
	var panel_width=this.infoPanelContainer.width();
	this.infoPanelContainer.animate({width:'toggle'}, transition_time,"swing",function(){that.fix_css_left_info_panel(panel_width);}).css('left','');

	
}


//Apri Chiudi il TAB di sinistra
LdpViewer.prototype.toggleLeftTabs = function(transition_time) {
	var transition_time = (typeof transition_time !== 'undefined') ?  transition_time : 500;
	
	//Su schermi piccoli si deve chiudere anche il pannello di info
	if ($(document).width() <= 1024) {
		this.titleToggleInfo.removeClass("active");
		this.infoPanelContainer.hide();
	}
	
	this.toolbarPanelToggleContainer.toggleClass("active");
	this.toolbarPanelContainer.animate({width:'toggle'} ,transition_time);
}



LdpViewer.prototype.toggleToolStatus = function(toolname) {
	$(".tool-on-off").removeClass("active");
	this.toolbarPanelMeasure.removeClass("group");
	switch (toolname) {
		case "zoom_selection":
			this.map.setStatoInterazione("zoom_selection");
			this.toolbarPanelZoomSelection.addClass("active");
			this.map.map.removeInteraction(this.map.extrainteractions.select);
			this.map.map.removeInteraction(this.map.extrainteractions.draw);
			this.map.map.removeInteraction(this.map.extrainteractions.snap);
			this.map.map.removeInteraction(this.map.extrainteractions.measure);
			this.map.map.addInteraction(this.map.extrainteractions.zoom_selection);
			
		break;

		case "pan":
			this.map.setStatoInterazione("pan");
			this.toolbarPanelCursorMove.addClass("active");
			this.map.map.removeInteraction(this.map.extrainteractions.select);
			this.map.map.removeInteraction(this.map.extrainteractions.zoom_selection);
			this.map.map.removeInteraction(this.map.extrainteractions.draw);
			this.map.map.removeInteraction(this.map.extrainteractions.snap);
			this.map.map.removeInteraction(this.map.extrainteractions.measure);
		break;

		case "select":
// 			console.log("ToggleToolStatus select: ",this.map.map.getInteractions());
			
			this.map.setStatoInterazione("select");
			
			this.toolbarPanelCursorSelect.addClass("active");

			this.map.map.removeInteraction(this.map.extrainteractions.zoom_selection);
			this.map.map.removeInteraction(this.map.extrainteractions.measure);
			
			//Devo usare un setTimeout perchè, a causa di un bug di openlayers, quando si fa doppio click per terminare il draw, esegue l'interazione DoubleClickZoom
			setTimeout($.proxy(function () {this.map.map.removeInteraction(this.map.extrainteractions.draw);},this),300);
			this.map.map.removeInteraction(this.map.extrainteractions.snap);
//  			this.map.map.addInteraction(this.map.extrainteractions.select);
		break;

		case "draw":
			this.map.setStatoInterazione("draw");
						
			//this.toolbarPanelCursorSelect.addClass("active");
			this.map.map.removeInteraction(this.map.extrainteractions.select);
			this.map.map.removeInteraction(this.map.extrainteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extrainteractions.draw);
			this.map.map.removeInteraction(this.map.extrainteractions.measure);
		break;

		case "measure_line":
			this.map.setStatoInterazione("measure_line");
			
			this.toolbarPanelMeasureLine.addClass("active");
			this.toolbarPanelMeasure.addClass("group");
			this.map.map.removeInteraction(this.map.extrainteractions.select);
			this.map.map.removeInteraction(this.map.extrainteractions.draw);
			this.map.map.removeInteraction(this.map.extrainteractions.snap);
			this.map.map.removeInteraction(this.map.extrainteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extrainteractions.measure_line);
		break;

		case "measure_area":
			this.map.setStatoInterazione("measure_area");
			
			this.toolbarPanelMeasureArea.addClass("active");
			this.toolbarPanelMeasure.addClass("group");
			this.map.map.removeInteraction(this.map.extrainteractions.select);
			this.map.map.removeInteraction(this.map.extrainteractions.draw);
			this.map.map.removeInteraction(this.map.extrainteractions.snap);
			this.map.map.removeInteraction(this.map.extrainteractions.zoom_selection);
			//this.map.map.addInteraction(this.map.extrainteractions.measure_line);
		break;
		default:

		break;
	} 
}


LdpViewer.prototype.toggleLegendContainer = function (e) {
	var element = e.target;
	var id=$(element).attr("id").replace("toggle_","");
	$("#"+ id).toggle();
	if($("#"+ id ).is(":visible"))
		$(element).removeClass("legend_close").addClass("legend_open");
	else
		$(element).removeClass("legend_open").addClass("legend_close");
}


LdpViewer.prototype.measure = function(type, callback_function){
	if(type == 'measure_line'){
		this.toggleToolStatus("measure_line");
		this.map.measure('line',callback_function);
	}
	else{
		this.toggleToolStatus("measure_area");
		this.map.measure('area',callback_function);
	}
}


LdpViewer.prototype.startDraw = function(type,callback_function) {
	this.toggleToolStatus("draw");
	this.map.startDraw(type,callback_function);
}


LdpViewer.prototype.endDraw = function() {
	this.toggleToolStatus("select");
	//this.map.endDraw();
}


LdpViewer.prototype.cancelDraw = function() {
	this.map.cancelDraw();
}


LdpViewer.prototype.digitizePoint = function(callback_function) {
	this.startDraw('Point',callback_function);
}

LdpViewer.prototype.isDigitizing = function() {
	var stato_interazione=this.map.getStatoInterazione();
	if (stato_interazione=='draw') {
		return true;
	} else {
		return false;
	}
}

//Per retrocompatibilità
LdpViewer.prototype.cancelDigitization = function() {
	this.endDraw();
}


LdpViewer.prototype.fit = function(wkt, crs, pixelPadding) {
	this.map.fit(wkt, crs, pixelPadding);
}


LdpViewer.prototype.footerUpdateText = function() {
// 	console.log("footerUpdateText");
	var stato = this.getStato();
	
	var selectOverlay=this.map.getMapLayer('selection');
	var numeroFeature = selectOverlay.getSource().getFeatures().length;
	if (numeroFeature == 1)
		this.footerPanelInfoSelezione.html(numeroFeature + " feature selezionata");
	else
		this.footerPanelInfoSelezione.html(numeroFeature + " feature selezionate");
}


LdpViewer.prototype.mapClearSelection = function() {
	var stato = this.getStato();
	var selectOverlay=this.map.getMapLayer('selection');

	//Si ripulisce la selezione precedente
	selectOverlay.getSource().clear();
	
	//Footer
	this.footerUpdateText();
}

LdpViewer.prototype.mapClearSnap = function() {
	var stato = this.getStato();
	var snapOverlay=this.map.getMapLayer('snap');

	//Si ripulisce la selezione precedente
	snapOverlay.getSource().clear();
}


LdpViewer.prototype.mapGetSelectedFeatures = function(xml,a_layers,callback,primary_key,extra_field) {
	var selection=this.map.getSelectedFeatures(xml,a_layers,callback,primary_key,extra_field);
	
	return selection;
}


LdpViewer.prototype.mapGetMapSelection = function() {
	var selection=this.map.getMapSelection();
	
	return selection;
}

LdpViewer.prototype.getLayers = function(a,b) {
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








LdpViewer.prototype.refreshSnapVector = function(layers,tipo_snap,tolleranza) {	
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
		var source=this.map.getMapLayerSource(ol_layer);
		
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








//Callback sulla selezione
LdpViewer.prototype.mapGetSelection = function(response) {
//console.log("mapGetSelection",response);
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=this.map.getMapLayer('selection');

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

//Valida solo per il mapguide
LdpViewer.prototype.setSelection_legacy = function(layer, ids, primary_key) {
	var this_viewer=this;

	if ( typeof primary_key == "undefined" ) {
		var primary_key="id";
	}
	
	var stato = this.getStato();

	var ol_layer="mapguide";
	
	//Valido per il MapGuide

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


//Valida solo per il mapguide
LdpViewer.prototype.setSelection_multilayer_legacy = function(selection_string) {
	var this_viewer=this;
	
	var stato = this.getStato();

	var ol_layer="mapguide";
	
	//Valido per il MapGuide
	
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



LdpViewer.prototype.mapSetSnap = function(response, crs) {
	var stato = this.getStato();
	if ( typeof crs == "undefined" ) crs = "EPSG:3003";

	var wktformat = new ol.format.WKT();
	var snapOverlay = this.map.getMapLayer('snap');
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




LdpViewer.prototype.mapSetSelection = function(response, crs) {
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
	
	var selectOverlay = this.map.getMapLayer('selection');
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


LdpViewer.prototype.mapAddFeatureSelection = function(response) {
	var stato = this.getStato();
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=this.map.getMapLayer('selection');
	
	//response è un oggetto geoJson
	features=geojsonFormat.readFeatures(response,{dataProjection: this.map.dataProjection,featureProjection: this.map.mapProjection});
	
	if(features.length > 0) {
		///TODO Per evitare di aggiungere più volte la stessa feature alla selezione si dovrebbe controllare che non sia già presente tra le feature
		
		selectOverlay.getSource().addFeatures(features);
	}

	//Footer
	this.footerUpdateText();
}


//Callback sul CTRL+click o sul tap prolungato
LdpViewer.prototype.openInfo = function(response) {
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

		var nome_layer=this.getLayerNameByFeatureName(nome_feature);
		var ol_layer=this.getOlLayerByLayerName(nome_layer);
		
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

		var ind=a_layers_hyperlinked.indexOf(nome_layer);
		if(ind != -1) {
			if(stato[ol_layer].layers_info[nome_layer].hyperlink != 'standard'){
				stringa_hyperlink = stato[ol_layer].layers_info[nome_layer].hyperlink.replace(/%\w+%/g, function(all) {
					return eval("properties."+all.replace(/%/g,''));
				});

				this.loadInfoPage('info',stringa_hyperlink);

				//Se è nascosto, si mostra
				this.infoPanelContainer.show(500);
				this.titleToggleInfo.addClass("active");
				
			}
			else{
				//return properties;
				this.loadInfoPage('info','infoWMSGetFeatureInfo.php');
				var html = this.createElementsFromJSON(properties);
				setTimeout(function(){$("#ldpviewer_info_wms_container").html(html);}, 500);
				this.titleToggleInfo.addClass("active");
			}
		}
	}
}


//Apro la pagina loadInfoPage passando del text plain
LdpViewer.prototype.openInfoExtWMS = function(response) {
	if (typeof LdpViewer_WMSGetFeatureInfoCustomPage !== "undefined") {
		this.loadInfoPage('info',LdpViewer_WMSGetFeatureInfoCustomPage, false, response);
	} else {
		this.loadInfoPage('info','infoWMSGetFeatureInfo.php');
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
			
			setTimeout(function(){$("#ldpviewer_info_wms_container").html(html);}, 500);
		}
	}
}


LdpViewer.prototype.createElementsFromJSONCustom = function(json, html){
	var html = "<ul>" + json + "</ul>";
	return html;
}


LdpViewer.prototype.createElementsFromJSON = function(json){
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

LdpViewer.prototype.mapRefresh = function() {
	var centro = ol.proj.transform([this.getMapCenter().X , this.getMapCenter().Y], this.map.mapProjection,this.map.dataProjection);
	this.zoomToView(centro[0]-1,centro[1], this.getMapScale());
}


LdpViewer.prototype.addEvents = function() {
// console.log("addEvents");
	//Sono eventi che vanno istanziati quando la mappa già esiste
	this.map.getMapView().on('propertychange', $.proxy(this.ev_map_cambio_view,this));
	
	//Select e/o CTRL+click
	this.map.map.on('singleclick', $.proxy(this.ev_map_select,this));
	
	//Tap o clic prolungato
	this.map.map.getViewport().addEventListener('mousedown',$.proxy(this.ev_map_mouse_down,this));
	this.map.map.getViewport().addEventListener('mouseup', $.proxy(this.ev_map_mouse_up,this));
	this.map.map.getViewport().addEventListener('mousemove', $.proxy(this.ev_map_mouse_move,this));
	
	this.map.map.getViewport().addEventListener('touchstart',$.proxy(this.ev_map_mouse_down,this));
	this.map.map.getViewport().addEventListener('touchend', $.proxy(this.ev_map_mouse_up,this));
	this.map.map.getViewport().addEventListener('touchmove', $.proxy(this.ev_map_mouse_move,this));
	
	//Evita l'apertura del menu contestuale sulla mappa
	this.map.map.getViewport().addEventListener('contextmenu', function(evt) { 
		evt.preventDefault();
	}, false);
};


LdpViewer.prototype.ev_legenda_plus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).show();
	$(element).removeClass("plus").addClass("minus");

	var ol_layer=this.getOlLayerByGroupName(id);
	stato[ol_layer].groups_info[id]['expanded']=true;
	
	this.setStato(stato);
}


LdpViewer.prototype.ev_legenda_minus_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#childrenof_"+id).hide();
	$(element).removeClass("minus").addClass("plus");
	
	var ol_layer=this.getOlLayerByGroupName(id);
	stato[ol_layer].groups_info[id]['expanded']=false;
	
	this.setStato(stato);
}


LdpViewer.prototype.ev_legenda_plus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#stile_"+id.replace(':','\\:')).show();
	$(element).removeClass("plus_stile").addClass("minus_stile");

	var ol_layer=this.getOlLayerByLayerName(id);
	stato[ol_layer].layers_info[id]['expanded']=true;
	
	this.setStato(stato);
}


LdpViewer.prototype.ev_legenda_minus_stile_click = function(event) {
	var stato = this.getStato();
	
	var element = event.target;
	var id=$(element).attr("id").replace("expand_","");
	$("#stile_"+id.replace(':','\\:')).hide();
	$(element).removeClass("minus_stile").addClass("plus_stile");
	
	var ol_layer=this.getOlLayerByLayerName(id);
	stato[ol_layer].layers_info[id]['expanded']=false;
	
	this.setStato(stato);
}


LdpViewer.prototype.ev_map_mouse_up = function(event) {
	clearTimeout(this.timeoutId); 
	this.startPixel = undefined; 
}


LdpViewer.prototype.ev_map_mouse_move = function(event) {
	if (this.startPixel) { 
		var pixel = this.map.map.getEventPixel(event); 
		var deltaX = Math.abs(this.startPixel[0] - pixel[0]); 
		var deltaY = Math.abs(this.startPixel[1] - pixel[1]); 

		if (deltaX + deltaY > 24) {
			clearTimeout(this.timeoutId); 
			this.startPixel = undefined; 
		} 
	} 
}


LdpViewer.prototype.ev_map_mouse_down = function(event) {
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
			var source=this.map.getMapLayerSource(ol_layer);

			if(stato[ol_layer].list_layers_hyperlinked!='') {
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
											this_viewer.loadInfoPage('info',response.data.hyperlink,true);

											//Se è nascosto, si mostra
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
}



LdpViewer.prototype.ev_map_select = function(event) {
	event.preventDefault();
	switch (this.map.getStatoInterazione()) {
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
			
			
			//Per la selezione si considera solo il primo OL layer
			var a_ol_layers=Object.keys(stato);
			//inizio a ciclare su tutti i layers
			for(var i=0; i<a_ol_layers.length; i++){

				//var ol_layer=a_ol_layers[0];
				var ol_layer=a_ol_layers[i];
				var source=this.map.getMapLayerSource(ol_layer);
				
				//Selezione: si esegue sempre (anche in caso di ctrl+click)
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
								}).then(function(response) { this_viewer.mapGetSelection(response); });
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
							//in caso di shift premuto si aggiunge alla selezione, altrimenti si genera la selezione ex-novo
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
								}).then(function(response) { this_viewer.mapGetSelection(response); });
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
							
							//Se non è premuto il tasto ctrl si fa la selezione
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

										//Se alla scala corrente il layer non è visibile non si deve selezionare
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
											layers_extra_properties:LdpViewer_layers_selection_extra_fields
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
					//Se è un WMS esterno che è stato richiesto
					var BreakException = {};
					var map_ol_layers=this_viewer.map.getMapLayers();

					try{
						map_ol_layers.forEach(function(item,index) {
							if(item.getVisible()) {
								var layer_name = item.get('name');

								var baselayer=item.get('baselayer');
								
								
//	 							if(this_viewer.map.ol_map_layers.indexOf(layer_name) == -1) {
								if(item.getSource() instanceof ol.source.TileWMS || item.getSource() instanceof ol.source.ImageWMS) {							
									
									var wms_url = this.customWmsURL;
									var wms_url_internal = this.internalWmsURL;

									var source=this_viewer.map.getMapLayerSource(layer_name);
									
									if (typeof source.getParams().INFO_FORMAT != 'undefined') {
										var info_format=source.getParams().INFO_FORMAT;
									} else {
										//I base layer vengono interrogati solo se è definito INFO_FORMAT gli altri sempre, per retrocompatibilità
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

									//WMS interno
									if(wms_url==wms_url_internal) {
										
										var url_argument=url.split("?");
										
										$.ajax({
											url: LdpViewer_proxy,
											method: "POST",
											dataType: "json",
											async: false,
											data: {'service_type': 'featureinfo', 'service_url': wms_url, 'action': 'GetFeatureInfo', 'request': url_argument[1]},
											success: function(ret) {
												response = ret.data;

												//Se la risposta non è nulla
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
												this_viewer.loadInfoPage('info',LdpViewer_proxy,null, data,false);
												
											break;
											
											case null:
// 												console.log("info_format null! non faccio niente", info_format);
											break;
											
											default:
												console.log("info_format non atteso!", info_format);
											break;
											
										}
									}
								}
							}
						},this);
					}catch (e) {
						if (e === BreakException) return;
						
					}

					//Se viene premuto il tasto ctrl: Richiesta informazioni
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

													this_viewer.loadInfoPage('info',response.data.hyperlink,true);

													//Se è nascosto, si mostra
													this_viewer.infoPanelContainer.show(500);
												}
											}

											//In ogni caso provo a fare la selezione

											var a_layers_selectable=stato[ol_layer].list_layers_selectable.split(",");
									
											if (a_layers_selectable.length > 0) {
												var a_layernames=new Array();

												for(var i=0;i<a_layers_selectable.length; i++) {

													//Se alla scala corrente il layer non è visibile non si deve selezionare
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
														layers_extra_properties:LdpViewer_layers_selection_extra_fields
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
}


LdpViewer.prototype.ev_map_cambio_view = function(event) {
	//console.log("evento cambio view "+event.key);
	switch (event.key) {
		case 'resolution':
			clearTimeout(this.timeoutIdChangeView);
	//console.log("*** evento cambio view "+event.key);
			this.timeoutIdChangeView = setTimeout($.proxy(function() {

				var scala=this.map.getScale();
				this.refreshLegend();
				this.footerPanelScala.html("1:"+Math.round(scala));

				this.map.saveViewHistory();
			
			},this), 300, false);
				
			
		break;
// 		case 'center':
// 			
// 		break;
	}
}


LdpViewer.prototype.ev_footer_scala_click = function(event) {
	var element = event.target;

	var oldScala = this.getMapScale();

	$(element).html("<input id='" + this.footerPanelScalaInputId + "' type='text' value='' />");
	var footerPanelScalaInput = $("#" + this.footerPanelScalaInputId);
	footerPanelScalaInput.focus().keypress($.proxy(function( ev ) {
		//Se invio
		if ( ev.which == 13 ) {
			// se non è un intero, ripristino oldScala
			if ( ! isNaN( parseInt( footerPanelScalaInput.val() ) ) )
				this.setMapScale( footerPanelScalaInput.val() );
			else
				this.setMapScale(oldScala);
		}
	},this));
};


LdpViewer.prototype.ev_legend_base_click = function(event) {
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


LdpViewer.prototype.ev_legenda_layer_checkbox_click = function(event) {
	var element = event.target;
	var id=$(element).attr("id");
// console.log(id);
	this.mostraNascondiLayer(id, $(element).is(":checked"));
};


LdpViewer.prototype.ev_legenda_group_checkbox_click = function(event) {
	var element = event.target;
	var id = $(element).attr("id");
// 	console.log(id);
	this.mostraNascondiGruppoLayer(id, $(element).is(":checked"));
};


LdpViewer.prototype.ev_info_page_href_click = function(event) {
	var element = event.currentTarget;
	//Se il link punta ad una pagina php la devo caricare nel div, altrimenti niente
//console.log($(element).hasClass('no-overwrite-href'));
	//&& !element.href.match(/proxyfile/g) 
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('info',element.href);
	} else {
// console.log("comportamento standard..");
	}
};


LdpViewer.prototype.ev_simplemodal_href_click = function(event) {
	var element = event.currentTarget;
	//Se il link punta ad una pagina php la devo caricare nel div, altrimenti niente
//console.log($(element).hasClass('no-overwrite-href'));
	//&& !element.href.match(/proxyfile/g) 
	if(element.href.match(/\.php/g) && !element.href.match(/proxyfile/g) && !($(element).hasClass('no-overwrite-href')) && (element.target!='_blank' && element.target!='blank')) {
		event.preventDefault();
		this.loadInfoPage('info',element.href);
		//Se il click è avvenuto in una finestra modale si chiude
		if (typeof ($.modal) !== "undefined") {;
			$.modal.close();
		}
	} else {
// console.log("comportamento standard..");
	}
};


LdpViewer.prototype.ev_info_page_submit_form = function(event) {
	///TODO controlli su id del form, method=POST, ecc..  

	var element = event.currentTarget;

	//Solo se la form non ha la classe no-action o target blank si intercetta il submit, altrimenti non si fa niente
	if(!$(element).hasClass('no-action') && (element.target!='_blank' && element.target!='blank') && (element.target!='_top' && element.target!='top') ) {  

		var id_form=$(element).attr("id");
		//Costruendo l'oggetto dei parametri vengono passati in POST
		var obj_form=$("#"+id_form).serializeArray();

		$(this.infoPanelInfo).load(element.action,obj_form);
	} else if (element.target=='_blank' || element.target=='blank' || element.target=='_top' || element.target=='top') {
//console.log("comportamento standard..");
		element.submit();
	}
	return false;
};


LdpViewer.prototype.documentLocationWrapper = function(url) {
	
	this.loadInfoPage('info',url);
}

LdpViewer.prototype.loadInfoPage = function(tabName,url,spinner,data,newHistoryState) {

	spinner = (typeof spinner !== 'undefined') ?  spinner : false;
	data = (typeof data !== 'undefined') ?  data : false;
	newHistoryState = (typeof newHistoryState !== 'undefined') ?  newHistoryState : true;
	
	var tab = undefined;
	switch (tabName) {
		case 'info':

			//Gestione history per fare back e forward dal tab info
			if(newHistoryState) {
				history.pushState({"tabName": tabName,"url": url,"spinner":spinner,"data":data}, "titolo", "");
			} else {
				//console.log("replaceState: "+url);
				//history.replaceState({"tabName": tabName,"url": url,"spinner":spinner,"data":data}, "titolo", "");
			}
			
			tab = this.infoPanelInfo;
			break;
		case 'ricerca':
			tab = this.infoPanelRicerca;
			break;
		case 'help':
			tab = this.infoPanelHelp;
			break;

	}

	if (tab) {
		if(spinner) {
			$(tab).html("<div class='ldpviewer_spinner'>Attendere prego...</div>");
		}
		if (data) 
			$(tab).load(url,data);
		else
			$(tab).load(url);
	}

	this.infoPanelTabs.tabs({ active: 0 });

	//se torno alla pagina del menu faccio scomparire il link al menu;
	if(this.menu_link.length){
		if(url == this.menu_page){
				this.menu_link.hide();
		}
		else
			this.menu_link.show();
	}
};


LdpViewer.prototype.loadVistaSu = function(url) {
	if (this.vistasuPanel)
		$(this.vistasuPanel).load(url);
};


LdpViewer.prototype.setTourElement = function(){
	var tour = new Tour({
		steps: [
			{
				title: "Usare le mappe interattive",
				content: "Segui il breve tour guidato per conoscere le funzionalità e gli strumenti delle mappe interattive.",
				orphan: true
			},
			{
				element: "#ldp_viewer_show_hide_info",
				title: "Sidebar destra",
				content: "Apri/chiudi la barra laterale destra: contiene gli strumenti di ricerca (per Via e n. civico, per località, ecc.) e mostra le informazioni degli oggetti selezionati sulla mappa.",
				placement: "left"
			},
			{
				element: "#ldp_viewer_show_hide_leftTabs",
				title: "Sidebar sinistra",
				content: "Apri/chiudi la barra laterale sinistra: contiene la Legenda della mappa con la quale puoi attivare o nascondere i livelli, il pannello WMS per aggiungere strati cartografici da servizi esterni e lo strumento <em>Vista su</em> per aprire un&apos;altra mappa mantenendo la vista corrente",
				placement: "right"
			},
			{
				element: "#ldp_viewer_show_hide_legend",
				title: "Legenda",
				content: "Mostra l&apos;elenco dei livelli (layer) presenti sulla mappa: puoi accendere o spegnere i diversi livelli per rendere visibili (e interrogabili) o per nasconderli.<br>Puoi anche aggiungere nuovi livelli utilizzando URL di servizi WMS.",
				placement: "bottom"
			},
			{
				element: "#ldpviewer_legend_container",
				title: "Visibilità livelli della legenda",
				content: "Apri/chiudi i raggruppamenti di livelli come <em>Tematismi</em> e <em>Layer di base</em>: accendere o spegnere i diversi livelli per rendere visibili (e interrogabili) o per nasconderli."
			},
			{
				element: "#ldpviewer_legend_aggiungi_wms",
				title: "Aggiungi WMS",
				content: "Utilizza un servizio WMS (<em>Web Map Service</em>) per aggiungere nuovi livelli alla mappa: scegli nella lista dei layer disponibili o usa una fonte dati esterna.",
				placement: "bottom"
			},
			{
				element: "#ldp_viewer_show_hide_vistasu",
				title: "Apri un&apos;altra mappa",
				content: "Apri un&apos;altra mappa mantenendo la vista corrente: la nuova mappa verrà aperta in una nuova finestra.<br>Sono disponibili anche mappe di terze parti come Google Maps, Open Street Map e Bing.",
				placement: "bottom"
			},			
			{
				element: "#tools",
				title: "Toolbar della mappa",
				content: "Gli strumenti per navigare la mappa e selezionare gli oggetti, fare zoom, effettuare misurazioni, stampare la vista corrente, ecc."
			},
			{
				element: "#footer_scala",
				title: "Scala della mappa",
				content: "Mostra la scala attuale della cartografia visibile.<br />Puoi cambiare scala di visualizzazione digitando il nuovo valore all'interno del campo e premendo &crarr;INVIO",
				placement: "top"
			},
			{
				element: "#exit",
				title: "Esci dalla mappa",
				content: "Chiudi la mappa interattiva e torna alle pagine del SIT.",
				placement: "right",
				template: "<div class='popover tour tour-tour' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><div class='btn-group'><button class='btn btn-sm btn-primary' data-role='prev' title='Torna al passo precedente'>« Indietro</button><span data-role='separator'>&nbsp;</span><button class='btn btn-sm btn-secondary' data-role='next' title='Vai al passo successivo'>Avanti »</button></div><button class='btn btn-sm btn-success' data-role='end' title='Chiudi il tour'>Chiudi</button></div></div>"
			}
		],
		backdrop: true,
		template: "<div class='popover tour tour-tour' role='tooltip'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><div class='btn-group'><button class='btn btn-sm btn-secondary' data-role='prev' title='Torna al passo precedente'>« Indietro</button><span data-role='separator'>&nbsp;</span><button class='btn btn-sm btn-primary' data-role='next' title='Vai al passo successivo'>Avanti »</button></div><button class='btn btn-sm btn-secondary' data-role='end' title='Chiudi il tour'>Chiudi</button></div></div>"
	});
	
	return tour
}


// HELP creato con Bootstrap Tour
// http://bootstraptour.com/ 
LdpViewer.prototype.loadTour = function(url) {
	var tour = this.setTourElement();
	// Initialize the tour
	tour.init();

	// Start the tour
	tour.start();
};

LdpViewer.prototype.RestartTour = function(url) {
	var tour = this.setTourElement();
	// Initialize the tour
	tour.init();

	// Start the tour
	tour.restart();
};

LdpViewer.prototype.loadPrintMap = function(url) {
	//Gestione dialog di stampa
	var div_print_dialog=$(this.printMapDiv);

	var dlg=$(this.printMapDiv).dialog({
		title: 'Stampa la vista della mappa',
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
	//Fine Gestione dialog di stampa
};


LdpViewer.prototype.getPrintablePage = function(label,format,adatta_scala) {
	
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
	var source=this.map.getMapLayerSource(ol_layer);

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
	var size = /** @type {ol.Size} */ (ol_map.getSize());
	ol_map.getView().fit(extent,{size: size, constrainResolution: false});
	ol_map.renderSync();
}


LdpViewer.prototype.refreshLegend = function() {
//console.log("refreshLegend");
	a_layers_legenda=new Array();
	
	//Creazione albero della legenda
	this.legendBuildLayerTree();

	var htmlLegenda = this.legendBuildClientSideTree(this.legendTree, null, null,true);

	this.legendPanel.html("<ul class='legenda'>" + htmlLegenda + "</ul>");

	var htmlLegendaWMS = this.legendBuildClientSideTree(this.legendTree, null, null,false);
	//per i layer che vengono da MetaRepo o da servizio WMS la legenda deve essere aggiornata con il panel esterno
	this.legendPanelWMS.html("<ul class='legenda'>" + htmlLegendaWMS + "</ul>");

	//Gestione Strati di base
	html_base_layers="";
	//OL Layers
	ol_layers=this.map.getMapLayers();

	ol_layers.forEach(function(element,index,ar) {
		//Solo se sono layer di base
		if(element.get('baselayer')) {
			if(element.get('visible')) {
				str_checked="checked=true";
			} else {
				str_checked="";
			}
			html_base_layers+="<li><input type='radio' class='base_layers' name='base_layers' id='"+element.get('name')+"' "+str_checked+" ><label for='"+element.get('name')+"'>"+element.get('name')+"</label></li>";
		}
	},this);
	
	this.legendPanelBase.html("<ul class='legenda'>"+html_base_layers+"</ul>");
// console.log("FINE refreshLegend");
	return false;
};


LdpViewer.prototype.mostraNascondiLayer = function(nome_layer,mostra) {
	var stato = this.getStato();
	
	//Mi ricavo lo stato del layer passato
	var ol_layer=this.getOlLayerByLayerName(nome_layer);

	var old_mostra=stato[ol_layer].layers_info[nome_layer]['visible'];
	if (mostra==true) {
		stato[ol_layer].layers_info[nome_layer]['visible']=true;
	} else {
		stato[ol_layer].layers_info[nome_layer]['visible']=false;
	}
	this.setStato(stato);
	this.mapRefreshStato();
	if (stato[ol_layer].list_layer_visible!='') {
		//Si aggiornano i layer della richiesta e si aggiorna la mappa
		this.map.refreshMapLayer(ol_layer);
	} else {
		//Se è l'unico layer rimasto accesso non si può spegnere
		stato[ol_layer].layers_info[nome_layer]['visible']=old_mostra;
		
		this.setStato(stato);
		
		//Si deve fare rollback del cambio di stato
		this.mapRefreshStato();
		
		$("#"+nome_layer).prop("checked",old_mostra);
	}
}


LdpViewer.prototype.mostraNascondiGruppoLayer = function(nome_gruppo,mostra) {
	var stato = this.getStato();
	//Mi ricavo lo stato del gruppo passato
	var ol_layer=this.getOlLayerByGroupName(nome_gruppo);
	old_mostra=stato[ol_layer].groups_info[nome_gruppo]['visible'];

	if (mostra==true) {
		stato[ol_layer].groups_info[nome_gruppo]['visible']=true;
	} else {
		stato[ol_layer].groups_info[nome_gruppo]['visible']=false;
	}

	this.setStato(stato);
	this.mapRefreshStato();

	if (stato[ol_layer].list_layers_visible!='') {
		//Si aggiornano i layer della richiesta e si aggiorna la mappa
		this.map.refreshMapLayer(ol_layer);
	} else {
		//Se non rimane nessun layer accesso non si può spegnere
		stato[ol_layer].groups_info[nome_gruppo]['visible']=old_mostra;
		
		//Si deve fare rollback del cambio di stato
		this.setStato(stato);
		this.mapRefreshStato();
		
		$("#"+nome_gruppo).prop("checked",old_mostra);
	}
}


LdpViewer.prototype.getOlLayerByLayerName = function(nome_layer) {
	var stato = this.getStato();
	
	var a_ol_layers=Object.keys(stato);
	//Per ogni layer di OL si controlla il tipo
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {
			if(a_layers_info[j]==nome_layer) {
				//Trovato
				return a_ol_layers[i];
			}
		}
	}
	
	//Non trovato
	return false;
}


LdpViewer.prototype.getLayerNameByFeatureName = function(feature_name) {
	var stato = this.getStato();
// console.log("getLayerNameByFeatureName");
	var a_ol_layers=Object.keys(stato);
	//Per ogni layer di OL si controlla il tipo
	for (var i=0;i<a_ol_layers.length;i++) {
		layers=stato[a_ol_layers[i]].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].feature_name==feature_name) {
				//Trovato
				return a_layers_info[j];
			}
		}
	}
	
	//Non trovato
	return false;
}


LdpViewer.prototype.getOlLayerByGroupName = function(nome_gruppo) {
	var stato = this.getStato();
// console.log("getOlLayerByGroupName");
	var a_ol_layers=Object.keys(stato);
	//Per ogni layer di OL si controlla il tipo
	for (var i=0;i<a_ol_layers.length;i++) {
		groups=stato[a_ol_layers[i]].groups_info;
		var a_groups_info=Object.keys(groups);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_groups_info.length;j++) {
			if(a_groups_info[j]==nome_gruppo) {
				//Trovato
				return a_ol_layers[i];
			}
		}
	}
	
	//Non trovato
	return false;
}


LdpViewer.prototype.getLayerNames = function(ids) {
	var stato = this.getStato();
// console.log("getLayerNameByFeatureName");
	var lys= new Array();
	//Per ogni layer di OL si controlla il tipo
	for (var i=0;i<ids.length;i++) {
		layers=stato['mapguide'].layers_info;
		var a_layers_info=Object.keys(layers);
		//a_layers_info.forEach(function(item2,index2) {
		for (var j=0;j<a_layers_info.length;j++) {

			if(layers[a_layers_info[j]].id==ids[i]) {
				//Trovato
				lys.push(layers[a_layers_info[j]].name);
			}
		}
	}

	return lys;
}


//REDLINE
LdpViewer.prototype.addRedlineWKT = function(nomeLayer,wkt,clear_before) {
// console.log("addRedLineWkt");
	clear_before = (typeof clear_before !== 'undefined') ?  clear_before : true;
	return this.map.addRedlineWKT(nomeLayer,wkt,clear_before);
};

LdpViewer.prototype.clearRedline = function(nomeLayer) {
	return this.map.clearRedline(nomeLayer);
};

LdpViewer.prototype.mapClearTempLayers = function(nomiLayers,clear_ol_layers) {
	if (typeof clear_ol_layers == 'undefined') {var clear_ol_layers=true;}
	if (typeof nomiLayers !== 'undefined') {
		var a_nomiLayers=nomiLayers.split(",");
		for (var i=0;i < a_nomiLayers.length;i++) {
			this.map.clearTempLayers(a_nomiLayers[i],clear_ol_layers);
		}
	} else {
		this.map.clearTempLayers();
	}
};
///FINE REDLINE


LdpViewer.prototype.getMapScale = function() {
	return this.map.getScale();
};


LdpViewer.prototype.getMapZoom = function() {
	return this.map.getZoom();
};


LdpViewer.prototype.getMapCenter = function() {
	return this.map.getCenter();
};

LdpViewer.prototype.getMapCenterDataProjection = function() {
	return this.map.getCenterDataProjection();
};

LdpViewer.prototype.getMapWidth = function() {
// console.log("getMapWidth");
	return this.map.getWidth();
};

LdpViewer.prototype.getMapHeight = function() {
// console.log("getMapHeight");
	return this.map.getHeight();
};

LdpViewer.prototype.setMapCenter = function(center) {
	this.map.setCenter(center.X,center.Y);
};


LdpViewer.prototype.setMapScale = function(scale) {
	this.map.setScale(scale);
	//Si sistema la scala nel footer
	this.footerPanelScala.html("1:"+Math.round(scale));
};


LdpViewer.prototype.zoomToView = function(x,y,scale) {
	this.map.setCenter(x,y);
	this.setMapScale(scale);
};


LdpViewer.prototype.scalaForFit = function(xmin, xmax, ymin, ymax, marginFactor) {
	if (isNaN(parseFloat(xmin)) || isNaN(parseFloat(xmax)) || isNaN(parseFloat(ymin)) || isNaN(parseFloat(ymax)))
		return NaN;

	//Necessario in quanto si arriva con coordinate dei dati
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

LdpViewer.prototype.mapRefreshStato = function() {
// 	console.log("refreshStato");
	this.map.refreshStato();
};


LdpViewer.prototype.getStato = function() {
	return this.map.getStato();
};


LdpViewer.prototype.setStato = function(stato) {
	return this.map.setStato(stato);
};


LdpViewer.prototype.legendBuildLayerTree = function() {
//console.log("legendBuildLayerTree");
	var stato = this.getStato();
	var tree = new Array();
	var knownGroups = new Array();
	var unresolved = new Array();
	//var groups = Object.keys(groups_info);

	
	//Per ciascun OL layer
	var a_ol_layers=Object.keys(stato);

	for (var i=0;i<a_ol_layers.length;i++) {
		
		ol_layer=stato[a_ol_layers[i]];
		layers_info=ol_layer.layers_info;
		groups_info=ol_layer.groups_info;
		layers=Object.keys(layers_info);
		groups=Object.keys(groups_info);
		//Si cicla sui gruppi
		for (var j=0;j<groups.length;j++) {
			rtGroup = groups_info[groups[j]];
			node = new LdpTreeItem(groups[j], true, rtGroup, null);
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
					tree.push(node); //should not happen. place group in the root if parent is not known
			}
		}
		// Get the layers
		layers = Object.keys(layers_info);

		for(var j = 0; j < layers.length; j++)
		{
			rtLayer = layers_info[layers[j]];
			node = new LdpTreeItem(layers[j], false, rtLayer, null); //$layersData->GetItem($i) come 4° argomento
			parentGroup = rtLayer.group;
			if(parentGroup == undefined)
				tree.push(node);
			else {
				parentNode = knownGroups[parentGroup];
				if(parentNode != undefined)
					parentNode.Attach(node);
				else
					tree.push(node); //should not happen. place layer in the root if parent is not known
			}
		}
	
	}
	this.legendTree = tree;
}

LdpViewer.prototype.getScaleMinMaxGroup = function(node) {
	//dato il nodo del gruppo ci si ricavano ricorsivamente le scale dei layer che contiene
	var range_scale={"scaleMin":9999999999,"scaleMax":0};

	if (node.children != null) {
		for(var c = 0; c < node.children.length; c++) {
			
			///TODO se il figlio di un gruppo si fa una chiamata ricorsiva
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

LdpViewer.prototype.legendBuildClientSideTree = function(tree, parent, parentName, internal) {
//console.log("legendBuildLayerTree");
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

	// 2 passes: pass 1 adds layers to the tree, pass 2 adds groups
	//
	treeIndex = 0;
	//for(pass = 0; pass < 2; pass++)
	//{
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

			//Expand/collapse
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
						
			//Se siamo fuori scala il gruppo non va mostrato
			if((groupScaleMin<Math.round(scala)) && (groupScaleMax>=Math.round(scala))) {
				displayStyle = 'block';
				
				style = 'style="display:' + displayStyle +';"';
				htmlLegenda += '<li ' + style + '>' + htmlExpandCollapse + '<input id="' + groupName + '" type="checkbox" ' + checked + ' class="legenda_group_checkbox" /><label for="' + groupName + '"><img src="/include/img/LdpViewer/legend/lc_group.gif" alt="icona del gruppo" />' + legendLabel + '</label></li>';

				//Si crea il div che conterrà i layer dentro al gruppo
				if (node.children != null) {
					//Se siamo fuori scala il layer non va mostrato
					if(node.tObject.expanded) {
						style="style=\"display:block;\"";
					} else {
						style="style=\"display:none;\"";
					}

					htmlLegenda+="<ul class='childrenof' id='childrenof_"+groupName+"' "+style+">";

					//Chiamata ricorsiva che ritorna l'html del sottoramo
					htmlLegenda += this.legendBuildClientSideTree(node.children, node, groupName, internal);
											// console.log('1161',htmlLegenda);
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

			//Expand/collapse
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

			//Se siamo fuori scala il layer non va mostrato
			if((node.tObject.min_scale==undefined || node.tObject.min_scale<=Math.round(scala)) && (node.tObject.max_scale==undefined || node.tObject.max_scale>Math.round(scala))) {
				style='style="display:block;"';
			} else {
				style='style="display:none;"';
			}

			var ol_layer = this.getOlLayerByLayerName(layerName);

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

					//Ci si ricava il currentRange in base alla scala attuale
					currentRange=this.getCurrentRange(rtLayer.ranges);

					//Se il layer non deve essere mostrato in legenda non si fa nulla
					if (rtLayer.display_in_legend!==false) {

						//Il layer non si deve vedere a questa scala, per cui nella legenda non va mostrato
						if(currentRange != null) {

							//Sul range corrente si controlla se ci sono tematizzazioni multiple
							if (currentRange.rules.length > 1) {
								html_stile="";
								for(k=0;k < currentRange.rules.length; k++) {
									themecategory=k;
									geomtype=currentRange.rules[k].type_num;
									label=currentRange.rules[k].label;

									html_stile=html_stile+"<img class='stile_"+layerName+"' id='stile_"+layerName+"_"+k+"' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY="+themecategory+"&TYPE="+geomtype+"&CLIENTAGENT=LdP%20Viewer' alt='icona tematizzazione del layer' title='' /> "+label+"<br/>";
								}

								html_stile="<div id='stile_"+layerName+"' "+stile_immagine+">"+html_stile+"</div>";

								htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='/include/img/LdpViewer/legend/lc_theme.gif' alt='icona multi regole' title='' />"+legend_label+"</label>"+html_stile+"</li>";

							} else {
								htmlLegenda+="<li "+style+"><input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY=-1&TYPE=-1&CLIENTAGENT=LdP%20Viewer' alt='icona tematizzazione del layer' title='' />"+legend_label+"</label></li>";
							}

						} else {
							///20190530 se il layer non si deve vedere alla scala corrente non si inserisce nell'html
							//htmlLegenda+="<li "+style+">"+htmlExpandCollapse+"<input id='"+layerName+"' type='checkbox' "+checked+" class='legenda_layer_checkbox' /><label for='"+layerName+"'><img class='legend-small' src='"+url+"&OPERATION=GETLEGENDIMAGE&SESSION="+stato[ol_layer].mg_session_info.mapSession+"&VERSION=1.0.0&SCALE="+scala+"&LAYERDEFINITION="+layerDefinition+"&THEMECATEGORY=-1&TYPE=-1&CLIENTAGENT=LdP%20Viewer' title='' />"+legend_label+"</label></li>";
						}
					} // if (rtLayer.display_in_legend!==false)
				break;
			} // switch (stato[ol_layer].tipo)
		} // else if(node.isGroup)
	}

//  console.log("htmlLegenda", htmlLegenda);
	return htmlLegenda;
}


LdpViewer.prototype.simpleHash = function(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}

LdpViewer.prototype.getCurrentRange = function (ranges) {
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

/*
 *================================================== 
 * WMS Section
 *==================================================
 */

LdpViewer.prototype.WMSInternalCatalog = function(internalUrl){
// 	$("#overlay_wms_selector_url").val(internalUrl);
	this.inputWMSUrl.val(internalUrl);
	this.overlayWmsSelectorScanUrl();
}


LdpViewer.prototype.openCloseWMSOverlayContainer = function(){
	if (this.editWMSBackground.hasClass("show")) {
		this.editWMSBackground.removeClass('show').addClass('hide');
		this.editWMSContainer.removeClass('show').addClass('hide');
	}
	else{
		this.editWMSBackground.removeClass('hide').addClass('show');
		this.editWMSContainer.removeClass('hide').addClass('show');
	}
}

LdpViewer.prototype.openCloseDiv = function(div){
	var div = $('#'+div);
	if ( div.is(':visible') ){
		div.removeClass('show').addClass('hide');
	}
	else{
		div.removeClass('hide').addClass('show');
	}
}


//Verifico se l'url passato è valido
LdpViewer.prototype.ValidURL = function(str) {
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if(!regex .test(str)) {
		return false;
	} else {
		return true;
	}
}


//riprendo l'url da overlay_wms_selector e chiamo la funzione per collegarsi al proxy;
LdpViewer.prototype.overlayWmsSelectorScanUrl = function(){
	var wms_url = this.inputWMSUrl.val();
	this.urlToProxyWMS(wms_url);
}


//Chiamo il Proxy tramite la chiamata ajax
LdpViewer.prototype.urlToProxyWMS = function(wms_url){
	var that = this;
	var wms_url = wms_url.trim();
	
	this.editWMSselectorContainer.empty("");
	this.editWMSselectorContainer.append("<span class='fa fa-spinner fa-spin'></div>");
	
// 	console.log(LdpViewer_proxy);
	if ( this.ValidURL(wms_url) == true ) {
// console.log(wms_url);
		$.ajax({
			url: LdpViewer_proxy,
			method: "POST",
			dataType: "json",
			data: {'service_type': 'wms', 'service_url': wms_url, 'action': 'GetCapabilities'},
			success: function(ret) {
				if ( typeof ret == 'undefined' || typeof ret.success == 'undefined' || ret.success == false ) {
						that.printMessages(that.editOverlayMessages,'<span>Impossibile recuperare la lista dei layers dall\'URL specificato</span>','warning',true);
				} else {
						that.editWMSselectorContainer.empty("");
						
						that.customWmsLayersList = ret.data;
						that.customWmsURL = wms_url;
						that.customWmsFormats = ret.formats;
						that.editWMSselectorContainer.html('<div id="ldpviewer_wms_selector_filter"><input id="ldpviewer_wms_selector_filter_text" placeholder="filtra layer" /></div>');
						that.editWMSselectorContainer.append('<div id="overlay_wms_selector_layers"></div>');
						that.overlayWmsSelectorShowData();
						$("#ldpviewer_wms_selector_filter_text").on("keyup", function() { that.overlayWmsSelectorShowData(); } );
				}
			},
			error: function() {
				that.printMessages(that.editOverlayMessages,'<span>Impossibile recuperare la lista dei layers dall\'URL specificato</span>','warning',true);
			}
		});

	} else {
		this.editWMSselectorContainer.empty("");
		this.printMessages(this.editOverlayMessages,'<span>L\'URL specificato non &egrave; valido</span>','warning',true);
	}
}


//immetto la lista dei layer ritornata in una tabella
LdpViewer.prototype.overlayWmsSelectorShowData = function(){
	var layersData = this.customWmsLayersList;
	var wms_url = this.customWmsURL;
	var hash = this.hashCode(wms_url);
	
	var filterText = $('#ldpviewer_wms_selector_filter_text').val();
	filterText = filterText.toLowerCase();
	var abs_class=""
	var img_scroll="<td class=\"scroll_y\">";
	var html = '';
	var img_html="";
	html += '<table id="overlay_wms_selector_layers_table"><thead><tr class="head"><th scope="col" id="titolo">Titolo</th><th scope="col" id="layer">Layer</th><th scope="col" id="descrizione">Descrizione</th><th scope="col" id="aggiungi"><span class="fa fa-plus-circle"></span> Aggiungi</th><th scope="col" id="stili">Stili</th><th scope="col" id="visibilita">Visibilit&agrave;</th>';
	//html += '<th>Azioni</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for (var i=0; i < layersData.length; i++) {
		if ( layersData[i].title.toLowerCase().indexOf(filterText) == -1 && 
			layersData[i].name.toLowerCase().indexOf(filterText) == -1 && 
			layersData[i].abstract.toLowerCase().indexOf(filterText) == -1)
			continue;
		html += '<tr class="';
		if ( (i % 2) == 0 ) { html += 'odd'; } else { html += 'even'; }
//		if (layersData[i].styles[style_name].legend_url_height > 200){
//			img_scroll="class=\"scroll_y\"";
//		}
		html += '"><td headers="titolo">' + layersData[i].title + '</td><td class="scroll" headers="layer">' + layersData[i].name + '</td><td '+abs_class+' headers="descrizione">' + layersData[i].abstract + '</td>';

		
		for (var style_name in layersData[i].styles) {
			if(layersData[i].styles[style_name].legend_url_height<200){
				img_html = '<td headers="aggiungi">';
			}
			else{
				//layersData[i].styles[style_name].legend_url_height=200;
				img_html = img_scroll;
			}
// 			console.log(img_html);
			html+=img_html;
	
			var wms_layer = this.customWmsLayersList[i].name;
			var wms_title = this.customWmsLayersList[i].title;

			//Si fa la chiamata al Proxy per le immagini della legenda, se la risorsa è interna al server
			var wms_url_internal = this.internalWmsURL;
			if(wms_url == wms_url_internal) {
				var scala=""; //Non serve?
				var returned_img = this.getWMSLegendFromProxy(wms_url, scala, wms_layer,'wms');
			
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='ldp_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='stili' class='nowrap'><a href='javascript:;' onclick='ldp_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='data:image/png;base64," + returned_img + "' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> vedi</a><br/>";
			
			} else {
				
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='ldp_viewer.overlayWmsSelectorAdd(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='stili' class='nowrap'><a href='javascript:;' onclick='ldp_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='"+layersData[i].styles[style_name].legend_url_href+"' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> vedi</a><br/>";
			}
// 	
		}
		html += '</td>';
		html += '<td headers="visibilita">Visibile';
		if ( typeof layersData[i].min_scale != 'undefined' && layersData[i].min_scale != '')
			html += ' da 1:' + Math.round(layersData[i].min_scale);
		if ( typeof layersData[i].max_scale != 'undefined' && layersData[i].max_scale != '' )
			html += ' fino a 1:' + Math.round(layersData[i].max_scale);
		if ( (typeof layersData[i].min_scale == 'undefined' || layersData[i].min_scale == '') && (typeof layersData[i].max_scale == 'undefined' || layersData[i].max_scale == '' ) )
			html += ' a tutte le scale';
		html += '</td>';
		html += '</tr>';
	}
	
	html += '</tbody>';
	html += '</table>';
	
	$('#overlay_wms_selector_layers').html(html);
}


//hash code della stringa degli url per rendere gli id univoci (questo poichè potremmo utilizzare wms diversi)
LdpViewer.prototype.hashCode = function(str) {
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};


//Aggiunta del layer alla legenda (checkbox)
LdpViewer.prototype.overlayWmsSelectorAdd = function(wms_url, i, style_name){
	var layersData = this.customWmsLayersList;
	var formats = this.customWmsFormats;
	var wms_url = this.customWmsURL;
	var wms_url_internal = this.internalWmsURL;

	// Decidiamo il formato migliore sulla base di quelli supportati. In ordine di preferenza: PNG8, PNG, JPEG
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
		// tentiamo PNG come fallback
		format = 'image/png';
	}
// 	console.log("formats",formats,"format scelto",format);
	
	var hash = this.hashCode(wms_url);
	var layer_name = layersData[i].name;
	
	if(wms_url == wms_url_internal) {
		this.map.addWmsInternalLayer(wms_url, layersData, i, style_name, format);
	} else {
		this.map.addWmsLayer(wms_url, layersData, i, style_name, format);
	}
	
	if(this.map.WmsLayerAdded != true)
		this.printMessages(this.editOverlayMessages,'<span>Il Layer non è stato aggiunto alla mappa. Vi è già un layer con lo stesso nome.</span>','warning',true);
	else{
		this.printMessages(this.editOverlayMessages,'<span>Il Layer è stato aggiunto alla mappa</span>','ok',true);
	
		if ( $('#map_wms_custom_label').length == 0 ) {
			var label = $('<div>');
			label.attr('id','map_wms_custom_label');
			label.html('WMS terze parti');
			$('#ldpviewer_legend_wmsExternal').append(label);
			var div = $('<div>');
			div.attr('id','map_wms_custom_container');
			div.addClass('form-checkboxes');
			$('#ldpviewer_legend_wmsExternal').append(div);
			var ul = $('<ul>');
			ul.attr('id','map_ul_legenda_wms_custom');
			ul.attr('class', 'legenda childrenof');
			$('#map_wms_custom_container').append(ul);
		}

		if(wms_url == wms_url_internal) {
			var scala=""; //Non serve?
			var returned_img = this.getWMSLegendFromProxy(wms_url, scala, layer_name,'wms');
			
			///TODO vedere perchè non si vede
			var div_legend_html = '<div id="custom_wms_layer_legend_' + hash + '_' + i + '" class="custom_wms_legend hide" style="background: url(\'data:image/png;base64,' + returned_img + '\'); width: '+ layersData[i].styles[style_name].legend_url_width +'px; height: '+ layersData[i].styles[style_name].legend_url_height +'px;""></div>';
			
		} else {
			var div_legend_html = '<div id="custom_wms_layer_legend_' + hash + '_' + i + '" class="custom_wms_legend hide" style="background: url(\'' + layersData[i].styles[style_name].legend_url_href +'\'); width: '+ layersData[i].styles[style_name].legend_url_width +'px; height: '+ layersData[i].styles[style_name].legend_url_height +'px;""></div>';
		}
		
		$("#map_ul_legenda_wms_custom").append('<li><a id="expand_' + hash + '_' + i +'" href="javascript:;" onclick="ldp_viewer.openCloseDiv(\'custom_wms_layer_legend_' + hash + '_' + i + '\')" class="plus_stile"></a><input id="custom_wms_layer_checkbox_' + hash + '_' + i + '" type="checkbox" checked="checked" onclick="ldp_viewer.customWmsLayerViewToggle(\'' + hash + '_' + i + '\', \'' + layer_name +'\')" class="form-checkbox">&nbsp;</input><label>'+ layersData[i].title +'</label><br/>' + div_legend_html + '</li>');
	}
}


//PrintMessages
LdpViewer.prototype.printMessages = function(div,message,status,timeout){
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


//Toggle Accensione/spegnimento layer
LdpViewer.prototype.customWmsLayerViewToggle = function(name, layer_name) {
	if ( $('#custom_wms_layer_checkbox_' + name).is(':checked') )
		this.map.customWmsLayerViewToggle(layer_name, true);
	else
		this.map.customWmsLayerViewToggle(layer_name, false);
}

//AddLayer 
LdpViewer.prototype.addLayer = function(layer){
	this.map.addingLayer(layer);
}

//overlayWmsInternal
LdpViewer.prototype.overlayWmsInternal = function() {
	var wms_url_internal = this.internalWmsURL;
	this.urlToProxyWMS(wms_url_internal);
}


//getLegendFromProxy
LdpViewer.prototype.getWMSLegendFromProxy = function(url, scala, layer, tipo) {

	var that = this;
	var url_legend_action = "REQUEST=GetLegendGraphic&VERSION=1.3.0&FORMAT=image/png&LEGEND_OPTIONS=fontName:Serif;fontAntiAliasing:true;fontSize=6;dpi:100&WIDTH=20&HEIGHT=20&SCALE="+scala+"&LAYER="+layer;
	var returned = '';
	$.ajax({
		url: LdpViewer_proxy,
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


//Valida solo per il mapguide
LdpViewer.prototype.addPolygonsInLayer_legacy = function(wkt,nomeLayer,doRefresh, onSuccess, onFail) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...
	var a_wkt=wkt.split("|");
	if (empty(nomeLayer)){
		nomeLayer='redline';
	}
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(nomeLayer,a_wkt[i]);
		} else {
			this.addRedlineWKT(nomeLayer,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}

LdpViewer.prototype.addPointsInLayer_legacy = function(wkt,nomeLayer,doRefresh, onSuccess, onFail, emptyLayerBefore) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...
	var a_wkt=wkt.split("|");
	if (empty(nomeLayer)){
		nomeLayer='redline';
	}
	
	if (typeof emptyLayerBefore === 'undefined') {
		emptyLayerBefore=true;
	}
	
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(nomeLayer,a_wkt[i],emptyLayerBefore);
		} else {
			this.addRedlineWKT(nomeLayer,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}

LdpViewer.prototype.putLabelInLayer_legacy = function(nomeLayer,wkt,labelText,size, angle, sizex, doRefresh,onSuccess) {
	var clear=1;
	this.map.addLabelInLayer(nomeLayer,wkt,labelText,size, angle,clear);
}

LdpViewer.prototype.putLabelsInLayer_legacy = function(nomeLayer,params,sizex,doRefresh,onSuccess) {
	
/*il primo si fa putlabelinlayer per gli altri si fa addLabelInLayer*/
	for (var i=0; i<params.length; i++)
		{
			this.map.addLabelInLayer(nomeLayer,params[i].wkt,params[i].text,params[i].size, params[i].angle,params[i].clear);
		}
}

LdpViewer.prototype.hex2dec = function (theHex) {
   if ( (theHex.charAt(0) > "F") || (theHex.charAt(1) > "F") ) {
      console.log("Hexadecimal (00-FF) only, please...");
      return 0;
   }
   var retDec  = parseInt(theHex,16)/255;
   return retDec;
}

LdpViewer.prototype.creaPointLayer_legacy = function(nome, colore, spessore, angolo, height, group, groupLabel, onSuccess, onFail) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(spessore) ) { spessore = 4; }
	if ( empty(nome) ) { nome = "tmp_punti"; }
	this.map.creaTempLayer(nome,colore,'',spessore);
}


LdpViewer.prototype.creaLineLayer_legacy = function(nome, colore, spessore, group, groupLabel, onSuccess, onFail) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(nome) ) { nome = "tmp_linee"; }
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(spessore) ) { spessore = 4; }
	this.map.creaTempLayer(nome,colore,'',spessore);
}

LdpViewer.prototype.creaPolygonLayer_legacy = function(nome, colore, spessore_bordo, colore_bordo, group, groupLabel, onSuccess, onFail, setVisible) {
	//controllo parametri. Se vuoti passo valori di default
	if ( empty(nome) ) { nome = "tmp_poligoni"; }
	if ( empty(colore) ) { colore = "c519ff"; }
	if ( empty(colore_bordo) ) { colore_bordo = "bf00ff"; }
	if ( empty(spessore_bordo) ) { spessore_bordo = 4; }
	this.map.creaTempLayer(nome,colore,colore_bordo,spessore_bordo);
}

LdpViewer.prototype.creaGeneralLayers_legacy = function(nomi, tipologie, colori, spessori_bordo, colori_bordo, nomiGruppi, onSuccess) {

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
		//lo spessore del bordo si cabla qui invece che in LdpMap.js, sostituendo una modifica del 2020-03-02. Questo permette di usare al funzione creaTempLayer per creare layer temporanei con spessori diversi da 2, senza passare da creaGeneralLayers_legacy
		a_spessori_bordo[i]=2;
		this.map.creaTempLayer(a_layers[i],fill_color_array,stroke_color_array,a_spessori_bordo[i]);
	}
}

LdpViewer.prototype.creaLabelLayer_legacy = function(nomeLayer,colore,spessore,doRefresh,onSuccess) {
	this.map.creaTempLayer(nomeLayer,colore,colore,spessore);
}


LdpViewer.prototype.addLinesInLayer_legacy = function(wkt,nomeLayer,doRefresh, onSuccess, onFail) {
	///Nella vecchia chiamata wkt contiene una lista di wkt separata da |, si deve ciclare e aggiungere una wkt alla volta...

	var a_wkt=wkt.split("|");
	if (empty(nomeLayer)){

		nomeLayer='redline';
	}
	
	for (var i=0;i < a_wkt.length;i++) {
		if (i==0) {
			this.addRedlineWKT(nomeLayer,a_wkt[i]);
		} else {
			this.addRedlineWKT(nomeLayer,a_wkt[i],false);
		}
	}
	
	if (typeof onSuccess !== 'undefined') {
		eval(onSuccess);
	}
}

//Valida solo per il mapguide
LdpViewer.prototype.emptyLayers_legacy = function(nomiLayers,mapRefresh) {
	var lista_layer=nomiLayers.split("|");
	
	for (var i=0;i < lista_layer.length;i++) {
		this.mapClearTempLayers(lista_layer[i]);
	}
	if(mapRefresh===true){
		setTimeout($.proxy(function () {this.mapRefresh();},this),500);

	}
}


//Tracking Position
LdpViewer.prototype.trackingPosition = function(){
	console.log("setTracking");
	this.map.mapSetTracking(true);
	//this.map.addLayer(whereat)
}
