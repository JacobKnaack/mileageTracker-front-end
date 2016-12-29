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

appMileage.controller('TripMeterController', ['$log', 'locationService', TripMeterController]);

function TripMeterController($log, locationService) {
  const vm = this; // initializes contect for tripMeter controller
  vm.startPos = null;
  vm.endingPos = null;
  vm.distanceTraveled = 0;

  vm.getStartingPosition = function(){ // sets the starting position in the trip meter
    vm.startPos = locationService.fetchCoords();
    $log.debug('trip meter start set: ', vm.startPos);
  };

  vm.getDistance = function() {
    $log.debug('tripMeter calulating distance');
    vm.endingPos = locationService.fetchCoords();
    vm.distanceTraveled = calculateDistance(vm.startPos.lat, vm.startPos.lng, vm.endingPos.lat, vm.endingPos.lng);
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
