'use strict';

require('./_map.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');
const GoogleMapsLoader = require('google-maps');

appMileage.controller('MapController', ['$scope', '$log', '$location', 'authService', 'locationService', 'logService', MapController]);

function MapController($scope, $log, $location, authService, locationService, logService){
  $log.log('mapCtrl hit');
  authService.getToken()
  .then(() => {
    $location.path('/map');
  }).catch(err => {
    $log.error('login failed', err.message);
    $location.path('/login');
  });

  // setting up map context variables
  const vm = this; // intitalizes context for MapController to be passed into google map loader
  vm.googleMarkers = [];
  vm.tripCoords = [];
  vm.distance = null;
  vm.startTrack = null;
  vm.stopTrack = null;

  vm.tripButton = function(){
    if (vm.startTrack == true) {
      vm.startTrack = false;
      vm.stopTrack = true;
      vm.stopTracking();
    } else if (vm.stopTrack == true) {
      vm.startTrack = null;
      vm.stopTrack = null;
      vm.finishTrip();
    } else {
      vm.startTrack = true;
      vm.startTracking();
    }
  };

  // Goole maps module for angular
  GoogleMapsLoader.KEY = __API_KEY__;
  GoogleMapsLoader.load(function(google) {
    vm.pos;
    var mapDiv = document.getElementById('map');
    var map =  new google.maps.Map(mapDiv, {
      center: vm.pos,
      zoom: 13,
      disableDefaultUI: true
    });

    var geolocation = new google.maps.Marker({ // map marker for current user location
      map: map,
      title: 'Current Position',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 6
      }
    });

    var tripPath = new google.maps.Polyline({ // line of path traveled by user
      strokeColor: 'blue',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    tripPath.setMap(map);

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function(position){
        $log.debug('getting users position', vm.tripCoords);
        vm.pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        $scope.$apply();
        locationService.pushCoords(vm.pos); // makes position coordinates available to other controllers

        if (vm.startTrack == true) {
          vm.tripCoords.push(vm.pos);
          var coords = new google.maps.LatLng(vm.tripCoords[vm.tripCoords.length - 1]);
          var path = tripPath.getPath();
          path.push(coords);
        }

        geolocation.setPosition(vm.pos); // sets the geolocation marker wherever the current user position is
        map.setCenter(vm.pos);
      }, function(){
        handleLocationError(true, geolocation, map.getCenter());
      });
    } else {
      handleLocationError(false, geolocation, map.getCenter());
    }

    vm.startTracking = function(){
      var startLatLng = vm.pos;
      var startPosition = new google.maps.Marker({
        position: startLatLng,
        map: map,
        title: 'Starting Location',
        icon: {
          path: google.maps.SymbolPath.BACKWARD_OPEN_ARROW,
          scale: 5,
          strokeColor: '#9FFFAC'
        }
      });

      vm.tripCoords.push(startLatLng);
      vm.googleMarkers.push(startPosition);
      startPosition.setPosition(startLatLng);
    };

    vm.stopTracking = function(){
      var endLatLng = vm.pos;
      var endPosition = new google.maps.Marker({
        position: endLatLng,
        map: map,
        title: 'Ending Location',
        icon: {
          path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
          scale: 5,
          strokeColor: '#B24C68'
        }
      });

      vm.tripCoords.push(endLatLng);
      vm.googleMarkers.push(endPosition);
      endPosition.setPosition(endLatLng);
    };

    vm.finishTrip = function(){
      vm.distance = locationService.fetchDistance();
      var log = {
        date: new Date(),
        routeData: vm.tripCoords,
        distance: vm.distance
      };

      logService.createLog(log)
      .then(() => {
        var len = vm.googleMarkers.length, i;
        for (i = 0; i < len; i++){
          vm.googleMarkers[i].setMap(null);
        }

        len = vm.tripCoords.length;
        vm.tripCoords.splice(0, len);
        tripPath.setMap(null);
      })
      .catch((err) => {
        $log.error(err);
      });
    };
  });

  function handleLocationError(browserHasGeolocation, marker, pos) {
    console.log(marker);
    marker.setPosition(pos);
    marker.setContent(browserHasGeolocation ? 'ERROR: Geolocation service has failed' :
                                              'ERROR: You\'re browser doesn\'t support geolocation.');
  }
}
