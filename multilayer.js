function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

var user = getURLParameter('u');
var table = getURLParameter('t');
var uuid = getURLParameter('v');
var title = getURLParameter('tt');
var description = getURLParameter('d');
var baseVizJsonUrl = "http://" + user + ".cartodb.com/api/v2/viz/" + uuid + "/viz.json";



var multilayer = angular.module('multilayer', []);
multilayer.controller('SelectorCtrl', function ($scope) {
    var cartodbLayers = [];

    function addLayer(id, show, map) {
        return function (layer) {
            if (!show) {
                layer.hide();
            }
            cdb.vis.Vis.addInfowindow(map, layer.getSubLayer(0), ['cartodb_id'])
            cartodbLayers[id] = layer;
        };
    }

    $scope.title = title;
    $scope.description = description;

    $scope.selectedLayers = [];

    $scope.layersUpdated = function (id) {
        var layer = cartodbLayers[id];
        if ($scope.selectedLayers[id]) {
            layer.show();
        } else {
            layer.hide();
        }
    };

    cartodb.createVis('map', baseVizJsonUrl, {
        zoom: 13,
        center_lat: 40.70,
        center_lon: -73.97,
        loaderControl: true,
        zoomControl: false
    }).done(function (vis) {
        var map = vis.getNativeMap();

        var sql = new cartodb.SQL({user: user});
        sql.execute("SELECT name, show, viz_json as vizjson, sql, cartocss, interactivity, sql_user FROM " + table + " WHERE name IS NOT NULL")
            .done(function (data) {
                $scope.layers = data.rows;
                for (var id = 0; id < $scope.layers.length; ++id) {
                    var layerOptions;

                    layer = $scope.layers[id];
                    layer.id = id;
                    //edit
                    $scope.selectedLayers[id] = layer.show ? true : false;
                    if (layer.vizjson) {
                        layerOptions = layer.vizjson;
                    } else {
                        layerOptions = {
                            user_name: layer.sql_user ? layer.sql_user : user,
                            type: "cartodb",
                            sublayers: [{
                                //edit
                                sql: 'select * from map',
                                cartocss: '#layer { polygon-fill: green; polygon-opacity: 0.3; line-color: #F00; }',
                                interactivity: 'cartodb_id'
                                //end edit
                            }],
                            params: {
                                id: id
                            }
                        };
                    }
                    cartodb.createLayer(map, layerOptions)
                        .addTo(map)
                        .done(addLayer(id, layer.show, map)) 
                        .error(function (error) {
                            console.log("error: " + error); 
                        }); 
                }
                $scope.$apply();
            })
            .error(function (errors) {
                console.log("errors: " + errors); 
                //edit
         .on('done', function(lyr) {
          L.control.layers(null, { 'maps': lyr }).addTo(map);
          //end edit
            });
    });
});
