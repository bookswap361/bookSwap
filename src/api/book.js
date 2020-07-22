var express = require("express");
var router = express.Router();
var BookServices = require("../services/book"),
    UserServices = require("../services/user");

router.route("/create-book")
    .get(function(req, res) {
        BookServices.getOlKeys()
            .then(function(result){
                var keys = [];
                result.forEach(function(element){
                    keys.push(element.ol_key);
                });
                console.log("Keys found:");
                console.log(keys);
                res.render("createbook", {"keys": keys});
            })
            .catch(function(err){
                res.status(400).json({"error": err});
            });
    })
    .post(function(req, res) {
        BookServices.createBook(req.body)
            .then(function(result) {
                console.log('post new book??')
                res.redirect("/book/" + req.body.bol_key + "?new=1");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/search")
    .get(function(req, res) {
        res.render("search");
    });

router.route("/:id")
    .get(function(req, res) {
        console.log("Searching for: ", req.params, req.query)
        BookServices.getBookByOLId(req.params.id)
            .then(function(result) {
                if(result.length > 0){
                    result[0][0].exists = 1;
                    console.log("Result found");
                    console.log(result);
                    res.render("book-page", req.query && req.query.new ? {"result": result[0][0], "isNew": true} : {"result": result[0], "copies": result[1]});
                } else {
                    res.send("404 Error - Try refreshing or go home")
                }
            })
            .catch(function(err) {
                console.error(err);
                res.status(400).json({"error": err});
            });
    })
    .post(function(req, res) {
        var data = req.body;
        BookServices.getBookByOLId(req.body.book_id)
            .then(function(result) {
                if(result[0].length > 0){
                    console.log("Result found");
                    console.log(result);
                    result[0][0].exists = 1;
                    res.render("book-page", {"result": result[0][0], "copies": result[1]});
                } else {
                    data.new = 1;
                    console.log("No book found");
                    console.log(data);
                    res.render("book-page", {"result": data});
                }
            })
            .catch(function(err) {
                console.error(err);
                res.status(400).json({"error": err});
            });
    });

router.route("/create-author")
    .post(function(req, res) {
        console.log(req.body);
        BookServices.createAuthor(req.body)
            .then(function(result) {
                console.log("Author created");
                res.send("Author created");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

module.exports = router;
