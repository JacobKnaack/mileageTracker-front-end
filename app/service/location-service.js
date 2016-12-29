'use strict';

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.service('locationService', function($log){
  var usersCoords = {};

  var pushCoords = function(coords){
    $log.debug('updating coordinates: ', coords);
    usersCoords.lat = coords.lat;
    usersCoords.lng = coords.lng;
  };

  var fetchCoords = function(){
    $log.debug('fetching coordinates');
    return usersCoords;
  };

  return {
    pushCoords: pushCoords,
    fetchCoords: fetchCoords
  };
});
