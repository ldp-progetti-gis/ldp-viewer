<?php
	require_once 'etc/config.app.inc.php';
	require_once $GLOBALS['resources_file'];
	
	$pageTitle		= $GLOBALS['app_name'].' - '.$GLOBALS['strings']['interface']['word_information'];
	$appLanguage	= $GLOBALS[$GLOBALS['package']]['language'];
	$appCopyright	= 'Copyright (C) '.$GLOBALS['year'].' '.$GLOBALS['app_name'].' '.$GLOBALS['app_maintainer'];

	$lineVersion	= ucwords(strtolower($GLOBALS['strings']['interface']['word_version'])).' '.$GLOBALS['app_version'].' ('.$GLOBALS['year'].')';
	$lineLicense	= ucwords(strtolower($GLOBALS['strings']['interface']['word_license'])).' '.$GLOBALS['license'];

	$lineOLVersion	= 'OpenLayers '.ucwords(strtolower($GLOBALS['strings']['interface']['word_version'])).' '.$GLOBALS['lib_openlayers_version'];
	$lineP4Version	= 'Proj4 '.ucwords(strtolower($GLOBALS['strings']['interface']['word_version'])).' '.$GLOBALS['lib_proj4_version'];
	$lineJQVersion	= 'JQuery '.ucwords(strtolower($GLOBALS['strings']['interface']['word_version'])).' '.$GLOBALS['lib_jquery_version'];
	
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">
	<head xml:lang="it">
		<title><?php echo $pageTitle ?></title>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="language" content="<?php echo $appLanguage ?>" />
		<meta name="copyright" content="<?php echo $appCopyright ?>"/>

	</head>

	<body>
		<div class="page_container">
			<h4><?php echo $pageTitle ?></h4>
			<p>
				<?php echo $lineVersion .'<br>'.
				           $appCopyright .'<br>&nbsp;<br><u>'.
				           $lineLicense . '</u>' ?>
			</p>
			
			<p>
				<?php echo $GLOBALS['license_description'] ?>
				<br>&nbsp;<br><i>(<?php echo $GLOBALS['strings']['interface']['sentence_sendemailto'] ?>: 
				<a href='mailto:ldp@ldpgis.it' title='(<?php echo $GLOBALS['strings']['interface']['sentence_sendemailto'].' '.$GLOBALS['app_maintainer'] ?>'><u>ldp@ldpgis.it</u></a>)</i>
			</p>
			<p>
				<?php echo '<u>'.$GLOBALS['strings']['interface']['sentence_generaldescription'] .'</u><br><ul>'.
				           '<li>'.$GLOBALS['general_description'] .'</li>'.
				           '<li>'.$GLOBALS['main_features'] .'</li>'.
				           '</ul>' ?>
			</p>
			<p>
				<?php echo '<u>'.$GLOBALS['strings']['interface']['sentence_epsgsupported'] .'</u><br><ul>'.
				           '<li>'.implode(" ",$GLOBALS['epsg_supported']).'</li>'.
				           '</ul>' ?>
			</p>
			<p>
				<?php echo $GLOBALS['strings']['interface']['sentence_releasenote'] .'<br><ul>'.
				           '<li>'.$GLOBALS['release_note_beta'] .'</li>'.
				           '</ul>' ?>
			</p>
			<p>
				<?php echo $GLOBALS['strings']['interface']['sentence_usedlibraries'] .'<br><ul>'.
				           '<li>'.$lineOLVersion.'</li>'.
				           '<li>'.$lineP4Version.'</li>'.
				           '<li>'.$lineJQVersion.'</li>'.
				           '</ul>' ?>
			</p>
		</div>
	</body>
</html>
