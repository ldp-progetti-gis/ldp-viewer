{*
	/**
	 * TEMPLATE SMARTY - PAGE
	 *
	 * This template defines the PAGE of the application, with all metadata,
	 * links, reference, css.
	 * Includes: openViewer.tpl for the definition of the graphical components.
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
*}
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">
	<head xml:lang="it">
		<title>{block head_title}{$GLOBALS[$GLOBALS['package']]['app_title_short']} - Open Viewer ({$GLOBALS['app_version']}){/block}</title>
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="language" content="{$GLOBALS[$GLOBALS['package']]['language']}" />
		<meta name="keywords" content=""/>
		<meta name="description" content="{$GLOBALS[$GLOBALS.package].app_department} {$GLOBALS[$GLOBALS.package].app_title_long}"/>
		<meta name="page-topic" content="" />
		<meta name="copyright" content="Copyright {$GLOBALS['release_year']} {$GLOBALS['app_copyright']}"/>
		<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0' name='viewport' />
		
		{block head_meta}{/block}
		
		{block head_favicon}<link rel="shortcut icon" href="{$GLOBALS['favicon']}" type="image/x-icon" />{/block}

		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/openlayers/{$GLOBALS['lib_openlayers_version']}/ol.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-{$GLOBALS['lib_proj4_version']}/proj4.js" defer></script>
		{* load specific EPSG definitions *}
		{foreach $GLOBALS['epsg_supported'] as $epsg}
			<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/epsg/EPSG-{$epsg}.js" defer></script>
		{/foreach}
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery/{$GLOBALS['lib_jquery_version']}/jquery-3.5.1.min.js"></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery/{$GLOBALS['lib_jquery_version']}/jquery-migrate-3.3.0.js"></script>
		
		{*<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/jquery-ui-1.10.1.min.js" defer></script>*}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/1.12.x/jquery-ui-1.12.1.min.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery.dialogextend/jquery.dialogextend.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/jquery.ui.touch-punch.min.js" defer></script>

		{*
		<script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js?v1.3.0"></script>
		<script type="text/javascript" src="https://unpkg.com/dom-to-image-more@2.7.1/dist/dom-to-image-more.min.js"></script>
		<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js"></script>
		*}
		
		{* OPENVIEWER PLUGINS *}
		<script type="text/javascript" src="{$GLOBALS[$GLOBALS.package]['plugins']['wmslayers']['jsLib']}" defer></script>
		
		{* BOOTSTRAP *}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/bootstrap/4.3.1/js/bootstrap.bundle.min.js" defer></script>

		{* HELP build with Bootstrap Tour (http://bootstraptour.com/) *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/bootstrap-tour/build/css/bootstrap-tour-standalone.min.css" />
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/bootstrap-tour/build/js/bootstrap-tour-standalone.min.js" defer></script>

		{* FontAwesome KIT *}
		<script src="https://kit.fontawesome.com/b706b5e040.js" defer></script>

		{* OVD convert the PHP strings to JS array *}
		<script>var strings_interface = {json_encode($GLOBALS['strings']['interface'])};</script>
		<script>var strings_tour_help = {json_encode($GLOBALS['strings']['tour_help'])};</script>
		<script>var epsg_supported = {json_encode($GLOBALS['epsg_supported'])};</script>
		        
		{assign var=t value=1|mt_rand:10000000}
		{*{assign var=hash value=1234}*}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/utilities/generalUtilities.js?{$t}" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/openViewer/openViewerMap.js?{$t}" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer.js?{$t}" defer></script>
		
		{block head_js}{/block}
		
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/css/jqueryui/jquery-ui-1.12.1.css" media="screen" />

		{* BOOTSTRAP CSS *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/bootstrap/4.3.1/css/bootstrap.min.css" />
		
		{* MAIN CSS *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer.css?{$t}"/>
		
		{* CSS user for responsive layout (media queries and others) *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer_responsive.css"/>
		
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/openlayers/{$GLOBALS['lib_openlayers_version']}/ol.css" />
		
		{block head_css}{/block}
	</head>
	<body>
		{include file="{$GLOBALS['PATHBaseInclude']}/openViewer/openViewer.tpl" GLOBALS=$GLOBALS}
	</body>
</html>
