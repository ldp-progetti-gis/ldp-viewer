<?php
	require_once 'etc/config.app.inc.php';
	require_once $GLOBALS['resources_file'];
	
	$pageTitle		= $GLOBALS['app_name'].' - '.$GLOBALS['strings']['interface']['word_information'];
	$appLanguage	= $GLOBALS[$GLOBALS['package']]['language'];
	$appCopyright	= 'Copyright (C) '.$GLOBALS['release_year'].' '.$GLOBALS['app_name'].' '.$GLOBALS['app_maintainer'];

	$lineVersion	= ucwords(strtolower($GLOBALS['strings']['interface']['word_version'])).' '.$GLOBALS['app_version'].' ('.$GLOBALS['release_year'].')';
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
		<div class="page_about">
			<h1 class="page_about"><?php echo $pageTitle ?></h1>
			<p class="page_about">
				<?php echo $lineVersion .'<br>'.
							$appCopyright .'<br>&nbsp;<br><u>'.
							$lineLicense . '</u>' ?>
			</p>
			
			<p class="page_about">
				<?php echo $GLOBALS['strings']['application_info']['license_description'] ?>
				<br>&nbsp;<br><i>(<?php echo $GLOBALS['strings']['interface']['sentence_sendemailto'] ?>: 
				<a href='mailto:<?php echo $GLOBALS['contact_email'] ?>' title='(<?php echo $GLOBALS['strings']['interface']['sentence_sendemailto'].' '.$GLOBALS['app_maintainer'] ?>'><u><?php echo $GLOBALS['contact_email'] ?></u></a>)</i>
			</p>
			<p class="page_about">
				<?php echo '<u>'.$GLOBALS['strings']['interface']['sentence_generaldescription'] .'</u><br><ul class="page_about">'.
							'<li class="page_about">'.'<b>'.$GLOBALS['app_name'].'</b> '.$GLOBALS['strings']['application_info']['application_description'] .'</li>'.
							'<li class="page_about">'.$GLOBALS['strings']['application_info']['application_mainfeatures'] .'</li>'.
							'</ul>' ?>
			</p>
			<p class="page_about">
				<?php echo '<u>'.$GLOBALS['strings']['interface']['sentence_epsgsupported'] .'</u><br><ul class="page_about">'.
							'<li class="page_about">'.implode(" ",$GLOBALS['epsg_supported']).'</li>'.
							'</ul>' ?>
			</p>
			<p class="page_about">
				<?php echo $GLOBALS['strings']['interface']['sentence_releasenote'] .'<br><ul class="page_about">'.
							'<li class="page_about">'.'<u>'.$GLOBALS['strings']['interface']['word_release'].' '.$GLOBALS['app_version'].' ('.$GLOBALS['release_year'].'.'.$GLOBALS['release_month'].')</u><br> '.$GLOBALS['strings']['application_info']['application_noterelease1'] .'</li>'.
							'</ul>' ?>
			</p>
			<p class="page_about">
				<?php echo $GLOBALS['strings']['interface']['sentence_usedlibraries'] .'<br><ul class="page_about">'.
							'<li class="page_about">'.$lineOLVersion.'</li>'.
							'<li class="page_about">'.$lineP4Version.'</li>'.
							'<li class="page_about">'.$lineJQVersion.'</li>'.
							'</ul>' ?>
			</p>
		</div>
	</body>
</html>
