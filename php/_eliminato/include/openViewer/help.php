<?php
	echo "Info";

die();
	
	require_once '../../../etc/config.mappa.inc.php';
	
	// Uso un po' di variabili, almeno il codice diventa più leggibile..
	$package = $GLOBALS['package'];
	$dati_package = $GLOBALS[$package];
	$mappa = $_GET['mappa'];
	$dati_mappa = $dati_package[$mappa];
	
?>

<div class="apps_container">
	
	<!--
	<a href="javascript:;" onclick="viewer.zoomToView('13.50656042', '43.62875763', 1000)">Test zoom to view (EPSG:4326) 1:000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('2399990', '4830597', 1000)">Test zoom to view (EPSG:3004) 1:000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('1863584', '4830597', 1000)">Test zoom to view (EPSG:3003) 1:000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('1503505', '5408036', 1000)">Test zoom to view (EPSG:900913 / EPSG:3857) 1:000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('1503505', '5408036', 5000)">Test zoom to view (EPSG:900913 / EPSG:3857) 1:5000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('1503505', '5408036', 10000)">Test zoom to view (EPSG:900913 / EPSG:3857) 1:10000</a><br/>
	<a href="javascript:;" onclick="viewer.zoomToView('1503505', '5408036', 1000000)">Test zoom to view (EPSG:900913 / EPSG:3857) 1:1000000</a><br/>
	-->
	
	<h1>Come utilizzare la mappa</h1>

	<div class="indicazioni">

				<img src="<?php echo $GLOBALS['URLImg'].'/'; ?>win_mac_linux_ie_ff_saf_chrome_iw_small.png" width="232" height="30" alt="Icone dei sistemi operativi e dei browser supportati" />
				<p>La cartografia interattiva &egrave; consultabile su sistemi operativi Microsoft Windows, Apple OSX e tutti i sistemi basati su Linux. I browser supportati sono Microsoft Internet Explorer, Mozilla Firefox, Safari, Google Chrome e Iceweasel.</p>

				<div id="infolayer">
					<h2>LIVELLI DELLA CARTOGRAFIA</h2>
					<?php switch($_GET['mappa']) {
						case "_dbsit":
					?>
						<ol>
							<li><span class="label">TODO</span> todo</li>
						</ol>
					<?php
						break;
						default:
						//Nessuna mappa passata
						break;
					}
					?>
				</div>

				<div id="infowindow">
					<h2>Finestra di navigazione</h2>
					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>colonnasx.gif" width="20" height="20" alt="Icona che indica la parte sinistra di questa finestra" /><strong>La parte sinistra</strong> della finestra &egrave; lo spazio di interazione con la Mappa interattiva ed i suoi comandi di navigazione, i livelli della cartografia (nella colonna a sinistra della mappa) e le funzioni di Ricerca.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>colonnadx.gif" width="20" height="20" alt="Icona che indica la parte destra di questa finestra, la colonna dove state leggendo queste informazioni" /><strong>Questa colonna</strong> serve per visualizzare le informazioni ottenute selezionando gli elementi cartografici o effettuando ricerche.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>lineadotted.gif" width="20" height="20" alt="Icona che indica la linea che separa la parte sinistra da quella destra di questa pagina" /><strong>Ridimensiona lo spazio</strong> riservato alla mappa trascinando la linea di separazione verticale qui a sinistra.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>layers.png" width="24" height="24" alt="Vista su..." /><strong>Vista su:</strong> (in cima a questa colonna) apre un'altra mappa mantenendo la vista e la scala correnti.</p>
				</div>

				<div id="toolbar">
					<h2>Barra degli strumenti</h2>
					<p><img src="<?php echo $dati_package['imgPath']?>toolbar.gif" width="207" height="25" alt="Icona che indica gli strumenti di navigazione della mappa" /><br /><strong>Gli strumenti di navigazione</strong> sono sopra alla mappa: puoi stampare la carta, effettuare misurazioni, spostare la vista e zoomare sulla cartografia.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>selezione.gif" width="20" height="20" alt="Toolbar degli strumenti di interazione con la mappa" /><strong>Informazioni e/o selezione degli oggetti</strong>: con questo strumento, posizionare il puntatore sull'oggetto, tenere premuto il tasto <em>Control</em> e fare click con il mouse (i dati vengono mostrati in questa colonna).</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>zoom_rettangolo.gif" width="20" height="20" alt="Strumento zoom su rettangolo" /><strong>Zoom su rettangolo:</strong> clicca e trascina per definire un'area da ingrandire.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>zoom_in_out.gif" width="40" height="20" alt="Strumenti Zoom in e Zoom out" /><strong>Zoom In e Out:</strong> un click sulla mappa ingrandisce o riduce la scala, centrando la mappa sul punto prescelto.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>pan.gif" width="20" height="20" alt="Strumento Panoramica" /><strong>Panoramica:</strong> trascina la mappa per spostare la visuale sulla cartografia.</p>

					<p><img class="float-left" src="<?php echo $dati_package['imgPath']?>scala.png" width="125" height="26" alt="campo Scala" /><strong>Scala:</strong> fai click sul campo posto sotto la mappa e imposta la scala di visualizzazione.</p>
				</div>
			</div>
</div>
