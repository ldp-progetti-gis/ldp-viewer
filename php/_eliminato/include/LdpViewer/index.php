<?php
	
	require_once $_SERVER['DOCUMENT_ROOT'] . "/share/include/php/ldp/LdpProject/libLdpProject.template.php";
	
	try {
		
		$ldpProject = new LdpProject("config.inc.php");
		//$ldpProject->loadLib(LdpProject::LIB_LOGIN_TEMPLATE, array('getback' => false));
		$libSmarty = $ldpProject->loadLib(LdpProject::LIB_SMARTY);
		
		// ~~~~~~~~~~~~~~~~~~~~~~~ Creo la pagina a partire dal template ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		try {
			
			$tpl = $ldpProject->prepareBasicTemplate($libSmarty, 'index.tpl');
			$libSmarty->display($tpl);
			
		} catch (Exception $e) {
			throw new LdpException($e, null, "Errore del template");
		}
	
	} catch (LdPException $l) {
		$l->dieWithHtml();
	} catch (Exception $e) {
		$l = new LdpException($e);
		$l->dieWithHtml();
	}
	
	
?>