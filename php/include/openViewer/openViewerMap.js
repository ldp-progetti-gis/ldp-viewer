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
	
	// show console messages
	this.showConsoleMsg = params.showConsoleMsg; // show console messages
	
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
	
};

/** PROPERTIES (get/set/is)
 * ---------------------------------------------------------------
 */
/** Return the "basemap" layers settings */
ovMap.prototype.getMapOptions = function() { return this.mapOptions; }
 /** Return the OpenLayers map view object */
ovMap.prototype.getMapView = function() { return this.map.getView(); }
 /** Return the "Main layers" settings */
ovMap.prototype.getStato = function() { return this.stato; }
 /** Set the "Main layers" settings */
ovMap.prototype.setStato = function(stato) { this.stato = stato; }
 /** Return the array of layers */
ovMap.prototype.getMapLayers = function() { return this.map.getLayers(); }
 /** Return the OL "layer" object identified by the name */
ovMap.prototype.getMapLayerByName = function(olLayerName) {
	var layer=null;
	var map_ol_layers=this.map.getLayers();
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==olLayerName) {
			layer=item;
		}
		
	},this);
	return layer;
}
/** Return the OL "source" object of the layer identified by name */
ovMap.prototype.getMapLayerSourceByName = function(olLayerName) {
	var source=null;
	var map_ol_layers=this.map.getLayers();

	map_ol_layers.forEach(function(item,index){

		if(item.get('name')==olLayerName) {
			source=item.getSource();
		}

	},this);

	return source;
}
/** Set the user interaction status */
ovMap.prototype.setStatusInteraction = function(interactionStatus) {
	this.statusInteraction=interactionStatus;
	return;
};
/** Return the user interaction status */
ovMap.prototype.getStatusInteraction = function() { return this.statusInteraction; };
/** Return the visibility of a "layer", taking into account the visibility of the parent group too */
ovMap.prototype.isLayerVisibleOnMap = function(olLayer,layerName) {
	// Layer belong to a group ?
	if(olLayer.layers_info[layerName].group!=undefined) {
		parentGroup=olLayer.layers_info[layerName].group;

		while (parentGroup!=null) {
			// check if the group is visible
			if(olLayer.groups_info[parentGroup].visible==true) {
				// check if the group belong to another group
				if(olLayer.groups_info[parentGroup].group!=undefined) {
					parentGroup=olLayer.groups_info[parentGroup].group;
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
	return (olLayer.layers_info[layerName].visible===true);
}
/** Return the visibility of a "group", taking into account the visibility of the parent group too */
ovMap.prototype.isGroupVisibleOnMap = function(olLayer,groupName) {
	parentGroup=groupName;

	while (parentGroup!=null) {
		// check if the group is visible
		if(olLayer.groups_info[parentGroup].visible==true) {
			// check if the group belong to another group
			if(olLayer.groups_info[parentGroup].group!=undefined) {
				parentGroup=olLayer.groups_info[parentGroup].group;
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
	return (olLayer.groups_info[groupName].visible);
}
/** Return the current scale */
ovMap.prototype.getScale = function(flagMetricScale) {
	if(typeof flagMetricScale === 'undefined') flagMetricScale = true;
	
	var view = this.map.getView();
	var resolution = view.getResolution();
	var scaleMapUnits = this.ipm * this.dpi * resolution;
	
	var units = view.getProjection().getUnits();
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	var scaleMeters = mpu * this.ipm * this.dpi * resolution;
	
	if(flagMetricScale) return Math.round(scaleMeters)
	else return scaleMapUnits;
};
/** Set the scale of the current view */
ovMap.prototype.setScale = function(scale) {
	var view = this.map.getView();
	var curRes = this.getResolutionFromProjectionAndScale(scale, view.getProjection());
    view.setResolution(curRes);
}
/** Calculate the resolution from defined projection and scale */
ovMap.prototype.getResolutionFromProjectionAndScale = function(scale, projection) {
	var view = this.map.getView();
	if ( typeof projection == "undefined" ) projection = view.getProjection();
	
	var resolution = view.getResolution();
	var metricResolution=ol.proj.getPointResolution(projection,resolution,view.getCenter());
	var metricResolutionRatio=metricResolution/resolution;
	var units = projection.getUnits();
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	var resolution = scale / this.ipm / mpu / this.dpi;
	
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
/** Return the current zoom level */
ovMap.prototype.getZoom = function() {
// console.log("getScale: ",window.devicePixelRatio);
	var view = this.map.getView();
	var zoom = view.getZoom();
	return zoom;
};
/** Set the current zoom level */
ovMap.prototype.setZoom = function(zoomLevel) {
	this.map.getView().setZoom(zoomLevel);
}
/** Return the coordinates of the center of the current view, according to the "map projection" */
ovMap.prototype.getCenter = function() {
	var view = this.map.getView();
	var center = view.getCenter();

	var centro = {};
	centro.X = center[0];
	centro.Y = center[1];
	
	return centro;
}
/** Return the projected coordinates of the center of the current view (default this.dataProjection) */
ovMap.prototype.getCenterProjected = function(aProjection) {
    if (typeof aProjection === 'undefined' || aProjection == undefined || aProjection == '') aProjection = this.dataProjection;
	var view = this.map.getView();
	var center = view.getCenter();

	var center_data = ol.proj.transform([center[0] , center[1]], this.mapProjection, this.dataProjection);

	var centro = {};
	centro.X = center_data[0];
	centro.Y = center_data[1];
	
	return centro;
}
/** Set the center of the current view, passing the projected coordinates and the projection (default this.dataProjection) */
ovMap.prototype.setCenterProjected = function(x, y, aProjection) { 
    if (typeof aProjection === 'undefined' || aProjection == undefined || aProjection == '') aProjection = this.dataProjection;
	if (!isNaN(parseFloat(x)) && !isNaN(parseFloat(y))){
		var view = this.map.getView();
		var centro = ol.proj.transform([parseFloat(x) , parseFloat(y)], aProjection, this.mapProjection);
		view.setCenter(centro);
	}
}
/** Return the "width" of the current extents */
ovMap.prototype.getWidth = function() {
	var view = this.map.getView();
	var extent = view.calculateExtent();
	var width= ol.extent.getWidth(extent);
	return width;
}
/** Return the "height" of the current extent */
ovMap.prototype.getHeight = function() {
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
	
ov_utils.ovLog('Start loading the map...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	/**
	 * STYLES
	 * - used for the rendering over the map
	 */
	ov_utils.ovLog('...creation of the map styles...');

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
		ov_utils.ovLog('...creation of the DEFAULT basemap layers (no specific basemap layer defined)...');
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
			ov_utils.ovLog('...creation of the '+map_baseLayers.length+' OL layers... ');
			for(var j=0; j < map_baseLayers.length; j++){
                
				var aLayerDef = map_baseLayersDefinition[j]

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
					case "XYZ": // OVD3 setAttributions(attributions)
						eval('var '+aLayerDef.key+' = new ol.layer.Tile({'+
								'source: new ol.source.XYZ ({'+
									'url: aLayerDef.wms_url'+
								'}),'+
								'maxZoom: '+aLayerDef.max_zoom+','+
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
				ov_utils.ovLog('   - layer '+aLayerDef.key+' ('+aLayerDef.sourceType+' '+aLayerDef.layer_visible+' '+aLayerDef.wms_layer_projection+') created.');
			}
		}
	}
	
	/**
	 * CREATION OF THE ADDITIONAL LAYERS
	 * - instantiation of the the layers
     * - addition (push) to the list of "available" layers inside OpenLayers
	 */
	ov_utils.ovLog('...creation of the MAIN layers...');
	
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
		ov_utils.ovLog('   - layer '+ol_layer.tipo+' created.');
	});

    if (typeof source !== 'undefined') var source_tooltip=source;
    // currently the array "stato" (< map_definition in config) is empty then this part could be useless - END SECTION
	
	
	/**
	 * CREATION OF THE SERVICE LAYERS
	 * - instantiation of the the layers
     * - addition (push) to the list of "available" layers inside OpenLayers
     * WARNING: the last pushed layer is the one used for the tooltip
	 */
	ov_utils.ovLog('...creation of the SERVICE layers (selection, measure, etc.)...');
	
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
	ov_utils.ovLog('...definition of the MAP VIEW...');
	
	ol.proj.proj4.register(proj4);
	
	// calculation of the map center (the coordinates based on this.dataProjection are transformed to this.mapProjection)
	ov_utils.ovLog('   - map projection '+ this.mapProjection, 'Setting the initial view...');
	var mapCenter = ol.proj.transform([mapOptions.initial_map_center[0], mapOptions.initial_map_center[1]], this.dataProjection, this.mapProjection);
	ov_utils.ovLog('   - initial map center '+mapCenter[0]+' , '+mapCenter[1]);
    
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
	ov_utils.ovLog('...definition of the MAP INTERACTION TOOLS...');
	
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
	
	
	/**
	 * DEFINITION OF THE MAP CONTROLS (OL controls object)
	 */
	ov_utils.ovLog('...definition of the MAP CONTROLS (coordinates, scale, etc.)...');
	
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
    
    var controls = [];
    if(this.mapOptions['show_coordinates_mouse']) controls.push(mousePositionControl);
    if(this.mapOptions['show_view_scale']) controls.push(new ol.control.ScaleLine());
	
	
	/**
	 * DEFINITION OF THE TOOLTIP OVERLAY (OL overlays object)
     * - tooltip overlay
     * - tooltip functionality
	 */
	ov_utils.ovLog('...definition of the TOOLTIPS...');
	
	tooltip_overlay = new ol.Overlay({
		// I need the DOM object, not of the JQUERY object
		element: tooltip_content[0]
	});

	// Tooltip overlay
	var map=new ol.Map({
		target: this.mapDiv,
		view: mapView,
		layers: ol_map_layers,
		interactions: interactions,
		controls: controls,
		overlays: [tooltip_overlay]
	});
	
	// Tooltip functionality
	map.on('pointermove', function(evt) {
		// hide the previous tooltip when the mouse position changes
		tooltip_overlay.setPosition(undefined);
		lastTimeMouseMoved = new Date().getTime();
        
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
								var url = source_tooltip.getFeatureInfoUrl(
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
											ov_utils.ovLog('Ajax error', 'GetTooltipHyperlink', 'error'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
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
	
	ov_utils.ovLog('...map loading completed successfully.');
	
};


/** MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER)
 * ---------------------------------------------------------------
 * - creation of a session
 * - ping (keep alive)
 * - return layer information
 * - get selected features
 * - refresh visibility
 */

/** Refresh the status of the "main" layers - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER)
 *  - update the deriver properties of the variable "stato" (list_groups_visible, layers_visible,
 *    layers_tooltip, layers_selectable, layers_hyperlinked, ...)
 *  - DON'T refresh the visibility of the OL layers (this task is perfromed by 
 */
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
			case "wms_onthefly":
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
					
					// specific case for onthefly user WMS layers
					var ref_layer = a_layers[i];
					if(ol_layer.tipo=='wms_onthefly') ref_layer = ol_layer.layers_info[a_layers[i]].feature_name;
					
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
						a_layers_selectable.push(ref_layer); // OVD a_layers[i]);
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
/** Refresh the visibility of the "main" layers (used by the checkboxes of the legend) - MAIN LAYERS INTEGRATION (MAPGUIDE, WMS, WMS_GEOSERVER, ONTHEFLY WMS) */
ovMap.prototype.refreshLayerVisibility = function(ol_layer,ol_type) {
ov_utils.ovLog('Refresh the visibility of layer '+ol_layer+' ('+ol_type+')'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	var map_ol_layers=this.map.getLayers();
	var stato = this.getStato();
	var that = this;
	
	switch (ol_type) { // switch (ol_layer) {
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
		
		case "wms_onthefly":
			// in the "legend tree" (aka "stato" variable"
			// the onthefly user WMS layers are structured as
			// "one group" composed by "one layer"
			// (for other source of data the structure can be much more complex)
			// then we don't change the "visible" layers in the "params" of the
			// "WMS connection", but we show/hide the whole OL layer
			map_ol_layers.forEach(function(item,index) {
				if(item.get('name')==ol_layer) {
					var source=item.getSource();
					var list_visible_layers = stato[ol_layer].list_layers_visible;
					var flagShow = (list_visible_layers != '');
					item.setVisible(flagShow);
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
/** Set the opacity/transparency of a layer */
ovMap.prototype.setLayerOpacity = function(layerName,opacityDelta){
	var ol_layer = this.getMapLayerByName(layerName)
	if (ol_layer==false) return false;
	var newOpacity = ol_layer.getOpacity();
	if(newOpacity == undefined) newOpacity = 1;
	var newOpacity = Math.max(0.1, Math.min(1,newOpacity+opacityDelta));
	ol_layer.setOpacity(newOpacity);
	return true;
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
	var aThreshold = this.mapOptions['map_measure_threshold'];							// example: 700 (m) for metric projection, 0.5 for decimal degrees
	aThreshold = aThreshold*aThreshold;
	var aUnitsNum = this.mapOptions['map_measure_units_number'];						// example: 1000 (1 km = 1000m) for metric projection, 1 for decimal degrees
	var aSubUnitsNum = Math.pow(this.mapOptions['map_measure_sub_units_number'], 2);	// example: 1 (m) for metric projection, 60 (1 minute = 1/60 of 1 degree) for decimal degrees
	var aUnits = this.mapOptions['map_measure_units'];									// example: 'km' for metric projection, '°' or 'deg' or 'dd' for decimal degrees
	var aSubUnits = this.mapOptions['map_measure_sub_units'];							// example: 'm' for metric projection, '\'' or 'min' or 'mm' for decimal degrees
	
	if (area > aThreshold) {
		output = (Math.round(area / (aUnitsNum*aUnitsNum) * 1000) / 1000) +
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
	var aThreshold = this.mapOptions['map_measure_threshold'];			// example: 700 (m) for metric projection, 0.5 for decimal degrees
	var aUnitsNum = this.mapOptions['map_measure_units_number'];		// example: 1000 (1 km = 1000m) for metric projection, 1 for decimal degrees
	var aSubUnitsNum = this.mapOptions['map_measure_sub_units_number'];	// example: 1 (m) for metric projection, 60 (1 minute = 1/60 of 1 degree) for decimal degrees
	var aUnits = this.mapOptions['map_measure_units'];					// example: 'km' for metric projection, '°' or 'deg' or 'dd' for decimal degrees
	var aSubUnits = this.mapOptions['map_measure_sub_units'];			// example: 'm' for metric projection, '\'' or 'min' or 'mm' for decimal degrees
	if (length > aThreshold) {
		output = (Math.round(length / aUnitsNum * 100) / 100) +
			' ' + aUnits;
	} else {
		output = (Math.round(length * aSubUnitsNum * 100) / 100) +
			' ' + aSubUnits;
	}
	
	return output;
};


/** OTHER METHODS  */

/** Save the current view in the views history (used to retrieve the previous zoom/extents) */
ovMap.prototype.saveViewHistory = function() {
ov_utils.ovLog('Saving an "historical" view...'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
    switch(this.historyViewCaller) {
        case 'ZoomPrev':
        case 'ZoomNext':
            // saving of the view is not needed
            ov_utils.ovLog('... nothing to be saved ('+this.historyViewCaller+')'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
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
ov_utils.ovLog('... '+this.historyViewIndex+ ' saved views ('+this.getZoom()+')'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
            // restore the previous "caller" (=interact state) if the caller is not an interactive tool, but a button
			if(this.historyViewCaller=='ZoomIn'||this.historyViewCaller=='ZoomOut')
				this.historyViewCaller = this.historyViewPreviousCaller
			break;
	}

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
		selectLayer.setVisible(visible);
    }
    else {
        // nothing to do
    }
}
/** Clear all "service" layers or one of them, and optionally cancel the features selection */
ovMap.prototype.clearTempLayers = function(layer_name, flag_clear_service_layers, flag_cancel_selection) {
	if (typeof flag_clear_service_layers == 'undefined') {flag_clear_service_layers=true;}
	if (typeof flag_cancel_selection == 'undefined') {flag_cancel_selection=true;}
	
	// clear previous selection
	if(flag_cancel_selection) {
		var selectOverlay=this.getMapLayerByName('selection');
		selectOverlay.getSource().clear();
		// refresh the footer message with the number of selected features
		open_viewer.footerUpdateText();
	}
	
	// clear "service layers"
	if (flag_clear_service_layers==true) {
		if(this.clearRedline!==undefined) {
			this.clearRedline('drawing');
			this.clearRedline('redline');
			this.clearRedline('selection');
			this.clearRedline('measure');
		}
		this.removeMeasureTooltip();
	}
	
	// If "layer_name" is empty, we need to clear all the "temporary" layers too
	if (typeof layer_name == "undefined") {
		var templayer = this.getMapLayerByName("tmp_punti");
		if(!empty(templayer)){
			if(this.clearRedline!==undefined) this.clearRedline("tmp_punti");
		}

		var templayer = this.getMapLayerByName("tmp_linee");
		if(!empty(templayer)){
			if(this.clearRedline!==undefined) this.clearRedline("tmp_linee");
		}
		
		var templayer = this.getMapLayerByName("tmp_poligoni");
		if(!empty(templayer)){
			if(this.clearRedline!==undefined) this.clearRedline("tmp_poligoni");
		}
	}
    
	if(!empty(layer_name)){
// 		si controlla che esista il layer 
		var templayer = this.getMapLayerByName(layer_name);
		if(!empty(templayer)){
			if(this.clearRedline!==undefined) this.clearRedline(layer_name);
		}
	}
};
/** Clear all the features of a layer (used to clear the results of the user interaction, like for example the activities of measuring length or area)*/
ovMap.prototype.clearRedline = function(ol_layer) {
	var redline = this.getMapLayerByName(ol_layer);
	redline.getSource().clear();
};


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

