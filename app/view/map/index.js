'use strict';

require('./_map.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');
const GoogleMapsLoader = require('google-maps');

appMileage.controller('MapController', ['$log', '$location',  'authService', MapController]);

function MapController($log, $location, authService){
  $log.log('mapCtrl hit');
  authService.getToken()
  .then(() => {
    $location.path('/map');
  }).catch(err => {
    $log.error('login failed', err.message);
    $location.path('/login');
  });

  // setting up map context variables
  const vm = this;
  vm.meter = true;
  vm.googleMarkers = [];
  vm.buttonText = 'Track Me!';
  vm.startTrack = null;
  vm.stopTrack = null;

  vm.tripButton = function(){
    if (vm.startTrack == true) {
      vm.startTrack = false;
      vm.stopTrack = true;
      vm.buttonText = 'New Trip!';
      vm.stopTracking();
    } else if (vm.stopTrack == true) {
      vm.startTrack = null;
      vm.stopTrack = null;
      vm.buttonText = 'Track Me!';
      vm.resetMarkers();
    } else {
      vm.startTrack = true;
      vm.buttonText = 'End Trip';
      vm.startTracking();
    }
  };

  // Goole maps module for angular
  GoogleMapsLoader.KEY = __API_KEY__;
  GoogleMapsLoader.load(function(google) {
    var pos;
    /* eslint-disable*/
    var mapDiv = document.getElementById('map');
    /* eslint-enable*/
    var map =  new google.maps.Map(mapDiv, {
      center: pos,
      zoom: 15,
      disableDefaultUI: true
    });

    var geolocation = new google.maps.Marker({
      map: map,
      title: 'Current Position',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7
      }
    });

    /*eslint-disable*/
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
    /*eslint-enable*/
        pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        geolocation.setPosition(pos);
        map.setCenter(pos);
      }, function(){
        handleLocationError(true, geolocation, map.getCenter());
      });
    } else {
      handleLocationError(false, geolocation, map.getCenter());
    }

    vm.startTracking = function(){
      var startLatLng = pos;
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

      vm.googleMarkers.push(startPosition);
      startPosition.setPosition(startLatLng);
    };

    vm.stopTracking = function(){
      var endLatLng = pos;
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

      vm.googleMarkers.push(endPosition);
      endPosition.setPosition(endLatLng);
    };

    vm.resetMarkers = function(){
      var len = vm.googleMarkers.length, i;
      for (i = 0; i < len; i++){
        vm.googleMarkers[i].setMap(null);
      }
    };
  });

  function handleLocationError(browserHasGeolocation, marker, pos) {
    console.log(marker);
    marker.setPosition(pos);
    marker.setContent(browserHasGeolocation ? 'ERROR: Geolocation service has failed' :
                                              'ERROR: You\'re browser doesn\'t support geolocation.');
  }
}
