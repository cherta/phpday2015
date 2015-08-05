var positionID = null;
var markers = [];

function startTrackingPosition (map) {
  removeMapMarkers(map);
  this.positionID = navigator.geolocation.watchPosition(function trackingPosition (position) {
    centerMap(map, position);
  });
}

function stopTrackingPosition () {
  if(navigator.geolocation) {
    navigator.geolocation.clearWatch(this.positionID);
  }
}

function removeMapMarkers (map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function centerMap (map, position) {
  setTimeout(function () {
    let marker = new google.maps.Marker({ position: position, map: map });
    map.panTo(position);
    markers.push(marker);
  });
}

function showDirections (map) {
  navigator.geolocation.getCurrentPosition(function (position) {
    let from = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    let venue = 'UTU - ESCUELA TECNOLÓGICA BUCEO, Avenida General Fructuoso Rivera, Montevideo 11600';
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    let request = {
      origin: from,
      destination: venue,
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      }
    });
  });
}

function load (mapNode) {
  if(!navigator.geolocation) { return null; }
  var mapNode = mapNode || document.getElementById('map');

  let options = { zoom: 17/*, center: new google.maps.LatLng(-34.8993774, -56.1320043)*/ };
  let map = new google.maps.Map(mapNode, options);

  navigator.geolocation.getCurrentPosition(function center (position) {
    let currentPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    centerMap(map, currentPosition);
    startTrackingPosition.call(this, map);
  }.bind(this));

  return map;
}

module.exports = {
  load: load,
  stopTrackingPosition: stopTrackingPosition,
  showDirections: showDirections,
  positionID: positionID
};
