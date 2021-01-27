var LdpMap = function (params) {
	this.stato = params.stato;
	this.mapOptions = params.mapOptions;
	this.mapDiv = params.mapDiv;
	this.tooltipDiv = params.tooltipDiv;
	this.drawWKTDiv = params.drawWKTDiv;
	this.measureTooltipElement = null;
	if (typeof this.mapOptions.dataProjection !== 'undefined') {
		this.dataProjection=this.mapOptions.dataProjection;
	} else {
		this.dataProjection="EPSG:3003";
	}
	
	if (typeof this.mapOptions.mapProjection !== 'undefined') {
		this.mapProjection=this.mapOptions.mapProjection;
	} else {
		this.mapProjection="EPSG:3003";
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
	
	this.extrainteractions= {"zoom_selection":null,"select":null, "draw":null, "measure":null, "snap":null};
	
	this.statoInterazione="select";
	this.historyView=[];
	this.historyViewIndex=-1;
	this.refreshStato();
	this.WmsLayerAdded=null;
	this.ProxySet = params.ProxySet;
	this.ol_map_layers=[];
	this.baseLayers = params.baseLayers;
};


LdpMap.prototype.getStato = function() { return this.stato; }
LdpMap.prototype.getMapOptions = function() { return this.mapOptions; }

LdpMap.prototype.setStato = function(stato) { this.stato = stato; }



LdpMap.prototype.LoadMap = function() {
	var that=this;

	var stato = this.getStato();
	var mapOptions = this.getMapOptions();
	
	var ol_map_layers=new Array();
	
	///TOOLTIP
	tooltip_content = this.tooltipDiv;

	///Draw WKT
	var draw_wkt = this.drawWKTDiv;

	//Overlay per il tooltip
	tooltip_overlay = new ol.Overlay({
		// ho bisogno dell'oggetto del DOM, non dell'oggetto jquery
		element: tooltip_content[0]
	});
	
	
	//
	///SELEZIONE
	//Layer per la selezione
	var fill=new ol.style.Fill({
		color: 'rgba(0, 127, 255,0.4)'
	});
	var stroke=new ol.style.Stroke({
		color: '#007FFF',
		width: 3
	});
	
	var selectOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill,
			stroke: stroke,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill,
				stroke: stroke
			})
		}),
		source: new ol.source.Vector(),
		name:'selection'
	});
	
	
	
	///SNAP
	//Layer per lo snap
	var fill_snap=new ol.style.Fill({
		color: 'rgba(0, 0, 0, 0)'
	});
	var stroke_snap=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0)',
		width: 1
	});
	
	var snapOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill_snap,
 			stroke: stroke_snap
		}),
		source: new ol.source.Vector(),
		name:'snap'
	});
	
	
	
	///REDLINE
	//Layer per il redline
	var fill_redline=new ol.style.Fill({
		color: 'rgba(197, 25, 255,0.8)'
	});
	var stroke_redline=new ol.style.Stroke({
		color: '#bf00ff',
		width: 4
	});
	
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
	
	///DISEGNO
	//Layer per il disegno
	var fill=new ol.style.Fill({
		color: 'rgba(221, 29, 4,0.4)'
	});
	var stroke=new ol.style.Stroke({
		color: '#FF7F00',
		width: 3
	});
	
	var disegnoOverlay = new ol.layer.Vector({
		style: new ol.style.Style({
			fill: fill,
			stroke: stroke,
			image: new ol.style.Circle({
				radius: 7,
				fill: fill,
				stroke: stroke
			})
		}),
		source: new ol.source.Vector(),
		name:'drawing'
	});
	
	//MISURA misura
	//layer per la misura 
	var fill_linea=new ol.style.Fill({
		 color: 'rgba(255, 255, 255, 0.2)'
	});
	var stroke_linea=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0.5)',
		lineDash: [10, 10],
		width: 2
	});
	
	var measure_style = new ol.style.Style({
		fill: fill_linea,
		stroke: stroke_linea,
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
	
	var misuraOverlay = new ol.layer.Vector({
		source: new ol.source.Vector(),
		name:'measure',
		style: measure_style
	});
		
	
	
	if(mapOptions.default_base_layer!=undefined) {
		var default_base_layer=mapOptions.default_base_layer;
	} else {
		var default_base_layer="OpenStreetMap";
	}

	//DBT Regione Toscana
	var dbt_regione_toscana = new ol.layer.Tile({
		
		source: new ol.source.TileWMS ({
			url: 'http://www502.regione.toscana.it/geoscopio_qg/cgi-bin/qgis_mapserv?map=dbtm_rt.qgs&'
			,params: {
				'LAYERS': 'Vestizione'
			},
			serverType: 'geoserver',
			projection: that.dataProjection
		}),
		name: 'DBT Regione Toscana',
		visible: (default_base_layer=='DBT Regione Toscana'),
		baselayer: true
	});

	//Ortofoto Regione Toscana
	var ortofoto_regione_toscana = new ol.layer.Tile({
		source: new ol.source.TileWMS ({
			url: 'http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsofc&map_resolution=91&language=ita&'
			,params: {
 				'LAYERS': 'rt_ofc.10k13'
			},
			serverType: 'geoserver',
			projection: that.dataProjection
		}),
		name: 'Ortofoto Regione Toscana (2013)',
		visible: (default_base_layer=='Ortofoto Regione Toscana (2013)'),
		baselayer: true
	});
	
	//Ortofoto Regione Toscana
	var ortofoto_regione_toscana_2016 = new ol.layer.Tile({
		source: new ol.source.TileWMS ({
			url: 'http://www502.regione.toscana.it/ows_ofc/com.rt.wms.RTmap/wms?map=owsofc&map_resolution=91&'
			,params: {
				'LAYERS': 'rt_ofc.5k16.32bit'
			},
			serverType: 'geoserver',
			projection: that.dataProjection
		}),
		name: 'Ortofoto Regione Toscana (2016)',
		visible: (default_base_layer=='Ortofoto Regione Toscana (2016)'),
		baselayer: true
	});

	//OSM - TODO da configurare nello stato se si vede o no
	var osm = new ol.layer.Tile({
		source: new ol.source.OSM(),
		name: 'OpenStreetMap',
		visible: (default_base_layer=='OpenStreetMap'),
		baselayer: true
	});

	//Limiti comunali Regione Toscana
	var limiti_regione_toscana = new ol.layer.Tile({
		source: new ol.source.TileWMS ({
			url: 'http://www502.regione.toscana.it/wmsraster/com.rt.wms.RTmap/wms?map=wmsambamm&'
			,params: {'LAYERS': 'rt_ambamm.idcomuni.rt.poly' },
			serverType: 'geoserver',
			projection: that.dataProjection
		}),
		name: 'Limiti Regione Toscana',
		visible: (default_base_layer=='Limiti Regione Toscana'),
		baselayer: true
	});
	
	
	//Catasto - Regione Toscana
	var catasto_regione_toscana = new ol.layer.Tile({
		source: new ol.source.TileWMS ({
			url: 'http://www502.regione.toscana.it/ows_catasto/com.rt.wms.RTmap/ows?map=owscatasto&'
			,params: {
				'LAYERS': 'rt_cat.idcatbdfog.rt,rt_cat.idcatpart.rt,rt_cat.idcatfabbr.rt',
				'QUERY_LAYERS': 'rt_cat.idcatbdfog.rt,rt_cat.idcatpart.rt,rt_cat.idcatfabbr.rt',
				'INFO_FORMAT': 'text/html'
// 				'STYLES':'default,default'
			},
			serverType: 'geoserver',
			projection: that.dataProjection
		}),
		name: 'Catasto (Regione Toscana)',
		visible: (default_base_layer=='Catasto (Regione Toscana)'),
		baselayer: true
	});
	
	
	//Catasto - Agenzia delle Entrate
	var cartografia_catastale = new ol.layer.Tile({
		source: new ol.source.TileWMS ({
			url: 'https://wms.cartografia.agenziaentrate.gov.it/inspire/wms/ows01.php',
			params: {
				'LAYERS': 'CP.CadastralZoning,CP.CadastralParcel,fabbricati',
				'QUERY_LAYERS': 'CP.CadastralZoning,CP.CadastralParcel',
				'INFO_FORMAT': 'text/html'
			},
			serverType: 'geoserver',
			projection: 'EPSG:25832'
		}),
		name: 'Catasto (Agenzia delle Entrate)',
		visible: (default_base_layer=='Catasto (Agenzia delle Entrate)'),
		baselayer: true
	});
	

	//Nessuno
	var nessuno = new ol.layer.Tile({
		source: null,
		name: 'Nessuno',
		visible: (default_base_layer=='Nessuno'),
		baselayer: true
	});
	
	if(this.baseLayers === null){
		ol_map_layers.push(dbt_regione_toscana);
		ol_map_layers.push(ortofoto_regione_toscana);
		ol_map_layers.push(ortofoto_regione_toscana_2016);
		ol_map_layers.push(osm);
		ol_map_layers.push(limiti_regione_toscana);

///TODO non si devono mostrare di default: modificare il config affinchè possano essere aggiunti a quelli di base
// 		ol_map_layers.push(catasto_regione_toscana);
// 		ol_map_layers.push(cartografia_catastale);
		
		ol_map_layers.push(nessuno);
	}
	else{
		if(this.baseLayers != ''){
			var map_baseLayers = this.baseLayers;
			for(var j=0; j < map_baseLayers.length; j++){
				ol_map_layers.push(eval(map_baseLayers[j]));
			}
		}
	}

	var a_ol_layers=Object.keys(stato);

	//Per ogni layer di OL si controlla il tipo
	a_ol_layers.forEach(function(item,index){
		ol_layer=stato[item];
		switch (ol_layer.tipo) {
			case "wms":
					source = new ol.source.ImageWMS ({
						url: LdpViewer_proxy,
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
							url: LdpViewer_proxy,
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

				//La prima volta che si carica la mappa dobbiamo assicurarci che la dimensione della mappa corrisponda al div che la contiene
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
					hidpi: false,	//Necessario per non far cambiare i layer visibili ad una certa scala nei device con pixelRatio > 1
					metersPerUnit: 1, //value returned from mapguide
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

				//La prima volta che si carica la mappa dobbiamo assicurarci che la dimensione della mappa corrisponda al div che la contiene
				source.once('imageloadend', function() {
					map.updateSize();
				});
				
				// mi copio il layer perché non cambi
				var this_layer = ol_layer;
				
				//PING nelle api del Mapguide per tenere viva la sessione
				that.mg_ping_timer=setInterval(function (){that.MapguidePing(this_layer);},that.mg_ping_interval);
				
			break;
		}
	});
	
	//L'ultimo strato è quello su cui va richiesto il tooltip
	//source_tooltip=source;
	
	//Si aggiunge il layer per lo snap
	ol_map_layers.push(snapOverlay);
	//Si aggiunge il layer per la selezione
	ol_map_layers.push(selectOverlay);
	//Si aggiungono i layer per il redline
	ol_map_layers.push(redlinePoint);
	//Si aggiunge il layer per la selezione
	ol_map_layers.push(disegnoOverlay);
	//Si aggiunge il layer per la misuraOverlay
	ol_map_layers.push(misuraOverlay);
	
	ol.proj.proj4.register(proj4);
	
	//Inquadramento iniziale (espresso in this.dataProjection)
	var centro = ol.proj.transform([mapOptions.centro[0], mapOptions.centro[1]], this.dataProjection, this.mapProjection);
	//var centro = mapOptions.centro;
	var mapView = new ol.View({
		center: centro,
		zoom: mapOptions.zoom,
		projection: this.mapProjection
	});
	
	this.initialView.center=centro;
	this.initialView.zoom=mapOptions.zoom;
	
	//Se vengono definiti i parametri di override (ad esempio da vistasu) si settano il centro e lo zoom da override
	if(typeof mapOptions.centro_override != 'undefined' && typeof mapOptions.zoom_override != 'undefined') {
		var centro = ol.proj.transform([mapOptions.centro_override[0], mapOptions.centro_override[1]], this.dataProjection, this.mapProjection);
		//var centro = mapOptions.centro;
		var mapView = new ol.View({
			center: centro,
			zoom: mapOptions.zoom_override,
			projection: this.mapProjection
		});
	}
	
	var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false, shiftDragZoom:false});
	
// 	dragZoom = new ol.interaction.DragZoom({condition: ol.events.condition.always}); 

	this.extrainteractions.zoom_selection = new ol.interaction.DragZoom({condition: ol.events.condition.always});
	
	this.extrainteractions.select = new ol.interaction.DragBox({condition: ol.events.condition.always});
	
	
	this.extrainteractions.measure = new ol.interaction.Draw({
		source: misuraOverlay.getSource(),
		type: "LineString"
	});
	
	
// // 	///TODO: serve per disegnare su mappa, va creato un Vector di disegno ed attivato in caso di bisogno
	this.extrainteractions.draw = new ol.interaction.Draw({
		source: disegnoOverlay.getSource(),
		type: "Polygon"
	});
	
	
	this.extrainteractions.snap = new ol.interaction.Snap({source: snapOverlay.getSource()});
// 	
// 	this.extrainteractions.draw.on('drawend',function(e) {
// console.log("general drawend");
// 		var format = new ol.format.WKT();
// 		wkt = format.writeGeometry(e.feature.getGeometry());
// 		draw_wkt.html(wkt);
// 		
// 		//Chiamo una callback ?
// 		fineDisegno(wkt);
// // 		that.controlDoubleClickZoom(false);
// 		//setTimeout(function() { that.controlDoubleClickZoom(true); }.bind(that),251);
// 	});
	
// 	this.extrainteractions.select.on('boxend', function() {
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
// 	this.extrainteractions.select.on('boxstart', function() {
// 		selectedFeatures.clear();
// 		infoBox.innerHTML = '&nbsp;';
// 	});
	
	
	//Controlli
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
	var controls = [ new ol.control.ScaleLine(), mousePositionControl ];
	
	var map=new ol.Map({
		target: this.mapDiv,
		view: mapView,
		layers: ol_map_layers,
		interactions: interactions,
		controls: controls,
		overlays: [tooltip_overlay]
	});
	
	
	
	
		
	//Tooltip
	map.on('pointermove', function(evt) {
// console.log("pointermove");
		//Appena si nuove il mouse si nasconde il tooltip precedente
		tooltip_overlay.setPosition(undefined);
		lastTimeMouseMoved = new Date().getTime();
// 		var stato = this.stato;

		/* Ciclo al contrario su ol_layers e prendo il primo strato che abbia list_layers_tooltip != '';
		 * Se è acceso un wms parziale, non avrò tooltip sullo strato sottostante. Non è perfetto ma dovrei in ogni caso attendere la sua risposta asincrona, non ne vale la pena
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

								//aggiunto controllo su strati che hanno l'hyperlink poichè anche se il tooltip è vuoto va mostrato ugualmente il tooltip per il ctrl+click
								//solo se esiste almeno uno strato con l'hyperlink si deve aggiungere
								if (ol_layer.list_layers_hyperlinked != "") {
									var a_layers_hyperlinked=ol_layer.list_layers_hyperlinked.split(",");
									var a_layers_tooltip_hyperlinked = a_layers_tooltip.concat(a_layers_hyperlinked);
								} else {
									var a_layers_tooltip_hyperlinked = a_layers_tooltip;
								}

								if (a_layers_tooltip_hyperlinked.length > 0) {
									var a_layernames=new Array();


									//ciclo for per rendere l'array a_layernames unique
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



LdpMap.prototype.updateMapSize = function(){
	return this.map.updateSize();
}


LdpMap.prototype.getMapView = function(){
	return this.map.getView();
}


LdpMap.prototype.TooltipOnData = function(data,coordinate){
	tooltip_content.html(data);
	tooltip_overlay.setPosition(coordinate);
}

LdpMap.prototype.measure = function(type, callback_function) {
	var type = (type == 'area' ? 'Polygon' : 'LineString');
	var that=this;
	
	var fill_linea=new ol.style.Fill({
		 color: 'rgba(255, 255, 255, 0.2)'
	});
	var stroke_linea=new ol.style.Stroke({
		color: 'rgba(0, 0, 0, 0.5)',
		lineDash: [10, 10],
		width: 2
	});
	
	var measure_style = new ol.style.Style({
		fill: fill_linea,
		stroke: stroke_linea,
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
		var misuraOverlayLayer=this.getMapLayer('measure');
		
		this.map.removeInteraction(this.extrainteractions.measure);
		
		this.extrainteractions.measure = new ol.interaction.Draw({
			source: misuraOverlayLayer.getSource(),
			type: 'Polygon',
			style: measure_style
		});
	} else {
		var misuraOverlayLayer=this.getMapLayer('measure');
		
	this.map.removeInteraction(this.extrainteractions.measure);
		this.extrainteractions.measure = new ol.interaction.Draw({
			source: misuraOverlayLayer.getSource(),
			type: 'LineString',
			style: measure_style
		});
	}
	
	var listener;
	var sketch;
	this.map.addInteraction(this.extrainteractions.measure);
	
	this.createMeasureTooltip();
	
	this.extrainteractions.measure.on('drawstart', function(e){
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
	
	this.extrainteractions.measure.on('drawend',
		function() {
			that.measureTooltipElement.className = 'tooltip tooltip-static tooltip-measuring';
			measureTooltip.setOffset([0, -7]);
			// unset sketch
			sketch = null;
			// unset tooltip so that a new one can be created
			that.measureTooltipElement = null;
			this.createMeasureTooltip();
			ol.Observable.unByKey(listener);
	}, this);
	
}


LdpMap.prototype.createMeasureTooltip = function(){
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


LdpMap.prototype.removeMeasureTooltip = function(){
	/*this.map.getOverlays().forEach(function(overlay) {
		this.map.removeOverlay(overlay);
	});*/
	$(".tooltip-measuring").remove();
}


//The ol.Sphere.getLength() and ol.Sphere.getArea() functions calculate spherical lengths and areas for geometries.
LdpMap.prototype.formatArea = function(polygon){
	//Non va usato ol.Sphere perchè le coordinate sono già proiettate sul piano
	//var area = ol.Sphere.getArea(polygon);
	var area = polygon.getArea();
	var output;
	if (area > 1000000) {
		output = (Math.round(area / 1000000 * 100) / 100) +
			' ' + 'km<sup>2</sup>';
	} else {
		output = (Math.round(area * 100) / 100) +
			' ' + 'm<sup>2</sup>';
	}
	return output;
}


LdpMap.prototype.formatLength = function(line) {
	//Non va usato ol.Sphere perchè le coordinate sono già proiettate sul piano
// 	var length = ol.Sphere.getLength(line, 'EPSG:3003');
	var length = line.getLength();
	
	var output;
	if (length > 1000) {
		output = (Math.round(length / 1000 * 100) / 100) +
			' ' + 'km';
	} else {
		output = (Math.round(length * 100) / 100) +
			' ' + 'm';
	}
	return output;
};


LdpMap.prototype.startDraw = function(type,callback_function) {
	var that=this;
	var draw_wkt = this.drawWKTDiv;
	var disegnoOverlay=this.getMapLayer('drawing');

// 	//Si ripuliscono i disegni precedenti
// 	//disegnoOverlay.getSource().clear();

	var coords_length=0;
	
	this.map.removeInteraction(this.extrainteractions.draw);
	
	this.extrainteractions.draw = new ol.interaction.Draw({
		source: disegnoOverlay.getSource(),
		type: type
	});
	
	this.extrainteractions.draw.on('drawstart', function(e){
		//Premendo ESC si elimina l'ultimo punto inserito
		$(document).on('keyup', function(event){
			if(event.keyCode === 27){
				that.extrainteractions.draw.removeLastPoint();
			}
		});
	});
	
	this.extrainteractions.draw.on('drawend',function(e) {
		//Tolgo l'evento sull'ESC premuto
		$(document).off('keyup');

		var format = new ol.format.WKT();
		//The circle geometry (a center with a radius) is not a supported by the WKT format. The best chance is to transform your Circle geometry in an approximate Polygon
		if(type=='Circle'){
			var circularPolygon = ol.geom.Polygon.fromCircle(e.feature.getGeometry());
			e.feature.setGeometry(circularPolygon);
		}
		//Necessario per mantenere il disegno nel sistema di riferimento della mappa, ma trasformare la wkt nel sistema di riferimento dei dati
		var feature_cloned = e.feature.clone();

		wkt = format.writeGeometry(feature_cloned.getGeometry().transform(that.mapProjection, that.dataProjection));
		draw_wkt.html(wkt);

		//Chiamo la funzione di callback, se definita
		if (typeof eval(callback_function) === "function") {
			var callbackFunction=callback_function+"(wkt)";
			eval(callbackFunction);
		}
	});
	this.map.addInteraction(this.extrainteractions.draw);
	this.map.addInteraction(this.extrainteractions.snap);
}


LdpMap.prototype.cancelDraw = function(type,callback_function) {
	var disegnoOverlay=this.getMapLayer('drawing');

	//Si ripuliscono i disegni precedenti
	disegnoOverlay.getSource().clear();
}


LdpMap.prototype.MapguideCreateSession = function(ol_layer) {
// console.log("MapguideCreateSession()");
	var that = this;
	var mg_session_info=null;
	if ( ol_layer.api_url != '' ) {
		//Si fa una chiamata syncrona per ottenere le variabili richieste in modo sincrono
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
// console.log("MapguideCreateSession() - ERRORE: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					mg_session_info=response.data;
				}
			}
		});
	}
	return mg_session_info;
}


LdpMap.prototype.MapguidePing = function(ol_layer) {
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
					
					console.log("ping() - ERRORE: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					//console.log(response);
					
					//Do nothing
				}
			}
		});
	}
}


LdpMap.prototype.MapguideGetLayersInfo = function(ol_layer) {
// console.log("Map.MapguideGetLayersInfo");

	var that = this;
// console.log(this.mg_session_info);
	
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
					console.log("getMapLayers() - ERRORE: " + (typeof response.data != 'undefined' ? response.data : '<undefined>'));
				} else {
					//console.log(response);
					
					///TODO
				}
			}
		});
	}
}


LdpMap.prototype.setStatoInterazione = function(stato) {
	this.statoInterazione=stato;
	return;
};


LdpMap.prototype.getStatoInterazione = function() {
	return this.statoInterazione;
};


LdpMap.prototype.refreshStato = function() {
	var statoCorrente = this.stato;

	// necessario per avere l'oggetto this dentro ad altre funzioni
	var that = this;

	//Array dei layers di OL presenti nella definizione
	var a_ol_layers=Object.keys(statoCorrente);

	//Per ogni layer di OL si controlla il tipo
	a_ol_layers.forEach(function(item,index) {

		var ol_layer=statoCorrente[item];
		switch (ol_layer.tipo) {
		
			case "wms":
			case "wms_geoserver":
				var layers_info=ol_layer.layers_info;
				var groups_info=ol_layer.groups_info;
				var a_layers=Object.keys(layers_info);
				var a_groups=Object.keys(groups_info);
				var list_layers=a_layers.join();
				
				statoCorrente[item].list_layers=list_layers;

				///TODO visible,tooltip, etc..
				
				a_layers_visible=new Array();
				a_layers_tooltip=new Array();
				a_layers_selectable=new Array();
				a_layers_hyperlinked=new Array();
				for (var i=0;i<a_layers.length;i++) {
					//visible=isLayerVisibleOnMap(ol_layer,a_layers[i]);
					visible = that.isLayerVisibleOnMap(ol_layer,a_layers[i]);
					//Layer visibili
					if(visible) {
						a_layers_visible.push(a_layers[i]);
					}
					//Layer da interrogare per il tooltip
					if(visible && layers_info[a_layers[i]].tooltip!=undefined) {
						a_layers_tooltip.push(a_layers[i]);
					}
					//Layer selezionabili
					if(visible && layers_info[a_layers[i]].selectable==true) {
						a_layers_selectable.push(a_layers[i]);
					}
					//Layer con hyperlink
					if(visible && layers_info[a_layers[i]].hyperlink!=undefined) {
						a_layers_hyperlinked.push(a_layers[i]);
					}
				}
				statoCorrente[item].list_layers_visible=a_layers_visible.reverse().join();
				statoCorrente[item].list_layers_tooltip=a_layers_tooltip.join();

				statoCorrente[item].list_layers_selectable=a_layers_selectable.join();
				statoCorrente[item].list_layers_hyperlinked=a_layers_hyperlinked.join();
			break;

			case "mapguide":
				if (statoCorrente[item].mg_session_info == null) {
					//Si genera una nuova sessione (chiamata remota sincrona. Gestire il timeout??)
					statoCorrente[item].mg_session_info=that.MapguideCreateSession(ol_layer);
				}
				
				ol_layer.layers_info=statoCorrente[item].mg_session_info.layers_info;
				ol_layer.groups_info=statoCorrente[item].mg_session_info.groups_info;
				
				var layers_info=ol_layer.layers_info;
				var groups_info=ol_layer.groups_info;
				var a_layers=Object.keys(layers_info);
				var a_groups=Object.keys(groups_info);
				
				var list_layers=a_layers.join();
				var list_groups=a_groups.join();
				
				statoCorrente[item].list_layers=list_layers;
				statoCorrente[item].list_groups=list_groups;

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

					//Layer visibili
					if(visible) {
						a_layers_visible.push(a_layers[i]);
					}

					//Layer da interrogare per il tooltip
					if(visible && layers_info[a_layers[i]].tooltip!=undefined && layers_info[a_layers[i]].tooltip!=null && layers_info[a_layers[i]].tooltip!="") {
						a_layers_tooltip.push(a_layers[i]);
					}
					//Layer selezionabili
					if(visible && layers_info[a_layers[i]].selectable==true) {
						a_layers_selectable.push(a_layers[i]);
					}
					//Layer con hyperlink
					if(visible && layers_info[a_layers[i]].hyperlink!=undefined && layers_info[a_layers[i]].hyperlink!=null && layers_info[a_layers[i]].hyperlink!="") {
						a_layers_hyperlinked.push(a_layers[i]);
					}
				}

				statoCorrente[item].list_groups_visible=a_groups_visible.reverse().join();

				statoCorrente[item].list_layers_visible=a_layers_visible.reverse().join();
				statoCorrente[item].list_layers_tooltip=a_layers_tooltip.join();

				statoCorrente[item].list_layers_selectable=a_layers_selectable.join();
				statoCorrente[item].list_layers_hyperlinked=a_layers_hyperlinked.join();
			break;
		}
	});
	this.stato=statoCorrente;

	return statoCorrente;
};


LdpMap.prototype.isLayerVisibleOnMap = function(ol_layer,nome_layer) {
// console.log('prototype.isLayerVisibleOnMap');
	//Il layer appartiene ad un gruppo?
	if(ol_layer.layers_info[nome_layer].group!=undefined) {
		gruppo_da_controllare=ol_layer.layers_info[nome_layer].group;

		while (gruppo_da_controllare!=null) {
			//Si controlla se il gruppo è visibile
			if(ol_layer.groups_info[gruppo_da_controllare].visible==true) {
				//Si controlla se il gruppo appartiene ad un altro gruppo
				if(ol_layer.groups_info[gruppo_da_controllare].group!=undefined) {
					gruppo_da_controllare=ol_layer.groups_info[gruppo_da_controllare].group;
				} else {
					//Il gruppo è visibile
					gruppo_da_controllare=null;
				}
			} else {
				//Il gruppo di appartenenza non è visibile
				return false;
			}
		}
	}

	//Si controlla se il layer è visibile
	return (ol_layer.layers_info[nome_layer].visible===true);
}


LdpMap.prototype.isGroupVisibleOnMap = function(ol_layer,nome_group) {
	gruppo_da_controllare=nome_group;

	while (gruppo_da_controllare!=null) {
		//Si controlla se il gruppo è visibile
		if(ol_layer.groups_info[gruppo_da_controllare].visible==true) {
			//Si controlla se il gruppo appartiene ad un altro gruppo
			if(ol_layer.groups_info[gruppo_da_controllare].group!=undefined) {
				gruppo_da_controllare=ol_layer.groups_info[gruppo_da_controllare].group;
			} else {
				//Il gruppo è visibile
				gruppo_da_controllare=null;
			}

		} else {
			//Il gruppo di appartenenza non è visibile
			return false;
		}
	}
	

	//Si controlla se il gruppo è visibile
	return (ol_layer.groups_info[nome_group].visible);
}


LdpMap.prototype.saveViewHistory = function() {
// console.log("saveHistoryView");
	//Siamo nello stato corrente
	if(this.historyView.length-1==this.historyViewIndex) {
		this.historyView.push({
			center: this.map.getView().getCenter(), 
			resolution: this.map.getView().getResolution()
		});
		this.historyViewIndex++;
	} else {
		//Siamo in uno stato precedente all'ultimo
		
	}
}


//Per retrocompatibilità si accetta un parametro xml che è null
//I parametri primary_key ed extra_field al momento non vengono utilizzati
LdpMap.prototype.getSelectedFeatures = function(xml,a_layers,callback_function,primary_key,extra_field) {
	layers=a_layers.split(",");
	
	var selectOverlay=this.getMapLayer('selection');
	var features=selectOverlay.getSource().getFeatures();
// console.log("features",features);

	var lista_id='';
	var nessunLayer=true;
	
	for (var i=0; i < features.length; i++) {
		var attributi=features[i].getProperties();
//console.log(layers);
// console.log(attributi);

		if (jQuery.inArray( attributi.layer, layers )!=-1) {
			nessunLayer=false;
			
			if (lista_id!='') {
				lista_id += '|';
			}

			//Se ho passato una chiave primaria diversa, devo tornare il contenuto del campo passato
			if (primary_key!="") {
				
				if(typeof attributi.extra_fields[primary_key] != "undefined") {
					lista_id += attributi.layer+';'+attributi.extra_fields[primary_key];
				} else {
					lista_id += attributi.layer+';'+attributi.feature_id;
				}
			} else {
				lista_id += attributi.layer+';'+attributi.feature_id;
			}


			//Se è definito extra_field si aggiunge il valore della colonna al risultato
			if (extra_field!="") {
				lista_id+=';'+attributi.extra_fields[extra_field];
			}

		}
	}
	
// console.log(lista_id);
	
	if (nessunLayer) {
		//non dovrebbe più entrarci perché il controllo è fatto anche in libviewer.js
		alert("Nessuna selezione nei layer: ("+a_layers+")");
	} else {
		//Chiamo la funzione di callback, se definita
		if (typeof eval(callback_function) === "function") {
			var callbackFunction=callback_function+"(lista_id)";
			eval(callbackFunction);
		}
	}

	return features;
};


LdpMap.prototype.getMapSelection = function() {

	var stato = this.getStato();
	var ol_layer = 'mapguide';
	var selectOverlay=this.getMapLayer('selection');
	var features=selectOverlay.getSource().getFeatures();

	var ids = new Array(), lys= new Array();
	for (var i=0; i < features.length; i++) {
		
		var attributi=features[i].getProperties();

		var layers=stato[ol_layer].layers_info;
		var a_layers_info=Object.keys(layers);
		for (var j=0;j<a_layers_info.length;j++) {
			if(layers[a_layers_info[j]].name==attributi.layer) {
				//Trovato
				var layer_id = a_layers_info[j];
				var id = attributi.feature_id;
			}
		}

		lys.push(layer_id);
		ids.push(id);
		
	}
	return {ids:ids, lys:lys };
};



LdpMap.prototype.getScale = function() {
// console.log("pixelRatio: "+window.devicePixelRatio);
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


LdpMap.prototype.getZoom = function() {
//console.log("getScale: ",window.devicePixelRatio);
	var view = this.map.getView();
	var zoom = view.getZoom();
	return zoom;
};


//Si aggiunge la funzione che setta la scala
LdpMap.prototype.setScale = function(scale) {
	
	var view = this.map.getView();
	
	var resolution = view.getResolution();
	var metricResolution=ol.proj.getPointResolution(view.getProjection(),resolution,view.getCenter());
	var metricResolutionRatio=metricResolution/resolution;
	var units = view.getProjection().getUnits();
	//var mpu = ol.proj.METERS_PER_UNIT[units];
	var mpu = ol.proj.Units.METERS_PER_UNIT[units];
	
	
	var resolution_old = scale / this.ipm / mpu / this.dpi / metricResolutionRatio;
	var resolution = scale / this.ipm / mpu / this.dpi;

// 	var scale_computed = 39.37 * 96 * resolution;
//     scale_computed = Math.round(scale_computed);
	
// 	console.log("scale_computed");
// 	console.log(scale_computed);
	
	view.setResolution(resolution);
}


LdpMap.prototype.getCenter = function() {
// console.log("getCenter");
	var view = this.map.getView();
	var center = view.getCenter();

	var centro = {};
	centro.X = center[0];
	centro.Y = center[1];
	
	return centro;
}


LdpMap.prototype.getCenterDataProjection = function() {
// console.log("getCenter");
	var view = this.map.getView();
	var center = view.getCenter();

	var center_data = ol.proj.transform([center[0] , center[1]], this.mapProjection, this.dataProjection);

	var centro = {};
	centro.X = center_data[0];
	centro.Y = center_data[1];
	
	return centro;
}


LdpMap.prototype.getWidth = function() {
// console.log("getWidth");
	var view = this.map.getView();
	var extent = view.calculateExtent();
	var width= ol.extent.getWidth(extent);
	return width;
}

LdpMap.prototype.getHeight = function() {
// console.log("getWidth");
	var view = this.map.getView();
	var extent = view.calculateExtent();
	var height= ol.extent.getHeight(extent);
	return height;
}


LdpMap.prototype.setCenter = function(x,y) {
// console.log("setCenter");
	if (!isNaN(parseFloat(x)) && !isNaN(parseFloat(y))){
		var view = this.map.getView();
		var centro = ol.proj.transform([parseFloat(x) , parseFloat(y)], this.dataProjection, this.mapProjection);
	// console.log(scale+ ":" +resolution);
		view.setCenter(centro);
	}
}


// fa il fit di una wkt in un certo crs e con una cornice di padding di pixelPadding pixel.
LdpMap.prototype.fit = function(wkt, crs, pixelPadding) {
	if ( typeof crs == "undefined" ) crs = "EPSG:3003";
	if ( typeof pixelPadding == "undefined" ) pixelPadding = 0;
	
	var view = this.map.getView();
	var viewProjectionCode = view.getProjection().getCode();
	var size = this.map.getSize();
	// console.log("map.fit: view",view);
// 	console.log("wkt",wkt,"viewProjectionCode",viewProjectionCode,"size",size,"crs",crs,"pixelPadding",pixelPadding);
	
	var format = new ol.format.WKT();
	var feature = format.readFeature(wkt, {
	dataProjection: crs,
	featureProjection: viewProjectionCode
	});
	// console.log("feature",feature);
	view.fit( feature.getGeometry(), size, { padding: [pixelPadding, pixelPadding, pixelPadding, pixelPadding] } );
}


//Aggiorna la source del layer
LdpMap.prototype.refreshMapLayer = function(ol_layer) {
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




// LdpMap.prototype.mapRefresh = function() {
// // 	this.map.setView(this.map.getView());
// };


LdpMap.prototype.getMapLayer = function(ol_layer) {
	var layer=null;
	var map_ol_layers=this.map.getLayers();
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==ol_layer) {
			layer=item;
		}
		
	},this);

	return layer;
}


LdpMap.prototype.getMapLayers = function(ol_layer) {
	return this.map.getLayers();
}


LdpMap.prototype.getMapLayerSource = function(ol_layer) {
	var source=null;
	var map_ol_layers=this.map.getLayers();

	map_ol_layers.forEach(function(item,index){

		if(item.get('name')==ol_layer) {
			source=item.getSource();
		}

	},this);

	return source;
}


LdpMap.prototype.addRedlineWKT = function(ol_layer,wkt,clear_before) {
	clear_before = (typeof clear_before !== 'undefined') ?  clear_before : true;
	
	var redline = this.getMapLayer(ol_layer);

	//Fallback, se il layer passato non è definito si disegna sul redline
	if(redline == null) {
		var redline = this.getMapLayer("redline");
	}
	
	//Si ripulisce il redline precedente
	if(clear_before) {
		redline.getSource().clear();
	}
	
	var formatWKT=new ol.format.WKT();
	var feature=formatWKT.readFeature(wkt);

	feature.getGeometry().transform(this.dataProjection, this.mapProjection);
	redline.getSource().addFeature(feature);
	
};


LdpMap.prototype.gmlToJson = function(xml) {
	var formatXML=new ol.format.GML();
	var feature=formatXML.readFeatures(xml);
	
	return feature;
};


LdpMap.prototype.clearRedline = function(ol_layer) {
	var redline = this.getMapLayer(ol_layer);
	redline.getSource().clear();
};

LdpMap.prototype.creaTempLayer = function (nomeLayer,fill_color,stroke_color, spessore_stroke) {

	//Se il layer è già presente non si crea nuovo, skip
	var redline = this.getMapLayer(nomeLayer);
	if(redline!=null) {
		return;
	}
	
	//Layer temporaneo
	var fill_templayer=new ol.style.Fill({
		// il parametro color può essere una stringa o un array di valori rgb o rgba
		color: fill_color
	});
	var stroke_templayer=new ol.style.Stroke({
		color: stroke_color,
		width: spessore_stroke
// 		width: 2 // 2020-03-02 fissato, per permettere più flessibilità nell'impostare il parametro che nel vecchio viewer è la dimensione del simbolo
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
		name:nomeLayer
	});
	
	
	this.map.addLayer(tempLayer);
	this.ol_map_layers.push(nomeLayer);
// console.log("aggiunto layer temporaneo "+nomeLayer);
};

LdpMap.prototype.addLabelInLayer = function(nomeLayer,wkt,labelText,size, angle,clear){
	
	var templayer = this.getMapLayer(nomeLayer);
	
	if (clear){
		this.clearTempLayers(nomeLayer);
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

LdpMap.prototype.clearTempLayers = function(nomeLayer,clear_ol_layers) {
	if (typeof clear_ol_layers == 'undefined') {var clear_ol_layers=true;}
	
	if (clear_ol_layers==true) {
		this.clearRedline('drawing');
		this.clearRedline('redline');
		this.clearRedline('selection');
		this.clearRedline('measure');
		this.removeMeasureTooltip();
	}
	
	//Nel caso in cui non venga passato il nome del layer ed esistano anche i layer temporanei vanno svuotati tutti
	if (typeof nomeLayer == "undefined") {
		var templayer = this.getMapLayer("tmp_punti");
		if(!empty(templayer)){
			this.clearRedline("tmp_punti");
		}

		var templayer = this.getMapLayer("tmp_linee");
		if(!empty(templayer)){
			this.clearRedline("tmp_linee");
		}
		
		var templayer = this.getMapLayer("tmp_poligoni");
		if(!empty(templayer)){
			this.clearRedline("tmp_poligoni");
		}
	}
		
	
	if(!empty(nomeLayer)){
// 		si controlla che esista il layer 
		var templayer = this.getMapLayer(nomeLayer);
		if(!empty(templayer)){
			this.clearRedline(nomeLayer);
		}
	}
};


LdpMap.prototype.addWmsLayer = function(wms_url, layersData, i, style_name, format){
	if (typeof format == "undefined" || format == '')
		format = 'image/png';
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
		
		var wmsSource = new ol.source.TileWMS({
			url: wms_url,
			params: {'LAYERS': wms_layer, 'FORMAT':format, 'STYLES' : style_name},
			projection: this.dataProjection
		});
		
		var wmsLayer = new ol.layer.Tile({
			source: wmsSource,
			name: wms_layer
		});
		
		this.map.addLayer(wmsLayer);
		this.WmsLayerAdded = true;
	}
}


LdpMap.prototype.addWmsInternalLayer = function(wms_url, layersData, i, style_name, format){
	if (typeof format == "undefined" || format == '')
		format = 'image/png8'; // supportato nel nostro geoserver
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
				url: LdpViewer_proxy,
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
	}
}





LdpMap.prototype.customWmsLayerViewToggle = function(layer_name, visible){
	
	var map_ol_layers=this.map.getLayers();
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==layer_name) {
			selectLayer=item;
		}
		
	},this);
		
	selectLayer.setVisible(visible);
}


//callback tooltip
function getTooltip (response){
	var geojsonFormat = new ol.format.GeoJSON();
	
	//response è un oggetto geoJson
	features=geojsonFormat.readFeatures(response);

	if(features.length > 0) {

		//Per generare il tooltip mi prendo solamente la prima feature dell'array
		feature=features[0];

		//Mi ricavo il nome del layer
		fid=feature.getId();

		a_fid=fid.split(".");
		nome_layer=a_fid[0];
		id_feature=a_fid[1];

		//Mi ricavo gli attributi
		properties=feature.getProperties();

		// Se properties.id non esiste lo aggiungo, definendolo come la primary_key (dovrebbe servire solo se "Expose primary keys" non è impostato nel data store)
		if ( typeof properties.id == "undefined" ) {
			properties.id=id_feature;
		}
		
		
		//Questo è dovuto al fatto che non sempre il nome del layer del wms è uguale al nome del feature source (tabella)
		//Mi devo ricavare il nome del layer a cui appartiene la feature
		//Nel caso particolare in cui più layer fanno riferimento alla stessa tabella del db, prendo solo il primo layer trovato
		layer_tooltip="";
		
		a_layers_tooltip=ol_layer.list_layers_tooltip.split(",");

		for (i=0;i<a_layers_tooltip.length;i++) {
			//Ciclo sui layers

			if(ol_layer.layers_info[a_layers_tooltip[i]].feature_name!=undefined) {

				if (ol_layer.layers_info[a_layers_tooltip[i]].feature_name==nome_layer) {
					layer_tooltip=a_layers_tooltip[i];
					break;
				}
			}
		}

// 		console.log(layer_tooltip);
		if(layer_tooltip!='') {

			stringa_tooltip = ol_layer.layers_info[layer_tooltip].tooltip.replace(/%\w+%/g, function(all) {
				return eval("properties."+all.replace(/%/g,''));
			});

			html_tooltip = '<strong>'+stringa_tooltip+'</strong>';

			if(ol_layer.layers_info[layer_tooltip]!=undefined && ol_layer.layers_info[layer_tooltip].hyperlink!=undefined) {html_tooltip +="<br/>CTRL + click o tieni premuto per consultare le informazioni";}

			tooltip_content.innerHTML = html_tooltip;
			tooltip_content.html(html_tooltip);
			tooltip_overlay.setPosition(coordinate);
		}
	}
}


LdpMap.prototype.addingLayer = function(layer){
	this.map.addLayer(layer);
}


LdpMap.prototype.mapSetTracking = function(value){
	/*Geolocation*/
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
			console.log("result: " + ev.data.result);
			
			if(!isNaN(parseFloat(ev.data.result[0])) && !isNaN(parseFloat(ev.data.result[1]))) {
				ev.source.close();
				
				var center = ol.proj.transform(ev.data.result, 'EPSG:4326', 'EPSG:3003');
				positionFeature.setGeometry(new ol.geom.Point(center));
						
				that.map.getView().setCenter(center);
			} else {
				ev.source.close();
				var mess = 'Errore nella geolocalizzazione sulla mappa.\nControllare le impostazioni del proprio browser.\nÉ necessario consentire l\'apertura di finestre popup da parte della pagina che si sta visualizzando.';
				alert(mess);
			}
			
			
		}
	}
	
	
	///Fallback in caso di unsecure origin (http)
	geolocation.on('error', function(error) {
// 		console.log('Errore geolocation');
// 		console.log(error.message);
		
			var index = Math.floor(Math.random() * 900000000) + 100000000;
			
			window.addEventListener("message", geolocationReturnMessage,{once: true});
			
			var child = window.open("https://geolocation.ldpgis.it/get_position.php?key=VAAGgq20MfG9lezhyzmLc3NLDsmefg07Z4NFqQ2GKMoxvRTlzh&index="+index, "geolocation_window");
			
			
			setTimeout(function() {
				try {
					
					if ((typeof child == 'undefined') || (child == null) || child.closed) {
						var mess = 'Impossibile effettuare la geolocalizzazione sulla mappa.\nControllare le impostazioni del proprio browser.\nÉ necessario consentire l\'apertura di finestre popup da parte della pagina che si sta visualizzando.';
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
