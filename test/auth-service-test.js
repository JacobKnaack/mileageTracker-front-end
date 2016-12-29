'use strict';

describe('testing the auth services', function() {
  var url = 'http://localhost:3000/api';

  var headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  beforeEach(() => {
    angular.mock.module('appMileageLog');
    angular.mock.inject((authService, $httpBackend) => {
      this.authService = authService;
      this.$httpBackend = $httpBackend;
    });
  });

  afterEach(() => {
    this.$httpBackend.verifyNoOutstandingExpectation();
    this.$httpBackend.verifyNoOutstandingRequest();
  });

  it('should return a token', () => {
    this.$httpBackend.expectPOST(`${url}/signup`, {emailAddress: 'test', password: 'password', firstName: 'thisIs', lastName: 'aTest'}, headers)
    .respond(200, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhkMzcxZmExZGU2NmRjYjVhNjU4NzlhYmI4MDk5YjA0ODU0ODVlYWU3OGU0OTYyMTY1NGQ5ZWJlMzBhYmJiZTQiLCJ1c2VySWQiOiI1N2M2Mzg3NTU1NDEyMTExMDAzMjNkM2EiLCJpYXQiOjE0NzI2MDgzNzN9.UFaYBDCWqKzdFyPeKNxfxBX2T8zNlqYMkP2tJKp-kQI');

    this.authService.signup({emailAddress: 'test', password: 'password', firstName: 'thisIs', lastName: 'aTest'})
    .then( token => {
      expect(token.length).toBe(253);
    })
    .catch(err => {
      expect(err).toBe(undefined);
    });

    this.$httpBackend.flush();
  });

  it('should fetch a user token', () =>{
    this.$httpBackend.expectGET(`${url}/signin`, {'Accept':'application/json','Authorization':'Basic dGVzdDpwYXNzd29yZA=='})
    .respond(200, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6IjhkMzcxZmExZGU2NmRjYjVhNjU4NzlhYmI4MDk5YjA0ODU0ODVlYWU3OGU0OTYyMTY1NGQ5ZWJlMzBhYmJiZTQiLCJ1c2VySWQiOiI1N2M2Mzg3NTU1NDEyMTExMDAzMjNkM2EiLCJpYXQiOjE0NzI2MDgzNzN9.UFaYBDCWqKzdFyPeKNxfxBX2T8zNlqYMkP2tJKp-kQI');

    this.authService.signin({emailAddress: 'test', password: 'password'})
    .then( token => {
      expect(token.length).toBe(253);
    })
    .catch(err => {
      expect(err).toBe(undefined);
    });

    this.$httpBackend.flush();
  });
});
