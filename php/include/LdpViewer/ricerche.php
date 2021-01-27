<?php
	
	if ( !isset($_GET['mappa']) ) {
		error_log(__FILE__.":".__LINE__." Parametro \$_GET['mappa'] non passato, impossibile proseguire.");
		die("Parametri obbligatori mancanti, impossibile proseguire.");
	}
	
	require_once '../../../etc/config.mappa.inc.php';
	
	// Uso un po' di variabili, almeno il codice diventa più leggibile..
	$package = $GLOBALS['package'];
	$dati_package = $GLOBALS[$package];
	$mappa = $_GET['mappa'];
	$dati_mappa = $dati_package[$mappa];
	
?>

<script type="text/javascript" src="<?php echo $GLOBALS['URLBaseInclude']?>/js/jquery.autocomplete.js"></script>

<div class="apps_container">
	
	<h1>Ricerche</h1>
		
	<?php require_once $GLOBALS['PATHBaseInclude'].'/php/ricerche.template.php'; ?>
		
</div>
