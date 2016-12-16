'use strict';

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.factory('authService', ['$log', '$q', '$http', '$window', authService]);

function authService($log, $q, $http, $window){
  let service = {};
  let token = null;

  function _setToken(_token){
    $log.debug('authService._setToken');
    if (!_token) return $q.reject(new Error('no token'));
    $window.localStorage.setItem('token', _token);
    token = _token;
    return $q.resolve(token);
  }

  service.getToken = function(){
    $log.debug('authService.getToken');
    if(token) return $q.resolve(token);
    token = $window.localStorage.getItem('token');
    if (token) return $q.resolve(token);
    return $q.reject(new Error('token not found'));
  };

  service.logout = function(){
    $log.debug('authService.logout');
    $window.localStorage.removeItem('token');
    token = null;
    return $q.resolve();
  };

  service.signup = function(user){
    let url = `${__API_URL__}/api/signup`;
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return $http.post(url, user, config)
    .then(res => {
      $log.info('signup success', res.data);
      return _setToken(res.data);
    })
    .catch(err => {
      $log.error(' signup failure', err.message);
      return $q.reject(err);
    });
  };

  service.signin = function(user){
    $log.debug('authService/signin');
    let url = `${__API_URL__}/api/signin`;
    let authString = $window.btoa(`${user.emailAddress}:${user.password}`);
    let config = {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Basic ${authString}`
      }
    };

    return $http.get(url, config)
    .then(res => {
      $log.info('signin success', res.data);
      return _setToken(res.data);
    })
    .catch(err => {
      $log.error('signin failure', err.message);
      return $q.reject(err);
    });
  };

  return service;
}
