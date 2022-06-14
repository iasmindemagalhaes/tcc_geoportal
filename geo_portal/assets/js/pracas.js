//Geoserver settings

// Get info wms
L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({
  onAdd: function (map) {
    // Triggered when the layer is added to a map.
    //   Register a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onAdd.call(this, map);
    map.on("click", this.getFeatureInfo, this);
  },

  onRemove: function (map) {
    // Triggered when the layer is removed from a map.
    //   Unregister a click listener, then do all the upstream WMS things
    L.TileLayer.WMS.prototype.onRemove.call(this, map);
    map.off("click", this.getFeatureInfo, this);
  },

  getFeatureInfo: function (evt) {
    // Make an AJAX request to the server and hope for the best
    var url = this.getFeatureInfoUrl(evt.latlng),
      showResults = L.Util.bind(this.showGetFeatureInfo, this);
    $.ajax({
      url: url,
      success: function (data, status, xhr) {
        var err = typeof data === "string" ? null : data;
        showResults(err, evt.latlng, data);
      },
      error: function (xhr, status, error) {
        showResults(error);
      },
    });
  },

  getFeatureInfoUrl: function (latlng) {
    // Construct a GetFeatureInfo request URL given a point
    var point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
      size = this._map.getSize(),
      params = {
        request: "GetFeatureInfo",
        service: "WMS",
        srs: "EPSG:4326",
        styles: this.wmsParams.styles,
        transparent: this.wmsParams.transparent,
        version: this.wmsParams.version,
        format: this.wmsParams.format,
        bbox: this._map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: this.wmsParams.layers,
        query_layers: this.wmsParams.layers,
        info_format: "text/html",
      };

    params[params.version === "1.3.0" ? "i" : "x"] = point.x;
    params[params.version === "1.3.0" ? "j" : "y"] = point.y;

    // return this._url + L.Util.getParamString(params, this._url, true);

    var url = this._url + L.Util.getParamString(params, this._url, true);

    /**
     * CORS workaround (using a basic php proxy)
     *
     * Added 2 new options:
     *  - proxy
     *  - proxyParamName
     *
     */

    // check if "proxy" option is defined (PS: path and file name)
    if (typeof this.wmsParams.proxy !== "undefined") {
      // check if proxyParamName is defined (instead, use default value)
      if (typeof this.wmsParams.proxyParamName !== "undefined")
        this.wmsParams.proxyParamName = "url";

      // build proxy (es: "proxy.php?url=" )
      _proxy = this.wmsParams.proxy + "?" + this.wmsParams.proxyParamName + "=";

      url = _proxy + encodeURIComponent(url);
    }

    return url;
  },

  showGetFeatureInfo: function (err, latlng, content) {
    if (err) {
      console.log(err);
      return;
    } // do nothing if there's an error

    // Otherwise show the content in a popup, or something.
    L.popup({ maxWidth: 800 })
      .setLatLng(latlng)
      .setContent(content)
      .openOn(this._map);
  },
});

L.tileLayer.betterWms = function (url, options) {
  return new L.TileLayer.BetterWMS(url, options);
};
// Camada WMS
var url_geoserver = "http://localhost:8080/geoserver/wms?" 

// Get wms layer from geoserver

var wmsLayer = new L.tileLayer.betterWms(url_geoserver,{
  layers: 'bdgeo:bairro',
  transparency: 'true',
  format: 'image/svg',
  opacity: 0.5, 
  maxZoom: 20,
  attribution: "Geo Portal"
});
// Camada WFS

var wfsLayer = new L.featureGroup();

$.ajax('http://localhost:8080/geoserver/ows?',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.0.0',
    request: 'GetFeature',
    typename: 'bdgeo:praca',
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript',
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options'
 });

  //Geojson style file
  var myStyle = {
    fillColor: "#72c842",
    color: "#72c842",
    weight: 1,
    opacity: 1,
    fillOpacity: 1,
    attribution: "Geo Portal"
  }

  
// the ajax callback function
function handleJson(data) {
    selectedArea = L.geoJson(data, {
      style: myStyle,
      onEachFeature: function(feature, layer) {
        //layer.bindPopup(`Bairro: ${feature.properties.name}`);
        layer.bindTooltip(`${feature.properties.name}`+`</br>`+`BAIRRO: ${feature.properties.bairro}`,{
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
    layers: [cartodb, wmsLayer, wfsLayer]
})

//web services layers

var baseLayers = {
    
    "Openstreet Map": osm,
    "CartoDB Light": cartodb
    
};

//Overlay layer

var overlayMaps = {
    "Praças Distrito Sede":wfsLayer,
    "Bairros":wmsLayer
};

//Add base layers

var controlLayers = L.control.layers(baseLayers, overlayMaps, {collapsed:false}).addTo(map);

//Add scale

L.control.scale({metric:true, imperial:false, maxWidth:100}).addTo(map);

