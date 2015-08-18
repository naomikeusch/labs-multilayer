      function main() {
        
        var map = L.map('map', { 
          zoomControl: false,
          center: [40.70, -73.97],
          zoom: 13
          //include layers in definition of map
        //  layers: [grayscale, council]
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
             cartocss: '#layer { polygon-fill: #FFFFFF; polygon-opacity: 0; line-color: #FFF000; line-width: 2; line-opacity: 1;}',
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
        .on('done', function(lyr) {
          L.control.layers(null, { 'all': lyr }).addTo(map);
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
        //L.control.layers(baseMaps, overlayMaps).addTo(map);
      }
      window.onload = main; 
