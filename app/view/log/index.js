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

  //***** having scoping issues with geocoding function, function works but can't return anything to controller context. Should add data too model and push addresses via map controller *****//

  GoogleMapsLoader.KEY = __API_KEY__;
  GoogleMapsLoader.load(function(google){
    var geocoder = new google.maps.Geocoder;

    logService.fetchUserLogs()
    .then((logs) => {
      vm.logs = logs;
      for(var i = 0; i < vm.logs.length; i++) {
        var len = vm.logs[i].routeData.length;
        var startLatLng = vm.logs[i].routeData[0];
        var endLatLng = vm.logs[i].routeData[len - 1];
        vm.logs[i].start = geocodeLatLng(geocoder, startLatLng.lat, startLatLng.lng);
        vm.logs[i].end = geocodeLatLng(geocoder, endLatLng.lat, endLatLng.lng);
        $log.debug('fetched logs', vm.logs);
      }
    })
    .catch((err) => {
      $log.error('log service failed to fetch user logs:', err);
    });

    var geocodeLatLng = function(geocoder, lat, lng) {
      //take lat and lng values and run them through google geocoder
      var latLng = {lat: parseFloat(lat), lng: parseFloat(lng)};
      geocoder.geocode({'location': latLng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            vm.address = results[0].address_components[0].long_name + ' ' + results[0].address_components[1].long_name;
            console.log(vm.address);
            return vm.address;
          } else {
            $log.error('no results found');
          }
        } else {
          $log.error('Geocoder failed:', status);
        }
      });
    };
  });
}
