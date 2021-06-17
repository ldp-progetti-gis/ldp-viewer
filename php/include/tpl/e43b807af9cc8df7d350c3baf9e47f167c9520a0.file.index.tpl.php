<?php /* Smarty version Smarty-3.1.13, created on 2021-06-17 10:24:50
         compiled from "index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:164208076260cb22f27593d1-36513315%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'e43b807af9cc8df7d350c3baf9e47f167c9520a0' => 
    array (
      0 => 'index.tpl',
      1 => 1614248068,
      2 => 'file',
    ),
    'dffdf2aaebc6fa5f40a626dcf622b36cd76b5be0' => 
    array (
      0 => 'include/openViewer/openViewer.page.tpl',
      1 => 1623925318,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '164208076260cb22f27593d1-36513315',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'GLOBALS' => 0,
    'epsg' => 0,
    't' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_60cb22f27c7a64_18049266',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_60cb22f27c7a64_18049266')) {function content_60cb22f27c7a64_18049266($_smarty_tpl) {?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="it" lang="it">
	<head xml:lang="it">
		<title><?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_title_short'];?>
 - Open Viewer (<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['app_version'];?>
)</title>
		
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta http-equiv="Content-Style-Type" content="text/css" />
		<meta http-equiv="Content-Script-Type" content="text/javascript" />
		<meta name="language" content="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['language'];?>
" />
		<meta name="keywords" content=""/>
		<meta name="description" content="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_department'];?>
 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['app_title_long'];?>
"/>
		<meta name="page-topic" content="" />
		<meta name="copyright" content="Copyright <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['release_year'];?>
 <?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['app_copyright'];?>
"/>
		<meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0' name='viewport' />
		
		
		
		<link rel="shortcut icon" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['favicon'];?>
" type="image/x-icon" />

		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/openlayers/<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['lib_openlayers_version'];?>
/ol.js" defer></script>
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/proj4/proj4-<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['lib_proj4_version'];?>
/proj4.js" defer></script>
		
		<?php  $_smarty_tpl->tpl_vars['epsg'] = new Smarty_Variable; $_smarty_tpl->tpl_vars['epsg']->_loop = false;
 $_from = $_smarty_tpl->tpl_vars['GLOBALS']->value['epsg_supported']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
foreach ($_from as $_smarty_tpl->tpl_vars['epsg']->key => $_smarty_tpl->tpl_vars['epsg']->value){
$_smarty_tpl->tpl_vars['epsg']->_loop = true;
?>
			<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/proj4/epsg/EPSG-<?php echo $_smarty_tpl->tpl_vars['epsg']->value;?>
.js" defer></script>
		<?php } ?>
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/jquery/<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['lib_jquery_version'];?>
/jquery-3.5.1.min.js"></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/jquery/<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['lib_jquery_version'];?>
/jquery-migrate-3.3.0.js"></script>
		
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/jqueryui/1.12.x/jquery-ui-1.12.1.min.js" defer></script>
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/jquery.dialogextend/jquery.dialogextend.js" defer></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/jqueryui/jquery.ui.touch-punch.min.js" defer></script>

		
		
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value[$_smarty_tpl->tpl_vars['GLOBALS']->value['package']]['plugins']['wmslayers']['jsLib'];?>
" defer></script>
		
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/bootstrap/4.3.1/js/bootstrap.bundle.min.js" defer></script>

		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/bootstrap-tour/build/css/bootstrap-tour-standalone.min.css" />
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/bootstrap-tour/build/js/bootstrap-tour-standalone.min.js" defer></script>

		
		<script src="https://kit.fontawesome.com/b706b5e040.js" defer></script>

		
		<script>var strings_interface = <?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['interface']);?>
;</script>
		<script>var strings_tour_help = <?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value['strings']['tour_help']);?>
;</script>
		<script>var epsg_supported = <?php echo json_encode($_smarty_tpl->tpl_vars['GLOBALS']->value['epsg_supported']);?>
;</script>
		        
		<?php $_smarty_tpl->tpl_vars['t'] = new Smarty_variable(mt_rand(1,10000000), null, 0);?>
		
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/utilities/generalUtilities.js?<?php echo $_smarty_tpl->tpl_vars['t']->value;?>
" defer></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/openViewer/openViewerMap.js?<?php echo $_smarty_tpl->tpl_vars['t']->value;?>
" defer></script>
		<script type="text/javascript" src="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/openViewer/openViewer.js?<?php echo $_smarty_tpl->tpl_vars['t']->value;?>
" defer></script>
		
		



		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/css/jqueryui/jquery-ui-1.12.1.css" media="screen" />

		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/bootstrap/4.3.1/css/bootstrap.min.css" />
		
		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/openViewer/openViewer.css?<?php echo $_smarty_tpl->tpl_vars['t']->value;?>
"/>
		
		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/openViewer/openViewer_responsive.css"/>
		
		<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['URLBaseInclude'];?>
/js/openlayers/<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['lib_openlayers_version'];?>
/ol.css" />
		
		
<!--<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['mappa']['_dbsit']['css']['screen'];?>
" media="screen" />
<link rel="stylesheet" type="text/css" href="<?php echo $_smarty_tpl->tpl_vars['GLOBALS']->value['mappa']['_dbsit']['css']['print'];?>
" media="print" />-->

	</head>
	<body>
		<?php echo $_smarty_tpl->getSubTemplate (((string)$_smarty_tpl->tpl_vars['GLOBALS']->value['PATHBaseInclude'])."/openViewer/openViewer.tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array('GLOBALS'=>$_smarty_tpl->tpl_vars['GLOBALS']->value), 0);?>

	</body>
</html>
<?php }} ?>