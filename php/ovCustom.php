<?php
	require_once 'etc/config.app.inc.php';
	require_once $GLOBALS['resources_file'];
	
	//$pageTitle			= $GLOBALS['app_name'].' - '.$GLOBALS['strings']['interface']['word_custompage'];
	//$appLanguage		= $GLOBALS[$GLOBALS['package']]['language'];
	//$appCopyright		= 'Copyright (C) '.$GLOBALS['release_year'].' '.$GLOBALS['app_name'].' '.$GLOBALS['app_maintainer'];
	$mapTitle			= $GLOBALS[$GLOBALS['package']]['map_title'];
	$mapDescription		= $GLOBALS[$GLOBALS['package']]['map_description'];
	$mapProjection		= $GLOBALS['strings']['interface']['sentence_renderingprojection'].': '.$GLOBALS[$GLOBALS['package']]['map_options']['map_projection'];
	
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
			<!-- h1 class='page_container_title'><?php echo $GLOBALS['strings']['interface']['sentence_custompage'] ?></h1> -->
			<h1 class="page_about"><?php echo $mapTitle ?></h1>
			<p class="page_about"><?php echo $mapDescription ?><br>&nbsp;</p>
			<p class="page_about"><?php echo $mapProjection ?><br>&nbsp;</p>
			
			<p class="page_about">
				<?php echo $lineVersion .'<br>'.
							$appCopyright .'<br>&nbsp;<br><u>'.
							$lineLicense . '</u>' ?>
			</p>
		</div>
	</body>
</html>
