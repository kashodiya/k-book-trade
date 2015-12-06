/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/books              ->  index
 * POST    /api/books              ->  create
 * GET     /api/books/:id          ->  show
 * PUT     /api/books/:id          ->  update
 * DELETE  /api/books/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Book = require('./book.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Books
exports.index = function(req, res) {
  Book.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Book from the DB
exports.show = function(req, res) {
  Book.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Book in the DB
exports.create = function(req, res) {
  console.log(req.user);
  var b = {
    title: req.body.title,
    addedOn: new Date(),
    owner: req.user.email
  };
  
  Book.createAsync(b)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Book in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Book.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.acceptTrade = function(req, res) {
  var thisId = req.body.book._id;
  var otherId = req.body.book.proposeTrade;
  Book.findByIdAsync(thisId)
    .then(function(book) {
      book.removeAsync()
        .then(function() {
          Book.findByIdAsync(otherId)
            .then(function(book) {
              book.removeAsync()
                .then(function() {
                  res.status(204).end();
                });    
            });
        });    
    });
};

exports.removeTrade = function(req, res) {
  Book.findByIdAsync(req.body.book._id)
    .then(function(book) {
      book.proposeTrade = undefined;
      return book.saveAsync()
        .then(function() {
          res.status(204).end();
        })
        .catch(handleError(res));
    });
};

exports.proposeTrade = function(req, res) {
  var myBook = req.body.myBook;
  var tradeBook = req.body.book;
  
  Book.findByIdAsync(myBook._id)
    .then(function(book) {
      book.proposeTrade = tradeBook._id;
      return book.saveAsync()
        .then(function() {
          res.status(204).end();
        })
        .catch(handleError(res));
    });
};

// Deletes a Book from the DB
exports.destroy = function(req, res) {
  Book.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
