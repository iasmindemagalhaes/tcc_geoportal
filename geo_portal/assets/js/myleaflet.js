//Geoserver settings

// Camada WFS

var wfsLayer = new L.featureGroup();

var url_geoserver = "http://localhost:8080/geoserver/wms?" 
var url_geoserver_wfs = "http://localhost:8080/geoserver/ows?"

// Get wms layer from geoserver

var wmsLayer = new L.tileLayer.wms(url_geoserver,{
    layers: 'bdgeo:bairro',
    transparency: 'true',
    format: 'image/svg',
    opacity: 0.6, 
    maxZoom: 20,
    //cql_filter: "name='OLARIA'",
    attribution: "Geo Portal"
});



//Get wfs layer from geoserver

//http://localhost:8080/geoserver/bdgeo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bdgeo%3Abairro&outputFormat=application/json


$.ajax('http://localhost:8080/geoserver/ows?',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typename: 'bdgeo:bairro',
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript',
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options'

 });
 
  //Geojson style file
  var myStyle = {
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8,
    attribution: "Geo Portal"
  }
// the ajax callback function
function handleJson(data) {
    selectedArea = L.geoJson(data, {
      style: myStyle,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`BAIRRO: ${feature.properties.name}`+`</br>`+`ZONA: ${feature.properties.zona}`)
      }
    }).addTo(wfsLayer);
  map.fitBounds(selectedArea.getBounds());
}

//atributos  do mapa

var mAttr = "";

// OSM tiles
var osmUrl = "https://{s}.tile.osm.org/{z}/{x}/{y}.png"
var osm = L.tileLayer(osmUrl, {attribution:mAttr});

//CartoDB tiles
var cartodbUrl = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";
var cartodb = L.tileLayer(cartodbUrl, {attribution:mAttr});


var map = L.map("map", {
    center: [-8.769659, -63.882688],
    zoom: 12,
    minZoom: 3,
    layers: [cartodb]
})

//web services layers

var baseLayers = {
    
    "Openstreet Map": osm,
    "CartoDB Light": cartodb
};

//Overlay layer

var overlayMaps = {
    "Bairros (WMS)": wmsLayer,
    "Bairros GeoJson":wfsLayer
};

//Add base layers

var controlLayers = L.control.layers(baseLayers, overlayMaps, {collapsed:false}).addTo(map);

//Add scale

L.control.scale({metric:true, imperial:false, maxWidth:100}).addTo(map);

//Function to search keyword from WFS service

function searchWFS(){
  //Get value from inputbox
  queryBox = document.getElementById("search-value").value;

  if(!queryBox){
    alert("Por favor, insira um valor válido!");
    return false;
  }

  var cqlFilter = "cql_filter=%27name=%20OLARIA%20%27";
  var url = "http://localhost:8080/geoserver/bdgeo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=bdgeo%3Abairro&outputFormat=application/json&" + cqlFilter;
  
};

//Function to clear results

function clearResult(){
  document.getElementById("search-value").value = "";
};
