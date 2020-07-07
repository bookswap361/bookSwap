var settings = require("../loaders/express");

var init   = require("../loaders/loader"),
    config = require("../config/config");

var Book = require("../models/book"),
    User = require("../models/user");

var express = require("express");
var router = express.Router()

router.get('/books/:id', function(req, res){
    res.send('Display Book Swap Functions for Selected Book (by list_ID)');
    //Traded_to, traded_by, is_accepted, request_date, approve_date
    //reject_date, shipping_address, ship_date, received_date, status
})

router.post('/books/:id', function(req, res){
    res.send('Add Book Swap to Selected Book');
    //Traded_to, traded_by
})

router.post('/books/:id', function(req, res){
    res.send('Delete Book Swap');
})

router.put('/books/:id', function(req, res){
    res.send('Update the swap progress');
    //Traded_to, traded_by, is_accepted, request_date, approve_date
    //reject_date, shipping_address, ship_date, received_date, status
})

module.exports = router;