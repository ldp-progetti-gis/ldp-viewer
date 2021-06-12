<?php
	require_once 'etc/config.app.inc.php';
	require_once $GLOBALS['resources_file'];
	
	$pageTitle		= $GLOBALS['app_name'].' - '.$GLOBALS['strings']['interface']['tab_search_title'];
	$appLanguage	= $GLOBALS[$GLOBALS['package']]['language'];
	$appCopyright	= 'Copyright (C) '.$GLOBALS['release_year'].' '.$GLOBALS['app_name'].' '.$GLOBALS['app_maintainer'];
	
	$pageContent	= $GLOBALS['strings']['interface']['tab_search_content'];
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
		
		<script type="text/javascript">
		var selectType = function(aType) {
			switch(aType) {
				case 'coords':
					$('#search_by_text_filter')[0].disabled = true;
					$('#search_by_coordx_filter')[0].disabled = false;
					$('#search_by_coordy_filter')[0].disabled = false;
					break;
					
				default: // case 'text'
					$('#search_by_text_filter')[0].disabled = false;
					$('#search_by_coordx_filter')[0].disabled = true;
					$('#search_by_coordy_filter')[0].disabled = true;
					break;
				
			}
		}
		var runSearch = function() {
			var flagCurrentScale = false;
			if($('#search_keep_zoom').is(':checked')) flagCurrentScale = true;

			if($('#search_by_coords').is(':checked')) {
				var params =	{
								aType: 'coords',
								coordX: $('#search_by_coordx_filter').val(),
								coordY: $('#search_by_coordy_filter').val(),
								objFoundAddress: $('#search_tab_address_found'),
								objFoundCoordinates: $('#search_tab_coordinates_found'),
								objFoundLicence: $('#search_tab_licence'),
								keepCurrentScale: flagCurrentScale,
								}
								
				//alert('coords');
				}
			else  { // if($('search_by_text')[0].is(':checked')) {
				var params =	{
								aType: 'text',
								searchText: $('#search_by_text_filter').val(),
								objFoundAddress: $('#search_tab_address_found'),
								objFoundCoordinates: $('#search_tab_coordinates_found'),
								objFoundLicence: $('#search_tab_licence'),
								keepCurrentScale: flagCurrentScale, 
								}
				//alert('text');
				}
								
			
			if(params!==undefined) {
				open_viewer.ev_run_location_search(params);
			} else {
			}
		}
		</script>
	</head>

	<body>
		<!--
		<div class="page_container">
			<h1 class='page_container_title'><?php echo $GLOBALS['strings']['interface']['sentence_searchpage'] ?></h1>
		</div>
		-->
		<div class="page_container">
			<h1 class='page_about'><?php echo $pageContent ?><br>&nbsp;</h1>
			
			<p class="page_about">
				<input type="radio" class="page_about" name="search_options" id="search_by_text" onclick='selectType("text")' checked>
				<?php echo $GLOBALS['strings']['interface']['sentence_searchbytext'] ?>
				<br>&nbsp;
				<br><input id="search_by_text_filter" size="30" placeholder="<?php echo $GLOBALS['strings']['interface']['sentence_typeaddressstring'] ?>" title="<?php echo $GLOBALS['strings']['interface']['sentence_typeaddressstring'] ?>">
				<br>&nbsp;
			</p>
			<p class="page_about">
				<input type="radio" class="page_about" name="search_options" id="search_by_coords" onclick='selectType("coords")'>
				<?php echo $GLOBALS['strings']['interface']['sentence_searchbycoordinates'] ?>
				<br>&nbsp;
				<br><input id="search_by_coordx_filter" type="number" size="10" placeholder="<?php echo $GLOBALS['strings']['interface']['sentence_typecoordinatex'] ?>" title="<?php echo $GLOBALS['strings']['interface']['sentence_typecoordinatex'] ?>" disabled>
				<br><input id="search_by_coordy_filter" type="number" size="10" placeholder="<?php echo $GLOBALS['strings']['interface']['sentence_typecoordinatey'] ?>" title="<?php echo $GLOBALS['strings']['interface']['sentence_typecoordinatey'] ?>" disabled>
				<br>&nbsp;
			</p>
			<p class="page_about">
				<input type="checkbox" class="page_about" name="search_keep_zoom" id="search_keep_zoom" checked="true">
				<?php echo $GLOBALS['strings']['interface']['sentence_keepzoom'] ?>
				<br>&nbsp;
			</p>
			
			<center><button id="ov_run_search" title="Click per avviare la ricerca" onclick="runSearch();" value="Avvia ricerca">Avvia ricerca</button></center>
			
			<p>&nbsp;</p>
			<h1 class='page_about'><?php echo $GLOBALS['strings']['interface']['sentence_infofoundedlocation'] ?></h1>
			
			<p class="page_about">&nbsp;</p>
			<p class="page_about"><u><?php echo $GLOBALS['strings']['interface']['word_address'] ?></u></p>
			<p id="search_tab_address_found" class="page_about"></p>
			
			<p class="page_about">&nbsp;</p>
			<p class="page_about"><u><?php echo $GLOBALS['strings']['interface']['word_coordinates'] ?></u></p>
			<p id="search_tab_coordinates_found" class="page_about"></p>
			
			<p class="page_about">&nbsp;</p>
			<p class="page_about"><u><?php echo $GLOBALS['strings']['interface']['word_license'] ?></u></p>
			<p id="search_tab_licence" class="page_about"></p>
			
		</div>
	</body>
</html>
