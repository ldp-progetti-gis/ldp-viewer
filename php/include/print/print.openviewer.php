<?php require_once '../../etc/config.inc.php'; ?>

<script type="text/javascript" src="<?php echo $GLOBALS['URLBaseInclude']; ?>/js/jspdf/1.3.2/dist/jspdf.min.js"></script>

<script>
$(document).ready(function() {
	//Si disabilita il submit del form sul press dell'invio nel campo di testo
	$("#openviewer_print_map_label").keydown(function(event){
		if(event.keyCode == 13) {
			event.preventDefault();
			return false;
		}
	});
	
	$("#stampa_scala_corrente").html(getMapScale());
});
</script>

<form id="stampa" name="" action="" method="">
	<h2>Titolo della stampa:</h2>
	<!--<label for="openviewer_print_map_label">Titolo:</label>&nbsp;--><input class="campo" type="text" placeholder="Titolo della stampa" size="50" name="openviewer_print_map_label" id="openviewer_print_map_label"><br />
	<p>Il titolo compare sovrapposto all'immagine, in alto a sinistra: lascia il campo vuoto per non stampare il titolo.</p>
	<h2>Dimensioni del foglio</h2>
	<input class="radio" type="radio" name="openviewer_print_map_formato_pagina" id="openviewer_print_map_formatoA4" value="a4" checked="true">
	<label for="openviewer_print_map_formatoA4">Formato <strong>A4</strong></label>
	<br />
	<input class="radio" type="radio" name="openviewer_print_map_formato_pagina" id="openviewer_print_map_formatoA3" value="a3">
	<label for="openviewer_print_map_formatoA3">Formato <strong>A3</strong></label>
	<br />
	<input class="radio" type="radio" name="openviewer_print_map_formato_pagina" id="openviewer_print_map_formatoA2" value="a2">
	<label for="openviewer_print_map_formatoA2">Formato <strong>A2</strong></label>
	<h2>Opzioni</h2>
	<input class="radio" type="radio" name="openviewer_print_map_adatta_scala" value="adatta" id="adatta">
	<label for="adatta">Adatta alla grandezza della pagina</label>
	<p>La scala della vista sulla mappa viene modificata automaticamente per adattarla alle dimensioni del foglio di stampa.</p>
	<input class="radio" type="radio" name="openviewer_print_map_adatta_scala" value="scala" id="scala" checked="true">
	<label for="scala">Stampa alla scala corrente (1:<span id="stampa_scala_corrente"></span>)</label>
	<p>L'estensione dell'area stampata viene modificata per adattarla alle dimensioni del foglio ed alla scala corrente.</p>
	<hr/>
	<input class="genera" type="button" value="Crea documento PDF" onclick="open_viewer.getPrintablePage($('#openviewer_print_map_label').val(),$('input[name=\'openviewer_print_map_formato_pagina\']:checked').val(),$('input[name=\'openviewer_print_map_adatta_scala\']:checked').val())" />
</form>
