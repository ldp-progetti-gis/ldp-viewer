<?php
	session_start();

	$_SESSION['viewer']="myOV";
	require_once "etc/config.app.inc.php";
	//require_once $GLOBALS['resources_file'];
	require_once "include/smarty/Smarty.class.php";
	
	try {
		
 		//$ldpProject = new LdpProject();
		//$ldpProject->loadLib(LdpProject::LIB_LOGIN_TEMPLATE, array('getback' => false));
		try { 
			$libSmarty = new Smarty(); 
			$templateTmp = "include/tpl";
			if ( !file_exists($templateTmp) ) { mkdir($templateTmp); }
			$libSmarty->setCompileDir($templateTmp);
			$libSmarty->setCacheDir($templateTmp);
			$libSmarty->setConfigDir($templateTmp);
			$libSmarty->clearAllCache();
			
			$libSmarty->setTemplateDir("include/tpl");
			
		} catch (Exception $e) { 
			throw new LdpException("Impossible instanziare la libreria Smarty: " . $e->getMessage()); 
		}
		
		//Se viene passato un'inquadramento allora si sovrascrivono temporaneamente le mapOptions
		if($_GET['x']!="" && $_GET['y']!="" && $_GET['zoom']!="") {

			//Fallback nel caso si arrivi dal vistasu del nuovo viewer ma non siano definiti i parametri di configurazione per il nuovo viewer
			if (!is_array($GLOBALS[$GLOBALS['package']]['map_options'])) {
				header("Status: 301 Moved Permanently");
				header("Location:".$_SERVER['PHP_SELF']."?". str_replace("viewer=myOV","viewer=ajax",$_SERVER['QUERY_STRING']));
				exit;
			}


			$GLOBALS[$GLOBALS['package']]['map_options']['center_override']=array(floatval($_GET['x']),floatval($_GET['y']));
			$GLOBALS[$GLOBALS['package']]['map_options']['zoom_override']=floatval($_GET['zoom']);
		}


		// ~~~~~~~~~~~~~~~~~~~~~~~ Creo la pagina a partire dal template ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		try {
			
			//$tpl = $ldpProject->prepareBasicTemplate($libSmarty, 'index.tpl');
			$tpl = $libSmarty->createTemplate('index.tpl');
			$tpl->assign('GLOBALS', $GLOBALS);
			
			$libSmarty->display($tpl);
			
		} catch (Exception $e) {
			echo $e->getMessage();
			throw new LdpException($e, null, "Errore del template");
		}
	
	} catch (LdPException $l) {
		$l->dieWithHtml();
	} catch (Exception $e) {
		$l = new LdpException($e);
		$l->dieWithHtml();
	}

	
?>

