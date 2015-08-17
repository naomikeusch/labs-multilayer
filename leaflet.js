      function main() {
        
        //Testing making variables for each layer
        //added to
     /*   var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
        denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
        aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
        golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');
        
          var council =  L.layerGroup([littleton, denver, aurora, golden]);
        //originally on, have to switch between
        var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution}),
            streets   = L.tileLayer(mapboxUrl, {id: 'MapID', attribution: mapboxAttribution});
            
        var baseMaps = {
            "Grayscale": grayscale,
            "Streets": streets
        };
        var overlayMaps = {
            "Council": council
        }; */
        // create leaflet map
        var map = L.map('map', { 
          zoomControl: false,
          center: [40.70, -73.97],
          zoom: 13
          //include layers in definition of map
         // layers: [grayscale, council]
        });
        // add a base layer
        L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
          attribution: 'Stamen'
        }).addTo(map); 
      //  L.control.layers(baseMaps, overlayMaps).addTo(map);
        // add cartodb layer with one sublayer: DONT FORGET COMMAS IN BETWEEN LAYERS IN ARRAY, AND MAKE SURE YOUR USERNAME AND SQL ARE CORRECT
            //First, layers that pop up by themselves
        cartodb.createLayer(map, {
          user_name: 'naomikeusch',
          type: 'cartodb',
          sublayers: [{
             sql: 'select * from city_council_districts',
             cartocss: '#layer { polygon-fill: #F00; polygon-opacity: 0.3; line-width: 2; line-color: #F00; }',
             interactivity: 'cartodb_id'
          }
          ]
        }).addTo(map);
          //Second, layers that come up by clicking maps
        cartodb.createLayer(map, {
          user_name: 'naomikeusch',
          type: 'cartodb',
          sublayers: [{
            sql: 'select * from world_borders',
            cartocss: '#layer { polygon-fill: #FFFFFF; polygon-opacity: 0; line-color: #6B0FB2; line-width: 2;}',
            interactivity: 'cartodb_id'
          },
          {
            sql: 'select * from bikeroutes_ny',
            cartocss: '#layer { polygon-fill: #FFFFFF; polygon-opacity: 0; line-color: #229A00; line-width: 2; line-opacity: 1;}',
            interactivity: 'cartodb_id'
          }
          ]
        })
        .on('done', function(lyr), function(lyr) {
          L.control.layers(null, { 'all': lyr }, { 'all': lyr }).addTo(map);
        })
        
        cartodb.createLayer(map, {
          user_name: 'naomikeusch',
          type: 'cartodb',
          sublayers: [           
            {
             sql: 'select * from nycd',
             cartocss: '#layer { polygon-fill: #F00; polygon-opacity: 0; line-width: 2; line-color:  #2167AB;}',
             interactivity: 'cartodb_id'
          }]
        })
        .on('done', function(lyr) {
          L.control.layers(null, { 'all': lyr }).addTo(map);
        })
      }
 
      window.onload = main; 
