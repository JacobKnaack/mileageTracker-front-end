'use strict';

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.service('locationService', function($log){
  var usersCoords = {};
  var userDistance = null;

  var pushCoords = function(coords){
    $log.debug('updating coordinates: ', coords);
    usersCoords.lat = coords.lat;
    usersCoords.lng = coords.lng;
  };

  var fetchCoords = function(){
    $log.debug('fetching coordinates');
    return usersCoords;
  };

  var pushDistance = function(distance){
    userDistance = distance;
  };

  var fetchDistance = function(){
    return userDistance;
  };

  return {
    pushCoords: pushCoords,
    fetchCoords: fetchCoords,
    pushDistance: pushDistance,
    fetchDistance: fetchDistance
  };
});
