currentLegend = null;
      legends       = {};
      legendsArray  = [];
      function selectLegend(e){
        e.stopPropagation();
        e.preventDefault();
        var target = e.target;
        var $link = $(e.target);
        var type = $link.attr("data-legend");
        if (type === 'stacked') {
        $(".legend-selector a").addClass("selected");
          var stackedLegend = new cdb.geo.ui.Legend.Stacked({
            data: legendsArray
          });
          currentLegend = stackedLegend;
        } else { 
              
                //Edit
          cartodb.createLayer(map, layerOptions)
                        .addTo(map)
                        .done(addLayer(id, layer.show, map))
                        .error(function (error) {
                            console.log("error: " + error);
                        });
                        //end edit
          $(".legend-selector a.selected").removeClass("selected");
          $link.addClass("selected");
          currentLegend = legends[type].legend;
        
        }
        currentLegend.addTo(".legends");
        //edit
         $("#map .legends").html(currentLegend.render().$el);
      }
      function renderLegendList() {
        _.each(legends, function(legend, type) {
          var li = '<li><a href="#" data-legend="' + type + '">' + legend.title + '</a></li>';
          $(".legend-selector").append(li);
        });
        var li = '<li><a href="#" data-legend="stacked">Clear</a></li>';
        $(".legend-selector").append(li);
      }
      window.onload = function() {
          var customLegend = new cdb.geo.ui.Legend.Custom({
            title: "Boarders",
            data: [
              { name: "City Council Districts",  value: "#FF2900" },
              { name: "Community Districts",       value: "#2167AB" },
              { name: "Rivers",         value: "#54BFDE" },
              { name: "Fields",         value: "#9BC562" },
              { name: "Caves",          value: "#FABB5C" }
            ]
          });
          var categoryLegend = new cdb.geo.ui.Legend.Category({
            title: "Category Legend",
            data: [
              { name: "Airport Parks", value: "img/airport-24@2x.png",   type: "image" },
              { name: "Heart",         value: "img/heart-24@2x.png",     type: "image" },
              { name: "Zoom",          value: "img/zoo-24@2x.png",       type: "image" },
              { name: "Fields",        value: "img/tennis-24@2x.png",    type: "image" },
              { name: "Caves",         value: "img/town-hall-24@2x.png", type: "image" },
            ]
          });
          var bubbleLegend = new cdb.geo.ui.Legend.Bubble({
            title: "Bubble Legend",
            min: 21, max: 20, color: "red"
          });
          var densityLegend = new cdb.geo.ui.Legend.Density({
            title: "Density Legend",
            left: "0", right: "10", colors: [ "#58A062", "#F07971", "#54BFDE", "#9BC562", "#FABB5C" ]
          });
          var intensityLegend = new cdb.geo.ui.Legend.Intensity({
            title: "Intensity Legend",
            left: "10", right: "20", color: "#f1f1f1"
          });
          legends = {
            custom:    { legend: customLegend,    title: "Boarders" },
            bubble:    { legend: bubbleLegend,    title: "Bubble Legend" },
            density:   { legend: densityLegend,   title: "Density Legend" },
            category:  { legend: categoryLegend,  title: "Category Legend" },
            intensity: { legend: intensityLegend, title: "Intensity Legend" }
          };
          legendsArray = [{
            title: "Boarders",
            data: [
              { name: "Postredist",  value: "#FF2900" },
              { name: "Villages",       value: "#F07971" },
              { name: "Rivers",         value: "#54BFDE" },
              { name: "Fields",         value: "#9BC562" },
              { name: "Caves",          value: "#FABB5C" }
            ]
          }, {
            type: "bubble",
            title: "Bubble Legend",
            min: 21, max: 20, color: "red"
          }];
          renderLegendList();
          $(".legend-selector a").click(selectLegend);
          
          var onVisDone = function(vis, layers) {
            layers[1].setInteraction(true);
            layers[1].on('featureOver', function(e, latlng, pos, data, layerNumber) {
              cartodb.log.log(e, latlng, pos, data, layerNumber);
            });
          };
         
      }
