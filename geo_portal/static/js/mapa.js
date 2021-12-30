
function getzoom (e) {
    map.fitBounds(e.target.getBounds())

}


var map
function init () {
    // Variavel de inicializacao do mapa
    map = L.map("map", {
        center: [-8.769659, -63.882688],
        zoom: 12
    });
    

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)
    
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
        

    })

    var basemap = {
        'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
        "Open Topo Map": L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png')
    }

    var control = L.control.layers(basemap, wms).addTo(map)
    control.expand()
    $.ajax('id').done(function (data) {
        var id = L.geoJSON(data, {
            style: getclass,
            color: 'green',
            onEachFeature: function (feature, layer) {
                layer.on({
                    click: getzoom,
                    contextmenu: function (e) {
                        var conteudo = '<b><label>Bairro:</label></b><label>' + feature.properties.name + '</label><br>'
                            + '<b><label>Zona:</label></b><label>' + feature.properties.zona + '</label><br>'

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

        })
        control.addOverlay(id, 'Id do')

    })



}