'use strict';
require('./_log.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');
const GoogleMapsLoader = require('google-maps');

appMileage.controller('LogController', ['$log', '$location', 'authService', 'logService', LogController]);

function LogController($log, $location, authService, logService) {
  authService.getToken()
  .then(() => {
    $location.path('/log');
  }).catch(err => {
    $log.error('login failed', err.message);
    $location.path('/login');
  });

  const vm = this;

  //***** update jan 14, 2017: moved gelocation to map controller, address posted to log model*****//

  GoogleMapsLoader.KEY = __API_KEY__;
  GoogleMapsLoader.load(function(google){
    // var geocoder = new google.maps.Geocoder;

    logService.fetchUserLogs()
    .then((logs) => {
      vm.logs = logs;
      $log.debug('vm.logs:', vm.logs);
    })
    .catch((err) => {
      $log.error('log service failed to fetch user logs:', err);
    });
  });
}
