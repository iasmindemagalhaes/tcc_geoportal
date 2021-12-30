//Geoserver settings

// Camada WFS

//var wfsLayer = new L.featureGroup();
//var newGroup = new L.featureGroup();

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

// Get wfs layer from geoserver
/** 
var wfsURL = url_geoserver_wfs + "WFS&version=1.0.0&request=GetFeature&typeName=bdgeo%3Abairro&maxFeatures=50&outputFormat=application%2Fjson";

//WFS styling
var geojsonWFSstyle = {
    fillColor: "red",
    fillOpacity: 0.5,
    color: "yellow",
    weight: 1,
    opacity: 1.0
};

async function getWFSgeojson(){
    try{
        const response = await fetch(wfsURL);
        console.log(response);
        return await response.json();
    } catch(err){
        console.log(err);
    }
}

getWFSgeojson().then(data => {
    var wfsPolylayer = L.geoJSON([data], {
        onEachFeature: function(f,l){
            console.log(f);
            var customOptions = {
                "maxWidth": "500px",
                "className": "customPop"
            }
            var popupContent = "<div><b>" + f.properties.name + "</b><br />" + f.properties.zona + "</div>";
            l.bindPopup (popupContent, customOptions);
        },
        style: geojsonWFSstyle
    }).addTo(wfsLayer);
    map.fotBounds(wfsPolylayer.getBounds());
})

//Get JSON using JQuery

$.getJSON(wfsURL, function(geojsonData){
    var geojsonLayer = new L.geoJSON(geojsonData, {
        style: function(feature){
            return{
                "weight": 0,
                "fillColor": "yellow",
                "fillOpacity": 0.5
            }
        }
    }).addTo(newGroup);
});
*/

//GEOSERVER WFS font: https://dev.to/iamtekson/wfs-request-in-geoserver-using-leafletjs-552g



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
    //"Bairros (WFS)": wfsLayer,
    //"Bairros (GeoJSON)": newGroup

};

//Add base layers

var controlLayers = L.control.layers(baseLayers, overlayMaps, {collapsed:false}).addTo(map);