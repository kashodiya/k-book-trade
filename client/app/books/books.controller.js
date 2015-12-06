'use strict';

(function() {

class BooksController {
  
  constructor($http, socket, Auth, toasty, $scope) {
    this.$scope = $scope;
    this.toasty = toasty;
    this.allBooks = [];
//    console.log('toasty', toasty);
    this.lodash = _;
    this.getCurrentUser = Auth.getCurrentUser;
//    console.log(this.getCurrentUser);
    this.$http = $http;
    this.newTitle = '';
    this.myBooks = [];
    this.books = [];
    this.selectedBook;
    this.selectedMyBook;
    this.socket = socket;
    this.getBooks();
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('book');
    });
    
    
    var splitMyAndOtherBooks = this.splitMyAndOtherBooks; 
    var that = this;
    
//    this.socket.syncUpdates('book', this.allBooks);
    
    
    //var allBooks = this.allBooks;
    
    
    
  }
  
//  myBookSelected(book){
//    this.selectedMyBook = book;
//    console.log(book);
//  }
//  
//  bookSelected(book){
//    this.selectedBook = book;
//    console.log(book);
//  }
  
  twoBooksSelected(){
    return this.selectedBook && this.selectedMyBook;
  }
  
  peoposeBookTrade(){
//    console.log(this.selectedBook);
//    console.log(this.selectedMyBook);
    
    this.$http.post('/api/books/proposeTrade', 
                    {myBook: this.selectedMyBook, book: this.selectedBook}).then(response => {
      console.log('proposeTrade done', response);
      this.selectedBook = undefined;
      this.selectedMyBook = undefined;
//      this.getBooks();
    });    
  }  
  
  removeTrade(book){
    this.$http.post('/api/books/removeTrade', 
                    {book: book}).then(response => {
//      this.getBooks();
    });    
  }  
  
  acceptTrade(book){
    this.$http.post('/api/books/acceptTrade', 
                    {book: book}).then(response => {
      this.toasty({
          title: 'Offer is accepted',
          msg: 'An email would be sent to both to send the book to each other. Removing books from here!',
          timeout: 15000
      });
//      this.getBooks();
    });    
  }  
  
  splitMyAndOtherBooks(){
    console.log('this.allBooks.length = ', this.allBooks.length);
//    this.allBooks = allBooks;
    var email = this.getCurrentUser().email;
    var books = this.books = [];
    var myBooks = this.myBooks = [];
    this.allBooks.forEach(function(b){
      if(b.owner === email){
        myBooks.push(b);
      }else{
        books.push(b);
      }
    });
    var lodash = this.lodash;
    myBooks.forEach(function(b){
      if(b.proposeTrade){
        var otherBook = lodash.find(books, {_id: b.proposeTrade});
        if(otherBook){
          b.proposedTradeBook = otherBook;
        }
      }
    });
    books.forEach(function(b){
      if(b.proposeTrade){
        var myBook = lodash.find(myBooks, {_id: b.proposeTrade});
        if(myBook){
          b.proposedTradeBook = myBook;
        }
      }
    });
  }
  
  getBooks(){
    
    this.$http.get('/api/books').then(response => {
//      console.log(response.data);
//      console.log('email', this.getCurrentUser().email);
      //this.allBooks = response.data;
      console.log('response data: books count', response.data.length);
      this.allBooks = response.data;
      this.splitMyAndOtherBooks();
      
      
      var outerThis = this;
      this.socket.syncUpdates('book', this.allBooks, function(event, item, array){
        console.log('Books changed!');
        array.forEach(function(b){
          console.log('Array event, title:', event, b.title);
        });
        outerThis.splitMyAndOtherBooks.apply(outerThis);
      });
      
      
      
//      var email = this.getCurrentUser().email;
//      var books = this.books = [];
//      var myBooks = this.myBooks = [];
//      this.allBooks.forEach(function(b){
//        if(b.owner === email){
//          myBooks.push(b);
//        }else{
//          books.push(b);
//        }
//      });
//      var lodash = this.lodash;
//      myBooks.forEach(function(b){
//        if(b.proposeTrade){
//          var otherBook = lodash.find(books, {_id: b.proposeTrade});
//          if(otherBook){
//            b.proposedTradeBook = otherBook;
//          }
//        }
//      });
//      books.forEach(function(b){
//        if(b.proposeTrade){
//          var myBook = lodash.find(myBooks, {_id: b.proposeTrade});
//          if(myBook){
//            b.proposedTradeBook = myBook;
//          }
//        }
//      });
      
    });    
  }
  
  addBook() {
    if (this.newTitle) {
      this.$http.post('/api/books', { title: this.newTitle });
      this.newTitle = '';
//      this.getBooks();
    }
  }
  
}

  
angular.module('appApp')
  .controller('BooksController', ['$http', 'socket', 'Auth', 'toasty', '$scope', BooksController]);
})();
