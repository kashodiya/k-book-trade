'use strict';

describe('Controller: BooksController', function () {

  // load the controller's module
  beforeEach(module('appApp'));

  var BooksController, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BooksController = $controller('BooksCcontroller', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
