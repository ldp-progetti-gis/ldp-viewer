<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** github_username     > ldp-progetti-gis
*** repo_name           > ldp-viewer
*** twitter_handle      > 
*** email               > helpdesk@ldpgis.it
*** project_title       > gisOpenViewer
*** project_description >
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<p align="center">
  <a href="https://github.com/ldp-progetti-gis/ldp-viewer">
    <img src="images/logo_solo_ldp_182x158.png" border="0" alt="Logo" width="194" height="169">
  </a>

  <h3 align="center">gisOpenViewer</h3>

  <p align="center">
    Display spatial data and handle map navigation, querying attriute and on the fly adding of additional layers from online data sources
    <br />
    <a href="https://github.com/ldp-progetti-gis/ldp-viewer"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/ldp-progetti-gis/ldp-viewer">View Demo</a>
    ·
    <a href="https://github.com/ldp-progetti-gis/ldp-viewer/issues">Report Bug</a>
    ·
    <a href="https://github.com/ldp-progetti-gis/ldp-viewer/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![gisOpenViewer application example](images/gisOpenViewer.png "gisOpenViewer application example")](https://www.ldpgis.it/)

gisOpenViewer is an Internet application that allows the publication of geographic data. The interactive viewer
allows users to navigate the map (zoom, pan, view at a defined scale), modify the displayed geographic levels,
add on the fly geographic layers published by WMS servers, query the associated data.



### Built With

* [OpenLayers](https://openlayers.org)
* [Proj4](https://proj.org)
* [JQuery](https://jquery.com)
* [Bootstrap](https://getbootstrap.com)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ldp-progetti-gis/ldp-viewer.git
   ```
2. Configure the php/etc/config.inc.php file<br>
   This file includes the general definitions common to all scripts. This file is very general, and it is not
   "directly" included inside the script, but it is referenced (included) by other more specific configuration
   files, focused on specific applications.
3. Configure the php/etc/config.app.inc.php file<br>
   This file includes the specific definitions common to all scripts. This file extends the general configuration
   file "config.inc.php" (this script is included).<br>
   The main sections of this configuration file relate to:<br>
   - configuration of the interface
   - configuration of the map options
   - definition of the main layers (representing the main contents of the application/map)
   - definition of the basemaps (used as background)
   - definition of the predefined external WMS server (to let the user add additional layers on the fly)




<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_



<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/ldp-progetti-gis/ldp-viewer/issues) for a list of proposed features (and known issues).



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the GNU GENERAL PUBLIC LICENSE, Version 2 License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact

LDP Progetti GIS - [@twitter_handle](https://twitter.com/twitter_handle) - helpdesk@ldpgis.it

Project Link: [https://github.com/ldp-progetti-gis/ldp-viewer](https://github.com/ldp-progetti-gis/ldp-viewer)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* []()
* []()
* []()





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[product-screenshot]: images/gisOpenViewer.png
[Product Name Screen Shot]: simone
[contributors-shield]: https://img.shields.io/github/contributors/ldp-progetti-gis/repo.svg?style=for-the-badge
[contributors-url]: https://github.com/ldp-progetti-gis/repo/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ldp-progetti-gis/repo.svg?style=for-the-badge
[forks-url]: https://github.com/ldp-progetti-gis/repo/network/members
[stars-shield]: https://img.shields.io/github/stars/ldp-progetti-gis/repo.svg?style=for-the-badge
[stars-url]: https://github.com/ldp-progetti-gis/repo/stargazers
[issues-shield]: https://img.shields.io/github/issues/ldp-progetti-gis/repo.svg?style=for-the-badge
[issues-url]: https://github.com/ldp-progetti-gis/repo/issues
[license-shield]: https://img.shields.io/github/license/ldp-progetti-gis/repo.svg?style=for-the-badge
[license-url]: https://github.com/ldp-progetti-gis/repo/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://it.linkedin.com/company/ldp-progetti-gis

