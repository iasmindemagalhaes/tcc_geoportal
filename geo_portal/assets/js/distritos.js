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
  layers: 'bdgeo:localidade_pvh',
  transparency: 'true',
  format: 'image/svg',
  opacity: 1, 
  maxZoom: 20,
  attribution: "Geo Portal"
});

var wmsLayer2 = new L.tileLayer.betterWms(url_geoserver,{
    layers: 'bdgeo:limite_distrito',
    transparency: 'true',
    format: 'image/svg',
    opacity: 0.6, 
    maxZoom: 20,
    attribution: "Geo Portal"
});






//"http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=bdgeo:limite_distrito",()
//layers:"bdgeo:limite_distrito",


// Camada WFS

var wfsLayer = new L.featureGroup();

$.ajax('http://localhost:8080/geoserver/ows?',{
  type: 'GET',
  data: {
    service: 'WFS', //serviço Web Feature Service (WFS)
    version: '1.0.0', //versão dada pelo Geoserver
    request: 'GetFeature', //Retorna uma seleção de recursos de uma fonte de dados, incluindo geometria e valores de atributo
    typename: 'bdgeo:distritos_pvh', //nome da camada no Geoserver
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript', //formato de saída
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
        layer.bindTooltip(`<strong>${feature.properties.nome}</strong>`+`</br>`+`${feature.properties.leicriacao}`,{
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

// Positron Light

var positronURL = "http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png";
var positron = L.tileLayer(positronURL, {attribution:mAttr});

var map = L.map("map", {
    center: [-8.769659, -63.882688],
    zoom: 12,
    minZoom: 3,
    layers: [osm, wfsLayer, wmsLayer, wmsLayer2]
})


//web services layers

var baseLayers = {
    
    "Openstreet Map": osm,
    "CartoDB Light": cartodb,
    "Positron Light": positron
    
};

//Overlay layer

var overlayMaps = {
    "Distritos":wfsLayer,
    "Limites Distritos": wmsLayer2,
    "Localidades": wmsLayer
};

//Add base layers

var controlLayers = L.control.layers(baseLayers, overlayMaps, {collapsed:false}).addTo(map);

//Add scale

L.control.scale({metric:true, imperial:false, maxWidth:100}).addTo(map);

//Configurações para adicionar legenda

L.Geoserver = L.FeatureGroup.extend({
  //Some of the default options
  options: {
    layers: "",
    format: "image/png",
    transparent: true,
    CQL_FILTER: "INCLUDE",
    zIndex: 1000,
    version: "1.1.0",
    srsname: "EPSG:4326",
    attribution: `layer`,
    fitLayer: true,
    style: "",
    onEachFeature: function (feature, layer) {},
    wmsLayers: [],
    wmsCQL_FILTER: [],
    wmsStyle: [],
    width: 500,
    height: 500,
  },

  // constructor function
  initialize: function (baseLayerUrl, options) {
    this.baseLayerUrl = baseLayerUrl;

    L.setOptions(this, options);

    this._layers = {};

    this.state = {
      exist: "exist",
    };
  },

  //wms layer function
  wms: function () {
    return L.tileLayer.wms(this.baseLayerUrl, this.options);
  },

  //wfs layer fetching function
  //Note this function will work only for vector layer
  wfs: function () {
    var that = this;

    //Geoserver Web Feature Service
    $.ajax(this.baseLayerUrl, {
      type: "GET",

      data: {
        service: "WFS",
        version: "1.1.0",
        request: "GetFeature",
        typename: this.options.layers,
        CQL_FILTER: this.options.CQL_FILTER,
        srsname: this.options.srsname,
        outputFormat: "text/javascript",
        format_options: "callback: getJson",
      },

      dataType: "jsonp",
      jsonpCallback: "getJson",
      success: function (data) {
        var layers = [];

        // push all the layers to the layers array
        for (var i = 0; i < data.features.length; i++) {
          var layer = L.GeoJSON.geometryToLayer(
            data.features[i],
            that.options || null
          );

          layer.feature = data.features[i];
          layer.options.onEachFeature = that.options.onEachFeature(
            layer.feature,
            layer
          );

          layers.push(layer);
        }

        // for adding styles to the geojson feature
        if (typeof that.options.style === "function") {
          for (i = 0; i < layers.length; i++) {
            that.addLayer(layers[i]);
            if (i.setStyle) {
              i.setStyle(that.options.style(element));
            }
          }
        } else {
          for (i = 0; i < layers.length; i++) {
            that.addLayer(layers[i]);
            that.setStyle(that.options.style);
          }
        }

        if (that.options.fitLayer) {
          that._map.fitBounds(that.getBounds());
        }
      },
    }).fail(function (jqXHR, textStatus, error) {
      console.log(jqXHR, textStatus, error);
    });

    return that;
  },

  //Legend of the map
  legend: function () {
    var that = this;
    var legend = L.control({ position: "bottomleft" });
    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info Legend");
      //var url = `${that.baseLayerUrl}/wms?REQUEST=GetLegendGraphic&VERSION=1.1.0&FORMAT=image/png&LAYER=${that.options.layers}&style=${that.options.style}`;
      var url = "http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=bdgeo:limite_distrito";
      div.innerHTML +=
        "<img src=" +
        url +
        ' alt="legend" data-toggle="tooltip" title="Map legend">';
      return div;
    };
    return legend;
  },

  //This function is used for zooming the raster layer using specific vector data
  wmsImage: function () {
    var that = this;
    $.ajax({
      url: `${that.baseLayerUrl}/ows?service=WFS&version=1.0.0&request=GetFeature&cql_filter=${that.options.wmsCQL_FILTER[0]}&typeName=${that.options.wmsLayers[0]}&srsName=EPSG:4326&maxFeatures=50&outputFormat=text%2Fjavascript`,
      dataType: "jsonp",
      jsonpCallback: "parseResponse",
      success: function (data) {
        // bounding box for the selected vector layer
        selectedArea = L.geoJson(data);
        bboxX1 = selectedArea.getBounds()._southWest.lng;
        bboxX2 = selectedArea.getBounds()._northEast.lng;
        bboxY1 = selectedArea.getBounds()._southWest.lat;
        bboxY2 = selectedArea.getBounds()._northEast.lat;
        bboxList = [bboxX1, bboxX2, bboxY1, bboxY2];
        bufferBbox = Math.min((bboxX2 - bboxX1) * 0.1, (bboxY2 - bboxY1) * 0.1);
        maxValue = Math.max(bboxX2 - bboxX1, bboxY2 - bboxY1) / 2.0;

        var otherLayers = "";
        var otherStyle = "";
        var otherCqlFilter = "";
        for (var i = 1; i < that.options.wmsLayers.length; i++) {
          otherLayers += that.options.wmsLayers[i];
          otherStyle += that.options.wmsStyle[i];
          otherCqlFilter +=that.options.wmsCQL_FILTER[i];
          if (i != that.options.wmsLayers.length - 1) {
            otherLayers += ",";
            otherStyle += ",";
            otherCqlFilter += ';';
          }
        }

        //final wmsLayerUrl
        var wmsLayerURL = `${
          that.baseLayerUrl
        }/wms?service=WMS&version=1.1.0&request=GetMap&\
layers=${otherLayers}&\
styles=${otherStyle}&\
cql_filter=${otherCqlFilter}&\
bbox=${(bboxX1 + bboxX2) * 0.5 - maxValue - bufferBbox},${
          (bboxY1 + bboxY2) * 0.5 - maxValue - bufferBbox
        },${(bboxX1 + bboxX2) * 0.5 + maxValue + bufferBbox},${
          (bboxY1 + bboxY2) * 0.5 + maxValue + bufferBbox
        }&\
width=${that.options.width}&\
height=${that.options.height}&\
srs=EPSG%3A4326&\
format=image/png`;
        $(`#${that.options.wmsId}`).attr("src", wmsLayerURL);
        return that;
      },
    });
    return that;
  },
});

L.Geoserver.wms = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wms();
};

L.Geoserver.wfs = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wfs();
};

L.Geoserver.legend = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.legend();
};

L.Geoserver.wmsImage = function (baseLayerUrl, options) {
  var req = new L.Geoserver(baseLayerUrl, options);
  return req.wmsImage();
};

// Add legend

var layerLegend = L.Geoserver.legend("http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&",{
  layers: 'bdgeo:limite_distrito',
});

layerLegend.addTo(map);