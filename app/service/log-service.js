'use strict';

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.factory('logService', ['$log', '$q', '$http', '$window', logService]);

function logService($log, $q, $http, $window) {
  let service = {};
  let url = `${__API_URL__}/api/user/log`;
  let token = $window.localStorage.getItem('token');

  service.createLog = function(data){
    $log.debug('creating trip log');
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    return $http.post(url, data, config)
    .then(res => {
      $log.info('log post sucess', res.data);
      return $q.resolve(res.data);
    })
    .catch(err => {
      $log.info('log post failure', err.message);
      return $q.reject(err);
    });
  };

  service.fetchUserLogs = function(){
    $log.debug('fetching all users trip logs');
    let config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    return $http.get(url, config)
    .then(res => {
      $log.info('fetch user logs success');
      return $q.resolve(res.data);
    })
    .catch(err => {
      $log.error('fetching all user logs failed', err.message);
      return $q.reject(err);
    });
  };

  service.deleteLog = function(){
    $log.debug('deleting user log');
  };

  return service;
}
