//Geoserver settings

// Camada WFS

var wfsLayer = new L.featureGroup();

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
    fillColor: "#E0A890",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.4,
    attribution: "Geo Portal"
  }

  
// the ajax callback function
function handleJson(data) {
    selectedArea = L.geoJson(data, {
      style: myStyle,
      onEachFeature: function(feature, layer) {
        //layer.bindPopup(`Bairro: ${feature.properties.name}`);
        layer.bindTooltip(`Bairro ${feature.properties.name}`+`</br>`+`ZONA: ${feature.properties.zona}`,{
          direction: 'top',
          permanent: false,
          sticky: true,
          offset: [10, 0],
          opacity: 1,
 
        });
      },
      
    
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
    layers: [cartodb, wfsLayer]
})

//web services layers

var baseLayers = {
    
    "Openstreet Map": osm,
    "CartoDB Light": cartodb
    
};

//Overlay layer

var overlayMaps = {
    "Bairros Distrito Sede":wfsLayer,
};

//Add base layers

var controlLayers = L.control.layers(baseLayers, overlayMaps, {collapsed:false}).addTo(map);

//Add scale

L.control.scale({metric:true, imperial:false, maxWidth:100}).addTo(map);

