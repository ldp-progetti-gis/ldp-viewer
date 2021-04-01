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
<div class="apps_container">
	
	<h1>Cronologia delle pagine visitate</h1>
	
	<div class="indicazioni">
		
		<div id="infolayer">
			<div class="wait">Caricamento in corso..</div>
		</div>
		
	</div>
</div>

<script type="text/javascript">
	$(document).ready(function() {
		
		var history = ldpOlViewer_navigationGetHistory();
		console.log(history);
		if ( typeof history == 'undefined' || history == null || typeof history.length == 'undefined' || history.length == 0 ) {
			$('#infolayer').html('<div class="info">Nessuna cronologia presente</div>');
		} else {
			$('#infolayer').html('<ul>');
			for (var index in history) {
				$('#infolayer').append('<li><a href="javascript:;" onclick="ldpOlViewer_navigationLoad(\'' + history[index].url + '\',\'' + history[index].target + '\',\'' + history[index].title + '\')">' + history[index].title + '</a> (' + history[index].date + ')</li>');
			}
			$('#infolayer').append('</ul>');
		}
		
	});
</script>
