'use strict';
require('./_login.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.controller('LoginController', ['$scope', '$log', '$location', '$window', 'authService', LoginController]);

function LoginController($scope, $log, $location, $window, authService){
  $log.debug('signup controller has run');

  const vm = this;
  this.buttons = ['Sign Up', 'Sign In'];
  this.selectedIndex = 0;
  this.error = false;

  this.toggleView = function($index){
    this.selectedIndex = $index;
  };

  /***** function for automatically loging users in if they have a token *****/
  this.getToken = function(){
    $log.debug('loginController.getToken');
    authService.getToken()
    .then(() => {
      $location.path('/map');
    })
    .catch(err => {
      $log.error(err.message);
    });
  };

  this.signup = function(){
    $log.debug('loginCtrl.signup');
    authService.signup(this.user)
    .then(token => {
      $log.info('token', token);
      $location.path('/map');
      //$window.location.reload();
    })
    .catch(err => {
      $log.error(err.message);
    });
  };

  this.signin = function(){
    $log.debug('loginCtrl.signin');
    authService.signin(this.user)
    .then(token => {
      $log.info('token', token);
      $location.path('/map');
      //$window.location.reload();
    })
    .catch(err => {
      $log.error(err.message);
      vm.error = true;
      setTimeout(function() {
        $scope.$apply(function() {
          vm.error = false;
        });
      }, 2500);
    });
  };
}
