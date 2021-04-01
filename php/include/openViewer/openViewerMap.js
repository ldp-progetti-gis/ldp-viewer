/**
 * JAVASCRIPT CLASSES TO HANDLE THE MAP COMPONENT
 * 
 * Classes:
 * - ovMap: class to handle the map component of the viewer
 *
 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
 * @version: 1.0
 * @license: GNU General Public License v2.0
 */


/** MAIN CLASS: ovMap */
var ovMap = function (params) {
	this.stato = params.stato;	// "stato" inherits the "map_definition" object defined in the PHP configuration
								// and contains the definition of the "main layers" (all layers but the basemap layers and the user WMS layers)
	this.mapOptions = params.mapOptions; // contains the basic settings for the map:° projection, units, initial view, etc. (= map_options defined in the PHP configuration file)
    this.mapCenter
	this.mapDiv = params.mapDiv;
	this.tooltipDiv = params.tooltipDiv;
	this.drawWKTDiv = params.drawWKTDiv;
	this.measureTooltipElement = null;
	if (typeof this.mapOptions.data_projection !== 'undefined') {
		this.dataProjection=this.mapOptions.data_projection;
	} else {
		this.dataProjection="EPSG:4326";
	}
	
	if (typeof this.mapOptions.map_projection !== 'undefined') {
		this.mapProjection=this.mapOptions.map_projection;
	} else {
		this.mapProjection="EPSG:4326";
	}
	
	//this.dpi=90.715;
	this.dpi=96;
	this.ipm=1/0.0254;
	this.map = null;
	this.mg_session_info = null;
	this.mg_ping_interval=120000;
	this.mg_ping_max_failures=5;
	this.mg_ping_failures=0;
	this.mg_ping_timer=null;
	
	this.initialView = {"center":null,"zoom":null};
	
	this.extraInteractions= {"zoom_selection":null,"select":null, "draw":null, "measure":null, "snap":null};
	
	this.statusInteraction="select";
	this.historyView=[];
	this.historyViewIndex=-1;
	this.historyViewCaller='';
	this.historyViewPreviousCaller='';
	this.refreshStatus();
	this.WmsLayerAdded=null;
	this.ProxySet = params.ProxySet;
	this.ol_map_layers=[];
	this.baseLayers = params.baseLayers;
	this.baseLayersDefinition = params.baseLayersDefinition;
	
	this.showConsoleMsg = params.showConsoleMsg; // show console messages
	
};


/** PROPERTIES (get/set/is) */
ovMap.prototype.getMapOptions = function() { return this.mapOptions; } // Return the "basemap" layers settings
ovMap.prototype.getMapView = function() { return this.map.getView(); } // Return the OpenLayers map view object
ovMap.prototype.getStato = function() { return this.stato; } // Return the "MapGuide" layers settings
ovMap.prototype.setStato = function(stato) { this.stato = stato; } // Set the "MapGuide" layers settings
ovMap.prototype.getMapLayers = function() { return this.map.getLayers(); } // Return the array of layers
ovMap.prototype.getMapLayerByName = function(ol_layer) { // Return the OL "layer" object identified by the name
	var layer=null;
	var map_ol_layers=this.map.getLayers();
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==ol_layer) {
			layer=item;
		}
		
	},this);

	return layer;
}
ovMap.prototype.getMapLayerSourceByName = function(ol_layer) { // Return the OL "source" object of the layer identified by the name
	var source=null;
	var map_ol_layers=this.map.getLayers();

	map_ol_layers.forEach(function(item,index){

		if(item.get('name')==ol_layer) {
			source=item.getSource();
		}

	},this);

	return source;
}
ovMap.prototype.setStatusInteraction = function(interactionStatus) { // Set the user interaction status
	this.statusInteraction=interactionStatus;
	return;
};
ovMap.prototype.getStatusInteraction = function() { return this.statusInteraction; }; // Return the user interaction status
ovMap.prototype.isLayerVisibleOnMap = function(ol_layer,layer_name) { // Return the visibility of a "layer", taking into account the visibility of the parent group too
	// Layer belong to a group ?
	if(ol_layer.layers_info[layer_name].group!=undefined) {
		parentGroup=ol_layer.layers_info[layer_name].group;

		while (parentGroup!=null) {
			// check if the group is visible
			if(ol_layer.groups_info[parentGroup].visible==true) {
				// check if the group belong to another group
				if(ol_layer.groups_info[parentGroup].group!=undefined) {
					parentGroup=ol_layer.groups_info[parentGroup].group;
				} else {
					// the group is visible
					parentGroup=null;
				}
			} else {
				// the parent group is not visible
				return false;
			}
		}
	}
	
	// check if the layer (not belonging to any group) is visible
	return (ol_layer.layers_info[layer_name].visible===true);
}
ovMap.prototype.isGroupVisibleOnMap = function(ol_layer,group_name) {	// Return the visibility of a "group", taking into account the visibility of the parent group too
	parentGroup=group_name;

	while (parentGroup!=null) {
		// check if the group is visible
		if(ol_layer.groups_info[parentGroup].visible==true) {
			// check if the group belong to another group
			if(ol_layer.groups_info[parentGroup].group!=undefined) {
				parentGroup=ol_layer.groups_info[parentGroup].group;
			} else {
				// the group is visible
				parentGroup=null;
			}

		} else {
			// the parent group is not visible
			return false;
		}
	}
	
	// check if the group (not belonging to any group) is visible
	return (ol_layer.groups_info[group_name].visible);
}
ovMap.prototype.getScale = function() {									// Return the current scale 
// if(this.showConsoleMsg) console.log("pixelRatio: "+window.devicePixelRatio);
	var view = this.map.getView();
	var resolution = view.getResolution();
	var metricResolution=ol.proj.getPointResolution(view.getProjection(),resolution,view.getCenter());
	var units = view.getProjection().getUnits();
	//var mpu = ol.proj.METERS_PER_UNIT[units];
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	//var scale = metricResolution * mpu * this.ipm * this.dpi;
	var scale = mpu * this.ipm * this.dpi * resolution;
	
	return Math.round(scale);
};
ovMap.prototype.setScale = function(scale) {							// Set the scale of the current view
	var view = this.map.getView();
	var curRes = this.getResolutionFromProjectionAndScale(scale, view.getProjection());
    view.setResolution(curRes);
}
ovMap.prototype.getZoom = function() {									// Return the current zoom level
// if(this.showConsoleMsg) console.log("getScale: ",window.devicePixelRatio);
	var view = this.map.getView();
	var zoom = view.getZoom();
	return zoom;
};
ovMap.prototype.getCenter = function() {								// Return the coordinates of the center of the current view, according to the "map projection"
	var view = this.map.getView();
	var center = view.getCenter();

	var centro = {};
	centro.X = center[0];
	centro.Y = center[1];
	
	return centro;
}
ovMap.prototype.getCenterProjected = function(aProjection) {			// Return the projected coordinates of the center of the current view (default this.dataProjection)
    if (typeof aProjection === 'undefined' || aProjection == undefined || aProjection == '') aProjection = this.dataProjection;
	var view = this.map.getView();
	var center = view.getCenter();

	var center_data = ol.proj.transform([center[0] , center[1]], this.mapProjection, this.dataProjection);

	var centro = {};
	centro.X = center_data[0];
	centro.Y = center_data[1];
	
	return centro;
}
ovMap.prototype.setCenterProjected = function(x, y, aProjection) {		// Set the center of the current view, passing the projected coordinates and the projection (default this.dataProjection)
    if (typeof aProjection === 'undefined' || aProjection == undefined || aProjection == '') aProjection = this.dataProjection;
	if (!isNaN(parseFloat(x)) && !isNaN(parseFloat(y))){
		var view = this.map.getView();
		var centro = ol.proj.transform([parseFloat(x) , parseFloat(y)], aProjection, this.mapProjection);
		view.setCenter(centro);
	}
}
ovMap.prototype.getWidth = function() {									// Return the "width" of the current extent
	var view = this.map.getView();
	var extent = view.calculateExtent();
	var width= ol.extent.getWidth(extent);
	return width;
}
ovMap.prototype.getHeight = function() {								// Return the "height" of the current extent
	var view = this.map.getView();
	var extent = view.calculateExtent();
	var height= ol.extent.getHeight(extent);
	return height;
}


/** CREATION OF THE OPENLAYERS MAP OBJECT
 * -------------------------------------------------------
 * - definition of the map styles
 * - creation of all layers (basemap, additional, service)
 * - definition of the map interaction tools
 * - definition of the map controls
 * - creation of the tooltip overlay
 * - definition of the tooltip functionality
 */
ovMap.prototype.LoadMap = function() {
	var that=this;
	var stato = this.getStato();
	var mapOptions = this.getMapOptions();
	var tooltip_content = this.tooltipDiv; // container used for the tooltip

    var ol_map_layers=new Array();
	
	/**
	 * STYLES
	 * - used for the rendering over the map
	 */

    // SELECTION layer: style settings
	var fill_selection=new ol.style.Fill({
		color: 'rgba(0, 127, 255,0.4)'
	});
	var stroke_selection=new ol.style.Stroke({
		color: '#007FFF',
		width: 3
	});
    // SNAP layer: style settings
	var fill_snap=new ol.style.Fill({
		color: 'rgba(0, 0, 0, 0)'
	});
	var stroke_snap=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0)',
		width: 1
	});
	// REDLINE layer: style settings
	var fill_redline=new ol.style.Fill({
		color: 'rgba(197, 25, 255,0.8)'
	});
	var stroke_redline=new ol.style.Stroke({
		color: '#bf00ff',
		width: 4
	});
	// DRAWING layer: style settings
	var fill_drawing=new ol.style.Fill({
		color: 'rgba(221, 29, 4,0.4)'
	});
	var stroke_drawing=new ol.style.Stroke({
		color: '#FF7F00',
		width: 3
	});
	// MEASURE layer: style settings
	var fill_line_measure=new ol.style.Fill({
		 color: 'rgba(255, 255, 255, 0.2)'
	});
	var stroke_line_measure=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0.5)',
		lineDash: [10, 10],
		width: 2
	});
	var style_measure = new ol.style.Style({
		fill: fill_line_measure,
		stroke: stroke_line_measure,
		image: new ol.style.Circle({
			radius: 5,
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.7)'
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			})
		})
	});
	
	/**
	 * CREATION OF THE BASEMAP LAYERS
	 * - instantiation of the the layers
     * - addition (push) to the list of "available" layers inside OpenLayers
	 */
	if(this.baseLayers === null){
if(this.showConsoleMsg) console.log('Creation of the DEFAULT basemap layers... ');
        var open_street_map = new ol.layer.Tile({
			source: new ol.source.OSM(),
			name: 'OpenStreetMap',
			visible: (default_base_layer=='open_street_map'),
			baselayer: true
		});
		ol_map_layers.push(osm);
		var no_basemap = new ol.layer.Tile({
			source: null,
			name: 'No basemap',
			visible: (default_base_layer=='no_basemap'),
			baselayer: true
		});
		ol_map_layers.push(nessuno);
	}
	else{
		if(this.baseLayers != ''){
			var map_baseLayers = this.baseLayers;
			var map_baseLayersDefinition = this.baseLayersDefinition;
if(this.showConsoleMsg) console.log('Creation of the '+map_baseLayers.length+' OL layers... ');
			for(var j=0; j < map_baseLayers.length; j++){
                
				var aLayerDef = map_baseLayersDefinition[j]
/*
if(this.showConsoleMsg) {
	console.log('- Layer '+map_baseLayers[j]);
	console.log('  - key '+aLayerDef.key);
	console.log('  - sourceType '+aLayerDef.sourceType);
	console.log('  - wms_url '+aLayerDef.wms_url);
	console.log('  - wms_layers_names '+aLayerDef.wms_layers_names);
	console.log('  - wms_server_type '+aLayerDef.wms_server_type);
	console.log('  - wms_layer_projection '+aLayerDef.wms_layer_projection);
	console.log('  - layer_title '+aLayerDef.layer_title);
	console.log('  - layer_visible '+aLayerDef.layer_visible);
	console.log('  - is_basemap_layer '+aLayerDef.is_basemap_layer);
}
*/
				if(aLayerDef.wms_layers_names == undefined) { aLayerDef.wms_layers_names = '';}
				if(aLayerDef.wms_query_layers_names == undefined) { aLayerDef.wms_query_layers_names = '';}
				if(aLayerDef.wms_info_format == undefined) { aLayerDef.wms_info_format = '';}

				if(aLayerDef.wms_layers_names != '' && aLayerDef.wms_query_layers_names != '' && aLayerDef.wms_info_format != '') {
					var tmpParams = {
										'LAYERS': eval(aLayerDef.wms_layers_names),
										'QUERY_LAYERS': aLayerDef.wms_query_layers_names,
										'INFO_FORMAT': aLayerDef.wms_info_format
									}
				} else if(aLayerDef.wms_layers_names != '' && ( aLayerDef.wms_query_layers_names == '' || aLayerDef.wms_info_format == '') ) {
					var tmpParams = {
										'LAYERS': aLayerDef.wms_layers_names
									}
				} else {
					var tmpParams = null;
				}

				switch (aLayerDef.sourceType) {
					case "OSM":
						eval('var '+aLayerDef.key+' = new ol.layer.Tile({'+
								'source: new ol.source.OSM(),'+
								'name: "'+aLayerDef.layer_title+'",'+
								'visible: '+aLayerDef.layer_visible+','+
								'baselayer: '+aLayerDef.is_basemap_layer+
							'});')
						break;
					case "TileWMS":
						eval('var '+aLayerDef.key+' = new ol.layer.Tile({'+
								'source: new ol.source.TileWMS ({'+
									'url: aLayerDef.wms_url,'+
									'params: tmpParams,'+
									'serverType: aLayerDef.wms_server_type,'+
									'projection: aLayerDef.wms_layer_projection'+
								'}),'+
								'name: "'+aLayerDef.layer_title+'",'+
								'visible: '+aLayerDef.layer_visible+','+
								'baselayer: '+aLayerDef.is_basemap_layer+
							'});')
						break;
					case "":
						eval('var '+aLayerDef.key+' = new ol.layer.Tile({'+
								'source: null,'+
								'name: "'+aLayerDef.layer_title+'",'+
								'visible: '+aLayerDef.layer_visible+','+
								'baselayer: '+aLayerDef.is_basemap_layer+
							'});')
						break;
				}
				ol_map_layers.push(eval(aLayerDef.key));
if(this.showConsoleMsg) console.log(' - Layer '+aLayerDef.key+' ('+aLayerDef.sourceType+' '+aLayerDef.layer_visible+' '+aLayerDef.wms_layer_projection+') created.');
			}
		}
	}

	/**
	 * CREATION OF THE ADDITIONAL LAYERS
	 * - instantiation of the the layers
     * - addition (push) to the list of "available" layers inside OpenLayers
	 */

    // currently the array "stato" (< map_definition in config) is empty then this part could be useless - START SECTION
	var a_ol_layers=Object.keys(stato);
    
	// check of the layer type for each layer defined in "stato" (< map_definition)
	a_ol_layers.forEach(function(item,index){
		ol_layer=stato[item];
		switch (ol_layer.tipo) {
			case "wms":
					source = new ol.source.ImageWMS ({
						url: OpenViewer_proxy,
						params: {'LAYERS': [ol_layer.name_layers_visible],'FORMAT':'image/png','WMSURL' :ol_layer.url,'PERMITTED_AUTENTICATION': permitted_autentication },
						serverType: 'geoserver',
						ratio: 1.2,
						projection: that.dataProjection
					});
				
				
				ol_map_layers.push(new ol.layer.Image({
					source: source,
					name: item,
					visible: false,
					opacity: 1.0
				}));
			break;
			case "wms_geoserver":
				//Sorgente dati Geoserver WMS
				if(that.ProxySet == true){
					source = new ol.source.ImageWMS ({
							url: OpenViewer_proxy,
							params: {'LAYERS': [ol_layer.name_layers_visible], 'FORMAT':'image/png8','WMSURL': ol_layer.url},
							serverType: 'geoserver',
							ratio: 1.2,
							projection: that.dataProjection
					});
					
					ol_map_layers.push(new ol.layer.Image({
						source: source,
						name: item,
						visible: false,
						opacity: 1.0
					}));
				} else {
					source = new ol.source.ImageWMS ({
						url: ol_layer.url,
						params: {'LAYERS': ol_layer.list_layers_visible, 'FORMAT':'image/png8'},
						serverType: 'geoserver',
						ratio: 1.2,
						projection: that.dataProjection
					});
			
					ol_map_layers.push(new ol.layer.Image({
						source: source,
						name: item
					}));
				}

				// the first time the map is loaded it is necessary to ensure that the size of the map fits inside the container DIV
				source.once('imageloadend', function() {
					map.updateSize();
				});
			break;

			case "mapguide":
				//Mapguide
				source = new ol.source.ImageMapGuide({
					projection: that.dataProjection,
					url: ol_layer.url,
					useOverlay: true,
					hidpi: false,	  // needed, to avoid changes on the visible layers at a specific scale, with device with pixelRatio > 1
					metersPerUnit: 1, // value returned from mapguide
					params: {
						MAPNAME: ol_layer.mg_session_info.mapName,
						SESSION: ol_layer.mg_session_info.mapSession,
						//MAPDEFINITION: ol_layer.mapDefinition,
						FORMAT			: 'PNG8',
						BEHAVIOR		: 2,
						VERSION			: '2.1.0'
					},
					ratio: 1.0
				});

				ol_map_layers.push(new ol.layer.Image({
					source: source,
					name: item
				}));

				// the first time the map is loaded it is necessary to ensure that the size of the map fits inside the container DIV
				source.once('imageloadend', function() {
					map.updateSize();
				});
				
				// make a copy of the layer to avoid changes
				var this_layer = ol_layer;
				
				// set a repeating PING in the API of MapGuide to keep the sessin alive
				that.mg_ping_timer=setInterval(function (){that.MapguidePing(this_layer);},that.mg_ping_interval);
				
			break;
		}
	});

    if (typeof source !== 'undefined') var source_tooltip=source;
    // currently the array "stato" (< map_definition in config) is empty then this part could be useless - END SECTION
	
	/**
	 * CREATION OF THE SERVICE LAYERS
	 * - instantiation of the the layers
     * - addition (push) to the list of "available" layers inside OpenLayers
     * WARNING: the last pushed layer is the one used for the tooltip
	 */

	// SNAP layer - instantiation of the layer used for the snapping activities
	var snapOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_snap,
 			stroke: stroke_snap
		}),
		source: new ol.source.Vector(),
		name:'snap'
	});
	// addtion (push) of the layer
	ol_map_layers.push(snapOverlay);
    
	// SELECTION layer - instantiation of the layer used for the selection activities
	var selectOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_selection,
			stroke: stroke_selection,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill_selection,
				stroke: stroke_selection
			})
		}),
		source: new ol.source.Vector(),
		name:'selection'
	});
	// addtion (push) of the layer
	ol_map_layers.push(selectOverlay);

	// REDLINE layer - instantiation of the layer used for the redlining activities
	var redlinePoint = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_redline,
			stroke: stroke_redline,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill_redline,
				stroke: stroke_redline
			})
		}),
		source: new ol.source.Vector(),
		name:'redline'
	});
	// addtion (push) of the layer
	ol_map_layers.push(redlinePoint);
    
	// DRAWING layer - instantiation of the layer used for the drawing activities
	var drawingOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_drawing,
			stroke: stroke_drawing,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill_drawing,
				stroke: stroke_drawing
			})
		}),
		source: new ol.source.Vector(),
		name:'drawing'
	});
	// addtion (push) of the layer
	ol_map_layers.push(drawingOverlay);
    
	// MEASURE layer - instantiation of the layer used for the measure activities
	var measureOverlay = new ol.layer.Vector({
		source: new ol.source.Vector(),
		name:'measure',
		style: style_measure
	});
	// addtion (push) of the layer
	ol_map_layers.push(measureOverlay);

	/**
	 * DEFINITION OF THE MAP VIEW  (OL view iobject)
	 * - initialization of the map center
     * - initialization of the MAP VIEW
	 */

    ol.proj.proj4.register(proj4);
	
	// calculation of the map center (the coordinates based on this.dataProjection are transformed to this.mapProjection)
if(this.showConsoleMsg) console.log('Setting the initial view...');
if(this.showConsoleMsg) console.log('- map projection '+ this.mapProjection);
	var mapCenter = ol.proj.transform([mapOptions.initial_map_center[0], mapOptions.initial_map_center[1]], this.dataProjection, this.mapProjection);
if(this.showConsoleMsg) console.log('- initial map center '+mapCenter[0]+' , '+mapCenter[1]);
    
	// creation of the OL map view object
	var mapView = new ol.View({
		center: mapCenter,
		zoom: mapOptions.initial_zoom,
		projection: this.mapProjection
	});
	
	this.initialView.center=mapCenter;
	this.initialView.zoom=mapOptions.initial_zoom;
	
    // if the override parameters (center_override and zoom_override) are defined, these settings are applied
	if(typeof mapOptions.center_override != 'undefined' && typeof mapOptions.zoom_override != 'undefined') {
		var mapCenter = ol.proj.transform([mapOptions.center_override[0], mapOptions.center_override[1]], this.dataProjection, this.mapProjection);
		//var mapCenter = mapOptions.initial_map_center;
		var mapView = new ol.View({
			center: mapCenter,
			zoom: mapOptions.zoom_override,
			projection: this.mapProjection
		});
	}
	
	/**
	 * DEFINITION OF THE MAP INTERACTION TOOLS (OL interaction object)
	 */
	var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false, shiftDragZoom:false});
	// dragZoom = new ol.interaction.DragZoom({condition: ol.events.condition.always}); 
	this.extraInteractions.zoom_selection = new ol.interaction.DragZoom({condition: ol.events.condition.always});
	this.extraInteractions.select = new ol.interaction.DragBox({condition: ol.events.condition.always});
	this.extraInteractions.measure = new ol.interaction.Draw({
		source: measureOverlay.getSource(),
		type: "LineString"
	});
	this.extraInteractions.snap = new ol.interaction.Snap({source: snapOverlay.getSource()});
	this.extraInteractions.draw = new ol.interaction.Draw({   // used to draw over the map
		source: drawingOverlay.getSource(),
		type: "Polygon"
	});
	
// 	
//	///Draw WKT
//	var draw_wkt = this.drawWKTDiv;
//
// 	this.extraInteractions.draw.on('drawend',function(e) {
// if(this.showConsoleMsg) console.log("general drawend");
// 		var format = new ol.format.WKT();
// 		wkt = format.writeGeometry(e.feature.getGeometry());
// 		draw_wkt.html(wkt);
// 		
// 		//Chiamo una callback ?
// 		fineDisegno(wkt);
// // 		that.controlDoubleClickZoom(false);
// 		//setTimeout(function() { that.controlDoubleClickZoom(true); }.bind(that),251);
// 	});
	
// 	this.extraInteractions.select.on('boxend', function() {
// 		// features that intersect the box are added to the collection of
// 		// selected features, and their names are displayed in the "info"
// 		// div
// 		var info = [];
// 		var extent = dragBox.getGeometry().getExtent();
// 		vectorSource.forEachFeatureIntersectingExtent(extent, function(feature) {
// 		selectedFeatures.push(feature);
// 		info.push(feature.get('name'));
// 		});
// 		if (info.length > 0) {
// 		infoBox.innerHTML = info.join(', ');
// 		}
// 	});
// 
// 	// clear selection when drawing a new box and when clicking on the map
// 	this.extraInteractions.select.on('boxstart', function() {
// 		selectedFeatures.clear();
// 		infoBox.innerHTML = '&nbsp;';
// 	});
	
	
	/**
	 * DEFINITION OF THE MAP CONTROLS (OL controls object)
	 */
	var mousePositionControl = new ol.control.MousePosition({
		coordinateFormat: ol.coordinate.createStringXY(2),
		//projection: this.dataProjection,
		projection: this.mapProjection,
		// comment the following two lines to have the mouse position
		// be placed within the map.
		className: 'custom-mouse-position',
		target: document.getElementById('footer_mouse_coordinates'),
		undefinedHTML: '&nbsp;'
	});
    
	//var controls = [ new ol.control.ScaleLine(), new ol.control.Zoom(), mousePositionControl ];
    //var controls = [ new ol.control.ScaleLine(), mousePositionControl ];

    var controls = [];
    if(this.mapOptions['show_coordinates_mouse']) controls.push(mousePositionControl);
    if(this.mapOptions['show_view_scale']) controls.push(new ol.control.ScaleLine());

	
	/**
	 * DEFINITION OF THE TOOLTIP OVERLAY (OL overlays object)
	 */
	tooltip_overlay = new ol.Overlay({
		// I need the DOM object, not of the JQUERY object
		element: tooltip_content[0]
	});

	var map=new ol.Map({
		target: this.mapDiv,
		view: mapView,
		layers: ol_map_layers,
		interactions: interactions,
		controls: controls,
		overlays: [tooltip_overlay]
	});
	
	/**
	 * DEFINITION OF THE TOOLTIP FUNCTIONALITY
	 */
	map.on('pointermove', function(evt) {
// if(this.showConsoleMsg) console.log("pointermove");
		// hide the previous tooltip when the mouse position changes
		tooltip_overlay.setPosition(undefined);
		lastTimeMouseMoved = new Date().getTime();
// 		var stato = this.stato;
        
		/* Reverse loop over the OL layers to find the first layer with list_layers_tooltip != '';
         * Special case: no tooltip on "partial" WMS layer, because we should wait for the async response and it is not worthwhile
		 */
		var done = false;
		a_ol_layers.slice().reverse().forEach(function(item,index){
			if (done) return;
			ol_layer=stato[item];

			if(ol_layer.list_layers_tooltip!='') {
				done = true;
				var t=setTimeout(function(){
					var currentTime = new Date().getTime();
					if(currentTime - lastTimeMouseMoved >= 500) {

						coordinate = evt.coordinate;
						switch(ol_layer.tipo) {
							case "wms":
								var url = source_tooltip.getGetFeatureInfoUrl(
									evt.coordinate, mapView.getResolution(), that.mapProjection,
									{'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': ol_layer.list_layers_tooltip,'format_options': 'callback:getTooltip'}
								);

								$.ajax({
									url: url,
									dataType: 'jsonp'
								});
							break;

							case "mapguide":
								var mapguide_coordinate = ol.proj.transform(evt.coordinate, that.mapProjection,that.dataProjection);

								var view = that.map.getView();
								var resolution = view.getResolution();
								var bufferPx=5;
								var buffer=resolution*bufferPx;

								var x1=mapguide_coordinate[0] - buffer;
								var x2=mapguide_coordinate[0] + buffer;
								var y1=mapguide_coordinate[1] - buffer;
								var y2=mapguide_coordinate[1] + buffer;

								var geom="POLYGON(("+x1+" "+y2+","+x2+" "+y2+","+x2+" "+y1+","+x1+" "+y1+","+x1+" "+y2+"))";

								var a_layers_tooltip=ol_layer.list_layers_tooltip.split(",");

								/* A control of the layers with an hyperlink has been added:
                                 * even if the tooltip is empty, the tooltip must be shown for the ctrl-click
                                 * WARNING: enable the following lines if at least a layer with hyperlink is present
                                 */
								if (ol_layer.list_layers_hyperlinked != "") {
									var a_layers_hyperlinked=ol_layer.list_layers_hyperlinked.split(",");
									var a_layers_tooltip_hyperlinked = a_layers_tooltip.concat(a_layers_hyperlinked);
								} else {
									var a_layers_tooltip_hyperlinked = a_layers_tooltip;
								}

								if (a_layers_tooltip_hyperlinked.length > 0) {
									var a_layernames=new Array();


                                    // loop to make "unique" the array a_layernames
									for(var i=0;i<a_layers_tooltip_hyperlinked.length; i++) {
										var trovato= false;
										for(var k=0;k<a_layernames.length; k++) {

											if(a_layernames[k]==ol_layer.layers_info[a_layers_tooltip_hyperlinked[i]].name){
												trovato=true;
												break;
											}
										}

										if(!trovato){
											a_layernames.push(ol_layer.layers_info[a_layers_tooltip_hyperlinked[i]].name);
										}
									}

									var layernames=a_layernames.join();

									data2send={
										action:"GET_TOOLTIP_HYPERLINK",
										mapName:ol_layer.mg_session_info.mapName,
										mapSession:ol_layer.mg_session_info.mapSession,
										layers:layernames,
										geometry:geom,
										maxfeatures:"1"
									};

									$.ajax({
										url: ol_layer.api_url,
										method: 'POST',
										dataType: 'json',
										data: data2send,
										error: function(a, b, c) {
											console.log("GET_TOOLTIP_HYPERLINK() - ERROR");
										},
										success: function(response) {

											if(response.status=="ok") {

												if (response.data.tooltip!="" || response.data.hyperlink!="") {
													if(response.data.tooltip!=""){
														html_tooltip = '<strong>'+response.data.tooltip+'</strong>';
														html_tooltip = html_tooltip.replace(/\\n/g,'<br/>');
														if(response.data.hyperlink!=""){
															html_tooltip +="<br/>"
														}
													} else{
														html_tooltip = '';
													}

													if(response.data.hyperlink!="") {html_tooltip +="CTRL + click o tieni premuto per consultare le informazioni";}

													tooltip_content.html(html_tooltip);
													tooltip_overlay.setPosition(coordinate);

												}

											}

										}
									});
								}
							break;
						} // switch(ol_layer.tipo)
					} // if(currentTime - lastTimeMouseMoved >= 500)
				},500); // setTimeout
			} // if(ol_layer.list_layers_tooltip!='')
		});
	});
	this.map=map;
	this.saveViewHistory();
	this.map.updateSize();
	for(var i=0; i< ol_map_layers.length; i++) {
		//this.ol_map_layers.push(ol_map_layers[i].values_.name);
		this.ol_map_layers.push(ol_map_layers[i].get("name"));
	}
	
	
};


/** WMS LAYERS INTEGRATION
 * ---------------------------------------------------------------
 * - add a WMS internal layer
 * - add a WMS user layer
 * - remove all WMA "user" layers
 */

/** Add a new internal WMS layer - WMS LAYERS INTEGRATION */
ovMap.prototype.addWmsInternalLayer = function(wms_url, layersData, i, style_name, format){
	if (typeof format == "undefined" || format == '')
		format = 'image/png8';
	var wms_layer = layersData[i].name;
	var wms_title = layersData[i].title;
	var exist = false;
	var map_ol_layers=this.map.getLayers();
	
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==wms_layer) {
			exist=true;
		}
		
	},this);
	
	if(exist == true){
		this.WmsLayerAdded = false;
	}

	else{
		wmsSource = new ol.source.TileWMS ({
				url: OpenViewer_proxy,
				params: {'LAYERS': wms_layer, 'FORMAT':format, 'WMSURL': wms_url}
// 				,serverType: 'geoserver',
// 				ratio: 1.2
		});
		
		var wmsLayer = new ol.layer.Tile({
			source: wmsSource,
			name: wms_layer
		});
		
		this.map.addLayer(wmsLayer);
		this.WmsLayerAdded = true;    
        return wmsLayer;
	}
}
/** Add a new user WMS layer - WMS LAYERS INTEGRATION */
ovMap.prototype.addWmsLayer = function(wms_url, layersData, i, style_name, format){
if(this.showConsoleMsg) console.log('Adding layer...');
	if (typeof format == "undefined" || format == '')
		format = 'image/png';
	var wms_layer = layersData[i].name;
	var wms_title = layersData[i].title;
    var legend_url = layersData[i].styles[style_name].legend_url_href;
    var legend_width = layersData[i].styles[style_name].legend_url_width;
    if(typeof legend_width == 'undefined' || legend_width == '') legend_width = '';
	var exist = false;
	var map_ol_layers=this.map.getLayers();
	
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==wms_title) {  // wms_layer
			exist=true;
		}
	},this);
	
	if(exist == true){
		this.WmsLayerAdded = false;
if(this.showConsoleMsg) console.log('... '+wms_layer+' already existing!');
	}

	else{
		
		// OVD change: previously the projection was set as this.dataProjection
        //             now it is set to this.mapProjection, if it is supported,
        //             otherwise to CRS:84,if the map projection is EPSG:4326, EPSG:3857 or EPSG:900913 (SPECIAL CASE)
        //             otherwise to EPSG:4326 as a first alternative
        //             otherwise to the first supported projection
		if (layersData[i].crs_supported.some( aCrs => aCrs === this.mapProjection ))
			var layerCrs = this.mapProjection;
		else if (this.mapProjection=='EPSG:4326'||this.mapProjection=='EPSG:3857'||this.mapProjection=='EPSG:900913')
			var layerCrs = 'CRS:84';
		else {
			if (layersData[i].crs_supported.includes('EPSG:4326'))
				var layerCrs = 'EPSG:4326';
			else
				var layerCrs = layersData[i].crs_supported[0];
        }

// OVD test:
// RT    :   CRS:84, 3003, 3004, 25832, 25833,        4326, 3857,       6707, 6708
// AE    :                       25832, 25833, 25834,             6706,           , 4258, 3044, 3045, 3046 
// NASA  :   CRS:84
// 3003  :   xxx     Tx    Tx    TT     TT     TT     Tx    Tx    xx    xx    xx    xx    
// 25834 :   xx      Tx    Tx    TT     TT     TT     Tx    Tx    xx    xx
// 4326  :   TT      Tx                        TT     Tx          xx    xx
// 4358  :   TT
// 3857  :   TT
// 4265  :   TT
// 900913:   TT
// 4806  :   NOR WORKING
//var layerCrs = 'CRS:84';

// if(this.showConsoleMsg) console.log('WMS layer added:\n- '+wms_title+'\n- '+layerCrs+' layer projection\n- '+this.map.getView().getProjection().getCode()+' map projection')
            
		var wmsSource = new ol.source.TileWMS({
                url: wms_url,
			params: {'LAYERS': wms_layer, 'FORMAT':format, 'STYLES' : style_name},
			projection: layerCrs // OVD this.dataProjection
		});
		
		var wmsLayer = new ol.layer.Tile({
			source: wmsSource,
			opacity: 1,//0.7,  // from 0 to 1
			// zIndex: 1000,
			// minZoom: layersData[i].minZoom,
			// maxZoom: layersData[i].maxZoom,
			minResolution: layersData[i].minResolution,
			maxResolution: layersData[i].maxResolution,
			name: wms_title, //wms_layer, wms_title
			wmsUserLayer: true,
			legendUrl: legend_url,
			legendWidth: legend_width
		});
		
		this.map.addLayer(wmsLayer);
		this.WmsLayerAdded = true;
if(this.showConsoleMsg) console.log('... added ', wms_layer);
		open_viewer.refreshLegend();
		return wmsLayer;
	}
}
/** Remove all WMS "user" layers - WMS LAYERS INTEGRATION */
ovMap.prototype.removeAllWmsUserLayers = function() {

    // retrieve the list of OL layers
	var map_ol_layers=this.map.getLayers();

	// loop on OL layers and make an array of all the WMS user layers
	var tmpWmsUserLayers = [];
	map_ol_layers.forEach(function(layer,index){
		if (layer.get('name') != undefined && layer.get('wmsUserLayer'))
			tmpWmsUserLayers.push(layer);
	},this);

	// remove all the WMS user layer
	for (i = 0; i < tmpWmsUserLayers.length; i++) {
		element = tmpWmsUserLayers[i];
		this.map.removeLayer(element);
	}
}


/** MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER)
 * ---------------------------------------------------------------
 * - creation of a session
 * - ping (keep alive)
 * - return layer information
 * - get selected features
 * - refresh visibility
 */

/** Create a MapGuide session - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.MapguideCreateSession = function(ol_layer) {
// if(this.showConsoleMsg) console.log("MapguideCreateSession()");
	var that = this;
	var mg_session_info=null;
	if ( ol_layer.api_url != '' ) {
        // AJAX call to sychronously get the value of some variables
		$.ajax({
			url: ol_layer.api_url,
			async: false,
			method: 'GET',
			dataType: 'json',
			data: {mapDefinition: ol_layer.mapDefinition, action: 'CREATE_SESSION'},
			error: function(a, b, c) {
// console.log("MapguideCreateSession() - ERROR");
			},
			success: function(response) {
				
				if ( typeof response.status == 'undefined' || response.status != 'ok' ) {
// console.log("MapguideCreateSession() - ERROR: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					mg_session_info=response.data;
				}
			}
		});
	}
	return mg_session_info;
}
/** Ping a MapGuide layer - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.MapguidePing = function(ol_layer) {
	var that = this;
	if ( ol_layer.api_url != '' ) {

		$.ajax({
			url: ol_layer.api_url,
			method: 'GET',
			dataType: 'json',
			data: {mapSession: ol_layer.mg_session_info.mapSession, mapName: ol_layer.mg_session_info.mapName, action: 'PING'},
			error: function(a, b, c) {
				that.mg_ping_failures++;
				if(that.mg_ping_failures > that.mg_ping_max_failures) {
					clearInterval(that.mg_ping_timer);
				}
				console.log("ping() - ERROR");
			},
			success: function(response) {

				if ( typeof response.status == 'undefined' || response.status != 'ok' ) {
					that.mg_ping_failures++;
					if(that.mg_ping_failures > that.mg_ping_max_failures) {
						clearInterval(that.mg_ping_timer);
					}
					
					console.log("ping() - ERROR: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					//console.log(response);
					
					//Do nothing
				}
			}
		});
	}
}
/** Return MapGuide layer information - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.MapguideGetLayersInfo = function(ol_layer) {
// if(this.showConsoleMsg) console.log("Map.MapguideGetLayersInfo");

	var that = this;
// if(this.showConsoleMsg) console.log(this.mg_session_info);
	
	if ( ol_layer.api_url != '' ) {
		$.ajax({
			url: ol_layer.api_url,
			method: 'GET',
			dataType: 'json',
			data: {mapSession: that.mg_session_info.mapSession, mapName: that.mg_session_info.mapName, action: 'GET_LAYERS'},
			error: function(a, b, c) {
				console.log("getMapLayers() - ERROR");
			},
			success: function(response) {
				
				if ( typeof response.status == 'undefined' || response.status != 'ok' ) {
					console.log("getMapLayers() - ERROR: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					//console.log(response);
					
					///TODO
				}
			}
		});
	}
}
/** Refresh the status of the "main" layers - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.refreshStatus = function() {
	var currentStatus = this.stato; // "stato" contains MapGuide layers settings

	// to have the object "this" inside other functions
	var that = this;

	// array of the OL layers included within the definition
	var a_ol_layers=Object.keys(currentStatus);

	// check of layer type for each layer
	a_ol_layers.forEach(function(item,index) {

		var ol_layer=currentStatus[item];
		switch (ol_layer.tipo) {
		
			case "wms":
			case "wms_geoserver":
				var layers_info=ol_layer.layers_info;
				var groups_info=ol_layer.groups_info;
				var a_layers=Object.keys(layers_info);
				var a_groups=Object.keys(groups_info);
				var list_layers=a_layers.join();
				
				currentStatus[item].list_layers=list_layers;

				///TODO visible,tooltip, etc..
				
				a_layers_visible=new Array();
				a_layers_tooltip=new Array();
				a_layers_selectable=new Array();
				a_layers_hyperlinked=new Array();
				for (var i=0;i<a_layers.length;i++) {
					//visible=isLayerVisibleOnMap(ol_layer,a_layers[i]);
					visible = that.isLayerVisibleOnMap(ol_layer,a_layers[i]);
					// visible layers
					if(visible) {
						a_layers_visible.push(a_layers[i]);
					}
					// layers to query for tooltip
					if(visible && layers_info[a_layers[i]].tooltip!=undefined) {
						a_layers_tooltip.push(a_layers[i]);
					}
					// selectable layers
					if(visible && layers_info[a_layers[i]].selectable==true) {
						a_layers_selectable.push(a_layers[i]);
					}
					// layers with hyperlink
					if(visible && layers_info[a_layers[i]].hyperlink!=undefined) {
						a_layers_hyperlinked.push(a_layers[i]);
					}
				}
				currentStatus[item].list_layers_visible=a_layers_visible.reverse().join();
				currentStatus[item].list_layers_tooltip=a_layers_tooltip.join();

				currentStatus[item].list_layers_selectable=a_layers_selectable.join();
				currentStatus[item].list_layers_hyperlinked=a_layers_hyperlinked.join();
			break;

			case "mapguide":
				if (currentStatus[item].mg_session_info == null) {
					// Start a new session (remote synchronous call
                    // WARNING : timeout needs to be handled ?
					currentStatus[item].mg_session_info=that.MapguideCreateSession(ol_layer);
				}
				
				ol_layer.layers_info=currentStatus[item].mg_session_info.layers_info;
				ol_layer.groups_info=currentStatus[item].mg_session_info.groups_info;
				
				var layers_info=ol_layer.layers_info;
				var groups_info=ol_layer.groups_info;
				var a_layers=Object.keys(layers_info);
				var a_groups=Object.keys(groups_info);
				
				var list_layers=a_layers.join();
				var list_groups=a_groups.join();
				
				currentStatus[item].list_layers=list_layers;
				currentStatus[item].list_groups=list_groups;

				//visible,tooltip, etc..
				a_groups_visible=new Array();

				a_layers_visible=new Array();
				a_layers_tooltip=new Array();
				a_layers_selectable=new Array();
				a_layers_hyperlinked=new Array();

				for (var i=0;i<a_groups.length;i++) {
					visible = that.isGroupVisibleOnMap(ol_layer,a_groups[i]);
					
					if(visible) {
						a_groups_visible.push(a_groups[i]);
					}
				}

				for (var i=0;i<a_layers.length;i++) {
// 					visible=isLayerVisibleOnMap(ol_layer,a_layers[i]);
					visible = that.isLayerVisibleOnMap(ol_layer,a_layers[i]);

					// visible layers
					if(visible) {
						a_layers_visible.push(a_layers[i]);
					}
					// layers to query for tooltip
					if(visible && layers_info[a_layers[i]].tooltip!=undefined && layers_info[a_layers[i]].tooltip!=null && layers_info[a_layers[i]].tooltip!="") {
						a_layers_tooltip.push(a_layers[i]);
					}
					// selectable layers
					if(visible && layers_info[a_layers[i]].selectable==true) {
						a_layers_selectable.push(a_layers[i]);
					}
					// layers with hyperlink
					if(visible && layers_info[a_layers[i]].hyperlink!=undefined && layers_info[a_layers[i]].hyperlink!=null && layers_info[a_layers[i]].hyperlink!="") {
						a_layers_hyperlinked.push(a_layers[i]);
					}
				}

				currentStatus[item].list_groups_visible=a_groups_visible.reverse().join();

				currentStatus[item].list_layers_visible=a_layers_visible.reverse().join();
				currentStatus[item].list_layers_tooltip=a_layers_tooltip.join();

				currentStatus[item].list_layers_selectable=a_layers_selectable.join();
				currentStatus[item].list_layers_hyperlinked=a_layers_hyperlinked.join();
			break;
		}
	});
	this.stato=currentStatus;

	return currentStatus;
};
/** Get the array of selected features (ids, layers) - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.getMapGuideSelection = function() {

	var stato = this.getStato();
	var ol_layer = 'mapguide';
	var selectOverlay=this.getMapLayerByName('selection');
	var features=selectOverlay.getSource().getFeatures();

	var ids = new Array(), lys= new Array();
	for (var i=0; i < features.length; i++) {
		
		var attributi=features[i].getProperties();

		var layers=stato[ol_layer].layers_info;
		var a_layers_info=Object.keys(layers);
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].name==attributi.layer) {
				// if found
				var layer_id = a_layers_info[j];
				var id = attributi.feature_id;
			}
		}

		lys.push(layer_id);
		ids.push(id);
		
	}
	return {ids:ids, lys:lys };
};
/** Refresh the visibility of the "main" layers (used by the checkboxes of the legend) - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER) */
ovMap.prototype.refreshMapLayer = function(ol_layer) {
	var map_ol_layers=this.map.getLayers();
	var stato = this.getStato();
	var that = this;

	switch (ol_layer) {
		case "wms_geoserver":

			map_ol_layers.forEach(function(item,index){
				if(item.get('name')==ol_layer) {
					var source=item.getSource();
					var list_visible_layers = stato[ol_layer].list_layers_visible;

					source.updateParams({'LAYERS': stato[ol_layer].list_layers_visible});
					source.refresh();

				}
			},this);
		break;

		case "wms":
			map_ol_layers.forEach(function(item,index) {
				if(item.get('name')==ol_layer) {
					var source=item.getSource();
					var list_visible_layers = stato[ol_layer].list_layers_visible;
					
					if(list_visible_layers == ''){
						
						source.updateParams({'LAYERS': ''});
						source.refresh();
						item.setVisible(false);
					}
					else{
						//nel caso in cui list_visible_layers sia una lista di più elementi ciclo su ognuno per riprendere il nome del layer e fare l'update della source
						if (list_visible_layers.indexOf(',') > -1){
							var single_layer = list_visible_layers.split(",");
							var visible_layer_array = [];
							for(var i = 0; i < single_layer.length; i++){
								var layer_id = single_layer[i];
								var layer_name = stato[ol_layer].layers_info[layer_id].name;
								visible_layer_array.push(layer_name);
								source.updateParams({'LAYERS': visible_layer_array});
								source.refresh();
							}
						}
						else{

							var layer_id = list_visible_layers;
								var layer_name = stato[ol_layer].layers_info[layer_id].name;

								//se il layer arriva da una struttura simile a metarepo maps (dove è definito per nome e non per id)
								if(typeof layer_name !== 'undefined'){
									source.updateParams({'LAYERS': layer_name});
									source.refresh();
								}
								else{
									source.updateParams({'LAYERS': stato[ol_layer].list_layers_visible});
									source.refresh();
								}
						}
						item.setVisible(true);
					}
				}
			},this);
		break;

		case "mapguide":
			//Devo passare l'elenco completo dei gruppi e dei layer da mostrare e da nascondere, altrimenti non funziona
			var a_groups=stato[ol_layer].list_groups.split(",");
			var a_groups_visible=stato[ol_layer].list_groups_visible.split(",");

			var a_groups_invisible = $.grep(a_groups,function(x) {return $.inArray(x, a_groups_visible) < 0});

			stato[ol_layer].list_groups_invisible=a_groups_invisible.join();

			var a_layers=stato[ol_layer].list_layers.split(",");
			var a_layers_visible=stato[ol_layer].list_layers_visible.split(",");

			var a_layers_invisible = $.grep(a_layers,function(x) {return $.inArray(x, a_layers_visible) < 0});

			stato[ol_layer].list_layers_invisible=a_layers_invisible.join();

			map_ol_layers.forEach(function(item,index){

				if(item.get('name')==ol_layer) {
					var source=item.getSource();

					source.updateParams({'SHOWGROUPS': stato[ol_layer].list_groups_visible, 'HIDEGROUPS': stato[ol_layer].list_groups_invisible, 'SHOWLAYERS': stato[ol_layer].list_layers_visible, 'HIDELAYERS': stato[ol_layer].list_layers_invisible });
					source.refresh();
				}
				
			},this);
		break;
	}
}


/** MEASURE INTERACTION TOOL
 * ---------------------------------------------------------------
 * - handling of the dawing actions
 * - creation and display of the tooltip with the area or distance
 */

/** Handle interaction (calculate area and distance) - MEASURE INTERACTION TOOL */
ovMap.prototype.measure = function(type, callback_function) {
	var type = (type == 'area' ? 'Polygon' : 'LineString');
	var that=this;
	
	var fill_line=new ol.style.Fill({
		 color: 'rgba(255, 255, 255, 0.2)'
	});
	var stroke_line=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0.5)',
		lineDash: [10, 10],
		width: 2
	});
	
	var measure_style = new ol.style.Style({
		fill: fill_line,
		stroke: stroke_line,
		image: new ol.style.Circle({
			radius: 5,
			stroke: new ol.style.Stroke({
				color: 'rgba(0, 0, 0, 0.7)'
			}),
			fill: new ol.style.Fill({
				color: 'rgba(255, 255, 255, 0.2)'
			})
		})
	});
		
	//var draw_wkt = this.drawWKTDiv;
	if(type == 'Polygon'){
		var measureOverlayLayer=this.getMapLayerByName('measure');
		
		this.map.removeInteraction(this.extraInteractions.measure);
		
		this.extraInteractions.measure = new ol.interaction.Draw({
			source: measureOverlayLayer.getSource(),
			type: 'Polygon',
			style: measure_style
		});
	} else {
		var measureOverlayLayer=this.getMapLayerByName('measure');
		
	this.map.removeInteraction(this.extraInteractions.measure);
		this.extraInteractions.measure = new ol.interaction.Draw({
			source: measureOverlayLayer.getSource(),
			type: 'LineString',
			style: measure_style
		});
	}
	
	var listener;
	var sketch;
	this.map.addInteraction(this.extraInteractions.measure);
	
	this.createMeasureTooltip();
	
	this.extraInteractions.measure.on('drawstart', function(e){
		sketch = e.feature;
		/** @type {ol.Coordinate|undefined} */
		var tooltipCoord = e.coordinate;
		
		listener = sketch.getGeometry().on('change', function(e) {
		
			var geom = e.target;
			var output;
			if (geom instanceof ol.geom.Polygon) {
				output = that.formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
			} 
			else if (geom instanceof ol.geom.LineString) {
				output = that.formatLength(geom);
				tooltipCoord = geom.getLastCoordinate();
				
			}
			that.measureTooltipElement.innerHTML = output;
			measureTooltip.setPosition(tooltipCoord);
			
			
		});
	}, this);
	
	this.extraInteractions.measure.on('drawend',
		function() {
			that.measureTooltipElement.className = 'tooltip tooltip-static tooltip-measuring';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			that.measureTooltipElement = null;
			that.createMeasureTooltip();
			ol.Observable.unByKey(listener);
	}, this);
	
}
/** Create tooltip - MEASURE INTERACTION TOOL */
ovMap.prototype.createMeasureTooltip = function(){
	if (this.measureTooltipElement) {
		this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
	}
	this.measureTooltipElement = document.createElement('div');
	this.measureTooltipElement.className = 'tooltip tooltip-measure';
	measureTooltip = new ol.Overlay({
		element: this.measureTooltipElement,
		offset: [0, -15],
		positioning: 'bottom-center'
	});
	this.map.addOverlay(measureTooltip);
}
/** Clear tooltip - MEASURE INTERACTION TOOL */
ovMap.prototype.removeMeasureTooltip = function(){
	/*this.map.getOverlays().forEach(function(overlay) {
		this.map.removeOverlay(overlay);
	});*/
	$(".tooltip-measuring").remove();
}
/** Set the format of the "area" tooltip - MEASURE INTERACTION TOOL */
ovMap.prototype.formatArea = function(polygon){
	// WARNING: Do not use ol.Sphere because the coordinates are already projected on the plane
	//          The ol.Sphere.getLength() and ol.Sphere.getArea() functions calculate spherical lengths and areas for geometries.
    
	//var area = ol.Sphere.getArea(polygon);
	var area = polygon.getArea();
	var output;
	var aThreshold = Math.pow(this.mapOptions['map_measure_threshold'], 2);				// example: 1000 (1 km = 1000m) for metric projection, 1 for decimal degrees
	var aSubUnitsNum = Math.pow(this.mapOptions['map_measure_sub_units_number'], 2);	// example: 1 (m) for metric projection, 60 (1 minute = 1/60 of 1 degree) for decimal degrees
	var aUnits = this.mapOptions['map_measure_units'];									// example: 'km' for metric projection, '°' or 'deg' or 'dd' for decimal degrees
	var aSubUnits = this.mapOptions['map_measure_sub_units'];							// example: 'm' for metric projection, '\'' or 'min' or 'mm' for decimal degrees
	
	if (area > aThreshold) {
		output = (Math.round(area / aThreshold * 100) / 100) +
			' ' + aUnits + '<sup>2</sup>';
	} else {
		output = (Math.round(area * aSubUnitsNum * 100) / 100) +
			' ' + aSubUnits + '<sup>2</sup>';
	}
	return output;
}
/** Set the format of the "distance" tooltip - MEASURE INTERACTION TOOL */
ovMap.prototype.formatLength = function(line) {
	// WARNING: Do not use ol.Sphere because the coordinates are already projected on the plane
	// 	var length = ol.Sphere.getLength(line, 'EPSG:3003');
	var length = line.getLength();
	
	var output;
	var aThreshold = this.mapOptions['map_measure_threshold'];			// example: 1000 (1 km = 1000m) for metric projection, 1 for decimal degrees
	var aSubUnitsNum = this.mapOptions['map_measure_sub_units_number'];	// example: 1 (m) for metric projection, 60 (1 minute = 1/60 of 1 degree) for decimal degrees
	var aUnits = this.mapOptions['map_measure_units'];					// example: 'km' for metric projection, '°' or 'deg' or 'dd' for decimal degrees
	var aSubUnits = this.mapOptions['map_measure_sub_units'];			// example: 'm' for metric projection, '\'' or 'min' or 'mm' for decimal degrees
	if (length > aThreshold) {
		output = (Math.round(length / aThreshold * 100) / 100) +
			' ' + aUnits;
	} else {
		output = (Math.round(length * aSubUnitsNum * 100) / 100) +
			' ' + aSubUnits;
	}
	
	return output;
};


/** OTHER METHODS  */

/** Show a tooltip at specific coordinates */
ovMap.prototype.TooltipOnData = function(data,coordinates){
	tooltip_content.html(data);
	tooltip_overlay.setPosition(coordinates);
}

/** Recalculate the size of the map view */
ovMap.prototype.updateMapSize = function() {
    return this.map.updateSize();
}

/** Save the current view in the views history (used to retrieve the previous zoom/extents) */
ovMap.prototype.saveViewHistory = function() {
if(this.showConsoleMsg) console.log('Saving an "historical" view...');
    switch(this.historyViewCaller) {
        case 'ZoomPrev':
        case 'ZoomNext':
            // saving of the view is not needed
if(this.showConsoleMsg) console.log('... nothing to save ('+this.historyViewCaller+')');
            this.historyViewCaller = this.historyViewPreviousCaller
            break;
        default:
            // delete all the saved views after the current one (historyViewIndex)
			this.historyView=this.historyView.slice(0, this.historyViewIndex+1);
            // save the new view
			this.historyView.push({
				center: this.map.getView().getCenter(), 
				resolution: this.map.getView().getResolution()
			});
			this.historyViewIndex++;
if(this.showConsoleMsg) console.log('... '+this.historyViewIndex+ ' saved views');
            // restore the previous "caller" (=interact state) if the caller is not an interactive tool, but a button
			if(this.historyViewCaller=='ZoomIn'||this.historyViewCaller=='ZoomOut')
				this.historyViewCaller = this.historyViewPreviousCaller
			break;
	}
/*        
	// it is the current status
	if(this.historyView.length-1==this.historyViewIndex) {
		this.historyView.push({
			center: this.map.getView().getCenter(), 
			resolution: this.map.getView().getResolution()
		});
		this.historyViewIndex++;
	} else {
		// it is a different status than the last
	}
*/
}

/** Calculate the resolution from defined projection and scale */
ovMap.prototype.getResolutionFromProjectionAndScale = function(scale, projection) {
	var view = this.map.getView();
	if ( typeof projection == "undefined" ) projection = view.getProjection();
	
	var resolution = view.getResolution();
	var metricResolution=ol.proj.getPointResolution(projection,resolution,view.getCenter());
	var metricResolutionRatio=metricResolution/resolution;
	var units = projection.getUnits();
	//var mpu = ol.proj.METERS_PER_UNIT[units];
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	var resolution = scale / this.ipm / mpu / this.dpi;
// if(this.showConsoleMsg) console.log('Scale: '+scale+'\nResolution: '+resolution);
	return resolution;
}

/** Calculate the scale form the view resolution */
ovMap.prototype.getScaleFromResolution = function(resolution, flagRoundInteger) {
	if ( typeof flagRoundInteger == "undefined" ) flagRoundInteger=false;
    
	var view = this.map.getView();
	var projection = view.getProjection();
	var units = projection.getUnits();
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	var calcScale = resolution * this.ipm * this.dpi / mpu;
    if (flagRoundInteger) calcScale = Math.round(calcScale);
	return calcScale;
}

// Convert the features defeined as GML to JSON
ovMap.prototype.gmlToJson = function(xml) {
	var formatXML=new ol.format.GML();
	var feature=formatXML.readFeatures(xml);
	
	return feature;
};

/** Show/hide a layer */
ovMap.prototype.layerViewToggle = function(layer_name, visible) {
	var map_ol_layers=this.map.getLayers();
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==layer_name) {
			selectLayer=item;
		}
		
	},this);
    if(selectLayer!=undefined) {
// if(this.showConsoleMsg) console.log('Layer to toggle: '+layer_name);
		selectLayer.setVisible(visible);
    }
    else {
// if(this.showConsoleMsg) console.log('Layer '+layer_name+' not found!');	
    }
}


/** OUT-OF-CLASS FUNCTIONS  */

/** Calculate the tooltip text from a GeoJSON object (used as callback in the tooltip function)  */
function getTooltip (response){
	var geojsonFormat = new ol.format.GeoJSON();
	
	// "response" is a geoJson object
	features=geojsonFormat.readFeatures(response);

	if(features.length > 0) {

		// take only the "first" feature of the array
		feature=features[0];

		// retrieve the layer name
		fid=feature.getId();

		a_fid=fid.split(".");
		layer_name=a_fid[0];
		id_feature=a_fid[1];

		// retrieve the feature attributes
		properties=feature.getProperties();

		// If properties.id does not exist, we add it as primary_key (it should be necessary only if "Expose primary keys" is not set in the data store)
		if ( typeof properties.id == "undefined" ) {
			properties.id=id_feature;
		}
		
		// Sometimes, the name of the WMS layer is not the same as the name of the feature source (table).
		// Then, we must retrieve the name of the layer by looping over all OL layers
		// Special case: if there are many layers referring to the same table of the databse, we take the "first" one only
		layer_tooltip="";
		
		a_layers_tooltip=ol_layer.list_layers_tooltip.split(",");

		for (i=0;i<a_layers_tooltip.length;i++) {
			// Loop over all the layers
			if(ol_layer.layers_info[a_layers_tooltip[i]].feature_name!=undefined) {

				if (ol_layer.layers_info[a_layers_tooltip[i]].feature_name==layer_name) {
					layer_tooltip=a_layers_tooltip[i];
					break;
				}
			}
		}
// if(this.showConsoleMsg) console.log(layer_tooltip);

		if(layer_tooltip!='') {

			stringa_tooltip = ol_layer.layers_info[layer_tooltip].tooltip.replace(/%\w+%/g, function(all) {
				return eval("properties."+all.replace(/%/g,''));
			});

			html_tooltip = '<strong>'+stringa_tooltip+'</strong>';

            var aMsg = "<br/>CTRL + click "+strings_interface.sentence_tooltip;
			if(ol_layer.layers_info[layer_tooltip]!=undefined && ol_layer.layers_info[layer_tooltip].hyperlink!=undefined) {html_tooltip += aMsg;}

			tooltip_content.innerHTML = html_tooltip;
			tooltip_content.html(html_tooltip);
			tooltip_overlay.setPosition(coordinate);
		}
	}
}





/** OTHER METHODS  - CHIEDERE SE SONO NECESSARI */

/** UNUSED - Set the view extents to fit the bounding box of the features defined as WKT, with a defined padding around */
ovMap.prototype.fit = function(wkt, crs, pixelPadding) {
	if ( typeof crs == "undefined" ) crs = this.dataProjection // "EPSG:3003";
	if ( typeof pixelPadding == "undefined" ) pixelPadding = 0;
	
	var view = this.map.getView();
	var viewProjectionCode = view.getProjection().getCode();
	var size = this.map.getSize();
// if(this.showConsoleMsg) console.log("map.fit: view",view);
// if(this.showConsoleMsg) console.log("wkt",wkt,"viewProjectionCode",viewProjectionCode,"size",size,"crs",crs,"pixelPadding",pixelPadding);
	
	var format = new ol.format.WKT();
	var feature = format.readFeature(wkt, {
	dataProjection: crs,
	featureProjection: viewProjectionCode
	});
// if(this.showConsoleMsg) console.log("feature",feature);
	view.fit( feature.getGeometry(), size, { padding: [pixelPadding, pixelPadding, pixelPadding, pixelPadding] } );
}

/** UNUSED - Add the features defined as "WKT" to a target layer */
ovMap.prototype.addRedlineWKT = function(ol_layer,wkt,clear_before) {
	clear_before = (typeof clear_before !== 'undefined') ?  clear_before : true;
	
	var redline = this.getMapLayerByName(ol_layer);

	// Fallback, if the target layer is not defined (ol_layer), we use the default layer "redline"
	if(redline == null) {
		var redline = this.getMapLayerByName("redline");
	}
	
	// Clear the previous redline
	if(clear_before) {
		redline.getSource().clear();
	}
	
	var formatWKT=new ol.format.WKT();
	var feature=formatWKT.readFeature(wkt);

	feature.getGeometry().transform(this.dataProjection, this.mapProjection);
	redline.getSource().addFeature(feature);
	
};

/** UNUSED - Clear all the feature of a layer */
ovMap.prototype.clearRedline = function(ol_layer) {
	var redline = this.getMapLayerByName(ol_layer);
	redline.getSource().clear();
};

/** UNUSED - Create a temporary layer and define the style */
ovMap.prototype.createTempLayer = function (layer_name, fill_color, stroke_color, stroke_width) {

	// Check if the layer is already existing
	var redline = this.getMapLayerByName(layer_name);
	if(redline!=null) {
		return;
	}
	
	// Create the temporary layer
	var fill_templayer=new ol.style.Fill({
		// color can be a tring or an array of RGB or RGBA values
		color: fill_color
	});
	var stroke_templayer=new ol.style.Stroke({
		color: stroke_color,
		width: stroke_width
	});
	
	var tempLayer = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_templayer,
			stroke: stroke_templayer,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill_templayer,
				stroke: stroke_templayer
			})
			
		}),
		source: new ol.source.Vector(),
		name:layer_name
	});
	
	this.map.addLayer(tempLayer);
	this.ol_map_layers.push(layer_name);
// if(this.showConsoleMsg) console.log("The temporary layer "+layer_name+" has been added successfully.");
};

/** UNUSED - Add a text label at the position defined as WKT */
ovMap.prototype.addLabelInLayer = function(layer_name, wkt, labelText, size, angle, clear){
	
	var templayer = this.getMapLayerByName(layer_name);
	
	if (clear){
		this.clearTempLayers(layer_name);
	}
	
	var formatWKT=new ol.format.WKT();
	var feature=formatWKT.readFeature(wkt);
	feature.getGeometry().transform(this.dataProjection, this.mapProjection);
	var text = new ol.style.Style({
		text: new ol.style.Text({
			text:labelText,
			rotation: -angle*3.14/180,
			scale: size,
			textAlign: 'end',
			fill: new ol.style.Fill({
				color: "#ff8080"
			})
		})
	});
	feature.setStyle(text);
	templayer.getSource().addFeature(feature);
}

/** UNUSED - Clear one or all "service" layers */
ovMap.prototype.clearTempLayers = function(layer_name,clear_ol_layers) {
	if (typeof clear_ol_layers == 'undefined') {var clear_ol_layers=true;}
	
	if (clear_ol_layers==true) {
		this.clearRedline('drawing');
		this.clearRedline('redline');
		this.clearRedline('selection');
		this.clearRedline('measure');
		this.removeMeasureTooltip();
	}
	
	// If "layer_name" is empty, we need to clear all the "temporary" layers too
	if (typeof layer_name == "undefined") {
		var templayer = this.getMapLayerByName("tmp_punti");
		if(!empty(templayer)){
			this.clearRedline("tmp_punti");
		}

		var templayer = this.getMapLayerByName("tmp_linee");
		if(!empty(templayer)){
			this.clearRedline("tmp_linee");
		}
		
		var templayer = this.getMapLayerByName("tmp_poligoni");
		if(!empty(templayer)){
			this.clearRedline("tmp_poligoni");
		}
	}
    
	if(!empty(layer_name)){
// 		si controlla che esista il layer 
		var templayer = this.getMapLayerByName(layer_name);
		if(!empty(templayer)){
			this.clearRedline(layer_name);
		}
	}
};

/** UNUSED - Tracking / Geolocation */
ovMap.prototype.mapSetTracking = function(value){
	var geolocation = new ol.Geolocation({
 			projection: this.map.getView().getProjection()
// 			,tracking: true,
// 			trackingOptions: {
// 					enableHighAccuracy: true,
// 					maximumAge: 2000
// 			}
	});

	var positionFeature = new ol.Feature();
	positionFeature.setStyle(new ol.style.Style({
			image: new ol.style.Circle({
					radius: 9,
					fill: new ol.style.Fill({
							color: '#16a228b0'
					}),
					stroke: new ol.style.Stroke({
							color: '#fff',
							width: 2
					})
			})
	}));

	var positionSource = new ol.source.Vector({
			features: [positionFeature]
	});
	var positionLayer = new ol.layer.Vector({
			source: positionSource
	});
    
	this.map.addLayer(positionLayer);
	
	var that = this;
	
	
	geolocation.setTracking(true);
	
	geolocation.on('change', function() {
		var pos = geolocation.getPosition();
		positionFeature.setGeometry(new ol.geom.Point(pos));
		that.map.getView().setCenter(pos);
		geolocation.setTracking(false);
	});
	
	
	var geolocationReturnMessage = function(ev) {
		if (ev.data.message === "deliverResult") {
if(this.showConsoleMsg) console.log("result: " + ev.data.result);
			
			if(!isNaN(parseFloat(ev.data.result[0])) && !isNaN(parseFloat(ev.data.result[1]))) {
				ev.source.close();
				
				var center = ol.proj.transform(ev.data.result, 'EPSG:4326', 'EPSG:3003');
				positionFeature.setGeometry(new ol.geom.Point(center));
						
				that.map.getView().setCenter(center);
			} else {
				ev.source.close();
                var mess = strings_interface.sentence_trackingerror;
				alert(mess);
			}
			
			
		}
	}
	
	// Fallback with an unsecure origin (http)
	geolocation.on('error', function(error) {
// console.log('Error geolocation');
// console.log(error.message);
		
			var index = Math.floor(Math.random() * 900000000) + 100000000;
			
			window.addEventListener("message", geolocationReturnMessage,{once: true});
			
			var child = window.open("https://geolocation.ldpgis.it/get_position.php?key=VAAGgq20MfG9lezhyzmLc3NLDsmefg07Z4NFqQ2GKMoxvRTlzh&index="+index, "geolocation_window");
			
			
			setTimeout(function() {
				try {
					
					if ((typeof child == 'undefined') || (child == null) || child.closed) {
						var mess = strings_interface.sentence_trackingerror;
						alert(mess);
					} else {
						child.postMessage({ message: "requestResult" }, "*");
					}
					
				} catch(e) {
					// we're here when the child window has been navigated away or closed
					if (child.closed) {
						console.log("closed");
						return; 
					}
				}
			}, 500);
		
	});

}

/** UNUSED - Adding layer ??? */
ovMap.prototype.addingLayer = function(layer){
	this.map.addLayer(layer);
}

/** UNUSED - DRAWING INTERACTION TOOL - Start drawing */
ovMap.prototype.startDraw = function(type,callback_function) {
	var that=this;
	var draw_wkt = this.drawWKTDiv;
	var drawingOverlay=this.getMapLayerByName('drawing');

 	// //Erase previous drawings
 	//drawingOverlay.getSource().clear();

	var coords_length=0;
	
	this.map.removeInteraction(this.extraInteractions.draw);
	
	this.extraInteractions.draw = new ol.interaction.Draw({
		source: drawingOverlay.getSource(),
		type: type
	});
	
	this.extraInteractions.draw.on('drawstart', function(e){
		// Click "ESC" to erase last entered point
		$(document).on('keyup', function(event){
			if(event.keyCode === 27){
				that.extraInteractions.draw.removeLastPoint();
			}
		});
	});
	
	this.extraInteractions.draw.on('drawend',function(e) {
		// Eliminate the event on pressing "ESC"
		$(document).off('keyup');

		var format = new ol.format.WKT();
		// The circle geometry (a center with a radius) is not a supported by the WKT format. The best chance is to transform your Circle geometry in an approximate Polygon
		if(type=='Circle'){
			var circularPolygon = ol.geom.Polygon.fromCircle(e.feature.getGeometry());
			e.feature.setGeometry(circularPolygon);
		}
		// This is required to preserve the projection of the map, while transforming the WKT string to the data projection
		var feature_cloned = e.feature.clone();

		wkt = format.writeGeometry(feature_cloned.getGeometry().transform(that.mapProjection, that.dataProjection));
		draw_wkt.html(wkt);

		// Call to callback function (if defined)
		if (typeof eval(callback_function) === "function") {
			var callbackFunction=callback_function+"(wkt)";
			eval(callbackFunction);
		}
	});
	this.map.addInteraction(this.extraInteractions.draw);
	this.map.addInteraction(this.extraInteractions.snap);
}

/** UNUSED - DRAWING INTERACTION TOOL - Cancel drawing */
ovMap.prototype.cancelDraw = function(type,callback_function) {
	var drawingOverlay=this.getMapLayerByName('drawing');

 	// Erase previous drawings
	drawingOverlay.getSource().clear();
}

/** UNUSED - Get selected features */
ovMap.prototype.getSelectedFeatures = function(xml,a_layers,callback_function,primary_key,extra_field) {
	// For backward compatibility xml=null is accepted
	// WARNING : the parameters primary_key and extra_field are not yet used
	
	layers=a_layers.split(",");
	
	var selectOverlay=this.getMapLayerByName('selection');
	var features=selectOverlay.getSource().getFeatures();
// if(this.showConsoleMsg) console.log("features",features);

	var id_list='';
	var noLayer=true;
	
	for (var i=0; i < features.length; i++) {
		var featureAttributes=features[i].getProperties();
// if(this.showConsoleMsg) console.log(layers);
// if(this.showConsoleMsg) console.log(featureAttributes);

		if (jQuery.inArray( featureAttributes.layer, layers )!=-1) {
			noLayer=false;
			
			if (id_list!='') {
				id_list += '|';
			}

			// If "primary_key" is not null, I use this column, otherwise "feature_id"
			if (primary_key!="") {
				
				if(typeof featureAttributes.extra_fields[primary_key] != "undefined") {
					id_list += featureAttributes.layer+';'+featureAttributes.extra_fields[primary_key];
				} else {
					id_list += featureAttributes.layer+';'+featureAttributes.feature_id;
				}
			} else {
				id_list += featureAttributes.layer+';'+featureAttributes.feature_id;
			}


			// If "extra_field" is not null, the value of this column is added to the result
			if (extra_field!="") {
				id_list+=';'+featureAttributes.extra_fields[extra_field];
			}

		}
	}

// if(this.showConsoleMsg) console.log(id_list);
	
	if (noLayer) {
        // this case should not happen (this check is also inside libviewer.js)
		alert(strings_interface.sentence_noselfeaturesinsidelayer+": ("+a_layers+")");
	} else {
		// call the callback function (if it is defined)
		if (typeof eval(callback_function) === "function") {
			var callbackFunction=callback_function+"(id_list)";
			eval(callbackFunction);
		}
	}

	return features;
};


