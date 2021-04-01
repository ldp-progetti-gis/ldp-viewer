<?php

try {   

		if ( $_POST['service_type'] == 'wms' ) {
//error_log(__FILE__ . " :: " . __LINE__ . " wms ");
			//Ritorna tutta la lista dei layer wms aggangiati ad un URL 
			switch ($_POST['action']) {
				case 'GetCapabilities':
					$query_url = "{$_POST['service_url']}";
					if ( !preg_match('/\?/', $_POST['service_url']) )
						$query_url .= '?';
					else
						$query_url .= '&';
					$query_url .= "SERVICE=WMS&REQUEST=GetCapabilities";
error_log(__FILE__ ." :: " . __LINE__ . " WMS " . $query_url);
					$xml_data = file_get_contents($query_url);
					

					$xml = simplexml_load_string($xml_data);
					
					// il modo giusto di farlo sarebbe con xpath, ma non ci riesco
					//$layers = $xml->xpath('descendant::Layer');
					//$data = sizeof($layers);
					///
					$xml->registerXPathNamespace("openlayers","http://www.opengis.net/wms");
					$layers_ = $xml->xpath('//openlayers:Layer');
					$formats_ = $xml->xpath('//openlayers:GetMap/openlayers:Format');
					$a_formats = array();
					foreach($formats_ as $f) {
						$a_formats[] = $f->__toString();
					}
// error_log(print_r($formats_,true));
// error_log(print_r($a_formats,true));
					$xml->registerXPathNamespace('xlink', 'http://www.w3.org/1999/xlink');
					
					$a=sizeof($styles);
					$layers = array();
					
					foreach ($layers_ as $node) {
							$layer_data = array();
							$style_data = array();
							$layer_data['styles'] = array();
							$layer_data['name'] = (string)$node->Name;
							$layer_data['title'] =(string)$node->Title;
							$splitting_abstract = chunk_split ( (string)$node->Abstract ,50, "\n");
							$layer_data['abstract'] = $splitting_abstract;
							$layer_data['min_scale'] = (string)$node->MinScaleDenominator;
							$layer_data['max_scale'] = (string)$node->MaxScaleDenominator;
							$style_data['name']=(string)$node->Style->Name;
							$style_data['legend_url_width']=(string)$node->Style->LegendURL['width'];
							$style_data['legend_url_height']=(string)$node->Style->LegendURL['height'];
// 							$style_data['legend_url_width']=(string)100;
// 							$style_data['legend_url_height']=(string)200;
							
							if (count($node->Style->LegendURL->OnlineResource) > 0) {
								foreach ($node->Style->LegendURL->OnlineResource as $el){
									$attributes = $el->attributes( 'xlink', true);

									$style_data['legend_url_href']=$attributes['href'] . ' ' . $el;
								}
							}

							$style_name= (string)$style_data['name'];
							$layer_data['styles'][$style_name] = $style_data;
							if ( $layer_data['name'] == '' )
								continue;
							$layers[] = $layer_data;
					}

					$titles = array();
					foreach ($layers as $key => $row) {
						$titles[$key]  = $row['title'];
					}
					array_multisort($titles, SORT_ASC, $layers);
                                        
					header("Content-Type: application/json");
					ob_end_flush();
					echo json_encode(array('success' => true, 'data' => $layers, 'formats' => $a_formats));
					die();
				break;
				
				default:
					throw new Exception("Parametri errati");
			}
		} else if ( $_POST['service_type'] == 'wfs' ) {
			switch ($_POST['action']) {
				case 'GetCapabilities':
					$query_url = "{$_POST['service_url']}";
					if ( !preg_match('/\?/', $_POST['service_url']) )
						$query_url .= '?';
					else
						$query_url .= '&';
					$query_url .= "SERVICE=WFS&REQUEST=GetCapabilities";
					
					$xml_data = file_get_contents($query_url);
					$xml = simplexml_load_string($xml_data);
					
					// il modo giusto di farlo sarebbe con xpath, ma non ci riesco
					//$layers = $xml->xpath('descendant::Layer');
					//$data = sizeof($layers);
					$layers = array();
					foreach ($xml->children() as $child)
						if ( $child->getName() == 'FeatureTypeList' )
							foreach ($child->children() as $c)
								if ( $c->getName() == 'FeatureType' ) {
									$layer_data = array();
									foreach ($c->children() as $l) {
										if ( $l->getName() == 'Name' )
											$layer_data['name'] = $l->__toString();
										if ( $l->getName() == 'Title' )
											$layer_data['title'] = $l->__toString();
										if ( $l->getName() == 'Abstract' )
											$layer_data['abstract'] = $l->__toString();
									}
									if ( $layer_data['name'] == '' )
										continue;
									$layers[] = $layer_data;
								}
					
					//sort($layers);
					$titles = array();
					foreach ($layers as $key => $row) {
						$titles[$key]  = $row['title'];
					}
					array_multisort($titles, SORT_ASC, $layers);
					
					header("Content-Type: application/json");
					ob_end_flush();
					echo json_encode(array('success' => true, 'data' => $layers));
					die();
				break;
				
				default:
					throw new Exception("Parametri errati");
			}
		}
		else if(isset($_GET['WMSURL'])){
// 		error_log('wmsurl');
			//Carica WMS provenienti dall'Amministrazione (exe: metarepo)
			$permitted_autentication = array("devsrv", "ldpgis");

			if (isset($_GET['PERMITTED_AUTENTICATION']) && $_GET['PERMITTED_AUTENTICATION']!=''){
			
				array_push($permitted_autentication,$_GET['PERMITTED_AUTENTICATION']);
			
			}
			$autenticated = false;
			foreach($permitted_autentication as $auth){
					if(strpos($_SERVER['SERVER_NAME'], $auth) !== FALSE ){
							$autenticated = true;
					}
			}

			$permitted_url = array("web.regione.toscana.it", "www502.regione.toscana.it", "centos-d5:8080", "centos-p21g:8080");
			$access = true;
			/*$access = false;
			foreach($permitted_url as $url){
					if(strpos($_GET['WMSURL'], $url) !== FALSE ){
							$access = true;
					}
			}*/
			if($access === true && $autenticated === true){
				if ( $_SERVER['REQUEST_METHOD'] == 'GET' ) {
						//Se è richiesto il GET Feature Info	
						if($_GET['REQUEST'] == 'GetFeatureInfo'){
							if ( strpos($_GET['WMSURL'],'?') === FALSE )
									$result = file_get_contents($_GET['WMSURL'] . '?' . $_SERVER['QUERY_STRING'] );
							else
									$result = file_get_contents($_GET['WMSURL'] . '&' . $_SERVER['QUERY_STRING'] );
						}
						else{
							//Se non è richiesto il get Feature info chiediamo le immagini con dpi=96 questo poichè altrimenti geoserver le fornisce a 90.
							if ( strpos($_GET['WMSURL'],'?') === FALSE )
									$result = file_get_contents($_GET['WMSURL'] . '?' . $_SERVER['QUERY_STRING'] . "&format_options=dpi:96");
							else
									$result = file_get_contents($_GET['WMSURL'] . '&' . $_SERVER['QUERY_STRING'] . "&format_options=dpi:96");
						}

				}

				else if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

						//error_log("POST REQUEST: " . json_encode($_POST));
						$opts = array('http' =>
								array(
										'method'  => 'POST',
										'header'  => 'Content-type: application/x-www-form-urlencoded',
										'content' => http_build_query($_POST)
								)
						);
						$context  = stream_context_create($opts);
						$result = file_get_contents($_GET['WMSURL'], false, $context);
				}

				//
				// Faccio l'output del contenuto e degli header
				//

// 				error_log("response_header: " . json_encode($http_response_header));
				foreach ($http_response_header as $header)
						header($header, false);
				
				echo $result;
		}
		else
			return;

		}
		else if ( $_POST['service_type'] == 'legends' ) {
			if($_POST['tipo']=='wms'){
				
				$query_url = "{$_POST['service_url']}";
				if ( !preg_match('/\?/', $_POST['service_url']) )
					$query_url .= '?';
				else
					$query_url .= '&';
				$query_url .= "SERVICE=WMS&REQUEST=GetCapabilities";
//error_log(__FILE__ ." :: " . __LINE__ . " WMS " . $query_url);
				$xml_data = file_get_contents($query_url);
				
				$xml = simplexml_load_string($xml_data);
				
				// il modo giusto di farlo sarebbe con xpath, ma non ci riesco
				//$layers = $xml->xpath('descendant::Layer');
				//$data = sizeof($layers);
				///
				$xml->registerXPathNamespace("openlayers","http://www.opengis.net/wms");
				$layers_ = $xml->xpath('//openlayers:Layer');
// error_log(print_r($layers_,true));


				$xml->registerXPathNamespace('xlink', 'http://www.w3.org/1999/xlink');
				
				$layers = array();
				
				foreach ($layers_ as $node) {
					if((string)$node->Name == $_POST['layer'] ){
						$layer_data = array();
						$style_data = array();
						$layer_data['styles'] = array();
						$layer_data['name'] = (string)$node->Name;
						$layer_data['title'] =(string)$node->Title;
						$splitting_abstract = chunk_split ( (string)$node->Abstract ,50, "\n");
						$layer_data['abstract'] = $splitting_abstract;
						$layer_data['min_scale'] = (string)$node->MinScaleDenominator;
						$layer_data['max_scale'] = (string)$node->MaxScaleDenominator;
						$style_data['name']=(string)$node->Style->Name;
						$style_data['legend_url_width']=(string)$node->Style->LegendURL['width'];
						$style_data['legend_url_height']=(string)$node->Style->LegendURL['height'];
// 							$style_data['legend_url_width']=(string)100;
// 							$style_data['legend_url_height']=(string)200;
						
						foreach ($node->Style->LegendURL->OnlineResource as $el){
							$attributes = $el->attributes( 'xlink', true);
							$style_data['legend_url_href']=$attributes['href'] . ' ' . $el;
						}
														
						$style_name= (string)$style_data['name'];
						$layer_data['styles'][$style_name] = $style_data;
						if ( $layer_data['name'] == '' )
							continue;
						$layers[] = $layer_data;
						break;
					}
				}

				$titles = array();
				foreach ($layers as $key => $row) {
					if($row['name']==$_POST['layer']){
						$layer=$row;
					}
					
				}
				
									
				header("Content-Type: application/json");
				ob_end_flush();
				echo json_encode(array('success' => true, 'data' => $layer));
				die();
			}else{
		
				//Richiedo le legende
				$service_url = $_POST['service_url'];
				$request = $_POST['request'];
	// 			error_log($service_url . $request);
				$result = file_get_contents( $service_url . $request);

				die(json_encode(array('success' => true, 'data' => base64_encode($result))));
			}
			
		}
		else if($_POST['service_type'] == 'featureinfo'){
			
			//Richiedo il ger feature info di fonti esterne
			$service_url = $_POST['service_url'];
			//Aggiunto FEATURE_COUNT per gestire quando nel punto selezionato sono presenti più feature, altrimenti di default ritornava solo la prima
			$request = $_POST['request']."&FEATURE_COUNT=100";

// 			$result = file_get_contents(urlencode($service_url . $request));
			$result = file_get_contents($service_url . $request);

			$array = jsonp_decode($result);
			
			die(json_encode(array('success' => true, 'data' =>$array)));                 
		}
		else if($_POST['service_type'] == 'featureinfoHtml'){
			
			//Richiedo il ger feature info di fonti esterne
			$service_url = $_POST['service_url'];
			
			$result = file_get_contents($service_url);

			echo "<div class='proxy_wms_html_result'>".$result."</div>";                 
		}
	} catch (Exception $e) {
		error_log(__FILE__." +".__LINE__." " . $e->getMessage() . " - Linea: " . $e->getLine() . " Stacktrace: " . $e->getTraceAsString());
		header("Content-Type: application/json");
		ob_end_flush();
		echo json_encode(array('success' => false, 'message' => $e->getMessage()));
		die();
	}
	
        
	function jsonp_decode($jsonp, $assoc = false) { // PHP 5.3 adds depth as third parameter to json_decode
		if($jsonp[0] !== '[' && $jsonp[0] !== '{') { 
			$jsonp = substr($jsonp, strpos($jsonp, '('));
		}
		$jsonp = trim($jsonp);      // remove trailing newlines
		$jsonp = trim($jsonp,'()'); // remove leading and trailing parenthesis

		return json_decode($jsonp);

	}
?>
