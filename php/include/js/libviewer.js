/**
 * 
 * File: libviewer.js
 * 
 * Libreria di interazione con la mappa 
 * 
 * 
 * 
 */


if ( typeof LIBVIEWER_LOADED == 'undefined' || LIBVIEWER_LOADED != true ) {

// Parametri di configurazione Ldp
if ( typeof LdpConfig == 'undefined' ) {
	LdpConfig = { 
		LOGLEVEL: 5 ,
		REDLINEURL: '/mapguide/ldp/redline.php',
		AJAXTIMEOUT: 120000,
		AJAXVERYLONGTIMEOUT: 1200000,
		_POSITION: 'libviewer.js'
	};
}


/**
 * 
 * Function: empty
 * 
 * *Mobile: yes* 
 * Check if a variable is _undefined, null or empty_.
 * 
 * Parameters:
 * 	@param _var - the variable to check
 * 
 * Returns:
 * 	@returns {Boolean} *true* if the passed var is empty, *false* otherwise
 */
function empty(_var) {
	
	if ( (typeof _var == 'undefined') || (_var == null) || (_var == '') ) {
		return true;
	} else {
		return false;
	}
} 


/**
 *
 * Function: isset
 * 
 * *Mobile: yes* 
 * Check if a variable is _set and not null_.
 * 
 * Parameters:
 * 	@param _var - the variable to check
 * 
 * Returns:
 * 	@returns {Boolean} *true* if the variable is set and not null, *false* otherwise 
 */
function isset(_var) {
	
	try {
		if ( (typeof _var == 'undefined') || (_var == null) ) {
			return false;
		} else {
			return true;
		}
	} catch (error) {
		logger.e(error.message);
		return false;
	}
}

/**
 * 
 * Function: istrue
 * 
 * *Mobile: yes* 
 * Check if a variable is _set and true_.
 * 
 * Parameters:
 * 	@param _var - the variable to check
 * 
 * Returns:
 * 	@returns {Boolean} - *true* if the variable is set and true, *false* otherwise
 */
function istrue(_var) {
	
	if ( isset(_var) && (_var == true) ) {
		return true;
	} else {
		return false;
	}
}


// Se non è definita la variabile onMobile, di default la mettiamo a false
if ( typeof onMobile  == 'undefined') {
	onMobile = false;
}


// Compatibilità: se non è definita la classe LdpLogger, definiamone una fittizia
if ( typeof LdpLogger == 'undefined' ) {
	LdpLogger = function (options) {
		this.i = function() {};
		this.w = function() {};
		this.e = function() {};
	};
	
	LdpLogger.LOGLEVEL = {
		NONE: 0,
		ALERT: 1,
		ERROR: 2,
		WARNING: 3,
		DEBUG: 4,
		INFO: 5
	};
	
}

// 
// Se non è definita la variabile logger, inizializziamola
// Nel caso LdpLogger sia stato incluso, questa classe può essere utilizzata per il logging degli errori javascript
// Se invece LdpLogger è fittizia (vedi pezzo di codice precedente), logger semplicemente non fa nulla
if ( typeof logger == 'undefined' ) {
	
	logger = new LdpLogger();
	
	/*
	logger.setCliente('-');
	logger.setPackage('-');
	window.onerror = function(errorMsg, url, lineNumber) {
	    logger.e(errorMsg, url + ":" + lineNumber);
	    return true;
	};
	*/
}




/**
 * 
 * 
 * Section: libviewer functions
 * 
 * A set of function to talk with the ajax mapviewer or with the new LdP OpenLayers Viewer.
 * 
 * 
 */



/**
 * 
 * Function: viewerPointToWKT
 * 
 * *Mobile: yes* Converte l'oggetto point in *WKT*
 * 
 *  
 */
function viewerPointToWKT(point){
	
	var wkt = "POINT ("+point.X+" "+point.Y+")";
	
	return wkt;
}

/**
 * 
 * Function: viewerLinestringToWKT
 * 
 * *Mobile: yes* Converte l'oggetto Linestring in WKT
 * 
 *  
 */
function viewerLinestringToWKT(linestring){
	var wkt="LINESTRING (";
	for (var i=0;i<linestring.Count;i++){
		wkt=wkt+linestring.Point(i).X+" "+linestring.Point(i).Y+",";
	}
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt+")";
	return wkt;
}

/**
 * 
 * Function: viewerPolygonToWKT
 * 
 * *Mobile: yes* Converte l'oggetto polygon in WKT
 * 
 *  
 */
function viewerPolygonToWKT(polygon){
	var wkt="POLYGON ((";
	for (var i=0;i<polygon.Count;i++){
		wkt=wkt+polygon.Point(i).X+" "+polygon.Point(i).Y+",";
	}
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt+"))";
	return wkt;
}

/**
 * 
 * Function: pointToWKT
 * 
 * *Mobile: yes* Converte un punto definito dalle coordinate in WKT
 * 
 *  
 */
function pointToWKT(x,y){
	var wkt="POINT ("+x+" "+y+")";
	return wkt;
}

/**
 * 
 * Function: segmentToWKT
 * 
 * *Mobile: yes* Converte un segmento definito dalle coordinate dei suoi estremi in WKT
 * 
 *  
 */
function segmentToWKT(x1,y1,x2,y2){
	var wkt="LINESTRING ("+x1+" "+y1+","+x2+" "+y2+")";
	return wkt;
}

/**
 * 
 * Function: arrayPointToPolygonWKT
 * 
 * *Mobile: yes* Converte un array di point in un poligono WKT (il primo e l'ultimo punto devono coincidere)
 * 
 *  
 */
function arrayPointToPolygonWKT(punti){
	var wkt="POLYGON ((";
	for (i=0;i<punti.length;i++){
		wkt=wkt+punti[i].X+" "+punti[i].Y+",";
	}
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt+"))";
	return wkt;
}

/**
 * 
 * Function: arrayPointToLinestringWKT
 * 
 * *Mobile: yes* Converte un array di point in una linestring WKT
 * 
 *  
 */
function arrayPointToLinestringWKT(punti){
	var wkt="LINESTRING (";
	for (i=0;i<punti.length;i++){
		wkt=wkt+punti[i].X+" "+punti[i].Y+",";
	}
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt+")";
	return wkt;
}

/**
 * 
 * Function: sottraiArrayPointFromWKT
 * 
 * *Mobile: yes* Data una WKT di tipo polygon, ne genera una nuova sottraendo ad essa il poligono generato dall'array di punti passato
 * 
 *  
 */
function sottraiArrayPointFromWKT(wkt,punti){
	var stringa=",(";
	for (i=0;i<punti.length;i++){
		stringa=stringa+punti[i].X+" "+punti[i].Y+",";
	}
	stringa=stringa.slice(0,stringa.length-1);
	stringa=stringa+")";
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt.concat(stringa,")");
	return wkt;
}


/**
 * 
 * Function: sottraiWKTFromWKT
 * 
 * *Mobile: yes* Data una WKT di tipo polygon, ne genera una nuova sottraendo ad essa la wkt del buco
 * 
 *  
 */
function sottraiWKTFromWKT(wkt,wkt_hole){
	var stringa=wkt_hole.replace("POLYGON(",",");
	stringa=stringa.slice(0,stringa.length-1);
	wkt=wkt.slice(0,wkt.length-1);
	wkt=wkt.concat(stringa,")");
	return wkt;
}


/**
 * 
 * Function: WKTToPoint
 * 
 * *Mobile: yes* Converte la WKT in un oggetto point
 * 
 *  
 */
function WKTToPoint(wkt){
	var a=wkt.search(/\(/);
	stringa=wkt.substring(a+1,wkt.length-1);
	arraypunto=stringa.split(" ");
	var mypunto={X:arraypunto[0], Y:arraypunto[1]};
	//alert()
	return mypunto;
}


if (typeof open_viewer == 'object' && typeof open_viewer.getScaleToFit == 'function') {
	getScaleToFit=$.proxy(open_viewer.getScaleToFit,open_viewer);
} else {

/**
 * 
 * Function: getScaleToFit
 * 
 * *Mobile: yes* Dato il bounding box rende la scala da applicare facendo zoom nel centro della geometria, per farne il fit
 * 
 * marginFactor: 1.10 x avere il 10% di margine (deve essere > 1)
 * 
 * 
 */
function getScaleToFit(xmin, xmax, ymin, ymax, marginFactor) {
	
	if ( typeof logger != 'undefined' ) { logger.i("getScaleToFit()"); }
	
	try {
		if (isNaN(parseFloat(xmin)) || isNaN(parseFloat(xmax)) || isNaN(parseFloat(ymin)) || isNaN(parseFloat(ymax)))
			return NaN;
		
		marginFactor = (typeof marginFactor !== 'undefined' && !isNaN(parseFloat(marginFactor)) && marginFactor > 1) ? marginFactor : 1;
		var retScale = NaN;
		
		if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
			var width = top.main.ViewerFrame.mapFrame.GetMapWidth();
			var height = top.main.ViewerFrame.mapFrame.GetMapHeight();
			var scala = top.main.ViewerFrame.mapFrame.GetScale();
			var scala_orizz=(xmax-xmin)*marginFactor/width*scala;
			var scala_vert=(ymax-ymin)*marginFactor/height*scala;
			
			retScale = Math.max(scala_orizz,scala_vert);
		} else {
			
			/* FIXME */
			//var size = viewer.getSize();
			//var width = size.w;
			//var height = size.h;
			//var scala = viewer.getScale();
			
			var width = -1;
			var height = -1;
			
			retScale = viewer.getScaleForExtent(xmin, xmax, ymin, ymax);
		}
		
		if ( typeof logger != 'undefined' ) { logger.i('w: ' + width + ' h: ' + height + ' scale: ' + retScale); }
		
		return retScale;
	} catch (error) {
		if ( typeof logger != 'undefined' ) { logger.e(error); }
	}
	
	return 1000; // FIXME
}

}

/**
 * 
 * Function: isMapReady
 * 
 * *Mobile: yes*
 * 
 */
function isMapReady() {
	if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
		return (typeof top != 'undefined' && typeof top.main != 'undefined' && typeof top.main.ViewerFrame != 'undefined' && typeof top.main.ViewerFrame.mapFrame != 'undefined');
	} else {
		return (typeof viewer != 'undefined' && isset(viewer));
	}
}

if (typeof open_viewer == 'object') {
	function getSelectionXML() {
		return null;
	}
} else {
	function getSelectionXML() {
		return top.main.ViewerFrame.mapFrame.GetSelectionXML();
	}
}



if (typeof open_viewer == 'object') {
	
	getLayers=$.proxy(open_viewer.getMapGuideVisibleLayersNames,open_viewer);
	
} else {
	function getLayers(a,b) {
		var layers = top.main.ViewerFrame.mapFrame.GetLayers(a, b);
		return layers;
	}
}

/**
 * 
 * Function: getSelectedFeatures
 * 
 * 
 * 
 * @param xml
 * @param a_layers
 * @param callback
 * @param primary_key
 * @param extra_field
 */
if (typeof open_viewer == 'object' && typeof open_viewer.mapGetSelectedFeatures == 'function') {
	getSelectedFeatures=$.proxy(open_viewer.mapGetSelectedFeatures,open_viewer);
} else {

	function getSelectedFeatures(xml,a_layers,callback,primary_key,extra_field) {

		if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
			if (xml=='' || a_layers=='') {
				alert('Nessuna selezione');
				return;
			} else {
				if (a_layers.indexOf(',') == -1 && xml.indexOf(a_layers) == -1) {
					//si cerca un solo layer ed il suo nome non compare nell'xml. In realtà noi cerchiamo il nome del layer mentre nell'xml c'è il nome della tabella.
					//bisogna quindi stare attenti a che nomeLayer sia almeno una sottostringa del nome della tabella
					alert('Nessuna selezione nei layer: '+a_layers);
					return;
				}
			}
			if (typeof(primary_key)=="undefined") primary_key="id";
			if (typeof(extra_field)=="undefined") extra_field="";
			var params = new Array(
				"sessionId", top.main.ViewerFrame.mapFrame.GetSessionId(),
				"mapName", top.main.ViewerFrame.mapFrame.GetMapName(),
				"a_layers",a_layers,
				"callback",callback,
				"selection", xml,
				"primary_key", primary_key,
				"extra_field", extra_field
			);
			var pageUrl ="/mapguide/ldp/selection.php";
			top.main.ViewerFrame.formFrame.Submit(pageUrl,params,"scriptFrame");
		} else {
			if ( typeof logger != 'undefined' ) { logger.i('getSelectedFeatures() non ancora implementata su mobile'); }
		}
	}

}
/**
 * 
 * Function: setSelection_multilayer
 * 
 * 
 * 
 * usare solo per selezionare più di un oggetto in più di un layer
 * selection_string: layer1@primary_key1@id1,id2..idN|layer2@primary_key2@id1,id2..idN|..
 * 
 * 
 * 
 */
if (typeof open_viewer == 'object' && typeof open_viewer.setSelection_legacy == 'function') {
	setSelection_multilayer=$.proxy(open_viewer.setSelection_multilayer_legacy,open_viewer);
} else {
	function setSelection_multilayer(selection_string) {
		
		if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
			var params='mapName='+top.main.ViewerFrame.mapFrame.GetMapName()+'&sessionId='+top.main.ViewerFrame.mapFrame.GetSessionId()+'&selection_string='+selection_string;
			$.ajax({
				url: '/mapguide/ldp/setSelection_multilayer.php',
				data: params,
				//async: false,
				type: 'POST',
				dataType: 'html',
				timeout: 10000,
				error: function() {
					return false;
				},
				success: function(xmlData) {
					top.main.ViewerFrame.mapFrame.SetSelectionXML(xmlData);
				}
			});
		} else {
			if ( typeof logger != 'undefined' ) { logger.i('setSelection_multilayer() non ancora implementata su mobile'); }
		}
	}
}

/**
 * 
 * Function: setSelection_multi
 * 
 * 
 * usare solo per selezionare più di un oggetto
 * 
 * 
 * 
 */
function setSelection_multi(layer,ids,primary_key) {
	
	if ( typeof primary_key != 'undefined' && empty(primary_key) ) { primary_key="id"; }
	
	if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
		var params='mapName='+top.main.ViewerFrame.mapFrame.GetMapName()+'&sessionId='+top.main.ViewerFrame.mapFrame.GetSessionId()+'&layer='+layer+'&ids='+ids+'&primary_key='+primary_key;
		$.ajax({
			url: '/mapguide/ldp/setSelection_multi.php',
			data: params,
			type: 'POST',
			dataType: 'html',
			timeout: 10000,
			error: function() {
				return false;
			},
			success: function(xmlData) {
				top.main.ViewerFrame.mapFrame.SetSelectionXML(xmlData);
			}
		});
	} else {
		if ( typeof logger != 'undefined' ) { logger.i('setSelection_multi() non ancora implementata su mobile'); }
	}
}



/**
 * 
 * Function: setSelection
 * 
 * *Mobile: yes*
 * 
 * 
 */

if (typeof open_viewer == 'object' && typeof open_viewer.setSelection_legacy == 'function') {
	setSelection=$.proxy(open_viewer.setSelection_legacy,open_viewer);
} else {

	function setSelection(layer, ids, primary_key) {
		
		
		var mapSession = GetSessionId();
		if ( typeof mapSession != 'undefined' && empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( typeof mapName != 'undefined' && empty(mapName) ) { return false; }
		if ( primary_key === "undefined" || !primary_key ) { primary_key = "id"; }
		

		var params='mapName='+mapName+'&sessionId='+mapSession+'&layer='+layer+'&ids='+ids+'&primary_key='+primary_key;
	//  	alert(params);
		// non c'è success function perché il dataType è "script" ossia se tutto va bene viene eseguito il codice ritornato come fosse uno script javascript
		$.ajax({
			url: '/mapguide/ldp/setSelection.php',
			data: params,
			type: 'POST',
			dataType: 'script',
			timeout: 10000,
			error: function() {
				return false;
			}
		});
			
	}

}



/**
 * 
 * Function: clearSelection
 * 
 * 
 * 
 */
if (typeof open_viewer == 'object' && typeof open_viewer.mapClearSelection == 'function') {
	clearSelection=$.proxy(open_viewer.mapClearSelection,open_viewer);
} else {
	function clearSelection() {
		if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
			top.main.ViewerFrame.mapFrame.ClearSelection();
		} else {
			if ( typeof logger != 'undefined' ) { logger.i('clearSelection() non ancora implementata su mobile'); }
		}
	}
}

function MyOnDblClick() {
// 	alert("doubleclick!");
}


/**
 * 
 * Function: drawRectangle
 * 
 * *Mobile: yes*
 * 
 */
function drawRectangle(bbox) {
	
	//if ( (typeof onMobile == 'undefined') || (onMobile == false) ) {
		creaLineLayer("boundingBox");
		var coord=bbox.split(","); // 0 => xmin, 1 => xmax, 2 => ymin, 3 => ymax
		var wkt="LINESTRING("+coord[0]+" "+coord[2]+","+coord[0]+" "+coord[3]+","+coord[1]+" "+coord[3]+","+coord[1]+" "+coord[2]+","+coord[0]+" "+coord[2]+")";
		addLinesInLayer(wkt,"boundingBox",true);
	//} else {
		//if ( typeof logger != 'undefined' ) { logger.i('clearSelection() non ancora implementata su mobile'); }
	//}
}

/**
 * 
 * Function: startDrawPolygon
 * 
 * Introdotta con il nuovo visualizzatore
 * 
 */
if (typeof open_viewer == 'object' && typeof open_viewer.startDrawPolygon == 'function') {
	startDrawPolygon=$.proxy(open_viewer.startDrawPolygon,open_viewer);
} else {
	function startDrawPolygon() {
		///Old viewer - Not implemented
	}
}




/**** SEZIONE REDLINING ****/


/**
 * 
 * Function: cancelDigitization
 * 
 * *Mobile: yes*
 * 
 */

if (typeof open_viewer == 'object' ) {
	cancelDigitization=$.proxy(open_viewer.cancelDigitization,open_viewer);
} else {

	function cancelDigitization() {
		if ( !istrue(onMobile) ) {
			top.main.ViewerFrame.mapFrame.CancelDigitization();
		} else {
			if ( isset(viewer) ) {
				viewer.cancelDigitization();
			} else {
				if (isset(logger)) { logger.e('viewer non trovato!'); }
			}
			//if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('cancelDigitization() non ancora implementata su mobile'); }
		}
	}

}

/**
 * 
 * Function: isDigitizing
 * 
 * *Mobile: yes*
 * 
 */

if (typeof open_viewer == 'object' && typeof open_viewer.digitizePoint == 'function') {
	
	isDigitizing=$.proxy(open_viewer.isDigitizing,open_viewer);
} else {

	function isDigitizing() {
		if ( !istrue(onMobile) ) {
			return top.main.ViewerFrame.mapFrame.IsDigitizing();
		} else {
			if ( isset(viewer) ) {
				return viewer.isDigitizing();
			} else {
				if (isset(logger)) { logger.e('viewer non trovato!'); }
			}
			//if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('isDigitizing() non ancora implementata su mobile'); }
		}
		return false; // FIXME di default va bene false?
	}

}

/**
 * 
 * Function: DigitizePoint
 * 
 * *Mobile: yes*
 * 
 */

if (typeof open_viewer == 'object' && typeof open_viewer.digitizePoint == 'function') {
	
	DigitizePoint=$.proxy(open_viewer.digitizePoint,open_viewer);
} else {

	function DigitizePoint(f) {
		if ( !istrue(onMobile) ) {
			return top.main.ViewerFrame.mapFrame.DigitizePoint(f);
		} else {
			if ( isset(viewer) ) {
				viewer.DigitizePoint(f);
			} else {
				if (isset(logger)) { logger.e('viewer non trovato!'); }
			}
			//if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('DigitizePoint() non ancora implementata su mobile'); }
		}
	}

}
/**
 * 
 * Function: creaPointLayerFont
 * 
 * *Mobile: yes*
 * 
 * Parameters:
 * 	@param nome - the name of the new layer
 * 	@param colore - the color of the new layer
 *  @param spessore - line width
 *  @param rotation - rotation 
 *  @param fontname - fontname
 *  @param character - character
 * 
 * Returns:
 * 	@returns {boolean} *true* on success, *false* otherwise
 */
function creaPointLayerFont(nome, colore, spessore, rotation, fontname, character) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nome) ) { nome = "tmp_punti"; }
	if ( empty(colore) ) { colore = ""; }
	if ( empty(spessore) ) { spessore = "4"; }
	if ( empty(rotation) ) { rotation = "0"; }
	if ( empty(fontname) ) { fontname = "Civici2"; }
	if ( empty(character) ) { character = "g"; }
	
	var params = 'funzione=creaPointLayerFont&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nome+'&layerLegendLabel='+nome+'&groupName=Temp&groupLegendLabel=Temp&colore='+colore+'&spessore_bordo='+spessore+'&rotation='+rotation+'&fontname='+fontname+'&character='+character;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			
		},
		success: function(htmlData){
			
		}
	});
	
	return true;
}


/**
 * Function: creaPointLayer
 * 
 * *Mobile: yes* Invia una richiesta al redline per la creazione di un nuovo layer di tipo point.
 * La creazione avviene in modalità asincrona tramite chiamata ajax.
 * 
 * Parameters: 
 * 	@param nome - nome del nuovo layer
 * 	@param colore - colore del punto
 * 	@param spessore - grandezza del punto
 * 	@param angolo - 
 * 	@param height -  
 * 	@param group - gruppo al quale assegnare il nuovo layer
 * 	@param groupLabel - label del gruppo (in caso non esista e venga creato)
 * 	@param onSuccess - funzione da eseguire se la chiamata ajax termina con successo
 * 	@param onFail - funzione da eseguire nel caso la chiamata ajax restituisca un errore
 * 
 * Returns:
 * 	@return true se la richiesta di creazione del nuovo layer è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.creaPointLayer_legacy == 'function') {
	creaPointLayer=$.proxy(open_viewer.creaPointLayer_legacy,open_viewer);
} else {
function creaPointLayer(nome, colore, spessore, angolo, height, group, groupLabel, onSuccess, onFail) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('creaPointLayer()'); }
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
			
	if ( typeof nome == 'undefined' || empty(nome) ) { nome = "tmp_punti"; }
	if ( typeof colore == 'undefined' || empty(colore) ) { colore = ""; }
	if ( typeof spessore == 'undefined' || empty(spessore) ) { spessore = "8"; }
	if ( typeof angolo == 'undefined' || empty(angolo) ) { angolo = 0; }
	if ( typeof height == 'undefined' || empty(height) ) { height = 12; }	
	
	var params='funzione=creaPointLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nome+'&layerLegendLabel='+nome+'&groupName='+group+'&groupLegendLabel='+groupLabel+'&colore='+colore+'&spessore_bordo='+spessore+'&angle='+angolo+'&height='+height;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.e('Errore durante la creazione del layer "'+nome+'"'); }
			if ( isset(onFail) ) {
				// Se onFail è una funzione, la eseguo passandole la string di errore
				if ( typeof(onFail) == 'function') { onFail('Errore nella creazione del nuovo layer line ([Parametri] Nome: '+nome+' Colore: '+colore+' Spessore: '+spessore+' Group: '+group+' GroupLabel: '+groupLabel+')'); }
				// In caso contrario, passo onFail come parametro ad eval
				else { eval(onFail); }
			}
		},
		success: function(htmlData) {
			if ( isset(onSuccess) ) {
				// Se onSuccess è una funzione, la eseguo passandole il risultato dell'eleborazione
				if ( typeof(onSuccess) == 'function' ) { onSuccess(htmlData); }
				// In caso contrario, passo onSuccess come parametro ad eval
				else { eval(onSuccess); }
			}
		}
	});
		
	return true;	
}
}

/**
 * 
 * Function: creaLineLayer
 * 
 * *Mobile: yes* Invia una richiesta al redline per la creazione di un nuovo layer di tipo line.
 * La creazione avviene in modalità asincrona tramite chiamata ajax.
 * 
 * Parameters:
 * 	@param nome: nome del nuovo layer
 * 	@param colore: colore della linea
 * 	@param spessore: spessore della linea
 * 	@param group: gruppo al quale assegnare il nuovo layer
 * 	@param groupLabel: label del gruppo (in caso non esista e venga creato)
 * 	@param onSuccess: funzione da eseguire se la chiamata ajax termina con successo
 * 	@param onFail: funzione da eseguire nel caso la chiamata ajax restituisca un errore
 * 
 * Returns:
 * 	@return true se la richiesta di creazione del nuovo layer è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.creaLineLayer_legacy == 'function') {
	creaLineLayer=$.proxy(open_viewer.creaLineLayer_legacy,open_viewer);
} else {
function creaLineLayer(nome, colore, spessore, group, groupLabel, onSuccess, onFail) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nome) ) { nome = "tmp_linee"; }
	if ( empty(colore) ) { colore = ""; }
	
	var params = 'funzione=creaLineLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nome+'&layerLegendLabel='+nome+'&groupName='+group+'&groupLegendLabel='+groupLabel+'&colore='+colore+'&spessore='+spessore;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function(){
			if ( isset(onFail) ) {
				// Se onFail è una funzione, la eseguo passandole la string di errore
				if ( typeof(onFail) == 'function') { onFail('Errore nella creazione del nuovo layer line ([Parametri] Nome: '+nome+' Colore: '+colore+' Spessore: '+spessore+' Group: '+group+' GroupLabel: '+groupLabel+')'); }
				// In caso contrario, passo onFail come parametro ad eval
				else { eval(onFail); }
			}
		},
		success: function(htmlData) {
			if ( isset(onSuccess) ) {
				// Se onSuccess è una funzione, la eseguo passandole il risultato dell'eleborazione
				if ( typeof(onSuccess) == 'function' ) { onSuccess(htmlData); }
				// In caso contrario, passo onSuccess come parametro ad eval
				else { eval(onSuccess); }
			}
		}
	});
			
	return true;
}
}

/**
 * 
 * Function: creaPolygonLayer
 * 
 * *Mobile: yes* Invia una richiesta al redline per la creazione di un nuovo layer di tipo polygon.
 * La creazione avviene in modalità asincrona tramite chiamata ajax.
 * 
 * Parameters:
 * 	@param nome: nome del nuovo layer
 * 	@param colore: colore di sfondo del nuovo layer
 * 	@param spessore_bordo: spessore dello bordo del nuovo layer
 * 	@param colore_bordo: colore del bordo del nuovo layer
 * 	@param group: gruppo al quale assegnare il nuovo layer
 * 	@param groupLabel: label del gruppo (in caso non esista e venga creato)
 * 	@param onSuccess: funzione da eseguire se la chiamata ajax termina con successo
 * 	@param onFail: funzione da eseguire nel caso la chiamata ajax restituisca un errore
 * 
 * Returns:
 * 	@return true se la richiesta di creazione del nuovo layer è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.creaPolygonLayer_legacy == 'function') {
	creaPolygonLayer=$.proxy(open_viewer.creaPolygonLayer_legacy,open_viewer);
} else {
function creaPolygonLayer(nome, colore, spessore_bordo, colore_bordo, group, groupLabel, onSuccess, onFail, setVisible) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nome) ) { nome = "tmp_poligoni"; }
	if ( empty(colore) ) { colore = ""; }
	
	var params = 'funzione=creaPolygonLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nome+'&layerLegendLabel='+nome+'&groupName='+group+'&groupLegendLabel='+groupLabel+'&colore='+colore+'&spessore_bordo='+spessore_bordo+'&colore_bordo='+colore_bordo+'&visible='+setVisible;

	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			if ( isset(onFail) ) {
				// Se onFail è una funzione, la eseguo passandole la string di errore
				if ( typeof(onFail) == 'function') { onFail('Errore nella creazione del nuovo layer polygon ([Parametri] Nome: '+nome+' Colore: '+colore+' Spessore Bordo: '+spessore_bordo+' ColoreBordo: '+colore_bordo+' Group: '+group+' GroupLabel: '+groupLabel+')'); }
				// In caso contrario, passo onFail come parametro ad eval
				else { eval(onFail); }
			}
		},
		success: function(htmlData) {
			if ( isset(onSuccess) ) {
				// Se onSuccess è una funzione, la eseguo passandole il risultato dell'eleborazione
				if ( typeof(onSuccess) == 'function' ) { onSuccess(htmlData); }
				// In caso contrario, passo onSuccess come parametro ad eval
				else { eval(onSuccess); }
			}
		}
	});
	
	return true;	
}
}
/**
 * 
 * Function: creaGeneralLayers
 * 
 * *Mobile: yes* Invia una richiesta al redline per creare un set di layer
 * Le tipologie ammissibili sono point, line o polygon 
 * 
 * Parameters:
 * 	@param nomi: Lista nomi dei layer separata da virgole 
 * 	@param tipologie: Lista tipologie dei layer separata da virgole 
 * 	@param colori: Lista dei colori dei layer separata da virgole (es. AAFF0000) 
 * 	@param spessori_bordo: spessore del bordo del layer
 * 	@param colori_bordo: colore del bordo del layer
 * 	@param nomiGruppi: Lista dei nomi dei Gruppi a cui aggiungere i layer
 * 
 * Returns:
 * 	@return true se la richiesta di creazione dei nuovi layer è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.creaGeneralLayers_legacy == 'function') {
	creaGeneralLayers=$.proxy(open_viewer.creaGeneralLayers_legacy,open_viewer);
} else {

function creaGeneralLayers(nomi, tipologie, colori, spessori_bordo, colori_bordo, nomiGruppi, onSuccess) {
// console.log("creaGeneralLayers", nomi);
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( typeof colori == "undefined" ) { colori = "AAFF0000"; }
	if ( typeof spessori_bordo == "undefined" ) { spessori_bordo = ""; }
	if ( typeof colori_bordo == "undefined" ) { colori_bordo = ""; }
	if ( typeof nomiGruppi == "undefined" ) { nomiGruppi = ""; }
	if ( typeof onSuccess == "undefined" ) { onSuccess = ""; }
	
	var params = 'funzione=creaGeneralLayers&mapName='+mapName+'&sessionId='+mapSession+'&nomi='+nomi+'&tipologie='+tipologie+'&colori='+colori+'&spessori_bordo='+spessori_bordo+'&colori_bordo='+colori_bordo+'&nomiGruppi='+nomiGruppi;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function(){
			return false;
		},
		success: function(htmlData){
			if ( !empty(onSuccess) ) {
				// Se onSuccess è una funzione, la eseguo passandole il risultato dell'eleborazione
				if ( typeof onSuccess == 'function' ) { onSuccess(htmlData); }
				// In caso contrario, passo onSuccess come parametro ad eval
				else { eval(onSuccess); }
			}
		}
	});
	
	return true;	
}
}

function evidenziaBox(x_coord, y_coord, nomeLayer, lunghezzaLato, colore, spessore, gruppo) {
	if (isNaN(parseFloat(x_coord)) || isNaN(parseFloat(y_coord))) { return false; }
	if (typeof nomeLayer == "undefined") { nomeLayer = 'tmp_linee'; }
	if (typeof lunghezzaLato == "undefined" || isNaN(parseInt(lunghezzaLato))) { lunghezzaLato = 5; }
	if (typeof colore == "undefined") { colore = ''; }
	if (typeof spessore == "undefined") { spessore = ''; }
	if (typeof gruppo == "undefined") { gruppo = ''; }
	
	var metaLato = Math.round(lunghezzaLato/2);
	var x_min = x_coord - metaLato;
	var x_max = x_coord + metaLato;
	var y_min = y_coord - metaLato;
	var y_max = y_coord + metaLato;
	
	var wkt = "LINESTRING(" + x_min + " " + y_min + "," +    x_max + " " + y_min + "," +     x_max + " " + y_max + "," +     x_min + " " + y_max + "," +     x_min + " " + y_min + ")";

	if (typeof open_viewer == 'object' && typeof open_viewer.addPointsInLayer_legacy == 'function') {
		addLinesInLayer(wkt, nomeLayer, true, null, gruppo, null);
	} else {
		creaGeneralLayers(nomeLayer, 'line', colore, spessore, colore, gruppo, function() { addLinesInLayer(wkt, nomeLayer, true, null, gruppo, null) } );
	}
	
	return true;
}


/**
 * 
 * Function: addPointsInLayer
 * 
 * *Mobile: yes* Invia una richiesta al redline per la creazione di un punto su di un layer
 * 
 * Parameters:
 * 	@param wkt: Lista delle wkt da aggiungere al layer separate da pipe (|)
 * 	@param nomeLayer:
 * 	@param dorefresh:
 * 	@param onsuccess:
 * 	@param labelText:
 * 	@param groupName:
 * 
 * Returns:
 * 	@return true se la richiesta è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.addPointsInLayer_legacy == 'function') {
	addPointsInLayer=$.proxy(open_viewer.addPointsInLayer_legacy,open_viewer);
} else {
	function addPointsInLayer(wkt, nomeLayer, dorefresh, onsuccess, labelText, groupName, onFail, stopRecursion) {
			
		if (wkt == "") {
			//niente da fare, passo ad eseguire le funzioni di onsuccess e dorefresh
			if( istrue(dorefresh) ) { mapRefresh(); }
			if( !empty(onsuccess) ) { eval(onsuccess); }
		}
		
		var mapSession = GetSessionId();
		if ( empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( empty(mapName) ) { return false; }
		
		if ( empty(nomeLayer) ) { nomeLayer = "tmp_punti"; }
		if ( typeof labelText == "undefined" || labelText == null ) { labelText = ''; }
		
		var params = 'funzione=addPointsInLayer&wkt='+wkt+'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName='+groupName+'&labelText='+encodeURIComponent(labelText);
		
		
		
		$.ajax({
			url: LdpConfig.REDLINEURL,
			data: params,
			type: 'POST',
			dataType: 'html',
			timeout: LdpConfig.AJAXTIMEOUT,
			error: function(jqXHR, textStatus, errorThrown){
				console.log("Error", jqXHR);
				if (typeof console !== "undefined") {
					if (typeof jqXHR.status !== "undefined") {
						if (typeof jqXHR.status !== "undefined") {
							//console.log("addLinesInLayer failed: " + jqXHR.status);
							if (typeof stopRecursion === "undefined") {
								return addPointsInLayer(wkt, nomeLayer, dorefresh, onsuccess, labelText, groupName, onFail, true);
							}
						}
					}
				}
			},
			success: function(htmlData) {
				
				if( istrue(dorefresh) ) { mapRefresh(); }
				if( !empty(onsuccess) ) { eval(onsuccess); }
			}
		});
		
		return true;
	}
}

/**
 * 
 * Functon: addLinesInLayer
 * 
 * *Mobile: yes* Invia una richiesta al redline per la creazione di una linea su di un layer
 * 
 * Parameters:
 * 	@param wkt: Lista delle wkt da aggiungere al layer separate da pipe (|)
 * 	@param nomeLayer:
 * 	@param dorefresh:
 * 	@param onSuccess:
 * 	@param groupName:
 * 	@param onFail:
 * 
 * Returns:
 * 	@return true se la richiesta di è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.addLinesInLayer_legacy == 'function') {
	addLinesInLayer=$.proxy(open_viewer.addLinesInLayer_legacy,open_viewer);
} else {
	function addLinesInLayer(wkt, nomeLayer, doRefresh, onSuccess, groupName, onFail, stopRecursion) {
	
		var mapSession = GetSessionId();
		if ( empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( empty(mapName) ) { return false; }
		
		if ( empty(nomeLayer) ) { nomeLayer = "tmp_linee"; }
		
		var params = 'funzione=addLinesInLayer&wkt='+wkt+'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName='+groupName;
		
		$.ajax({
			url: LdpConfig.REDLINEURL,
			data: params,
			type: 'POST',
			dataType: 'html',
			timeout: 120000,
			error: function(jqXHR, textStatus, errorThrown){
				if (typeof console !== "undefined" && typeof jqXHR.status !== "undefined") {
					console.log("addLinesInLayer failed: " + jqXHR.status);
				}
				if (typeof stopRecursion !== true) {
					return addLinesInLayer(wkt, nomeLayer, doRefresh, onSuccess, groupName, onFail, true);
				} else {
					if ( !empty(onFail) ) {
						// Se onFail è una funzione, la eseguo passandole la string di errore
						if ( typeof(onFail) == 'function') { onFail('Errore nella creazione del nuovo layer polygon ([Parametri] Nome: '+nome+' Colore: '+colore+' Spessore Bordo: '+spessore_bordo+' ColoreBordo: '+colore_bordo+' Group: '+group+' GroupLabel: '+groupLabel+')'); }
							// In caso contrario, passo onFail come parametro ad eval
						else { eval(onFail); }
					}
				}
			},
			success: function(htmlData){
				if ( istrue(doRefresh) ) { mapRefresh(); }	
				if ( !empty(onSuccess) ) {
					// Se onSuccess è una funzione, la eseguo passandole il risultato dell'eleborazione
					if ( typeof(onSuccess) == 'function' ) { onSuccess(htmlData); }
					// In caso contrario, passo onSuccess come parametro ad eval
					else { eval(onSuccess); }
				}
			}
		});
		
		return true;
	}
}



/**
 * 
 * Function: addPolygonsInLayer
 * 
 * *Mobile: yes* Disegna un poligono in un layer a partire dalla sua wkt
 * 
 * Parameters:
 * 	@param wkt: - Lista delle wkt da aggiungere al layer separate da pipe (|)
 * 	@param nomeLayer: - nome del layer al quale aggiungere il poligono
 * 	@param doRefresh: - true se la mappa deve essere ricaricata dopo la funzione, false altrimenti
 * 	@param onSuccess: - funzione da eseguire in caso vada tutto bene
 * 	@param onFail: - funzione da eseguire in caso ci sia un errore
 * 
 * Returns:
 * 	@return true se la richiesta è stata inviata correttamente, false altrimenti
 */
if (typeof open_viewer == 'object' && typeof open_viewer.addPolygonsInLayer_legacy == 'function') {
	
	addPolygonsInLayer=$.proxy(open_viewer.addPolygonsInLayer_legacy,open_viewer);
} else {
	function addPolygonsInLayer (wkt, nomeLayer, doRefresh, onSuccess, onFail) {
		
		var mapSession = GetSessionId();
		if ( empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( empty(mapName) ) { return false; }
		
		if ( empty(nomeLayer) ) { nomeLayer = "tmp_poligoni"; }
		
		var ret = false;
		var params = 'funzione=addPolygonsInLayer&wkt='+wkt+'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName=Temp';
		
		$.ajax({
			url: LdpConfig.REDLINEURL,
			data: params,
			async: false,
			type: 'POST',
			dataType: 'html',
			timeout: 120000,
			error: function() {
				if ( !empty(onFail) ) { eval(onFail); }
			},
			success: function(htmlData) {
				
				// Se richiesto, eseguo il refresh della mappa
				if ( istrue(doRefresh) ) { mapRefresh(); }
				// Se è definita, eseguo la funzione onSuccess
				if ( !empty(onSuccess) ) { eval(onSuccess); }
				
				ret = true;
			}
		});
		
		return ret;
	}
}

/**
 * 
 * Function: emptyLayer
 * 
 * *Mobile: yes* Svuota il contenuto di un Layer
 * 
 * Parameters:
 * 	layer - il nome del layer da pulire
 * 	doRefresh - true se la mappa deve essere ricaricata dopo la funzione, false altrimenti
 * 	onSuccess - funzione da eseguire in caso vada tutto bene
 * 	onFail - funzione da eseguire in caso ci sia un errore
 * 
 */
if (typeof open_viewer == 'object' && typeof open_viewer.emptyLayers_legacy == 'function') {
	
	emptyLayer=$.proxy(open_viewer.emptyLayers_legacy,open_viewer);
	
} else {
	function emptyLayer (layer, doRefresh, onSuccess, onFail) {
		
		
		var mapSession = GetSessionId();
		if ( empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( empty(mapName) ) { return false; }
		
		if ( empty(layer) ) { return false; }
		
		var ret = false;
		var params = 'funzione=emptyLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+layer;
		
		$.ajax({
			url: LdpConfig.REDLINEURL,
			data: params,
			async: false,
			type: 'POST',
			dataType: 'html',
			timeout: LdpConfig.AJAXTIMEOUT,
			error: function() {
				// Se è definita, eseguo la funzione onFail
				if ( !empty(onFail) ) { eval(onFail); }
				ret = false;
			},
			success: function(htmlData) {
	// 			console.log(htmlData);
				if (htmlData=='error') {
					if ( !empty(onFail) ) { eval(onFail); }
					ret = false;
				} else {
					// Se richiesto, eseguo il refresh della mappa
					if ( istrue(doRefresh) ) { mapRefresh(); }
					// Se è definita, eseguo la funzione onSuccess
					if ( !empty(onSuccess) ) { eval(onSuccess); }
					ret = true;
				}
			}
		});
		
		return ret;
	}
}

/**
 * 
 * Function: emptyLayers
 * 
 * *Mobile: yes* Pulisce una lista di layers
 * 
 * Parameters:
 * 	list_layers - layers list
 * 	dorefresh - refresh after success
 * 	onsuccess - exec on success
 * 	async - do it async
 * 	onFail - exec on fail
 * 
 * Returns:
 * 	@returns {Boolean} *true* on success request, *false* otherwise
 */
if (typeof open_viewer == 'object' && typeof open_viewer.emptyLayers_legacy == 'function') {

	emptyLayers=$.proxy(open_viewer.emptyLayers_legacy,open_viewer);
	
} else {
function emptyLayers(list_layers, dorefresh, onsuccess, async, onFail) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(list_layers) ) { return false; }
	if ( empty(async) ) { async = true; }
	
	var ret = true;
	var params = 'funzione=emptyLayers&mapName='+mapName+'&sessionId='+mapSession+'&layers='+list_layers;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		async: async,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			ret = false;
		},
		success: function(htmlData) {
			if ( istrue(dorefresh) ) { mapRefresh(); }
			if ( !empty(onsuccess) ) { eval(onsuccess); }
			ret = true;
		}
	});
	
	return ret;
}
}
/**
 * 
 * Function: removeLayer
 * 
 * *Mobile: yes* Remove a layer.
 * 
 * Parameters:
 * 	@param layer
 * 	@param dorefresh
 * 	@param onsuccess
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function removeLayer(layer,dorefresh,onsuccess) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(layer) ) { return false; }
	
	var ret = true;
	var params = 'funzione=removeLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+layer;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function(){
			ret = false;
		},
		success: function(htmlData){
			
			if ( istrue(dorefresh) ) { mapRefresh(); }
			if ( !empty(onsuccess) ) { eval(onsuccess); }
			ret = true;
		}
	});
	
	return ret;
}

/**
 * 
 * Function: snapPoint
 * 
 * *Mobile: yes* Esegue lo snap di un punto su oggetti presenti nella mappa
 * 
 * Parameters:
 * 	@param point
 * 	@param strati
 * 	@param tipo
 * 	@param tolleranza
 * 	@param sottrai
 * 	@param callback
 */
function snapPoint(point, strati, tipo, tolleranza, sottrai, callback) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	var wkt = viewerPointToWKT(point);
	
	var ret = true;
	var params = 'funzione=snapPoint&mapName='+mapName+'&sessionId='+mapSession+'&wkt='+wkt+'&layers='+strati+'&tipo='+tipo+'&tolleranza='+tolleranza;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function(jqXHR, textStatus, errorThrown){
			//if (typeof console !== "undefined") console.log("snap non riuscito!");
			
			//fix passo il punto non snappato
			if(sottrai==0){
				if (typeof(callback)=='undefined') {
					snapReturn(wkt,'warning');
				} else if (typeof(callback)=='function')
					callback(wkt,'warning');
				else {
					eval(callback+"('"+wkt+"','warning')");
				}
			} else {
				if (typeof(callback)=='undefined') {
					snapReturnSottrai(wkt,'warning');
				} else if (typeof(callback)=='function')
					callback(wkt,'warning');
				else {
					eval(callback+"('"+wkt+"','warning')");
				}
			}
		},
		success: function(htmlData) {
			htmlData=htmlData.replace("\n",'');
			if ( sottrai == 0 ) {
				if ( typeof(callback) == 'undefined' ) {
					snapReturn(htmlData);
				} else if ( typeof(callback) == 'function' )
					callback(htmlData);
				else {
					eval(callback+"('"+htmlData+"')");
				}
			} else {
				if ( typeof(callback) == 'undefined' ) {
					snapReturnSottrai(htmlData);
				} else if ( typeof(callback) == 'function' )
					callback(htmlData);
				else {
					eval(callback+"('"+htmlData+"')");
				}
			}
			ret = true;
		}
	});
	
	return ret;
}

/**
 * 
 * Function: creaLabelLayer
 * 
 * *Mobile: yes* Create a label layer, same a creaPointLayer for formal arguments.
 * 
 * Parameters:
 * 	@param nome
 * 	@param colore
 * 	@param spessore
 * 	@param dorefresh
 * 	@param onsuccess
 * 
 * Returns:
 * 	@returns {Boolean}
 */
if (typeof open_viewer == 'object' && typeof open_viewer.creaLabelLayer_legacy == 'function') {
	creaLabelLayer=$.proxy(open_viewer.creaLabelLayer_legacy,open_viewer);
} else {

function creaLabelLayer(nome,colore,spessore,dorefresh,onsuccess) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nome) ) { return false; }
	
	var ret = true;
	var params = 'funzione=createLabelLayer&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nome+'&layerLegendLabel='+nome+'&groupName=Temp&groupLegendLabel=Temp&colore='+colore+'&spessore_bordo='+spessore;
		
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			ret = false;
		},
		success: function(htmlData) {
			if ( istrue(dorefresh) ) { mapRefresh(); }
			if ( !empty(onsuccess) ) { eval(onsuccess); }
			ret = true;
		}
	});
		
	return ret;
}
}
/**
 * 
 * Function: addLabelInLayer
 * 
 * *Mobile: yes* Add a label in a layer. See redline.php for addLabelInLayer case.
 * 
 * Parameters:
 * 	@param nomeLayer
 * 	@param wkt
 * 	@param labelText
 * 	@param size
 * 	@param angle
 * 	@param sizex
 * 	@param dorefresh
 * 	@param onsuccess
 * 	@param onfail
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function addLabelInLayer(nomeLayer, wkt, labelText, size, angle, sizex, dorefresh,onsuccess, onfail ) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nomeLayer) ) { nomeLayer = "tmp_punti"; }
	if ( typeof labelText == "undefined" ) { labelText = ''; }
	if ( empty(sizex) ) { sizex = size; }
	
	var ret = true;
	var params = 'funzione=addLabelInLayer&wkt='+wkt+'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName=Temp';
	params += '&labelText='+encodeURIComponent(labelText) + '&angle='+angle + '&size='+size + '&sizex='+sizex;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			ret = false;
		},
		success: function(htmlData) {
			if ( istrue(dorefresh) ) { mapRefresh(); }
			if ( !empty(onsuccess) ) { eval(onsuccess); }
			ret = true;
		}
	});
	
	return ret;
}

/**
 * 
 * Function: putLabelInLayer
 * 
 * *Mobile: yes* Add a label in a layer removing existings features. See redline.php for putLabelInLayer case.
 * 
 * Parameters:
 * 	@param nomeLayer
 * 	@param wkt
 * 	@param labelText
 * 	@param size
 * 	@param angle
 * 	@param sizex
 * 	@param dorefresh
 * 	@param onsuccess
 * 
 * Returns:
 * 	@returns {Boolean}
 */
if (typeof open_viewer == 'object' && typeof open_viewer.putLabelInLayer_legacy == 'function') {
	putLabelInLayer=$.proxy(open_viewer.putLabelInLayer_legacy,open_viewer);
} else {

	function putLabelInLayer(nomeLayer, wkt, labelText, size, angle, sizex, dorefresh,onsuccess ) {
		
		var mapSession = GetSessionId();
		if ( empty(mapSession) ) { return false; }
		var mapName = GetMapName();
		if ( empty(mapName) ) { return false; }
		
		if ( empty(nomeLayer) ) { nomeLayer = "tmp_punti"; }
		if ( typeof labelText == "undefined" ) { labelText = ''; }
		if ( empty(sizex) ) { sizex = size; }
		
		var ret = true;
		var params = 'funzione=putLabelInLayer&wkt='+wkt+'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName=Temp';
		params += '&labelText='+encodeURIComponent(labelText) + '&angle='+angle + '&size='+size + '&sizex='+sizex;
		
		$.ajax({
			url: LdpConfig.REDLINEURL,
			data: params,
			type: 'POST',
			dataType: 'html',
			timeout: LdpConfig.AJAXTIMEOUT,
			error: function() {
				ret = false;
			},
			success: function(htmlData){
				if ( istrue(dorefresh) ) { mapRefresh(); }
				if ( !empty(onsuccess) ) { eval(onsuccess); }
				ret = true;
			}
		});
		
		return ret;
	}
}
/**
 * 
 * Function: putLabelsInLayer
 * 
 * *Mobile: yes* Put one ore more labels in a layer.
 * N.B. sizex is actually the scale factor for SizeX property not the value it-self since it is used for all labels
 * params holds the values needed to add labels, see redline.php on putLabelsInLayer case.
 * 
 * Parameters:
 * 	@param nomeLayer
 * 	@param params
 * 	@param sizex
 * 	@param dorefresh
 * 	@param onsuccess
 * 
 * Returns:
 * 	@returns {Boolean}
 */
if (typeof open_viewer == 'object' && typeof open_viewer.putLabelsInLayer_legacy == 'function') {
	putLabelsInLayer=$.proxy(open_viewer.putLabelsInLayer_legacy,open_viewer);
} else {

function putLabelsInLayer(nomeLayer, params, sizex, dorefresh,onsuccess ) {
	
	var mapSession = GetSessionId();
	if ( empty(mapSession) ) { return false; }
	var mapName = GetMapName();
	if ( empty(mapName) ) { return false; }
	
	if ( empty(nomeLayer) ) { nomeLayer = "tmp_punti"; }
	
	var ret = true;
	var params = "funzione=putLabelsInLayer&" + params +'&mapName='+mapName+'&sessionId='+mapSession+'&layerName='+nomeLayer+'&groupName=Temp' + '&sizex='+sizex ;
	
	$.ajax({
		url: LdpConfig.REDLINEURL,
		data: params,
		type: 'POST',
		dataType: 'html',
		timeout: LdpConfig.AJAXTIMEOUT,
		error: function() {
			ret = false;
		},
		success: function(htmlData){
	
			if ( istrue(dorefresh) ) { mapRefresh(); }
			if ( !empty(onsuccess) ) { eval(onsuccess); }
		}
	});
	
	return ret;
}
}
/**** FINE SEZIONE REDLINING ****/

if (typeof open_viewer == 'object' && typeof open_viewer.zoomToView == 'function') {
	zoomToView=$.proxy(open_viewer.zoomToView,open_viewer);
} else {
/**
 * 
 * Function: zoomToView
 * 
 * *Mobile: yes* Zoom the map to the requested scale, centered on the given coords.
 * 
 * Parameters:
 * 	@param cx - x coord of the point to center
 * 	@param cy - y coord of the point to center
 * 	@param scala - the requested scale
 * 
 */
function zoomToView(cx, cy, scala) {
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("zoomToView()"); }
	
	if ( !istrue(onMobile) ) {
		
		if (!isNaN(parseFloat(cx)) && !isNaN(parseFloat(cy)) && !isNaN(parseInt(scala))){
			top.main.ViewerFrame.mapFrame.ZoomToView(parseFloat(cx),parseFloat(cy),parseInt(scala, 10), true);
		}
		else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.e('Errore nei dati'); }
		}
		
	} else {
		
		if ( isset(viewer) ) {
			
			if (!isNaN(parseFloat(cx)) && !isNaN(parseFloat(cy)) && !isNaN(parseInt(scala)))
				viewer.zoomToView(cx, cy, parseInt(scala, 10));
			
		} else {
			
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.e('viewer non trovato!'); }
			
		}
		
	}
}

}



/**
 *
 * Function: zoomToPolygon
 *
 * *Mobile: no* Zoom the map to the requested polygon, parsing it using wicket.
 *
 * Parameters:
 * 	@param polygonWkt - well formed wkt polygon as a string
 * 	@param getScaleToFitMargin - margin for getScaleToFit function
 * 	@param scalaMinima - min scale for zoom
 *
 */
function zoomToPolygon(polygonWkt, getScaleToFitMargin, scalaMinima) {
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("zoomToPolygon()"); }

	if (!empty(polygonWkt)) {
		if (empty(getScaleToFitMargin)) getScaleToFitMargin = 1;

		// WKT parsing from https://github.com/arthur-e/Wicket
		$.getScript('/include/js/wicket.js', function() {
			var wkt = new Wkt.Wkt();
			wkt.read(polygonWkt);

			var xmin = ymin = Number.MAX_VALUE;
			var xmax = ymax = Number.MIN_VALUE;

// 			console.log(xmin, ymin, xmax, ymax);

			for (var i = 0; i < wkt.components.length; i++) {
				var polygon = wkt.components[i];
// 				console.log("polygon", polygon);

				for (var j = 0; j < polygon.length; j++) {
					if (polygon[j].x < xmin) xmin = polygon[j].x;
					if (polygon[j].x > xmax) xmax = polygon[j].x;
					if (polygon[j].y < ymin) ymin = polygon[j].y;
					if (polygon[j].y > ymax) ymax = polygon[j].y;
				}
			}

			if (xmin != Number.MAX_VALUE && ymin != Number.MAX_VALUE && xmax != Number.MIN_VALUE && ymax != Number.MIN_VALUE) {
				var scala = getScaleToFit(xmin, xmax, ymin, ymax, getScaleToFitMargin);
				if (!empty(scalaMinima) && parseInt(scalaMinima) && scala < scalaMinima) {
					scala = scalaMinima;
				}
				zoomToView( (xmin + xmax) /2, (ymin + ymax)/2, scala);
			}
		});
	}
}



/**
 * 
 * Function: zoomToViewFalse
 * 
 * *Mobile: yes* Zoom the map to the requested scale, centered on the given coords.
 * FIXME
 * 
 * Parameters:
 * 	@param cx - x coord of the point to center
 * 	@param cy - y coord of the point to center
 * 	@param scala - the requested scale
 * 
 */
function zoomToViewFalse(cx,cy,scala) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("zoomToViewFalse()"); }
	
	if ( !istrue(onMobile) ) {
		if (!isNaN(parseFloat(cx)) && !isNaN(parseFloat(cy)) && !isNaN(parseInt(scala)))
			top.main.ViewerFrame.mapFrame.ZoomToView(parseFloat(cx),parseFloat(cy),parseInt(scala, 10), false);
	} else {
		if ( isset(viewer) ) {
			if (!isNaN(parseFloat(cx)) && !isNaN(parseFloat(cy)) && !isNaN(parseInt(scala)))
				viewer.zoomToView(cx, cy, parseInt(scala, 10));
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.e('errore, viewer non trovato!'); }
		}
	}
}



/**
 * 
 * Function: mapRefresh
 * 
 * *Mobile: yes* Refreshes the map.
 * 
 * Parameters:
 * 	@param onSuccess: - funzione da eseguire se tutto va bene
 * 	@param onFail: - funzione da eseguire in caso di errore
 * 	@param useRefreshSenzaLegenda: - true se non si vuole aggiornare anche la leggenda, false altrimenti
 * 
 */
if (typeof open_viewer == 'object' && typeof open_viewer.mapRefresh == 'function') {
	
	mapRefresh=$.proxy(open_viewer.mapRefresh,open_viewer);
// 	//Non c'è bisogno di fare chiamate dirette al nuovo viewer, si sfruttano le funzioni già mappate
//  	function mapRefresh(onSuccess, onFail, useRefreshSenzaLegenda) {
// 		zoomToView(getMapCenter().X-0.01,getMapCenter().Y, getMapScale(),true);
// 	}
	
} else {

function mapRefresh(onSuccess, onFail, useRefreshSenzaLegenda) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("mapRefresh()"); }
	
	if ( !istrue(onMobile) ) {
		if ( typeof(useRefreshSenzaLegenda) == "undefined" ) {
			if (typeof(top.main.ViewerFrame.mapFrame.RefreshSenzaLegenda) == "undefined") {
				var useRefreshSenzaLegenda = false;
			} else {
				var useRefreshSenzaLegenda = true;
			}
		}
		if (useRefreshSenzaLegenda) {
			top.main.ViewerFrame.mapFrame.RefreshSenzaLegenda();
		} else {
			top.main.ViewerFrame.mapFrame.ZoomToView(top.main.ViewerFrame.mapFrame.GetCenter().X-0.01,top.main.ViewerFrame.mapFrame.GetCenter().Y,top.main.ViewerFrame.mapFrame.GetScale(),true);
		}
	} else {
		if ( isset(viewer) ) {
			viewer.refresh();
		} else {
			if ( istrue(logger) ) { logger.e('viewer non trovato!'); }
		}
	}
	
	// Se è definita, eseguo la funzione onSuccess
	if ( isset(onSuccess) ) { eval(onSuccess); }
}
}
/**
 * 
 * Function: getMapCenter
 * 
 * *Mobile: yes* Get the center of the map.
 * 
 * Returns:
 * 	@returns
 */

if (typeof open_viewer == 'object' && typeof open_viewer.getMapCenter == 'function') {
	
	getMapCenter=$.proxy(open_viewer.getMapCenter,open_viewer);
} else {

function getMapCenter() {
	
	if ( !istrue(onMobile) ) {
		return top.main.ViewerFrame.mapFrame.GetCenter();
	} else {
		if ( isset(viewer) ) {
			var center = viewer.getCenter();
			var ret = {};
			ret.X = center.lon;
			ret.Y = center.lat;
			return ret;
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("La variabile viewer non è definita."); }
		}
	}
	
	return null;
}

}



/**
 * 
 * Function: getMapCenter
 * 
 * *Mobile: yes* Get the center of the map.
 * 
 * Returns:
 * 	@returns
 */

if (typeof open_viewer == 'object' && typeof open_viewer.getMapCenterDataProjection == 'function') {
	
	getMapCenterDataProjection=$.proxy(open_viewer.getMapCenterDataProjection,open_viewer);
} else {

function getMapCenterDataProjection() {
	
	//Definita solo nel nuovo viewer
	
	return null;
}

}



/**
 * 
 * Function: getMapWidth
 * 
 * Returns the width of the map.
 * 
 * Returns:
 * 	@returns the width of the map
 */
if (typeof open_viewer == 'object' && typeof open_viewer.getMapWidth == 'function') {
	
	getMapWidth=$.proxy(open_viewer.getMapWidth,open_viewer);
} else {


	function getMapWidth() {
		
		if ( !istrue(onMobile) ) {
			return top.main.ViewerFrame.mapFrame.GetMapWidth();
		} else {
			// TODO
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getMapWidth() not yet implemented on mobile"); }
		}
	}

}

/**
 * 
 * Function: getMapHeight
 * 
 * Returns the height of the map.
 * 
 * Returns:
 * 	@returns the height of the map
 */
if (typeof open_viewer == 'object' && typeof open_viewer.getMapHeight == 'function') {
	
	getMapHeight=$.proxy(open_viewer.getMapHeight,open_viewer);
} else {

	function getMapHeight() {
		
		if ( !istrue(onMobile) ) {
			return top.main.ViewerFrame.mapFrame.GetMapHeight();
		} else {
			// TODO
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getMapHeight() not yet implemented on mobile"); }
		}
	}

}
/**
 * 
 * Function: getMapScale
 * 
 * *Mobile: yes* Returns the actual scale of the map.
 * 
 * Returns:
 * 	@returns the actual scale of the map
 */
if (typeof open_viewer == 'object' && typeof open_viewer.getMapScale == 'function') {
	getMapScale=$.proxy(open_viewer.getMapScale,open_viewer);
} else {
	function getMapScale() {
		
		if ( !istrue(onMobile) ) {
			return top.main.ViewerFrame.mapFrame.GetScale();
		} else {
			if ( isset(viewer) ) {
				return viewer.getScale();
			} else {
				if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The variable viewer is not defined."); }
			}
		}
	}
}

/**
 * 
 * Function: _parseXML
 * 
 * *Mobile: yes* Cross browser XML parser
 * 
 * Parameters:
 * 	@param xml - the xml to parse
 * 
 * Returns:
 * 	@returns the parsed xml
 */
function _parseXML(xml) {
	
	if (window.DOMParser) {
		parser = new DOMParser();
		return parser.parseFromString(xml,"text/xml");
	} else { 
		// Internet Explorer
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = "false";
		xmlDoc.loadXML(xml);
		
		return xmlDoc;
	}
}

/**
 * 
 * Function: legendRefresh
 * 
 * Parameters:
 * 	@param onSuccess
 * 	@param onFail
 */
function legendRefresh(onSuccess, onFail) {
	if ( !istrue(onMobile) ) {
		top.main.ViewerFrame.mapFrame.GetLegendCtrl().Refresh();
	} else {
		// TODO
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("legendRefresh() not yet implemented on mobile"); }
	}
	if ( isset(onSuccess) ) { eval(onSuccess); }
}


/**
 * 
 * Function: _decode64
 * 
 * *Mobile: yes* Decodes MIME64 input
 * 
 * Parameters:
 * 	@param input
 * 
 * Returns:
 * 	@returns {String}
 */
function _decode64(input) {
	var output = "";
	var chr1, chr2, chr3;
	var enc1, enc2, enc3, enc4;
	var i = 0;
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {

		enc1 = _keyStr.indexOf(input.charAt(i++));
		enc2 = _keyStr.indexOf(input.charAt(i++));
		enc3 = _keyStr.indexOf(input.charAt(i++));
		enc4 = _keyStr.indexOf(input.charAt(i++));

		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;

		output = output + String.fromCharCode(chr1);

		if (enc3 != 64) {
			output = output + String.fromCharCode(chr2);
		}
		if (enc4 != 64) {
			output = output + String.fromCharCode(chr3);
		}

	}


	return output;	
}
	
/**
 * 
 * Function: _toInt16LE
 * 
 * *Mobile: yes* Converts from byte string to a LE WORD (16 Bit with least byte at low address)
 * 
 * Parameters:
 * 	@param txt
 * 
 * Returns:
 * 	@returns
 */
function _toInt16LE(txt)
{
	var r;
	
	for (var i=0; i<txt.length; i++)
		r |= (txt.charCodeAt(i)<<(i*8));
		
	return r;
}


/**
 * 
 * Function: _getIDs
 * 
 * *Mobile: yes* Get the ID tags of a layer tag and push them into ret array
 * 
 * Parameters:
 * 	@param xml
 * 	@param ret
 * 
 * Returns:
 * 	@returns
 */
function _getIDs(xml, ret) {
	
	var ids = xml.getElementsByTagName('ID');
	
	for (var i=0; i<ids.length; i++)
	{
		var m64 = ids[i].childNodes[0].nodeValue;
		//Decode ID
		ret.push(_toInt16LE(_decode64(m64)));
	}
	
	return ids.length;

}


/**
 * 
 * Function: getSelection
 * 
 * Get an object with selected features id and relative layers id
 * ids member is an array of feature id (the selected ones)
 * lys member is an array of layers id (use getMapGuideLayersNamesByIDs to get layer names)
 * 
 * Returns:
 * 	@returns null if no feature selected
 */

if (typeof open_viewer == 'object' && typeof open_viewer.getMapGuideSelection == 'function') {
	getMapGuideSelection=$.proxy(open_viewer.getMapGuideSelection,open_viewer);
} else {
function getMapGuideSelection() {
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getSelection() not yet implemented on mobile"); }
		return null;
	}
	
	var x = top.main.ViewerFrame.mapFrame.GetSelectionXML();
	var ids = new Array(), lys= new Array();

	if (x == null || x == '') return null;
	
	//Get XML DOM Parser
	x = _parseXML(x);
	
	//Each layer tag hold selected features id
	var layers = x.getElementsByTagName('Layer');
	for (var i=0; i<layers.length; i++)
	{
		var layer = layers[i];
		var layer_id = layer.getAttribute('id');
	
		//Get selected features into ids, return the number of inserted features
		var n = _getIDs(layer, ids);
		
		for (var j=0; j<n; j++)
			lys.push(layer_id);
	}

	return {ids:ids, lys:lys};
}
}


/**
 * 
 * Function: getMapGuideLayersNamesByIDs
 * 
 * Converts and array of layer ids to an array of layer names
 * N.B. This is a client-only method
 * 
 * Parameters:
 * 	@param ids
 * 
 * Returns:
 * 	@returns the names arrays
 */
if (typeof open_viewer == 'object' && typeof open_viewer.getMapGuideLayersNamesByIDs == 'function') {
	getMapGuideLayersNamesByIDs=$.proxy(open_viewer.getMapGuideLayersNamesByIDs,open_viewer);
} else {
function getMapGuideLayersNamesByIDs(ids) {
	var res=null;
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getMapGuideLayersNamesByIDs() not yet implemented on mobile"); }
		return null;
	}
	
	var layers = top.main.ViewerFrame.mapFrame.GetLayers(false, false);
	for (var j=0; j<ids.length; j++)
		for (var i=0; i<layers.length; i++)
			if (layers[i].objectId == ids[j])
			{
				if (res == null) res = new Array();
				res.push(layers[i].name);
			}
	return res;
}
}
/**
 * 
 * Function: getLayerIds
 * 
 * Converts and array of layer ids to an array of layer names
 * N.B. This is a client-only method
 * 
 * Parameters:
 * 	@param ids
 * 
 * Returns:
 * 	@returns the names arrays
 */

function getLayerIds(ids) {
	var res=null;
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getLayerIds() not yet implemented on mobile"); }
		return null;
	}
	
	var layers =top.main.ViewerFrame.mapFrame.GetLayers(false, false);
	for (var j=0; j<ids.length; j++)
		for (var i=0; i<layers.length; i++)
			if (layers[i].name == ids[j])
			{
				if (res == null) res = new Array();
				res.push(layers[i].objectId);
			}
	return res;
}

/**
 * 
 * Function: _implode
 * 
 * *Mobile: yes* Implode an array with delimiter
 * 
 * Parameters:
 * 	delimiter - delimiter to use
 * 	array - the array of elements
 * 
 * Returns:
 * 	@returns {String} the result string
 */
function _implode(delimiter, array)
{
	var s='';
	for (var i=0; i<array.length; i++)
		s = s + (i>0 ? delimiter:'') + array[i];
	return s;
}

/**
 * 
 * Function: filterSelection
 * 
 * *Mobile: yes*
 * Filter current selected features based on layer name
 * 
 * Parameters:
 * 	@param sel
 * 	@param layerName
 * 
 * Returns:
 * 	@returns
 */
function filterSelection(sel, layerName) {
	
	
	if (sel == null) return null;
	var ids=[], lys=sel.translated ? sel.lys : getMapGuideLayersNamesByIDs(sel.lys), lay=[];
	
	for (var i=0; i<lys.length; i++)
		if ((typeof layerName == 'string' && lys[i] == layerName) || layerName.test &&  layerName.test(lys[i]))
		{
			ids.push(sel.ids[i]);lay.push(lys[i]);
		}
	
	return {ids:ids, lys:lay, translated:true};
}

/**
 * 
 * Function: _DOM2Obj
 * 
 * *Mobile: yes* Node to obj
 * 
 * Parameters:
 * 	@param dom
 * 
 * Returns:
 * 	@returns
 */
function _DOM2Obj(dom) {
	var obj={};
	
	for (var i=0; i<dom.childNodes.length; i++)
	{
		var name = dom.childNodes[i].nodeName;
		var val =  dom.childNodes[i].firstChild ? dom.childNodes[i].firstChild.nodeValue : '';
		
		obj[name] = val;
	}
	
	return obj;
}


/**
 * 
 * Function: _implodeObject
 * 
 * *Mobile: yes*
 * implode object
 * Implode an array with delimiter
 * 
 * Parameters:
 * 	@param delimiter
 * 	@param array
 * 	@param prop
 * 
 * Returns:
 * 	@returns {String}
 */
function _implodeObject(delimiter, array, prop) {
	var s='';
	for (var i=0; i<array.length; i++)
		s = s + (i>0 ? delimiter:'') + array[i][prop];
	return s;
}


/**
 * 
 * Function: snapPoint_ng
 * 
 * *Mobile: yes*
 * Do a new generation snap. N.B. This function is blocking!
 * 
 * Parameters:
 * 	@param point
 * 	@param layers
 * 	@param type
 * 	@param tolerance
 * 	@param geoms
 * 	@param packageN
 * 
 * Returns:
 * 	@returns 
 */
function snapPoint_ng(point, layers, type, tolerance, geoms,packageN) {
	var wkt = viewerPointToWKT(point);
	var newPoint=point;

	$.ajax({
		url: '../include/php/snapPoint.php',
		data: 'strati='+ layers + '&tipo='+ type  +'&wkt=' + wkt + '&package='+packageN+'&tolleranza=' + tolerance +(geoms? '&geoms='+geoms:''),
		type: 'POST',
		dataType: 'html',
		async:		false,
		timeout: 5000,
		error: function(){
			
		},
		success: function(htmlData)
		{
			var parsed = /^\s*POINT\s*\(\s*(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\)\s*$/.exec(htmlData);

			if (parsed != null && parsed.length == 3)
				newPoint = {X:parseFloat(parsed[1]), Y:parseFloat(parsed[2])};
		}
	});

	return newPoint;
}

/**
 * 
 * Function: getLayerGroup
 * 
 * Get layer group object from group name
 * 
 * Parameters:
 * 	@param groupName
 * 
 * Returns:
 * 	@returns
 */
function getLayerGroup(groupName) {
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("getLayerGroup() not yet implemented on mobile"); }
		return null;
	}
	
	var groups = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame.tree;

	for (var i in groups)
	{
		if (groups[i].name == groupName) return groups[i];
	}

	return null;
}

/**
 * 
 * Function: isLayerGroupVisible
 * 
 * 
 * Given a layer group object tell if it is visible
 * 
 * Parameters:
 * 	group - the layer group to check
 * 
 * Returns:
 * 	{boolean} *true* if the layer group is visible, *false* otherwise
 */
function isLayerGroupVisible(group){
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("isLayerGroupVisible() not yet implemented on mobile"); }
		return null;
	}
	
	return group.visible;
}

/**
 * 
 * Function: layerGroupId
 * 
 * Given a layer group object retrieve its object id
 * 
 * Parameters:
 * 	group - the layer group
 * 
 * Returns:
 * 	the id of the group
 */
function layerGroupId(group){
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("layerGroupId() not yet implemented on mobile"); }
		return null;
	}
	return group.objectid;
}

/**
 * 
 * Function: expandLayerGroup
 * 
 * Given a layer group object expand it if 'expanded' is true, collapse otherwise
 * 
 * Parameters:
 * 	group - the layer group
 * 	expanded - true if the group must be expanded
 * 
 */
function expandLayerGroup(group, expanded) { 
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("expandLayerGroup() not yet implemented on mobile"); }
		return null;
	}
	var t = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame;
	expanded && t.Expand(group) || !expanded && t.Collapse(group);
}

/**
 * 
 * Function: showLayerGroup
 * 
 * Given a layer group object show it and (eventually expands or collapses it, only if 'expanded' set)
 * 
 * Parameters:
 * 	@param group
 * 	@param expanded
 * 
 */
function showLayerGroup(group, expanded) { 
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("showLayerGroup() not yet implemented on mobile"); }
		return null;
	}
	var t = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame;
	if (!group.visible) t.ChangeVisibility(group.objectId);
	if (typeof expanded != 'undefined') window.setTimeout(function(){expandLayerGroup(group, expanded);},150);
}

/**
 * 
 * Function: hideLayerGroup
 * 
 * Given a layer group object hide it and (eventually expands or collapses it, only if 'expanded' set)
 * 
 * Parameters:
 * 	@param group
 * 	@param expanded
 * 
 */
function hideLayerGroup(group, expanded) { 
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("hideLayerGroup() not yet implemented on mobile"); }
		return null;
	}
	var t = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame;
	if (group.visible) t.ChangeVisibility(group.objectId);
	if (typeof expanded != 'undefined') window.setTimeout(function(){expandLayerGroup(group, expanded);},150);
}


/**
 * 
 * Function: isLayerVisible
 * 
 * Tell if the layer corrisponding to the passed id is visible.
 * 
 * Parameters:
 * 	layerId - the layer of the id to check
 * 
 * Returns:
 * 	{boolean} *true* if the layer is visible, *false* otherwise
 */
function isLayerVisible(layerId) {
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("isLayerVisible() not yet implemented on mobile"); }
		return null;
	}
	var l = top.main.ViewerFrame.mapFrame.LegendCtrl.GetLayers(true);
	
	for (var i=0; i<l.length; i++)
		if (l[i].objectId == layerId) return true;
					 
	return false;
}

/**
 * 
 * Function: toggleLayerVisibility
 * 
 * Toggle the visibility of a layer given its id.
 * 
 * Parameters:
 * 	layerId - the layer of the id
 * 
 */
function toggleLayerVisibility(layerId) {
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("toggleLayerVisibility() not yet implemented on mobile"); }
		return null;
	}
	var t = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame;
	t.ChangeVisibility(layerId);
}

/**
 * 
 * Function: showLayer
 * 
 * Show a layer given its id.
 * 
 * Parameters:
 * 	layerId - the id of the layer to show
 * 
 */
function showLayer(layerId) {
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("showLayer() not yet implemented on mobile"); }
		return null;
	}
	if (!isLayerVisible(layerId)) toggleLayerVisibility(layerId);
}

/**
 * 
 * Function: hideLayer
 * 
 * Parameters:
 * 	@param layerId
 */
function hideLayer(layerId) {
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.i("hideLayer() not yet implemented on mobile"); }
		return null;
	}
	if (isLayerVisible(layerId)) toggleLayerVisibility(layerId);
}

/**
 * 
 * Function: GetMapName
 * 
 * *Mobile: yes* Returns the map name.
 * 
 * Returns:
 * 	{string} the *map name* on success, *null* otherwise
 */
function GetMapName() {
	if ( istrue(onMobile) ) {
		if ( isset(viewer) ) {
			return viewer.getMapName();
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The variable viewer is not defined."); }
			return null;
		}
	} else {
		if ( typeof top != "undefined" && typeof top.main != "undefined" && typeof top.main.ViewerFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame.GetMapName == "function" ) {
			return top.main.ViewerFrame.mapFrame.GetMapName();
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The map doesn't exist."); }
			return null;
		}
	}
}

/**
 * 
 * Function: GetSessionId
 * 
 * *Mobile: yes* Get the session id of the map.
 * 
 * Returns:
 * 	{string} the map *session id* on success, *null* otherwise
 */
function GetSessionId() {
	
	if ( istrue(onMobile) ) {
		if ( isset(viewer) ) {
			return viewer.getMapSession();
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The variable viewer is not defined."); }
			return false;
		}
	} else {
		if ( typeof top != "undefined" && typeof top.main != "undefined" && typeof top.main.ViewerFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame.GetSessionId == "function") {
			return top.main.ViewerFrame.mapFrame.GetSessionId();
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The map doesn't exist."); }
			return false;
		}
	}
}


/**
 * 
 * Function: fullMapRefresh
 * 
 * *Mobile: yes* Full refresh della mappa
 * 
 * Parameters:
 * 	onSuccess - funzione da eseguire in caso tutto vada bene
 * 	onFail - funzione da eseguire in caso di errore
 * 
 * Returns:
 * 	*true* on success, *false* se ci sono errori
 */
function fullMapRefresh(onSuccess, onFail) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('fullMapRefresh()'); }
	
	if ( istrue(onMobile) ) {
		if ( isset(viewer) ) {
			viewer.refresh();
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The variable viewer is not defined."); }
			return false;
		}
	} else {
		// occorre controllare anche top.main.ViewerFrame.mapFrame.GetLegendCtrl() perché talvolta rende null e non viene controllato nella funzione Refresh, causando un errore
		if ( typeof top != "undefined" && typeof top.main != "undefined" && typeof top.main.ViewerFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame != "undefined" && typeof top.main.ViewerFrame.mapFrame.Refresh == "function" && top.main.ViewerFrame.mapFrame.GetLegendCtrl() ) {
			top.main.ViewerFrame.mapFrame.Refresh();
		}
	}
	
	// Se è definita, eseguo la funzione onSuccess
	if (onSuccess) { eval(onSuccess); }
	
	return true;
}


/**
 * 
 * Function: handleTemporaryLayers
 * 
 * *Mobile: yes*
 * Add features in temporary layers.
 * Each layer may have it's own style and geometry type.
 *
 * The parameter command is an object:
 *
 * {
 *	group:	[GroupObject1, ..., GroupObjectH],
 *	empty:	["layerName1", ... , "layerNameK"],
 *	add:	[AddObject1, ..., AddObjectM],
 *	remove:	["layerName1", ... , "layerNameN"]
 *	error:	function(){},
 *	success: function(json){}
 *  preventRefresh: true|false
 *  preventExpandGroup: true|false
 *  
 * }
 *
 * The property "group" is an array of GroupObject described below. This array
 * is used to create layer groups if not already present.
 * The "empty" array holds the name of the layers to empty, others ones are left
 * unchanged.
 * To add WKT in a layer or to create a layer use "add" array, AddObject is
 * described below.
 * "remove" array is an array used to remove layers from the map.
 *
 * The command is processed in the order "group", "empty", "add", "remove".
 *
 * "error" and "success" function are callback for jQuery AJAX call.
 * N.B. Actually server page return temporary layer on the map, see getTemporaryLayers.
 *
 * GroupObject is following defined:
 * {
 *	name:		"Group internal name",
 *	label:		"Group legend label",
 *	visible:	true|false,
 *	display:	true|false, //Display in legend
 *	group:		"Parent group name",//Must appear before this in the array or be
 *									//already defined
 *	remove_if_empty: true|false
 * 	expand:		true|false
 * }
 *
 *
 * AddObject is
 * {
 *	name:		"Layer internal name",
 *	label:		"Label legend label",
 *	group:		"Layer group name",
 *  visible		true|false,
 * 	display		true|false,		//Display in legend
 *
 *	//These 3 properties are set only during layer creation, so the very first
 *	//time the layer is added to the map
 *
 *	tooltip:	"Layer tooltip",	//Use U1 and U2 as per-WKT user defined
 *									//properties
 *	url:		"Layer URL",		//See tooltip note
 *	type:		"polygon|point|line",	//Any comb allowed (eg: line|point)
 *
 *  selectable	true|false
 * 
 *	//Theese style property are set per-layer even if server page can handle
 *	//them per feature.
 *
 *	color:		"ARGB for line/point/area",
 *	stroke:		"ARGB for polygon stroke",
 *	thick:		"Thickness in device points",
 *
 *	wkts:		[WKTObject1, ..., WKTObjectL]
 * }
 *
 * The only required property is name.
 * WKTObject is
 * {
 *	wkt:	"WKT",
 *	user1:	"User defined string",
 *	user2:	"User defined string",
 *  id		Id of the feature
 * }
 *
 * user1 and user2 are optional.
 * 
 * 
 * ADDENDUM:
 * 
 * delete_features:	[DeleteObj1, ..., DeleteObjT]
 * 
 * Where DeleteObj is
 * {
 * 	layer:	layer containing the feature
 * 	id: id of the feature
 * }
 * 
 * delete_features if processed after empty
 * 
 * 
 * style can also be "compound" which means to use compound styles 
 * 
 * compoundStyle property in AddObject, it is an array of object:
 * 
 * {
 * 	type = "reference" (simpleSymbol e compoundSymbol not yet supported)
 *	
 * 	//for reference type 
 *	//Override params
 * 	params = [{symbol:'Name of symbol', 'param':'Name of param', 'value':'Value'}, ...]
 * }
 * 
 **/
function handleTemporaryLayers(command) {
// 	console.log(command);

	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('handleTemporaryLayers()'); }
	
	var json_command = JSON.stringify(command);
	
	//Di default, se non specificato fai tre tentativi in caso di errore
	if ( typeof command.attempts == 'undefined' && typeof command.attemptsSet == 'undefined' )
		command.attempts = command.attemptsSet = 3;
	
	showMapSpinner(true);

	var sessionId = GetSessionId();
	var mapName = GetMapName();
	if ( sessionId === false || mapName === false ) {
		if ( command.attempts > 0 ) {
			command.attempts--;
			return setTimeout(function() { handleTemporaryLayers(command); }, 500);
		}
	}
	
	$.ajax({
		url: '/mapguide/ldp/temporaryLayers.php',
		data: "SESSION=" + sessionId + "&NAME=" + mapName + "&DATA=" + encodeURIComponent(json_command),
		type: 'POST',
		async: typeof command.async == 'undefined' ? true: command.async,
		dataType: 'json',
		timeout: 30000,

		error: function(jqXHR, textStatus, errorThrown){

			if (/502/.test(errorThrown) && command.attempts>0) {
				command.attempts--;
				setTimeout(function() { handleTemporaryLayers(command); }, 500);
			}

			showMapSpinner(false);

			if (typeof command.error == 'function') command.error();
		},

		success: function(json) {
			//console.log("VALORE RITORNATO IN HANDLE TEMP ");
			//console.log(json);

			if (typeof command.preventExpandGroup == 'undefined' || !command.preventExpandGroup) {

				//Expand groups, try at most N times every dt ms
				var g, all=true, f, N=5, dt=1000;
				window.setTimeout(f = function() {
					if (N--==0) return;
					all = true;

					//Expand groups
					if (command.groups)
						for (var i in command.groups)
							if (command.groups[i].name && command.groups[i].expand)
							{
								g = getLayerGroup(command.groups[i].name);
								all = all && (g != null);
								g && expandLayerGroup(g, true);
							}
					if (!all) window.setTimeout(f, dt);
				}, dt);
			}

			if (typeof command.preventRefresh == 'undefined' || !command.preventRefresh) fullMapRefresh();

			if (typeof command.success == 'function') command.success(json);
			showMapSpinner(false);
		}
	});
}

/**
 * 
 * Function: getTemporaryLayers
 * 
 * *Mobile: yes*
 * command is an object with properties:
 * 
 * error - function called on ajax error
 * success(result) - function called on success
 *
 * result param is an array of object holding layers information (name, legend, id, group, groupLabel)
 * 
 */
function getTemporaryLayers(command) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('getTemporaryLayers()'); }
	
	$.ajax({
		url: '/mapguide/ldp/temporaryLayers.php',
		data: "SESSION="+GetSessionId() + "&NAME=" + GetMapName() + "&DATA="+ '"query"',
		type: 'POST',
		dataType: 'json',
		timeout: 10000,
		error: function(){
			if (typeof command.error == 'function') command.error();
		},
		success: function(json){
			if (typeof command.success == 'function') command.success(json);
		}
	});
	
}

/**
 * 
 * Function: deleteAllTemporaryLayers
 * 
 * *Mobile: yes*
 * Parameters:
 * 	@param command
 * 
 */
function deleteAllTemporaryLayers(command) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('deleteAllTemporaryLayers()'); }
	
	showMapSpinner(true);
	
	$.ajax({
				url: '/mapguide/ldp/deleteTemporaryLayers.php',
				data: "SESSION="+GetSessionId() + "&NAME=" + GetMapName(),
				type: 'POST',
				dataType: 'text',
				timeout: 10000,
				error: function(jqXHR, textStatus, errorThrown){
					showMapSpinner(false);
					if (typeof command.error == 'function') command.error(jqXHR, textStatus, errorThrown);
				},
				success: function(txt){
					showMapSpinner(false);
					if (!command.noRefresh) mapRefresh();
					if (txt == 'OK' && typeof command.success == 'function') command.success();
					if (txt != 'OK' && typeof command.error == 'function') command.error(txt);
				}
			});	
	
}

/**
 * 
 * Function: showMapSpinner
 * 
 * Parameters:
 * 	@param show
 * 
 */
function showMapSpinner(show) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('showMapSpinner()'); }
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.w('showMapSpinner() non implementata su mobile'); }
	} else {
		if ( isMapReady() && typeof top.main.ViewerFrame.tbFrame != "undefined" && typeof top.main.ViewerFrame.tbFrame.document != "undefined"  ) {
			var $spinner = $('#divRefresh',top.main.ViewerFrame.tbFrame.document);

			if (!show)
				$spinner.hide();
			else
				$spinner.show();
		}
	}
}



/**
 * 
 * Function: evidenziaWKT
 * 
 * 
 * 
 * Parameters:
 * 	@param wkt
 * 	@param cx
 * 	@param cy
 * 	@param scala
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function evidenziaWKT(wkt, cx,cy,scala) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('evidenziaWKT()'); }
	
	
// 	showMapSpinner(true);
// 	
// 	
// 	$.ajax({
// 				url: '/mapguide/ldp/evidenzia.php',
// 				data: "SESSION="+GetSessionId() + "&NAME=" + GetMapName() + (typeof wkt == 'string' ? ('&WKT=' + encodeURIComponent(wkt)) : '&CLEAR=1') + '&STRONG=1',
// 				type: 'POST',
// 				dataType: 'text',
// 				timeout: 30000,
// 				error: function(){
// 					showMapSpinner(false);
// 				},
// 				success: function(txt){
// 					showMapSpinner(false);
// 					if (typeof cx == 'undefined') 
// 						mapRefresh();
// 					else
// 						zoomToView(cx, cy, scala);
// 				}
// 			});		

	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("evidenziaWKT() not yet implemented on mobile!"); }
		// FIXME SetSelectionXML problem
		return true;
	} else {
		if ( isset(top) && isset(top.main) && isset(top.main.ViewerFrame) && isset(top.main.ViewerFrame.mapFrame) ) {
			if (wkt == false) {
				handleTemporaryLayers({remove:['layer_evidenziazione']});
			} else 
				handleTemporaryLayers({
		
				empty:['layer_evidenziazione'],
				add:
				[
					{
						name:	"layer_evidenziazione" ,
						display: false,
						visible: true,
						type:	"polygon",
						color:	"00FF33CC",
						stroke:	"00E600AC",
						thick:	1.0,
						selectable: true,
						append:true,
						wkts:
						[{
							wkt:	wkt,
							user1:	'',
							user2:	'',
							id:		241
						}]
					}				
				],
				error: function(){ zoomToView(cx,cy,scala);},
				success: function(json){ 
					
					if (json["layer_evidenziazione"])
					{
						var id = json["layer_evidenziazione"].id;
						
						top.main.ViewerFrame.mapFrame.SetSelectionXML('<?xml version="1.0" encoding="UTF-8"?><FeatureSet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="FeatureSet-1.0.0.xsd"> <Layer id="'+id+'">  <Class id="SHP_Schema:layer_evidenziazione">   <ID>AQAAAA==</ID>  </Class> </Layer></FeatureSet>');
					}
					
		 			zoomToView(cx,cy,scala==null ? top.main.ViewerFrame.mapFrame.GetScale():scala);
					
					
				}
			});
			
			//Toglie automaticamente il cancella-evidenzia
			if ($('#cancella-evidenzia').length > 0)
			{
				var f;
				var t = setTimeout(f = function(){
					
					try
					{
						var s = filterSelection(getSelection(), 'layer_evidenziazione');
					
						if (s != null && s.ids.length > 0 && $('#cancella-evidenzia').is(':visible'))
							setTimeout(f, 2000);
						else
							$('#cancella-evidenzia').hide('slow');
						
					}catch (e){}
				
					
				}, 5000);
			}
		}
	}

}




/**
 * 
 * Function: addGoogleLikeMarker
 * 
 * *Mobile: yes* Add a marker like the Google one on the map.
 *  * Recreating the layer is needed when changing strokeColor and fillColor properties (see handleTemporaryLayers).
 * 
 * Sample usage
 * 
 * DigitizePoint(function(p){
 *
 *		//Dark red borders
 *		p.strokeColor = 'ff880000';
 *		
 *		//Only for style debug purpose, you can remove this for speeding up
 *		p.mode = 'remove';	
 *		
 *		//Tooltip sample
 *		p.tooltip = "<div style='padding:5px;'> 																		\
 *						<img style='float:left; margin-right:3px; border: 1px solid black;' 							\
 *							src='http://trollface.biz/wp-content/uploads/2011/03/cereal-guy2.gif'>						\
 *						<p style='margin:0px 0px 0px 0px; font-size: 16px; color:#00ACE6;'>Hi!</p>						\
 *						<p style='margin:4px 0px 0px 0px; font-size: 13px;'>You can enjoy big parties here at " + 
 *						/\d+\.\d\d/.exec(p.X)[0] + ", " + /\d+\.\d\d/.exec(p.Y)[0] + "!</p> 							\
 *					</div>";
 *				
 *		//The real mandatory call :) 
 *		addGoogleLikeMarker(p);
 *	});
 * 
 * Parameters:
 * 	@param data JS object with the function properties
 *  @param data.X (mandatory) X coord
 *  @param data.Y (mandatory) Y coord
 *  @param data.strokeColor (optional) ARGB used for the symbol stroke. See *
 *  @param data.fillColor (optional) ARGB used for the symbol fill. See *
 *  @param data.tooltip (optional) Tooltip
 *  @param data.error (optional) Callback for errors
 *  @param data.success (optional) Callback for success, it takes one argument, see handleTemporaryLayers success function
 *  @param data.mode (optional)	Default mode empties the layer before adding the new marker. If mode is "remove" the layer is recreated before adding the marker, if  mode is "append" the layer is not emptied so multiple markers can be added.
 * 
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function addGoogleLikeMarker(data) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('addGoogleLikeMarker()'); }
	
	//Make the WKT
	var wkt = "POINT(" + data.X + " " + data.Y + ")";
	console.log(wkt);
	//Layer name
	var layerName = 'tmp_punti';			
	//NOTE: Using tmp_punti ensure compatibility with "redline functions", futhermore using a name starting with 'tmp' allow this layer to be removed by deleteAllTemporaryLayers
	
	//Add the point in a layer
	var cmd = 
	{
		add:
		[
			{
				name:	layerName,					//Layer name
				display: false,						//Display in legend
				visible: true,						//Layer is visible
				type:	"point|compound",			//Layer with points and compound style
				selectable: false,					//Layer is not selectable
				wkts:[{wkt:	wkt}],					//WKTs
				compoundStyle: 
				[
					//Reference the marker symbol
					{type: "reference", resourceId:"Library://simboli/marker.SymbolDefinition", params:[]}
				]
				
			}				
		],
		error: function(){ data.error && data.error();},
		success: function(json){ data.success && data.success(json);}

	};
	
	//Empty the layer if requested
	if (data.mode == 'remove') cmd.remove = ['tmp_punti'];
	else if (data.mode != 'append') cmd.empty = ['tmp_punti'];
			
	if (data.tooltip) {
		cmd.add[0].tooltip = 'U1';					//Each feature has the U1 and U2 properties which are set with the per WKT values
													//This tell MG to read the U1 properties from the feature
		cmd.add[0].wkts[0].user1 = data.tooltip;	//Set the tooltip value
	}
					 
	//Ovverride colors
	if ( data.strokeColor)
		cmd.add[0].compoundStyle[0].params.push({symbol:'MapMarker', param:'STROKECOLOR', value:data.strokeColor});
	if ( data.fillColor)
		cmd.add[0].compoundStyle[0].params.push({symbol:'MapMarker', param:'COLOR', value:data.fillColor});
	
	//Do the dirty done dirt chip
	handleTemporaryLayers(cmd);
}




/**
 * 
 * Function: toggleButtonVisibility
 * 
 * 
 * 
 * Parameters:
 * 	@param name
 * 	@param state
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function toggleButtonVisibility (name,state) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('toggleButtonVisibility()'); }

	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("toggleButtonVisibility() not yet implemented on mobile!"); }
		return true;
	} else {
		if ( isset(top) && isset(top.main) && isset(top.main.ViewerFrame) && isset(top.main.ViewerFrame.tbFrame) ) {
			var c = top.main.ViewerFrame.tbFrame.parent.commands;
			for (var i in c) {
				if ( c[i].name == name ) {
					c[i].enabled = state ? true : false;
					break;
				}
			}
			top.main.ViewerFrame.tbFrame.OnCmdStateChanged();
			return true;
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The map doesn't exist."); }
			return false;
		}
	}
}



/**
 * 
 * Function: setLayerGroupExpandable
 * 
 * FIXME questa funzione non fa niente -.-
 * 
 * Parameters:
 * 	@param layerGroupName
 * 	@param expandable
 * 	@param onSuccess
 * 	@param onFail
 * 
 * Returns:
 * 	@returns {Boolean}
 */
function setLayerGroupExpandable(layerGroupName, expandable, onSuccess, onFail) {
	
	if ( typeof logger != 'undefined' && isset(logger) ) { logger.i('setLayerGroupExpandable()'); }
	
	
	if ( istrue(onMobile) ) {
		if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("setLayerGroupExpandable() not yet implemented on mobile!"); }
		if (onSuccess) { eval(onSuccess); } // FIXME è giusto chiamarlo lo stesso?
		return true;
	} else {
		if ( isset(top) && isset(top.main) && isset(top.main.ViewerFrame) && isset(top.main.ViewerFrame.mapFrame) ) {
			var layers = top.main.ViewerFrame.mapFrame.GetLayers(false, false);
			var groups = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame.tree;
			if (onSuccess) { eval(onSuccess); }
			return true;
		} else {
			if ( typeof logger != 'undefined' && isset(logger) ) { logger.w("The map doesn't exist."); }
			return false;
		}
		
		
	}
	
	//var layers = top.main.ViewerFrame.mapFrame.GetLayers(false, false);
	//for (var i=0; i<layers.length; i++) {
	//	console.log('Layer: ' + layers[i].name);
	//}
	//var groups = top.main.ViewerFrame.mapFrame.GetLayerGroups();
 	//var groups = top.main.ViewerFrame.mapFrame.LegendCtrl.legendUiFrame.tree;	
	//for (var i=0; i<groups.length; i++) {
	//	console.log('Group: ' + groups[i].name);
	//}
	/*
	var tempLayers = { success: function(data) {
		console.log('Data: ' + data);
	} };
	getTemporaryLayers(tempLayers);
	*/
	//if (onSuccess) { eval(onSuccess); }
}




/**** SEZIONE UTILITY WRAPPER JAVASCRIPT FUNCTIONS ****/
function documentLocationWrapper(url) {
	if (typeof open_viewer == 'object') {
		open_viewer.documentLocationWrapper(url);
	}else{
		document.location=url;
	}
}



}

var LIBVIEWER_LOADED = true;

