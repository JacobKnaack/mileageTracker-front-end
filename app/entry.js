'use strict';

require('!!file?name=[name].[ext]!./view/index.html');
require('./scss/base.scss');

const angular = require('angular');
const ngRoute = require('angular-route');
const ngAnimate = require('angular-animate');

angular.module('appMileageLog', [ngRoute, ngAnimate])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider
  .when('/login', {
    template: require('./view/login/login.html'),
    controller: 'LoginController',
    controllerAs: 'loginCtrl'
  })
  .when('/log', {
    template: require('./view/log/log.html'),
    controller: 'LogController',
    controllerAs: 'logCtrl'
  })
  .when('/map', {
    template: require('./view/map/map.html'),
    controller: 'MapController',
    controllerAs: 'mapCtrl'
  })
  .otherwise({
    redirectTo: '/login'
  });
}]);

// components
require('./component/heading-control');
require('./component/trip-meter');

// angular services
require('./service/auth-service');

//angular controllers
require('./view/login');
require('./view/map');
