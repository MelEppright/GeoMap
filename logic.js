// Store our API endpoint inside queryUrl
var queryUrl = "http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets-basic",
  accessToken: API_KEY
}).addTo(myMap);

function markerSize(magnitude) {
  return features.properties.mag * 1;
}

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + 
      "</h3><hr><p>" + "<h3>" + feature.properties.mag + 
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes,
  };


for (var i = 0; i < features.properties.mag; i++) {

  var color = "";
  if (features[i].properties.mag <= 5) {
    color = "yellow";
  }
  else if (features[i].properties.mag <= 4) {
    color = "blue";
  }
  else if (features[i].properties.mag <= 3) {
    color = "green";
  }

  else if (features[i].properties.mag <= 2) {
    color = "pink";
  }
  else if (features[i].properties.mag <= 1) {
    color = "purple";
  }
  else {
    color = "red";
  }

  // Add circles to map
  L.circle(features[i].properties.mag, {
    fillOpacity: 0.75,
    color: "white",
    fillColor: color,
    // Adjust radius
    radius: markersize(magnitude)
  }).bindPopup("<h3>" + feature.properties.place + 
  "</h3><hr><p>" + "<h3>" + feature.properties.mag + 
  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
}