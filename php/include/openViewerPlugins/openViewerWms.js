/**
 * JAVASCRIPT CLASSES TO HANDLE THE DATA FROM A WMS SERVER
 * 
 * Classes:
 * - ovWmsLayers: class to handle all the functionalities
 *
 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
 * @version: 1.0
 * @license: GNU General Public License v2.0
 */


/** MAIN CLASS: ovWmsLayers 
 * ---------------------------------------------------------------
 */
var ovWmsLayers = function(params) {
	// declared globally as ov_wms_plugin
	
	this.editWMSContainer			= $("#" + params.legend_wmsUser.container);
	this.editWMSselectorContainer	= $("#" + params.legend_wmsUser.wmsContainer);
	this.editOverlayMessages		= $("#" + params.legend_wmsUser.messages);
	this.inputWMSUrl				= $("#" + params.legend_wmsUser.inputUrl);
	this.inputFilterText			= params.legend_wmsUser.inputFilter;
	this.editWmsLayersSelector		= params.legend_wmsUser.layersSelector;
	
	this.internalWmsURL				= params.wmsInternalUrl; // internal WMS url
	
	this.showGetCapButton			= params.flagShowGetCapButton  // display the "GetCapabilities" in the window to add WMS on-the-fly layers

	// service variables
	this.mapClass = undefined;
    this.stato = undefined;
	this.correctionOffsetScaleMin = null;
	this.correctionOffsetScaleMax = null;
	this.userWmsLayersList = null;			// list of WMS layers returned by the AJAX call	(WMS layers loaded on the fly)
	this.userWmsURL = null;					// URL of the WMS called
	this.userWmsFormats = null;				// array of the formats supported by the WMS server
	this.userWmsInfoFormats = null;			// array of the feature info formats supported by the WMS server
	// UNUSED this.userWmsGetCapabilities	= null;		// panel to show the GetCapabilities of a WMS server
	// UNUSED this.userWmsQueryable = false;			// store the queryability of a wms layer
	
	this.WmsLayerAdded=false;
}

/** Retrive the information/capabilities associated to a WMS url - STEP 1 (call WMSuserLaunchScanUrl) */
ovWmsLayers.prototype.init = function(ovMap, ovStato, ovCorrOffsetScaleMin, ovCorrOffsetScaleMax){
	this.mapClass = ovMap;
    this.stato = ovStato;
	this.correctionOffsetScaleMin = ovCorrOffsetScaleMin;
	this.correctionOffsetScaleMax = ovCorrOffsetScaleMax;
}


/** HANDLING WMS SEARCH/SELECTION WINDOW
 * ---------------------------------------------------------------
 */

/* OVD ELIMINARE - WMSInternalCatalog function has been renamed WMSuserOpenCatalog * /
ovWmsLayers.prototype.WMSInternalCatalog = function(internalUrl){
    this.WMSuserOpenCatalog(internalUrl);
}
*/
/** Retrive the information/capabilities associated to a WMS url - STEP 1 (call WMSuserLaunchScanUrl) */
ovWmsLayers.prototype.WMSuserOpenCatalog = function(anUrl){
// 	$("#overlay_wms_selector_url").val(anUrl);
    this.inputWMSUrl.val(anUrl);
	this.WMSuserLaunchScanUrl(); // this.WMSuserLaunchScanUrl();
}
/** Retrive the information/capabilities associated to a WMS url - STEP 2 (call WMSuserScanUrlViaProxy) */
ovWmsLayers.prototype.WMSuserLaunchScanUrl = function(){
	var wms_url = this.inputWMSUrl.val();
	this.WMSuserScanUrlViaProxy(wms_url);
}
/** Retrive the information/capabilities associated to a Proxy WMS - STEP 3 (run an AJAX call) */
ovWmsLayers.prototype.WMSuserScanUrlViaProxy = function(wms_url){
	var that = this;
	var wms_url = wms_url.trim();
ov_utils.ovLog(wms_url, 'WMS Server queryied:'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	that.editWMSselectorContainer.append("<span class='fa fa-spinner fa-spin'></div>");
	
	if ( ov_utils.ValidURL(wms_url) == true ) {
		$.ajax({
			url: OpenViewer_proxy,
			method: "POST",
			dataType: "json",
			//async: true,
			data: {'service_type': 'wms', 'service_url': wms_url, 'action': 'GetCapabilities'},
			success: function(ret) {
// ov_utils.ovLog(ret, 'AJAX success'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
                if ( typeof ret == 'undefined' || typeof ret.success == 'undefined' || ret.success == false ) {
						that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_impossiblegetlayersfromurl+'</span>','warning',true);
						that.editWMSContainer.scrollTop(0);
				} else {
						that.editWMSselectorContainer.empty("");
						
						that.userWmsLayersList = ret.data;
						that.userWmsURL = wms_url;
						that.userWmsFormats = ret.formats;
						//that.userWmsQueryable = ret.queryable;
						that.userWmsInfoFormats = ret.gfi_formats;
						
						that.editWMSselectorContainer.html('<div id="ov_wms_selector_filter"><input id="'+that.inputFilterText+'" placeholder="'+strings_interface.wms_filterlayers+'" title="'+strings_interface.wms_filterlayers+'"/></div>');
						that.editWMSselectorContainer.append('<div id="'+that.editWmsLayersSelector+'"></div>');
						that.WMSuserShowAvailableData();
						$("#"+that.inputFilterText).on("keyup", function() { that.WMSuserShowAvailableData(); } );
				}
			},
			error: function(xhr, status, error) {
ov_utils.ovLog(xhr.responseText, 'AJAX Error', 'error', false); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
				that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_impossiblegetlayersfromurl+'</span>','warning',true);
				that.editWMSContainer.scrollTop(0);
			}
		});

	} else {
		that.editWMSselectorContainer.empty("");
		that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_invalidurl+'</span>','warning',true);
		that.editWMSContainer.scrollTop(0);
	}
}
/** Show the list of available WMS layer as a table - STEP 4 */
ovWmsLayers.prototype.WMSuserShowAvailableData = function(){
    var that = this;
    
    var flagTwoLinesVersion = true;
	var layersData = that.userWmsLayersList;
	var gfi_formats = that.userWmsInfoFormats;
	var wms_url = that.userWmsURL;
	var hash = ov_utils.hashCode(wms_url);
	
	var filterText = $('#'+that.inputFilterText).val();
	filterText = filterText.toLowerCase();
	var abs_class=""
	//var img_scroll="<td class=\"scroll_y\">";
	var html = '';
	var img_html= '';
	
	// OVD added the visualization of the "get capabilities" 
	// --------------------------------------------------------------------------------
    if(that.showGetCapButton) {
		html += '<table id="overlay_wms_selector_layers_table"><tr><td>';
		html += '<div id="overlay_wms_selector_layers_get_capabilities"></div>';
		html += '</td></tr></table>';
	}
	
	// OVD added the visualization of the supported coordinates systems 
	// --------------------------------------------------------------------------------
	// We assume that the CRS supported by the server are the same for each layer
	// then we only look to the supported CRSs of the first layer found (layersData[0])
	html += '<table id="overlay_wms_selector_layers_table">';
	//html += '<thead><tr class="head"><th scope="col" id="CRSsupported">'+strings_interface.wms_supportedCRS+'</th></tr></thead>';
	
	// OVD start the main information table
	// --------------------------------------------------------------------------------
	var getCapTool_html = "<a id='overlay_wms_selector_layers_table_spec_getcapabilities' href='javascript:;' onclick='ov_wms_plugin.showWMSserverCapabilities(\""+that.userWmsURL+"\",\"overlay_wms_selector_layers_get_capabilities\","+that.showGetCapNewTab+")' title='"+strings_interface.wms_showhidestyle+"'>";
	getCapTool_html += strings_interface.sentence_servercapabilities;
	//getCapTool_html += "<span class='fa fa-eye'></span>";
	getCapTool_html += "</a>";
	
    if(that.showGetCapButton) {
		html += '<thead><tr class="head"><th scope="col" id="CRSsupported">'+strings_interface.wms_supportedCRS+'</th><th style="text-align:right">'+getCapTool_html+'</th></tr></thead>';
		html += '<tbody><td headers="CRSsupported" colspan="2">';
	} else {
		html += '<thead><tr class="head"><th scope="col" id="CRSsupported">'+strings_interface.wms_supportedCRS+'</th></tr></thead>';
		html += '<tbody><td headers="CRSsupported" colspan="1">';
	}
	if (layersData[0].crs_supported.includes(that.mapClass.mapProjection)) {
		html += '<div id="overlay_wms_selector_layers_table_crs_supported">';
		html += layersData[0].crs_supported.join(' ')+'</div></td></tbody>';
	}
	else if (layersData[0].crs_supported.includes('CRS:84')&&(that.mapClass.mapProjection=='EPSG:4326'||that.mapClass.mapProjection=='EPSG:3857'||that.mapClass.mapProjection=='EPSG:900913')) {
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
	html += '<th scope="col" id="layerstyles"><center>'+strings_interface.word_styles+'</center></th>';
	html += '<th scope="col" id="scalevisibility">'+strings_interface.word_visibility+'</th>';
	html += '<th scope="col" id="infoqueryability">'+strings_interface.word_queryability+'</th>';
	html += '<th scope="col" id="addlayer"><center>'+strings_interface.word_add+'</center></th>';
	//html += '<th>'+strings_interface.word_actions+'</th>';
	html += '</tr></thead>';
	html += '<tbody>';
	for (var i=0; i < layersData.length; i++) {
		
		var layer_name = layersData[i].name;  // that.userWmsLayersList[i].name;
		var layer_title = layersData[i].title; // that.userWmsLayersList[i].title;
		var layer_abstract = layersData[i].abstract.trim();
		// retrieve the "queryability" of the layer
		var layer_queryability = (layersData[i].queryable==1);
		var layer_gfiformats = gfi_formats.join(', ');
		var layer_minscale = layersData[i].min_scale; // minimum scale of visibility allowed by the server
		var layer_maxscale = layersData[i].max_scale; // maximum scale of visibility allowed by the server
// console.log('layersData[i]',layersData[i],'QUERYABLE',layersData[i].queryable, layer_queryability);
		
		if ( layer_title.toLowerCase().indexOf(filterText) == -1 && 
			layer_name.toLowerCase().indexOf(filterText) == -1 && 
			layer_abstract.toLowerCase().indexOf(filterText) == -1)
			continue;
			
		// calculate the minimum and maximum supported resolution
		//var correctionFactor = 0.00000001; // correction factor used to fix potential problems related to the visualization close to the scale constraints, and due to approximation on the calculation of "resolution"
		var scaleToResolution = that.mapClass.getMapView().getResolution()/that.mapClass.getScale();
		if (layer_minscale != undefined && layer_minscale != '' && layer_minscale > 0)
			layersData[i].minResolution = Math.max(that.mapClass.getMapView().getMinResolution(), (layer_minscale * scaleToResolution)+that.correctionOffsetScaleMin);
		else
			layersData[i].minResolution = that.mapClass.getMapView().getMinResolution();
        
		if (layer_maxscale != undefined && layer_maxscale != '' && layer_maxscale > 0 && layer_maxscale > layer_minscale)
			layersData[i].maxResolution = Math.min(that.mapClass.getMapView().getMaxResolution(), (layer_maxscale * scaleToResolution)+that.correctionOffsetScaleMax);
		else
			layersData[i].maxResolution = that.mapClass.getMapView().getMaxResolution();
		            
		//layersData[i].minZoom = that.mapClass.getMapView().getZoomForResolution(layersData[i].maxResolution);
		//layersData[i].maxZoom = that.mapClass.getMapView().getZoomForResolution(layersData[i].minResolution);
// console.log(layer_title+':\n- min resolution '+layersData[i].minResolution +'\n- max resolution '+layersData[i].maxResolution +'\n- min scale '+layer_minscale +'\n- max scale '+layer_maxscale +'\n- scaleToResolution '+scaleToResolution );
		
		
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
			var wms_url_internal = that.internalWmsURL;
/* OVD OLD VERSION - DELETE
			if(wms_url == wms_url_internal) {
				var scala=""; //Non serve?
				var returned_img = that.getWMSlegendViaProxy(wms_url, scala, layer_name,'wms');
			
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.WMSuserDefinePropertiesLayerToBeAdded(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='layerstyles' class='nowrap'><a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='data:image/png;base64," + returned_img + "' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> "+strings_interface.wms_showhidestyle.toLowerCase()+"</a><br/>";
			} else if (false) {
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.WMSuserDefinePropertiesLayerToBeAdded(\"" + wms_url + "\", \"" + i + "\", \"" + layersData[i].styles[style_name].name + "\")' title='Aggiungi questo layer alla mappa'><span class='fa fa-plus-circle'></span> aggiungi</a></div></td><td headers='layerstyles' class='nowrap'><a href='javascript:;' onclick='open_viewer.openCloseDiv(\"img_"+ hash + "_" + i +"\")'><img id='img_" + hash + "_" + i +"' src='"+layersData[i].styles[style_name].legend_url_href+"' class='hide' style='width: \'"+ layersData[i].styles[style_name].legend_url_width + "\'px; height: \'" + layersData[i].styles[style_name].legend_url_height + "\' px;/><span class='fa fa-eye'></span> "+strings_interface.wms_showhidestyle.toLowerCase()+"</a><br/>";
			}
*/
            if(wms_url == wms_url_internal) { // wms_url is the URL selected by the user, from which we must retrieve the layers
				var scala="";
				var returned_img = that.getWMSlegendViaProxy(wms_url, scala, layer_name,'wms');
                var img_source_html = " src='data:image/png;base64," + returned_img+"' ";
			
/* OVD OLD VERSION - DELETE
				// fill column "ADDLAYER"
				html += '<td headers="addlayer"><center>';
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.WMSuserDefinePropertiesLayerToBeAdded(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'/><span class='fa fa-plus-circle'></span>";
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
				html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='open_viewer.WMSuserDefinePropertiesLayerToBeAdded(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'><center><span class='fa fa-plus-circle'></span>";
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
				//legend_html += "<img id='img_" + hash + "_" + i +img_source_html+" class='hide' style='width: "+ style_leg_width + "px;'/><span class='fa fa-eye'></span>";
				legend_html += "<span class='fa fa-eye'></span>"+"<img id='img_" + hash + "_" + i +img_source_html+" class='hide' style='width: "+ style_leg_width + "px;'/>";
				//legend_html += " "+strings_interface.wms_showhidestyle.toLowerCase();
				legend_html += "</a>";
			} else {
				legend_html = strings_interface.wms_notavailable.toLowerCase();
			}
			
			// fill column "LAYERSTYLES"
			html += "<td headers='layerstyles' class='nowrap'><center>" + legend_html + "<br/>";
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
			
			// fill column "QUERYABILITY" (SUPPORTED FORMATS)
			html += '<td headers="infoqueryability">';
            if(layer_queryability) html += strings_interface.word_queryableas+'<br>'+gfi_formats.join('<br>');
            else html += strings_interface.word_no;
			html += '</td>';
            
//            var layer_queryability = (layersData[i].queryable='1');
//		var layer_gfiformats = gfi_formats.join(', ');

			
			// fill column "ADDLAYER"
			html += '<td headers="addlayer"><center>';
			html += "<div><a class='overlay_wms_selector_layers_layer_add nowrap' href='javascript:;' onclick='ov_wms_plugin.WMSuserDefinePropertiesLayerToBeAdded(\"" + wms_url + "\", \"" + i + "\", \"" + style_name + "\", \"" + style_leg_url + "\")' title='"+strings_interface.sentence_addlayertomap+"'><center><span class='fa fa-plus-circle'></span>";
			//html += " "+strings_interface.sentence_addtomap.toLowerCase();
			html += "</a></div></center></td>";
			
		}
//		html += '</center></td>';
	
        html += '</tr>';
        
		// fill row "DESCRIPTION" (2 lines version)
		if(flagTwoLinesVersion && layer_abstract != '') {
			html += '<tr><td '+abs_class+' colspan=6><span id="overlay_wms_selector_layers_table_description">'+strings_interface.word_description+':<br>'+layer_abstract + '</span></td></tr>';
		}
	
	}
	
	html += '</tbody>';
	html += '</table>';
	
	$('#'+that.editWmsLayersSelector).html(html);
}


/** WMS LAYERS INTEGRATION (ADD/REMOVE)
 * ---------------------------------------------------------------
 */
/** Add a WMS layer to the map (call addWmsLayer/addWmsInternalLayer)
 *  - define the "best" image format among those supported by the source WMS server
 *  - define the "best" info format to exchange the feature attribute information among those supported by the source WMS server
 *  - derive the name and title of the layer
 *  - call the addWmsLayer/addWmsInternalLayer procedure to add the layer to the OpenLayers map_index
 *  - update the themes legend
 */
ovWmsLayers.prototype.WMSuserDefinePropertiesLayerToBeAdded = function(wms_url, i, style_name, style_url){
	if (typeof style_url == 'undefined') style_url='';
	
	var layersData = this.userWmsLayersList;
	var formats = this.userWmsFormats;
	var gfi_formats = this.userWmsInfoFormats;
	
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
	
	var gfi_formats = this.userWmsInfoFormats;
	//var is_queryable = this.userWmsQueryable;
	// set the best get_fature_info format among the supported ones (priorities: javascript, plain)
	var gfi_format = 'unsupported';
	gfi_formats.forEach(function(f) {
		if (f == 'text/javascript')
			gfi_format = 'text/javascript'; // this format is parsed
	});
	if (gfi_format == 'unsupported') {
		gfi_formats.forEach(function(f) {
			if (f == 'text/plain')
				gfi_format = 'text/plain'; // this format is parsed
		});
	}
	if (gfi_format == 'unsupported') {
		gfi_formats.forEach(function(f) {
			if (f == 'text/xml')
				gfi_format = 'text/xml'; // this format is displayed as is
		});
	}
	if (gfi_format == 'unsupported') {
		gfi_formats.forEach(function(f) {
			if (f == 'application/geojson')
				gfi_format = 'application/geojson'; // this format is displayed as is
		});
	}
	if (gfi_format == 'unsupported') {
		gfi_formats.forEach(function(f) {
			if (f == 'text/html')
				gfi_format = 'text/html'; // this format is displayed as is
		});
	}
	if (gfi_format == 'unsupported') {
		gfi_formats.forEach(function(f) {
			if (f == 'text/gml')
				gfi_format = 'text/gml'; // this format is displayed as is
		});
	}
	
	var hash = ov_utils.hashCode(wms_url);
	var layer_name = layersData[i].name;
	var layer_title = layersData[i].title;
	
	// add the layer to OpenLayers, using procedures defined inside the "map" class
	if(wms_url == wms_url_internal) {
		var newLayer = this.addWmsInternalLayer(wms_url, layersData, i, style_name, format, gfi_format);
	} else {
		var newLayer = this.addWmsLayer(wms_url, layersData, i, style_name, format, gfi_format);
	}
	//if (typeof newLayer != "undefined" && newLayer != '') newLayer.set('legendUrl','uffa'); //style_url);
	
	var responseMsg = '';
	var responseType = 'ok';
	
	if (layersData[i].crs_supported.includes(this.mapClass.mapProjection)) {
		// nothing to do
	}
	else {
		// update the response string with a notification related to the automatic reprojection of data
		responseMsg += strings_interface.sentence_layerwillbereprojected+'<br>';
		//responseType = 'warning';
		responseType = 'ok';
	}
	
	if(this.WmsLayerAdded != true) {
		// update the response string with a notification about the existance of a layer with the same name
		responseMsg += strings_interface.sentence_layeraleradyexisting+'<br>';
		responseType = 'warning';
		this.printMessages(this.editOverlayMessages,'<span>'+responseMsg+'</span>',responseType,true);
	}
	else {
		var layerCrs = newLayer.getSource().getProjection().getCode();
		
		// update the response string with a notification about the successfully adding of the layer
		responseMsg += strings_interface.sentence_layeradded+'<br>';
		this.printMessages(this.editOverlayMessages,'<span>'+responseMsg+'</span>',responseType,true);
	
        /* OVD - UNUSED AND PROBABLY USELESS
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
		*/

		if(wms_url == wms_url_internal) {
			var scale=''; // needed?
			var returned_img = ov_wms_plugin.getWMSlegendViaProxy(wms_url, scale, layer_name,'wms');
			
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
/** Add a new user WMS layer - WMS LAYERS INTEGRATION
 *  - wms_url is the url of the analyzed WMS server
 *  - layersData contains the information of all layers available at "wms_url"
 *  - i is the choosen layer
 *  - style_name is the name of the style (thematization legend) of the choosen layer
 *  - format is the format used to "exchange" the map
 *  - gfi_format is the foramt used to "exchange" the information related to a spcific feature of the layer (GetFeatureInfo)
 */
ovWmsLayers.prototype.addWmsLayer = function(wms_url, layersData, i, style_name, format, gfi_format) {
ov_utils.ovLog('INPUT\n-----------------\nlayersData\n'+i,layersData[i], '\nstyle_name >',style_name, 'Adding WMS layer'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	
	var that = this;
	
	if (typeof format == "undefined" || format == '')
		format = 'image/png';
	var is_queryable = false;
	if (typeof layersData[i].queryable != "undefined"&&(layersData[i].queryable==1||layersData[i].queryable=='1')) is_queryable = true;
	if (typeof gfi_format == "undefined" || gfi_format == '') gfi_format = 'unsupported';
	
	var wms_ol_layer_name = layersData[i].name; 
	var wms_group_name = 'group_'+wms_ol_layer_name; 
	var wms_layer_name = 'layer_'+wms_ol_layer_name; 
	var wms_group_layer_label = layersData[i].title;
    var wms_feature_name = layersData[i].name;
	
	//var scale_min = parseInt(layersData[i].min_scale)
	//var scale_max = parseInt(layersData[i].max_scale)
	var legend_url = layersData[i].styles[style_name].legend_url_href;
	var legend_width = layersData[i].styles[style_name].legend_url_width;
	if(typeof legend_width == 'undefined' || legend_width == '') legend_width = '';
	var exist = false;
	var map_ol_layers=that.mapClass.getMapLayers(); //getLayers();
	
	map_ol_layers.forEach(function(item,index){
		if(item.get('name')==wms_ol_layer_name) { // wms_title wms_name
			exist=true;
		}
	},that);

	if(exist == true){
		that.WmsLayerAdded = false;
		ov_utils.ovLog('... '+wms_ol_layer_name+' already existing!', 'Adding WMS layer', 'warning'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	}

	else{
		
		// OVD change: previously the projection was set as this.dataProjection
        //             now it is set to this.mapClass.mapProjection, if it is supported,
        //             otherwise to CRS:84,if the map projection is EPSG:4326, EPSG:3857 or EPSG:900913 (SPECIAL CASE)
        //             otherwise to EPSG:4326 as a first alternative
        //             otherwise to the first supported projection
		if (layersData[i].crs_supported.some( aCrs => aCrs === that.mapClass.mapProjection ))
			var layerCrs = that.mapClass.mapProjection;
		else if (that.mapClass.mapProjection=='EPSG:4326'||that.mapClass.mapProjection=='EPSG:3857'||that.mapClass.mapProjection=='EPSG:900913')
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

// console.log('WMS layer added:\n- '+wms_ol_layer_name+'\n- '+layerCrs+' layer projection\n- '+this.mapClass.getView().getProjection().getCode()+' map projection')
            
		var wmsSource = new ol.source.TileWMS({
                url: wms_url,
			params: {'LAYERS': wms_feature_name, 'FORMAT':format, 'STYLES' : style_name},
			projection: layerCrs // OVD this.dataProjection
		});
		
		// define the new layer
        var layerMinResolution = layersData[i].minResolution;
        var layerMaxResolution = layersData[i].maxResolution;
		var wmsLayer = new ol.layer.Tile({
			source: wmsSource,
			opacity: 1,//0.7,  // from 0 to 1
			// zIndex: 1000,
			// minZoom: layersData[i].minZoom,
			// maxZoom: layersData[i].maxZoom,
			minResolution: layerMinResolution,
			maxResolution: layerMaxResolution,
			name: wms_ol_layer_name,
			wmsUserLayer: true,
			legendUrl: legend_url,
			legendWidth: legend_width
		});
		
		// add the new layer to OpenLayers        
		this.mapClass.map.addLayer(wmsLayer); // OL object "map" defined inside the class "this.mapClass"
		that.WmsLayerAdded = true;
		
		// define the "properties" of the new stato-item (macro-layer)
		// - it is a group with a single layer inside
		// - the show/hide functionality works on the whole group
		var new_stato_item_id = wms_ol_layer_name;
		var single_group_name = wms_group_name;
		var single_layer_name = wms_layer_name;
		
		// define the ID of the new "macro-layer" (it must be different from the existing ones)
		var a_StatoItems=Object.keys(that.stato); // list of existing macro-layers
		var i = 0;
		do {
			if(i>0) new_stato_item_id=new_stato_item_id+'_'+i;
			i++;
		}
		while (a_StatoItems.includes(new_stato_item_id));
        
		var new_data_source =	{
								'tipo': 'wms_onthefly',
								'url':  wms_url,
                                'gfi_format': gfi_format,
								'layers_info':	{
										[single_layer_name]:	{
														'min_scale': undefined,
														'max_scale': undefined,
														'min_Resolution': layerMinResolution, // new property
														'max_Resolution': layerMaxResolution, // new property
														'tooltip': undefined,
														'hyperlink': undefined,
														'selectable': is_queryable,
														'visible': true,
														'legend_label': wms_group_layer_label,
														'image_legend_layer': wms_ol_layer_name,
														'feature_name': wms_feature_name,
														'group': single_group_name
													}
												},
								'groups_info':	{
                                        [single_group_name]:	{
														'visible': true,
														'legend_label': wms_group_layer_label,
														'expanded': false
													}
												}
								};
		that.addLayerToMainLayersObject(new_stato_item_id, new_data_source);
		
		ov_utils.ovLog(new_data_source, wms_ol_layer_name+' added'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
		open_viewer.refreshLegend();
		return wmsLayer;
	}
}
/** Add a new group/layer to the "stato" object ("stato" contains the settings of all main layers, MapGuide, WMS, ...) */
ovWmsLayers.prototype.addLayerToMainLayersObject = function(aMacroLayerID, aDataSource) {
	
	// retrieve the information of the new item
	var aSourceName = aMacroLayerID; 
	var aSourceType = aDataSource['tipo'];
	var aSourceUrl = aDataSource['url'];
	
	// initial checks
	if (!['wms','wms_geoserver','mapguide','wms_onthefly'].includes(aSourceType)) return false;
	
	// retrieve the current list of "main layers"
	var currentStatus = this.stato;
	
	// check if the "index" field is present, if not initialize it
	var listNameLayers=Object.keys(currentStatus);
	listNameLayers.forEach(function(itemName,index){
        var item = currentStatus[itemName];
        if(typeof item.map_index == 'undefined') {
            currentStatus[itemName]['map_index'] = index;
        } else {
        }
	});
	
	switch(aSourceType) {
		case 'wms_onthefly':		// add "on top" of all layers wms_onthefly
			
			// update the index of the existing ones
			listNameLayers.forEach(function(itemName,index){ currentStatus[itemName]['map_index'] += 1; });
			
			// set the index "0" - on top - to the new one
			if(typeof aDataSource.map_index == 'undefined') {
				aDataSource['map_index'] = 0;
            }
		break;
			
		default:
			// to be done
		break;
	}
	
	// add the new items to the "stato "object
	currentStatus[aMacroLayerID] = aDataSource;
ov_utils.ovLog(currentStatus, 'CurrentStatus updated:'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	this.mapClass.refreshStatus();
	
}
/** Add a new internal WMS layer - WMS LAYERS INTEGRATION
 *  - wms_url is the url of the "internal" WMS server
 *  - layersData contains the information of all layers available at "wms_url"
 *  - i is the choosen layer
 *  - style_name is the name of the style (thematization legend) of the choosen layer
 *  - format is the format used to "exchange" the map
 */
ovWmsLayers.prototype.addWmsInternalLayer = function(wms_url, layersData, i, style_name, format){
	if (typeof format == "undefined" || format == '')
		format = 'image/png8';
	var wms_layer = layersData[i].name;
	var wms_title = layersData[i].title;
	var exist = false;
	var map_ol_layers=this.mapClass.getMapLayers();
	
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
		
		this.mapClass.addLayer(wmsLayer);
		this.WmsLayerAdded = true;    
        return wmsLayer;
	}
}
/** Remove all WMS "user" layers - WMS LAYERS INTEGRATION */
ovWmsLayers.prototype.removeAllWmsUserLayers = function() {
	
	var that = this;
	
	// retrieve the list of OL layers
	var map_ol_layers=that.mapClass.getMapLayers();
	
	// loop on OL layers and make an array of all the WMS user layers
	var tmpWmsUserLayers = [];
	map_ol_layers.forEach(function(layer,index){
		if (layer.get('name') != undefined && layer.get('wmsUserLayer'))
			tmpWmsUserLayers.push(layer);
	},this);
	
	// remove all the WMS user layer
	for (i = 0; i < tmpWmsUserLayers.length; i++) {
	
		// remove the OL layer        
		element = tmpWmsUserLayers[i];
		that.mapClass.map.removeLayer(element);
		
		// update the "stato" variable
		var curStatus = that.stato;
		var layerToDelete = element.get('name');
		delete curStatus[layerToDelete]
	}
}


/** RETRIEVING SERVER/LAYER/FEATURES INFORMATION
 * ---------------------------------------------------------------
 */

/** Show in a new page the WMS Capabilities of a WMS Server
 *  - if div_id!=undefined      the GetCapabilities is open in a div inside the WMS Selector page
 *  - if flagOpenInNewTab==true the GetCapabilities is open as a new browser tab
 */
ovWmsLayers.prototype.showWMSserverCapabilities = function(serverUrl, div_id, flagOpenInNewTab){
ov_utils.ovLog('Retrieve information from\n'+serverUrl, 'Show Server Capabilities'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var that = this;
	
	// initial checks
    var flagShowInTheDiv = !flagOpenInNewTab;
    if(typeof div_id == 'undefined') flagShowInTheDiv = false;
	if(typeof flagOpenInNewTab == 'undefined') flagOpenInNewTab=false;
    if(!flagShowInTheDiv&&!flagOpenInNewTab) return false;
	
	// build the URL
	//var GCstr = 'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities';
	var GCstr = 'SERVICE=WMS&REQUEST=GetCapabilities';
	if(serverUrl.substr(serverUrl.length - 1)=='?') {
		serverUrl = serverUrl+GCstr;
	} else if (true) {
		if(serverUrl.indexOf('?')==-1) {
			serverUrl = serverUrl+'?'+GCstr;
		} else {
			if(serverUrl.substr(serverUrl.length - 1)!='&') {
				serverUrl = serverUrl+GCstr;
			} else {
				serverUrl = serverUrl+'&'+GCstr;
			};
		};
	};
	
	// check the URL
	if ( ov_utils.ValidURL(serverUrl) == false ) {
ov_utils.ovLog(strings_interface.sentence_invalidurl+'\n'+serverUrl, 'Show Server Capabilities'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
		that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_invalidurl+'<br>'+serverUrl+'</span>','warning',true);
	} else {
ov_utils.ovLog('GetCapabilities full URL\n'+serverUrl, 'Show Server Capabilities'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
		if(flagOpenInNewTab) window.open(serverUrl,'_blank');
	}
	
	if(flagShowInTheDiv) {
		// run the request and update the interface
		var divGetCapabilities = $("#" + div_id);
		divGetCapabilities.empty();
		
		$.ajax({
			url: OpenViewer_proxy,
			method: "POST",
			dataType: "json",
			data: {'service_type': 'wms', 'service_url': serverUrl, 'action': 'GetCapabilitiesText'},
			success: function(ret) {
				// option 1: it does not keep the carriadge return and it is difficult to read
				//var aMsg = String(ret.xml).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
				//divGetCapabilities.html(aMsg);
				
				// option 2: the format is not nice
				//divGetCapabilities.html('<pre><code>'+ret.xml+'</code></pre>');
				
				// option 3: the format is not nice
				//divGetCapabilities.html('<pre lang="xml><code>'+ret.xml+'</code></pre>');
				
				// option 4: it seems to work very well
				divGetCapabilities.html('<xmp>'+ret.xml+'</xmp>');
				
				returned = ret;
			},
			error: function() {
ov_utils.ovLog(strings_interface.sentence_problemsgetcapabilities+'\n'+serverUrl, 'Show Server Capabilities'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
				that.printMessages(that.editOverlayMessages,'<span>'+strings_interface.sentence_problemsgetcapabilities+'<br>'+serverUrl+'</span>','warning',true);
				return;
			}
		});
	}
}
/** Retrive the feature information from a WMS source, and call the callback function
 *  - "layerNameOL" is the name of the layer OpenLayers
 *  - "listSelectableLayers" can be a single layer or a comma separated list of layers defined inside "stato"
 *    and all contained inside the OpenLayers layer "layerNameOL"
 *  - for the WMS on-the-fly layer "listSelectableLayers" is the name of the layer inside "stato"
 */
/** Retrieve the bitmap of the legend for a WMS layer */
ovWmsLayers.prototype.getWMSlegendViaProxy = function(url, scala, layer, tipo) {

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
ovWmsLayers.prototype.getWmsInfoByCoordinates = function(layerNameOL, sourceOL, coordinates, mapResolution, mapProjection, infoFormat, listSelectableLayers, pointerType, touchBuffer, callbackFunction, flagNewSelection, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess) {
	
	if(typeof infoFormat == 'undefined'||infoFormat == '') infoFormat = 'text/javascript';
	//infoFormat = 'text/html'
	//infoFormat = 'text/xml'
	//infoFormat = 'text/plain'
	//infoFormat = 'application/json';
	//infoFormat = 'application/vnd.ogc.wms_xml';
	switch (infoFormat.toLowerCase()) {
		
		case 'text/javascript':
			//var params = {'INFO_FORMAT': 'text/javascript','QUERY_LAYERS': listSelectableLayers, 'format_options': 'callback:parseResponseSelect', 'propertyName': 'name'}
			if(pointerType=='mouse')    var params = {'INFO_FORMAT': infoFormat,'QUERY_LAYERS': listSelectableLayers, 'format_options': 'callback:parseResponseSelect'};
			else                        var params = {'INFO_FORMAT': infoFormat,'QUERY_LAYERS': listSelectableLayers, 'format_options': 'callback:parseResponseSelect', 'buffer': touchBuffer};
			var url = sourceOL.getFeatureInfoUrl( coordinates, mapResolution, mapProjection, params );
// console.log('URL',url);
// console.log('sourceOL',sourceOL);
// console.log('layerNameOL',layerNameOL);
			
			$.ajax({
				url: url,
				dataType: 'jsonp',
				jsonpCallback: 'parseResponseSelect'
			}).then(function(response) {
				if(response['features'].length>0) {
                    response.query_url = url;
					callbackFunction(response, infoFormat.toLowerCase(), layerNameOL, flagNewSelection, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess);
                    return true;
				} else {
					return false;
				}
			});
		break;
		
		case 'text/plain':
			var url = sourceOL.getFeatureInfoUrl( coordinates, mapResolution, mapProjection, params );
			// add INFO_FORMAT
			url += '&INFO_FORMAT='+infoFormat;
			// add FEATURE_COUNT to handle multiple features "below" the selected coordinates (otherwise it returns only the first one)
			url += '&FEATURE_COUNT=100';
// console.log('URL',url);
// console.log('sourceOL',sourceOL);
// console.log('layerNameOL',layerNameOL);
			
			$.ajax({
				url: OpenViewer_proxy,
				method: "POST",
				dataType: "json",
				//async: false,
				data: {'service_type': 'GetInfoText', 'service_url': url},
				success: function(ret) {
					if(ret!='') {
						callbackFunction(ret, infoFormat.toLowerCase(), listSelectableLayers, flagNewSelection, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess);
						return true;
					} else {
						return false;
					}
/*
					response = ret.datatext;
					if(response!='') {
						callbackFunction(response, infoFormat.toLowerCase(), listSelectableLayers, flagNewSelection, flagShowFeaturesAttributes, flagShowOnlyLastSelected, flagLastLayerToProcess);
					} else {
						return false;
					}
*/
				},
				error: function(xhr, status, error) {
ov_utils.ovLog(xhr.responseText, 'Get Info By Coordinates AJAX Error', 'error', false); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
					return false;
				}
			});
		break;
			
		default:
			
		break;
	}
	return false;
}
/** Callback of a new selection of features over a WMS layer, performed inside "ev_map_select" (the previous selection is deleted) */
ovWmsLayers.prototype.getWMSlayerSelection = function(response) {
ov_utils.ovLog('getWMSlayerSelection', response); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)

	var that = open_viewer; // as "this" does not work because it is a callback from another class
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=that.map.getMapLayerByName('selection');
	// clear previous selection
	selectOverlay.getSource().clear();
	
	// "response" is a geoJson object
	features=geojsonFormat.readFeatures(response,{dataProjection: that.map.dataProjection,featureProjection: that.map.mapProjection});
	if(features.length > 0) {
		selectOverlay.getSource().addFeatures(features);
	}

	// refresh the footer message with the number of selected features
	that.footerUpdateText();
ov_utils.ovLog('FINE','getWMSlayerSelection'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
}


/** OTHER PROCEDURES
 * ---------------------------------------------------------------
 */

/** Write a notification message on the WMS adding panel */
ovWmsLayers.prototype.printMessages = function(div,message,status,timeout){
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











/* OVD Previous version located in openViewer.js: this function has not yet checked, because no main data "WMS" available

/ ** Callback of a new selection of features over a WMS layer (the previous selection is deleted) * /
openViewer.prototype.getWMSlayerSelectionGGGGG = function(response) {
ov_utils.ovLog(response,'getWMSlayerSelection'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
	var that = open_viewer; // as "this" does not work because it is a callback from another class
	var geojsonFormat = new ol.format.GeoJSON();

	var selectOverlay=that.map.getMapLayerByName('selection');
	// clear previous selection
	selectOverlay.getSource().clear();
	
	// "response" is a geoJson object
	features=geojsonFormat.readFeatures(response,{dataProjection: that.map.dataProjection,featureProjection: that.map.mapProjection});
	if(features.length > 0) {
		selectOverlay.getSource().addFeatures(features);
	}

	// refresh the footer message with the number of selected features
	that.footerUpdateText();
ov_utils.ovLog('FINE','getWMSlayerSelection'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
}

*/

/** WMS LAYERS INTEGRATION - CURRENTLY UNUSED
 * ---------------------------------------------------------------
 */

/** OVD UNUSED REPLACED - Fill the "QueryResult" page with plain text, and open it
openViewer.prototype.openInfoWMS = function(response) {
console.log(response);
	var that = open_viewer;
	if (typeof ov_WMSGetFeatureInfoCustomPage !== "undefined") {
		this.loadInfoPage('tabQueryResult',ov_WMSGetFeatureInfoCustomPage, false, response);
	} else {
		this.loadInfoPage('tabQueryResult',this.infoPanel); // this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
		//var json = this.map.gmlToJson(response);
		var features = response.features;
		if(features.length > 0) {
			var html='<p>'+strings_interface.sentence_foundfeatures+' : '+features.length+'</p>';
			for(var i=0;i<features.length;i++) {
// console.log(features[i].geometry.type);
// console.log(features[i].properties);
				html = html + '<p>'+features[i].geometry.type+' ('+features[i].id+')</p>'; // strings_interface.word_feature
			
				// retrieve the feature attributes
				properties=features[i].properties;
				// format the attributes
				var html = html + this.createElementsFromJSON(properties);
			}
			
			setTimeout(function(){$("#ov_info_wms_container").html(html);}, 500);
			if (that.titleToggleInfo.hasClass("active")) {that.toggleInfo(0);} // OVD strange behviour
			
		}
	}
}
*/
/** OVD CURRENTLY UNUSED - Fill the "QueryResult" page with plain text, and open it
openViewer.prototype.openInfoExtWMS = function(response) {
	if (typeof ov_WMSGetFeatureInfoCustomPage !== "undefined") {
		this.loadInfoPage('tabQueryResult',ov_WMSGetFeatureInfoCustomPage, false, response);
	} else {
		this.loadInfoPage('tabQueryResult',this.infoPanel); // this.loadInfoPage('tabQueryResult','infoWMSGetFeatureInfo.php');
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


