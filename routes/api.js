/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose    = require('mongoose');
const ObjectId    = require('mongoose').Types.ObjectId;
const expect      = require('chai').expect;
const DB_URI      = process.env.DB;

const Book        = require('../models/book');

mongoose.Promise = global.Promise;

module.exports = function (app) {
  
  mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
  
  const db = mongoose.connection;
  
  db.on('error', console.error.bind(console, 'Error connection to MongoDB'));
  
  db.once('open', function(){
    
    app.route('/api/books')
    .get(function (req, res){
      
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      
      Book.find({}, '_id title commentcount')
            .exec((err, doc) => {
              if (err) { 
                res.json({ database_error: err.message }); 
              } else { 
                res.json(doc);
              }
            });
      
    })
    
    .post(function (req, res){
      const title = req.body.title;
      
      if (!title) {
        res.json({ error: 'emty title'});
      } else {
        
      //response will contain new book object including atleast _id and title
        
      // Book.create({title: title}, function(err, doc){
      //   if (err) { res.json({ database_error: err.message }); } 
      //   else { res.json(doc); }
      // });

        const query   = { title: title };
        const update  = { $setOnInsert: { title: title, comments: [], commentcount: 0 } };
        const options = { new: true,       // Return the document after updates are applied
                        upsert: true };  // Create a document if one isn't found.

        Book.findOneAndUpdate(query, update, options)
              .select('title _id')
              .exec((err, doc) => {
                if (err) { 
                  res.json({ database_error: err.message }); 
                } else { 
                  res.json(doc);
                }
              });
            
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      
      Book.deleteMany({}, function(err, result){
        
        if (err) { 
          res.json({ database_error: err.message }); 
        } else { 
          res.send('complete delete successful');
        }
                      
      });
      
    });



    app.route('/api/books/:id')
      .get(function (req, res){
        const bookid = req.params.id;
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      
        if (!isValidObjectId(bookid)) {
          res.json({ error: 'invalid id' });
        } else {
          
          Book.findById(bookid, '_id title comments') 
              .lean()
              .exec((err, doc) => {
                 if (err) { 
                     res.json({ database_error: err.message }); 
                  } else { 
                    if (doc) {
                      res.json(doc);
                    } else {
                      // doc == null
                      res.json({ error: 'no book exists'});
                    }

                  }
              });
        }  
      })

      .post(function(req, res){
        const bookid = req.params.id;
        const comment = req.body.comment.trim();
        //json res format same as .get
      
        if (!isValidObjectId(bookid)) {
          res.json({ error: 'invalid id' });
        } else if (!comment) { 
          res.json({ error: 'empty comment'});
        } else {
          
          const update  = { $push: { comments: comment  }, $inc: { commentcount: 1 } }
          const options = { new: true, select: '_id title comments' }
          
          Book.findByIdAndUpdate(bookid, update, options)
              .lean()
              .exec((err, doc) => {
                 if (err) { 
                     res.json({ database_error: err.message }); 
                  } else { 
                    if (doc) {
                      res.json(doc);
                    } else {
                      // doc == null
                      res.json({ error: 'no book exists'});
                    }

                  }
              });
          
        }
      })

      .delete(function(req, res){
        const bookid = req.params.id;
        //if successful response will be 'delete successful'
      
        if (!isValidObjectId(bookid)) {
          res.json({ error: 'invalid id' });
        } else {
          
          Book.findByIdAndDelete(bookid)
              .exec((err, doc) => {
                 if (err) { 
                     res.json({ database_error: err.message }); 
                  } else { 
                    if (doc) {
                      res.send('delete successful');
                    } else {
                      // doc == null
                      res.json({ error: 'no book exists'});
                    }

                  }
              });
          
        }
      });
  
  
  
      //404 Not Found Middleware
      app.use(function(req, res, next) {
        res.status(404)
          .type('text')
          .send('Not Found');
      });
    
  });
  
};

function isValidObjectId(id){
  
  if(ObjectId.isValid(id)){
    return String(new ObjectId(id)) === id ? true : false;
  } else {
    return false;
  }
  
}
