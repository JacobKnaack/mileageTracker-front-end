'use strict';
require('./_log.scss');

const angular = require('angular');
const appMileage = angular.module('appMileageLog');

appMileage.controller('LogController', ['$log', 'logService', LogController]);

function LogController($log, logService) {
  logService.fetchUserLogs()
  .then((logs) => {
    this.logs = logs;
    $log.debug('fetched logs', this.logs);
  })
  .catch((err) => {
    $log.error('log service failed to fetch user logs:', err);
  });
}
