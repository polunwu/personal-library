/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test POST /api/books with title'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test POST /api/books with title');
            assert.property(res.body, '_id');
            done();
        });
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'emty title');
            done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
         const idNotInDB = '5e4ad597e4481237b7ac5fcc';
         chai.request(server)
          .get('/api/books/' + idNotInDB)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test GET /api/books/[id] with valid id in db'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test GET /api/books/[id] with valid id in db');
            
            const id = res.body._id;
            chai.request(server)
              .get('/api/books/' + id)
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'Test GET /api/books/[id] with valid id in db');
                assert.property(res.body, '_id');
                assert.isArray(res.body.comments);
                done();
              });
        });
        
      });
      
      test('Test GET /api/books/[id] with invalid id in db',  function(done){
        const idInvalid = '123';
         chai.request(server)
          .get('/api/books/' + idInvalid)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'invalid id');
            done();
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test POST /api/books/[id] with comment'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test POST /api/books/[id] with comment');
            
            const id = res.body._id;
            const num = Math.floor(Math.random() * 10);
            chai.request(server)
              .post('/api/books/' + id)
              .send({ comment: 'new comment ' + num})
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.title, 'Test POST /api/books/[id] with comment');
                assert.property(res.body, '_id');
                assert.isArray(res.body.comments);
                assert.includeMembers(res.body.comments, ['new comment ' + num ]);
                done();
              });
        });
      });
      
    });
    
    suite('DELETE /api/books/[id] => delete expect book object with id', function(){
      
      test('Test DELETE /api/books/[id] with invalid id in db', function(done){
        const idInvalid = '456';
         chai.request(server)
          .delete('/api/books/' + idInvalid)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'invalid id');
            done();
          });
      });
      
      test('Test DELETE /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Test DELETE /api/books/[id] with valid id in db'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'Test DELETE /api/books/[id] with valid id in db');
            
            const id = res.body._id;
            chai.request(server)
              .delete('/api/books/' + id)
              .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.text, 'delete successful');
                done();
              });
        });
        
      });
      
      test('Test DELETE /api/books/[id] with id not in db', function(done){
        const idNotInDB = '5e4ad597e4481237b7ac5fcc';
         chai.request(server)
          .delete('/api/books/' + idNotInDB)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.error, 'no book exists');
            done();
          });
      });
      
    });

  });

});
