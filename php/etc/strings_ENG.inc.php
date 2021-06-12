<?php
	/**
	 * RESOURCES FILE - STRINGS - ENGLISH VERSION
	 *
	 * This file contains the definition of all strings used in the application.
	 *
	 * @author:  LDP Fanetti Duccio, Gentili Luca, Maffei Simone
	 * @version: 1.0
	 * @license: GNU General Public License v2.0
	 */
    
	$PREFIX = ''; //'(OV) ';

	/**
	 * Strings used by the general INTERFACE
	 */
	$GLOBALS['strings']['interface'] = array(
         'tab_query_title'              => $PREFIX . 'Results',
         'tab_query_content'            => 'Show the related information',
         'tab_search_title'             => $PREFIX . 'Search',
         'tab_search_content'           => 'Find a city, a place, an address',
         'tab_custom_title'             => 'Map info', // $PREFIX . 'Custom',
         'tab_custom_content'           => 'Show a custom page',
         'tab_appinfo_title'            => $PREFIX . 'About',
         'tab_appinfo_content'          => 'Show the information about the application',

         'button_exitinteractivemap'    => 'Exit the interactive map',
         'button_defaultstatus'         => 'Pan, zoom and select',
         'button_initialview'           => 'Initial view',
         'button_zoomincenter'          => 'Zoom in to center',
         'button_zoomoutcenter'         => 'Zoom out from center',
         'button_zoomrectangle'         => 'Zoom rectangle',
         'button_previousview'          => 'Previous view',
         'button_nextview'              => 'Next view',
         'button_measuredistance'       => 'Measure a distance',
         'button_measurearea'           => 'Measure an area',
         'button_clearmap'              => 'Clear selection, highlighted objects and user drawings',
         'button_printmap'              => 'Print the map view',
         'button_guidedtour'            => 'Help guided tour',

         'welcome_msg_statusbar'        => 'Ready',
         'feature_selected_statusbar'   => 'selected feature',
         'features_selected_statusbar'  => 'selected features',
         
         'wms_CRSunsupported'           => 'The map projection is not directly supported by the WMS server',
         'wms_clicktogetlistwmslayers'  => 'Click here to retrieve the list of availalble WMS layers',
         'wms_filterlayers'             => 'Click here and write to filter the layers',
         'wms_inserturlwmsserver'       => 'Insert here the URL of the WMS server',
         'wms_notavailable'             => 'Not available',
         'wms_pagetitle'                => 'Add layer from WMS services',
         'wms_pagedescription1'         => 'Add geographical layers to the map from the internal WMS catalogue ',
         'wms_pagedescription2'         => 'Or, add geographical layers by accessing external WMS catalogues',
         'wms_pagedescription3'         => 'Add geographical layers by accessing external WMS catalogues',
         'wms_showavailablelayers'      => 'Show available layers',
         'wms_supportedCRS'             => 'Supported CRSs',
         'wms_showhidestyle'            => 'Show/Hide style',

         'word_actions'                 => 'Actions',
         'word_add'                     => 'Add',
         'word_address'                 => 'Address',
         'word_close'                   => 'Close',
         'word_coordinates'             => 'Coordinates',
         'word_description'             => 'Description',
         'word_feature'                 => 'Feature',
         'word_from'                    => 'From',
         'word_in'                      => 'In',
         'word_information'             => 'Information',
         'word_layer'                   => 'Layer',
         'word_legend'                  => 'Legend',
         'word_libreria'                => 'Library',
         'word_license'                 => 'Licence',
         'word_no'                      => 'No',
         'word_of'                      => 'Of',
         'word_open'                    => 'Open',
         'word_or'                      => 'Or',
         'word_original'                => 'Original',
         'word_queryability'            => 'Queryability',
         'word_queryableas'             => 'Queryable as',
         'word_release'                 => 'Release',
         'word_styles'                  => 'Styles',
         'word_themes'                  => 'Themes',
         'word_title'                   => 'Title',
         'word_to'                      => 'To',
         'word_version'                 => 'Version',
         'word_visible'                 => 'Visible',
         'word_visibility'              => 'Visibility',
         
         'sentence_addlayertomap'               => 'Add this layer to the map',
         'sentence_addtomap'                    => 'Add to map',
         'sentence_addwmstomap'                 => 'Add WMS to map',
         'sentence_atallscales'                 => 'At all scales',
         'sentence_basemap'                     => 'Basemap',
         'sentence_custompage'                  => 'Custom page',
         'sentence_datasource'                  => 'Data source',
         'sentence_epsgsupported'               => 'Supported coordinate systems (EPSG)',
         'sentence_forexample'                  => 'For example',
         'sentence_foundfeatures'               => 'Found features',
         'sentence_generaldescription'          => 'General description',
         'sentence_impossiblegetlayersfromurl'  => 'Impossible to retrieve the layers list from the URL defined',
         'sentence_increasetransparency'        => 'Increase the transparency',
         'sentence_infofoundedlocation'         => 'Information about the location founded',
         'sentence_insertscale'                 => 'Insert the scale and press ENTER',
         'sentence_invalidurl'                  => 'Invalid URL',
         'sentence_keepzoom'                    => 'Keep current scale',
         'sentence_layeradded'                  => 'Layer successfully added to the map.',
         'sentence_layeraleradyexisting'        => 'Layer not added to the map. A layer with the same name is already existing.',
         'sentence_layerwillbereprojected'      => 'The layer does not directly support the coordinate system used in the map: hence it will be automatically reprojected.',
         'sentence_nobasemap'                   => 'No basemap',
         'sentence_noselectedobjects'           => 'No selected objects',
         'sentence_noselfeaturesinsidelayer'    => 'No selection within the layers',
         'sentence_opencloselegend'             => 'Open/Close the legend',
         'sentence_opencloseinfopanel'          => 'Open/Close the information panel',
         'sentence_openprintdialog'             => 'Print the current map view',
         'sentence_problemsgetcapabilities'     => 'Encountered problems while retrieving GetCapabilities from',
         'sentence_queryresultpage'             => 'Page of the results',
         'sentence_reducetransparency'          => 'Reduce the transparency',
         'sentence_releasenote'                 => 'Notes about the version',
         'sentence_removealluserwms'            => 'Remove all user WMS layers',
         'sentence_renderingprojection'         => 'Projection used for map rendering',
         'sentence_retrievingtheinformation'    => 'Retrieving the information, please wait ...',
         'sentence_scalevisibility'             => 'Visible in the scale range ',
         'sentence_searchcityplaceaddress'      => 'Search for a city, a place, an address',
         'sentence_searchbycoordinates'         => 'Search the location',
         'sentence_searchbytext'                => 'Search for the address',
         'sentence_searchpage'                  => 'Search page',
         'sentence_searchunsuccessful'          => 'Unsuccessful search',
         'sentence_sendemailto'                 => 'For additional info email to',
         'sentence_servercapabilities'          => 'Server capabilities',
         'sentence_showyourposonthemap'         => 'Show your position on the map',
         'sentence_usedlibraries'               => 'Open source libraries used',
         'sentence_thirdpartyWMS'               => 'Third party WMS',
         'sentence_trackingerror'               => 'Error while trying to localize on the map.\nPlease check the settings of your browser.\nYou need to allow popup windows from the current page.',
         'sentence_tooltip'                     => 'or press and hold to show the information',
         'sentence_typeaddressstring'           => 'Type addresss string (example: road city country)',
         'sentence_typecoordinatex'             => 'Insert coordinate X (lat, lon)',
         'sentence_typecoordinatey'             => 'Insert coordinate Y (lat, lon)',
         'sentence_visitthewebsite'             => 'Visit the website',
         'sentence_waitplease'                  => 'Wait please',

         'varempty'                     => '');

	/**
	 * Strings used by the TOUR/HELP functionality
	 */
	$GLOBALS['strings']['tour_help'] = array(
         'start_title'                  => $PREFIX . 'How to use interactive maps',
         'start_content'                => 'Follow the short guided tour to learn about the features and tools of interactive maps.',

         'rightbar_title'               => $PREFIX . 'Right sidebar',
         'rightbar_content'             => 'Open/close the right sidebar: which contains the search tools (by street and house number, by location, etc.) and shows the information of the selected objects on the map.',
         
         'leftbar_title'                => $PREFIX . 'Left sidebar',
         'leftbar_content'              => 'Open/close the left sidebar: which contains the map legend useful to activate or hide the layers and to add cartographic layers from external services.',
         'leftbar_content_old'          => 'Open/close the left sidebar: which contains the map legend useful to activate or hide the layers, the WMS panel to add cartographic layers from external services and the <em>Clone map</em> tool to open another map while keeping the current view',

         'legend_title'                 => $PREFIX . 'Legend',
         'legend_content'               => 'Show the list of layers of the map: you can check/uncheck the different layers to make them visible (and searchable) or to hide them.<br>You can also add new layers using WMS service URLs.',
    
         'legenditems_title'            => $PREFIX . 'Visibility of the layers of the legend',
         'legenditems_content'          => 'Open/close the groups of layers (<em>Themes</em> and <em>Basemap Layer</em>): check/uncheck the different layers to make them visible (and searchable) or to hide them.',

         'wms_title'                    => $PREFIX . 'Add WMS layers',
         'wms_content'                  => 'Access a WMS (<em>Web Map Service</em>) to add additional layers to the map: access an external data source and select the available layers.',

         'viewothermap_title'           => $PREFIX . 'Open another map',
         'viewothermap_content'         => 'Open another map while keeping the current one: the new map opens on a new window.<br>Third party maps are available, like Google Maps, Open Street Map and Bing.',

         'toolbar_title'                => $PREFIX . 'Map toolbar',
         'toolbar_content'              => 'It includes the tools to navigate the map, select the objects, zoom, pan, measure distances and areas, print the current view, , etc.',

         'scalebar_title'               => $PREFIX . 'Scale of the map',
         'scalebar_content'             => 'Show the current scale of the map.<br>It is possible to change the scale by digitizing the new value in the scale text box and clicking &crarr;ENTER',

         'exit_title'                   => $PREFIX . 'Exit the map',
         'exit_content'                 => 'Close the interactive map and go back to the previous page.',

         'template_prev_title'          => 'Go to the previous step',
         'template_prev_back'           => '« Back',
         'template_next_title'          => 'Go to the next step',
         'template_next_forward'        => 'Forward »',
         'template_close_tour'          => 'Exit the tour',
         'template_close_close'         => 'Exit',

         'varempty'                     => '');
	 
	/**
	 * Strings used by the TOUR/HELP functionality
	 */
	$GLOBALS['strings']['application_info'] = array(
         'license_description'          => 'This program is free software; you can redistribute it and/or modify it under the terms '.
                                           'of the GNU General Public License as published by the Free Software Foundation; either '.
                                           'version 2 of the License, or (at your option) any later version.'.
                                           '<br>&nbsp;<br>'.
                                           'This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; '.
                                           'without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. '.
                                           'See the <u><i><a href="GNU General Public License v2.0 - GNU Project - Free Software Foundation.html" '.
                                           'target="_blank">GNU General Public License</a></i></u> for more details.',
         'application_description'      => 'is an Internet application that allows the publication of geographic data. The interactive viewer '.
                                           'allows users to navigate the map (zoom, pan, view at a defined scale), modify the displayed geographic levels, '.
                                           'add on the fly geographic layers published by WMS servers, query the associated data and generate print reports.',
         'application_mainfeatures'     => 'Supported data: <ul>'.
                                           '<li> WMS data sources </li>'.
                                           '<li> MapGuide data sources </li>'.
                                           '<li> basemap OpenStreetMap </li>'.
                                           '</ul>'.
                                           'Features: <ul>'.
                                           '<li> interactive pan and zoom on rectangle </li>'.
                                           '<li> initial view, zoom in, zoom out, previous view, next view </li>'.
                                           '<li> measurement of distances and areas </li>'.
                                           '<li> print </li>'.
                                           '</ul>',
         'application_noterelease1'     => 'Initial development of the application, based on the review of the most complex and complete applications '.
                                           'created by LdpGIS for the management of geographic data for territorial management.',

         'varempty'                     => '');
	 
?>
