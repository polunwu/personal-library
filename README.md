# Personal Library

A Personal-Library project from FreeCodeCamp - Information Security and Quality Assurance Curriculum

### Install

This project use [node](https://nodejs.org/en/) and [npm](https://www.npmjs.com/).

```
npm install
```

### Setup

1) ADD Your MongoDB connection string to .env without quotes as db
    `example: DB=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]`
2) SET NODE_ENV to `test` without quotes
3) All mongoose Model/Schema within `models/book.js`
4) All routes within `routes/api.js`
5) Security features was added to `server.js`
6) All of the functional tests was created in `tests/2_functional-tests.js`

### User Stories

1) Nothing from my website will be cached in my client as a security measure.
2) I will see that the site is powered by *'PHP 4.2.0'* even though it isn't as a security measure.
3) I can **POST** a title to `/api/books` to add a book and returned will be the object with the title and a unique *_id*.
4) I can **GET** `/api/books` to retrieve an aray of all books containing *title*, *_id* & *commentcount*.
5) I can **GET** ``/api/books/{_id}`` to retrieve a single object of a book containing *title*, *_id*, & an array of *comments* (empty array if no comments present).
6) I can **POST** a comment to `/api/books/{_id}` to add a comment to a book and returned will be the books object similar to GET `/api/books/{_id}`.
7) I can **DELETE** `/api/books/{_id}` to delete a book from the collection. Returned will be 'delete successful' if successful.
8) If I try to request a book that doesn't exist I will get a 'no book exists' message.
9) I can send a **DELETE** request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
10) All functional tests required are complete and passing.

### Example Usage


| API             | GET            | POST                | DELETE           |
|-----------------|----------------|---------------------|------------------|
| /api/books      | list all books | add new book        | delete all books |
| /api/books/1234 | show book 1234 | add comment to 1234 | delete 1234      |



