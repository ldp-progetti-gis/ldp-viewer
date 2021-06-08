/**
 * GENERAL JAVASCRIPT UTILITIES
 * 
 * Classes:
 * - generalUtilities: class to handle all the functionalities
 *
 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
 * @version: 1.0
 * @license: GNU General Public License v2.0
 */


/** MAIN CLASS: generalUtilities
 * ---------------------------------------------------------------
 */
var generalUtilities = function(params) {
	// declared globally as ov_utils
	
	this.showConsoleMsg = params.flagConsMsg; // show console messages
}

/** Calculate a simple hash code */
generalUtilities.prototype.simpleHash = function(s) {
	return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
}
/** Calculate the hash code of an url (used to create unique ID for layers names) */
generalUtilities.prototype.hashCode = function(str) {
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr   = str.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
/** Check the validity of an URL */
generalUtilities.prototype.ValidURL = function(str) {
	var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if(!regex .test(str)) {
		return false;
	} else {
		return true;
	}
}
/** Convert an hexadecimal to decimal */
generalUtilities.prototype.hex2dec = function (theHex) {
    if ( (theHex.charAt(0) > "F") || (theHex.charAt(1) > "F") ) {
        ov_utils.ovLog('Hexadecimal (00-FF) only, please...','HEX2EDEC', 'error'); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
        return 0;
    }
    var retDec  = parseInt(theHex,16)/255;
    return retDec;
}
/** Format a JSON object */
generalUtilities.prototype.createElementsFromJSONCustom = function(json, html){
	var html = "<ul>" + json + "</ul>";
	return html;
}
/** Format a JSON object as a bulleted list */
generalUtilities.prototype.createElementsFromJSON = function(json){
	//console.log(json);
	var key;
	var html = "<ul class='page_container'>";
	for (key in json) {
		if (json.hasOwnProperty(key)) {
			//console.log(key + " = " + json[key]);
			html = html + "<li class='page_container'><label class='page_container'>" + key + "</label>&nbsp;<span class='page_container'><b>" + json[key] + "</b></span>"; 
		}

	}  
	html = html + "</ul>";
	return html;
}
/** Escape an object name to be found with JQuery $ */
generalUtilities.prototype.jQescape = function(aStr) {
    return aStr.replace( /(:|\.|\[|\]|,|=|@)/g, "\\$1" );
}
/** Simple logging and notification (types supported: consolelog, error, warning, alert)
 *  - empty-type   : console                            (if flag_console_messages is TRUE)
 *  - consolelog   : console                            (if flag_console_messages is TRUE)
 *  - error        : console forced                     (even if flag_console_messages is FALSE)
 *  - warning      : console forced    statusbar        (even if flag_console_messages is FALSE)
 *  - alert        :                   statusbar alert 
 */
generalUtilities.prototype.ovLog = function (aMsg, aTitle, aType, flagForce) {
// ovLog(aMsg, aTitle, aType, flagForce); // supported types: <empty> or "consolelog" (console/flag_console_messages depending) "error" (console-forced) "warning" (console-forced) "alert" (statusbar alert)
    // initial checks
    if(typeof aMsg == 'undefined' || aMsg == '') return false;

    // structure the information
    var msgObj = aMsg;
    if(Array.isArray(msgObj)&&msgObj.length==1) msgObj = msgObj[0]; // simplify the "msg" object
    
    var msgFirstLine = msgObj;
    if(Array.isArray(msgObj)) msgFirstLine = msgObj[0];

    // the following variables are defined "globally" in the TPL file
    // - flag_console_messages      (show/hide console messages)
    // - footer_panel_ready         (object of the footer, with the status messages)
    // - timeout_id_readymsg        (id of the timeout)
    // - timeout_duration_readymsg  (duration in milliseconds of the timeout)
    
    if(typeof aType != 'undefined') aType = aType.toLowerCase();
    if(aType == 'error') aTitle = '***** ERROR ***** \n'+aTitle+'\n*****************';
    if(typeof flagForce == 'undefined') flagForce = false;
    
    // Log to the browser console
    if(flag_console_messages||flagForce||aType=='warning'||aType=='error') { 
        if(aTitle!=''&&aTitle!=undefined)  console.log(aTitle+'\n',msgObj);
        else            console.log(msgObj);
        //if(aTitle!='')  eval(console.log(aTitle+', '+aMsg.join(', ')));
        //else            eval(console.log(aMsg.join(', ')));
    }
    
    // Log to status bar or alert message
    switch (aType) {
        case 'consolelog':
        case 'error':
        break;
        case 'warning':
            footer_panel_ready.html(msgFirstLine);
            clearTimeout(timeout_id_readymsg);
            timeout_id_readymsg = setTimeout(function() {footer_panel_ready.html(strings_interface.welcome_msg_statusbar);}, timeout_duration_readymsg);
        break;
        case 'alert':
            footer_panel_ready.html(msgFirstLine);
            clearTimeout(timeout_id_readymsg);
            timeout_id_readymsg = setTimeout(function() {footer_panel_ready.html(strings_interface.welcome_msg_statusbar);}, timeout_duration_readymsg);
            alert(msgFirstLine);
        break;
    }
   return true;
}





