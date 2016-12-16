'use strict';

require('./_heading-control.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.directive('appHeadingControl', function(){
  return {
    restrict: 'E',
    replace: true,
    template: require('./heading-control.html'),
    controller: 'HeadingController',
    controllerAs: 'headingCtrl',
    bindToCtrl: true,
  };
});

appMileage.controller('HeadingController', ['$log', '$location', 'authService', HeadingController]);

function HeadingController($log, $location, authService){

  this.logout = function(){
    $log.debug('HeadingController logout function');
    authService.logout()
    .then(() => {
      $location.path('/login');
    })
    .catch(err => {
      $log.error('signout failed: ', err.message);
    });
  };
}
