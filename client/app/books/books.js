'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('books', {
        url: '/books',
        templateUrl: 'app/books/books.html',
        controller: 'BooksController',
        controllerAs: 'books'
      });
  });
