function getclass (feature) {
    switch (feature.properties.administra) {
        case 'Federal': return { color: 'red' };
        case 'Estadual': return { color: 'blue' };
        case 'Municipal': return { color: 'yellow' }
    }
}
function getzoom (e) {
    map.fitBounds(e.target.getBounds())

}


function createPolyline (map) {

    var polyline = L.polyline({}).addTo(map)
    map.on('click', function (e) {
        polyline.addLatLng(e.latlng)
        polyline.on('contextmenu', function (e) {
            map.removeLayer(e.target)
        })
    })
    map.on('contextmenu', function (e) {
        polyline.closestLayerPoint(e.latlng)
        polyline = L.polyline({}).addTo(map)
    })

}
var map
function init () {
    // Variavel de inicializacao do mapa
    map = L.map("map", {
        center: [-8.769659, -63.882688],
        zoom: 12
    });
    createPolyline(map)

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    var control = L.control.layers().addTo(map)
    //var otm = L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')

    var wms = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
        layers: 'bdgeo:bairro',
        style: '',
        format: 'image/png',
        transparent: true,
        //cql_filter: "USO='Agricultura'"
    }).addTo(map)
    //wms.setParams({ cql_filter: "USO='Cerrado'" })

    $.ajax('/focos').done(function (data) {
        var focos = L.geoJSON(data)
        var array = new Array()
        focos.eachLayer(function (lyr) {
            var coordenadas = lyr.feature.geometry.coordinates
            array.push([coordenadas[1], coordenadas[0]])
        })

        var heatmap = L.heatLayer(array, {
            minOpacity: 1,
            radius: 10,
            max: 0.5

        })
        control.addOverlay(heatmap, 'Mapa de Calor')

    })
    //var wms2 = L.tileLayer.wms('http://localhost:8080/geoserver/ows?', {
    //	layers: 'Curso-Censipam:areas_prioritarias',
    //	style: '',
    //	format: 'image/png',
    //	transparent: false
    //}).addTo(map)


    //osm.addTo(map)
    //otm.addTo(map)

    var basemap = {
        'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "Open Topo Map": L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
    }
    /* 
    //var overmaps = {
        'Areas-Prioritarias': wms,
        'Nome da segunda': wms2
    }
    */


    control.expand()
    $.ajax('/uf').done(function (data) {
        var uf = L.geoJSON(data, {
            style: getclass,
            color: 'green',
            onEachFeature: function (feature, layer) {
                layer.on({
                    click: getzoom,
                    contextmenu: function (e) {
                        var conteudo = '<b><label>Codigo:</label></b><label>' + feature.properties.geocodigo + '</label><br>'
                            + '<b><label>Codigo:</label></b><label>' + feature.properties.geocodigo + '</label><br>'

                        var popup = L.popup()
                            .setContent(conteudo)
                            .setLatLng(e.latlng)
                            .openOn(map)
                    }
                })

            },
            filter: function (feature) {
                if (feature.properties.sigla == 'AM') {
                    return true
                } else {
                    return false
                }
            }
            /*
            onEachFeature: function (feature, layer) {

                var popup = '<b><label>Codigo:</label></b><label>' + feature.properties.geocodigo + '</label><br>'
                    + '<b><label>Codigo:</label></b><label>' + feature.properties.geocodigo + '</label><br>'
                layer.bindPopup(popup)
            */

        })//.addTo(map)
        control.addOverlay(uf, 'Unidade de Federação')

    })

    //var geo = L.geoJSON(uf).addTo(map)
    //L.control.layers(basemap, overmaps, { collapsed: false, title: 'Controle' }).addTo(map)
}