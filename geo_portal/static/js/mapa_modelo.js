var map

function init () {

    //camadas base
    var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

    var otm = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
    
    //camada de inicialização
    var bairro = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
        layers: 'bdgeo:bairros_distrito_sede',
        transparency: 'true',
        format: 'image/svg', 
        maxZoom: 20,
        //opacity: 0.5

    });

    //camadas de sobreposição
    var overlays = {
        
        'Praças': L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'bdgeo:praca',
            transparency: 'true',
            format: 'image/svg', 
            maxZoom: 21,

        }),

        'Unidades Assistência Social': L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'bdgeo:unidade_assistencia_social',
            transparency: 'true',
            format: 'image/svg', 
            maxZoom: 21,

        }),

        'Feira Livre': L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
            layers: 'bdgeo:feira_livre',
            transparency: 'true',
            format: 'image/svg', 
            maxZoom: 21,

        }),

    };


    //adicionando as camadas ao mapa
    var baselayers = {
        'OpenStreetMap': osm,
        'OpenTopoMap': otm
    };

    
    // Variavel de inicializacao do mapa
    map = L.map("map", {
        center: [-8.769659, -63.882688],
        zoom: 12,
        layers:[osm, bairro]
    });

    var layerControl = L.control.layers(null, overlays).addTo(map);
 
}

