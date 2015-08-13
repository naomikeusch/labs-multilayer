function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null
}

var user = getURLParameter('u');
var table = getURLParameter('t');
var uuid = getURLParameter('v');
var title = getURLParameter('tt');
var description = getURLParameter('d');
var baseVizJsonUrl = "http://" + user + ".cartodb.com/api/v2/viz/" + uuid + "/viz.json";

//testing crime
var densityLegend = new cdb.geo.ui.Legend.Density({
         		title:   "<a href='http://www.fbi.gov/about-us/cjis/ucr/ucr'>Data From FBI Crime Reporting 2013</a>",
            	left: "Low", right: "High", colors: [ "#FFFFB2", "#FED976", "#FEB24C", "#FD8D3C", "#FC4E2A", "#E31A1C", "#B10026"  ]
            });
            $('#map').append(densityLegend.render().el);
            // Hide the legend for Violent crimes by default
            $(densityLegend.render().el).hide()
		    var densityLegendNon = new cdb.geo.ui.Legend.Density({
                title: "  <a href='http://www.fbi.gov/about-us/cjis/ucr/ucr'>Data From FBI Crime Reporting 2013</a>",
                left: "Low", right: "High", colors: [ "#FFFFCC", "#C7E9B4", "#7FCDBB", "#41B6C4", "#1D91C0", "#225EA8", "#0C2C84" ]
            });
            $('#map').append(densityLegendNon.render().el);
            
            cartodb.createLayer(map_object,'http://team.cartodb.com/api/v2/viz/5a9a49ce-b3a9-11e4-921d-0e9d821ea90d/viz.json')
                .addTo(map_object)
                .done(function(layer) {
                  $("li").on('click', function(e) {
                    var num = +$(e.target).attr('data');
                    createSelector(layer,num,$(e.target).hasClass('vio'));
                  });
                })
                

//end testing crime

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
                    $scope.selectedLayers[id] = layer.show ? true : false;
                    if (layer.vizjson) {
                        layerOptions = layer.vizjson;
                    } else {
                        layerOptions = {
                            user_name: layer.sql_user ? layer.sql_user : user,
                            type: "cartodb",
                            sublayers: [{
                                sql: layer.sql,
                                cartocss: layer.cartocss,
                                interactivity: layer.interactivity
                            }],
                            params: {
                                id: id
                            }
                        };
                    }
                    cartodb.createLayer(map, layerOptions, {legends:true})
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
            });
    });
});
