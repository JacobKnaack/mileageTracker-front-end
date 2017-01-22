'use strict';

require('./_footer.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.directive('appFooter', function() {
  return {
    restrict: 'E',
    replace: true,
    template: require('./footer.html'),
    controller: 'FooterController',
    controllerAs: 'footerCtrl',
    bindToCtrl: true,
  };
});

appMileage.controller('FooterController', ['$log', FooterController]);

function FooterController($log) {

}
