'use strict';

describe('testing log service', function(){
  var url = 'http://localhost:3000/api/user';
  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhkMzcxZmExZGU2NmRjYjVhNjU4NzlhYmI4MDk5YjA0ODU0ODVlYWU3OGU0OTYyMTY1NGQ5ZWJlMzBhYmJiZTQiLCJ1c2VySWQiOiI1N2M2Mzg3NTU1NDEyMTExMDAzMjNkM2EiLCJpYXQiOjE0NzI2MDgzNzN9.UFaYBDCWqKzdFyPeKNxfxBX2T8zNlqYMkP2tJKp-kQI',
    'Accept': 'application/json, text/plain, */*'
  };

  var postData1 = {
    date: new Date().getDate(),
    routeData: [
      {
        'lat': 20,
        'lng': 40
      },
      {
        'lat': 21,
        'lng': 42
      }
    ],
    startAddress: 'NorthWest 57th St., Seattle',
    endAddress: '3rd Ave, Seattle',
    distance: 1000
  };

  var postData2 = {
    date: new Date().getDate(),
    routeData: [
      {
        'lat': 30,
        'lng': 45
      },
      {
        'lat': 32,
        'lng': 50
      }
    ],
    startAddress: '3rd Ave, Seattle',
    endAddress: 'NorthWest 57th St., Seattle',
    distance: 900
  };

  var allData = [postData1, postData2];

  beforeEach(() => {
    angular.mock.module('appMileageLog');
    angular.mock.inject((logService, $httpBackend) => {
      this.logService = logService;
      this.$httpBackend = $httpBackend;
    });
  });

  afterEach(() => {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.$httpBackend.verifyNoOutstandingRequest();
  });

  it('should create a log', () => {
    this.$httpBackend.expectPOST(`${url}/log`, postData1, headers)
    .respond(200, postData1);

    this.logService.createLog(postData1)
    .then(log => {
      expect(log.distance).toEqual(1000);
      expect(log.routeData[0]['lat']).toEqual(20);
    })
    .catch( err => {
      expect(err).toEqual(undefined);
    });

    this.$httpBackend.flush();
  });

  it('should fetch all logs by userId', () => {
    var headers = {
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhkMzcxZmExZGU2NmRjYjVhNjU4NzlhYmI4MDk5YjA0ODU0ODVlYWU3OGU0OTYyMTY1NGQ5ZWJlMzBhYmJiZTQiLCJ1c2VySWQiOiI1N2M2Mzg3NTU1NDEyMTExMDAzMjNkM2EiLCJpYXQiOjE0NzI2MDgzNzN9.UFaYBDCWqKzdFyPeKNxfxBX2T8zNlqYMkP2tJKp-kQI',
      'Accept': 'application/json, text/plain, */*'
    };

    this.$httpBackend.expectGET(`${url}/log`, headers)
    .respond(200, allData);

    this.logService.fetchUserLogs()
    .then(logs => {
      expect(logs.length).toEqual(2);
      expect(logs[0].startAddress).toEqual('NorthWest 57th St., Seattle');
    })
    .catch(err => {
      expect(err).toEqual(undefined);
    });

    this.$httpBackend.flush();
  });
});
