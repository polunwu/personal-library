'use strict';

const mongoose    = require('mongoose');
const Schema      = mongoose.Schema;

const bookSchema = new Schema({
  
      title:        { type: String, required: true, trim: true },
      comments:     { type: [String] },
      commentcount: { type: Number, default: 0 }
      
  
    }, { 
  
      writeConcern: { w: "majority" , wtimeout: 5000 },
      versionKey: false
  
    });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;