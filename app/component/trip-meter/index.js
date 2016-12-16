'use strict';
require('./_trip-meter.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.directive('appTripMeter', function(){
  return {
    restrict: 'E',
    replace: true,
    template: require('./trip-meter.html'),
    controller: 'TripMeterController',
    controllerAs: 'tripMeterCtrl',
    bindToCtrl: true,
  };
});

appMileage.controller('TripMeterController', ['$log', TripMeterController]);

function TripMeterController($log) {
  const vm = this;
  vm.startPos = null;

  this.getStartingPosition = function(){ // sets the starting position in the trip meter
    /* eslint-disable*/
    navigator.geolocation.getCurrentPosition(function(position) {
      $log.debug('setting start position at: ', position);
      vm.startPos = position;
      document.getElementById('startLocationLat').innerHTML = vm.startPos.coords.latitude + ', ';
      document.getElementById('startLocationLon').innerHTML = vm.startPos.coords.longitude;
    }, function(error) {
      alert('an error has occured: ' + error.code);
    });

    navigator.geolocation.watchPosition(function(position) { // finds the current position of user and watches for changes
      document.getElementById('currentLocationLat').innerHTML = position.coords.latitude + ', ';
      document.getElementById('currentLocationLon').innerHTML = position.coords.longitude;
      if (vm.startPos !== null) {
        document.getElementById('totalDistance').innerHTML =
          calculateDistance(vm.startPos.coords.latitude, vm.startPos.coords.longitude,
                            position.coords.latitude, position.coords.longitude);
      }
      /* eslint-enable*/
    });
  };

  function calculateDistance(lat1, lon1, lat2, lon2) { //calculates the distance between the starting position and the current user position
    var R = 6371;
    var dLat = (lat2 - lat1).toRad();
    var dLon = (lon2 - lon1).toRad();
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  };
}
