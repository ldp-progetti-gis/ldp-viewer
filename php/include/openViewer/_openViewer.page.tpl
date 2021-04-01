<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">
	<head xml:lang="it">
		<title>{block head_title}SIT: mappa interattiva{/block}</title>
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="language" content="italian" />
		<meta name="keywords" content=""/>
		<meta name="description" content="Mappa interattiva"/>
		<meta name="page-topic" content="" />
		<meta name="copyright" content="LdP Progetti GIS"/>
		<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0' name='viewport' />
		
		{block head_meta}{/block}
		
		{block head_favicon}<link rel="shortcut icon" href="{$GLOBALS['favicon']}" type="image/x-icon" />{/block}

		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/openlayers/6.5.0/ol.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/proj4.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/EPSG-3003.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/EPSG-4326.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/EPSG-6707.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/EPSG-32632.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/proj4/proj4-2.3.16/EPSG-25832.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery/3.5.x/jquery-3.5.1.min.js"></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery/3.5.x/jquery-migrate-3.3.0.js"></script>
		
		{*<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/jquery-ui-1.10.1.min.js" defer></script>*}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/1.12.x/jquery-ui-1.12.1.min.js" defer></script>
		
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jquery.dialogextend/jquery.dialogextend.js" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/jqueryui/jquery.ui.touch-punch.min.js" defer></script>

		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/strings.js" defer></script>

		{* BOOTSTRAP *}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/bootstrap/4.3.1/js/bootstrap.bundle.min.js" defer></script>

		{* HELP creato con Bootstrap Tour (http://bootstraptour.com/) *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/bootstrap-tour/build/css/bootstrap-tour-standalone.min.css" />
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/js/bootstrap-tour/build/js/bootstrap-tour-standalone.min.js" defer></script>

		{* FontAwesome KIT *}
		<script src="https://kit.fontawesome.com/b706b5e040.js" defer></script>

		{assign var=t value=1|mt_rand:10000000}
		{*{assign var=hash value=1234}*}
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/openViewer/openViewerMap.js?{$t}" defer></script>
		<script type="text/javascript" src="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer.js?{$t}" defer></script>
		
		{*{include file="{$GLOBALS['PATHBaseInclude']}/tpl/LdpJsLogger/LdpJsLogger.tpl" GLOBALS=$GLOBALS}*}
		{block head_js}{/block}
		
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/css/jqueryui/jquery-ui-1.12.1.css" media="screen" />

		{* BOOTSTRAP CSS*}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/bootstrap/4.3.1/css/bootstrap.min.css" />
		
		{*CSS di BASE PRIMARIO *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer.css?{$t}"/>
		
		{*CSS per responsive layout (media queries e altro) *}
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/openViewer/openViewer_responsive.css"/>
		
		<link rel="stylesheet" type="text/css" href="{$GLOBALS['URLBaseInclude']}/js/openlayers/6.5.0/ol.css" />
		
		{block head_css}{/block}
	</head>
	<body>
		{include file="{$GLOBALS['PATHBaseInclude']}/openViewer/openViewer.tpl" GLOBALS=$GLOBALS}
	</body>
</html>
