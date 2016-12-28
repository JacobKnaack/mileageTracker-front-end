'use strict';

describe('testing log service', function(){
  var url = 'http://localhost:3000/api/user';

  var headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhkMzcxZmExZGU2NmRjYjVhNjU4NzlhYmI4MDk5YjA0ODU0ODVlYWU3OGU0OTYyMTY1NGQ5ZWJlMzBhYmJiZTQiLCJ1c2VySWQiOiI1N2M2Mzg3NTU1NDEyMTExMDAzMjNkM2EiLCJpYXQiOjE0NzI2MDgzNzN9.UFaYBDCWqKzdFyPeKNxfxBX2T8zNlqYMkP2tJKp-kQI',
    'Accept': 'application/json, text/plain, */*'
  };

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
    var date = new Date().getDate();
    var postData = {
      date: date,
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
      distance: 1000
    };

    this.$httpBackend.expectPOST(`${url}/log`, postData, headers)
    .respond(200, postData);

    this.logService.createLog(postData)
    .then(log => {
      expect(log.distance).toEqual(1000);
      expect(log.routeData[0]['lat']).toEqual(20);
    })
    .catch( err => {
      expect(err).toEqual(undefined);
    });

    this.$httpBackend.flush();
  });
});
