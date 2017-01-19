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
  vm.startAddress = null;
  vm.endAddress = null;
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
    vm.google = google;
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

    if (navigator.geolocation) { // geolocation tracking function that runs everytime user position changes
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

    vm.geocodeLatLng = function(lat, lng, callback) {
      var latLng = new vm.google.maps.LatLng(lat, lng);
      var geocoder = new vm.google.maps.Geocoder;

      geocoder.geocode({'location': latLng}, function(results, status) {
        if (status == 'OK') {
          if (results[0]) {
            callback(results[0].address_components[0].long_name + ' ' + results[0].address_components[1].long_name);
          } else {
            $log.error('no results found');
          }
        } else {
          $log.error('geocoder failed:', status);
        }
      });
    };

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

    vm.finishTrip = function(){ // focus on moving the geolocation and logService function to endTrip, make this simply a resetting markers and variables function
      var tripLen = vm.tripCoords.length;
      vm.distance = locationService.fetchDistance();
      vm.geocodeLatLng(vm.tripCoords[0].lat, vm.tripCoords[0].lng, function(address) {
        vm.startAddress = address;
        vm.geocodeLatLng(vm.tripCoords[tripLen - 1].lat, vm.tripCoords[tripLen - 1].lng, function(address) {
          vm.endAddress = address;
          var log = {
            date: new Date(),
            routeData: vm.tripCoords,
            startAddress: vm.startAddress,
            endAddress: vm.endAddress,
            distance: vm.distance
          };
          $log.debug('log object', log);

          logService.createLog(log)
          .then(() => {
            var markerLen = vm.googleMarkers.length, i;
            for (i = 0; i < markerLen; i++){
              vm.googleMarkers[i].setMap(null);
            }

            vm.tripCoords.splice(0, tripLen);
            tripPath.setMap(null);
          })
          .catch((err) => {
            $log.error(err);
          });
        });
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
