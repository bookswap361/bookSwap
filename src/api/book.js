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
        var data = req.body;
        BookServices.createBook(req.body)
            .then(function(result) {
                res.redirect("/book/" + req.body.bol_key);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/search")
    .get(function(req, res) {
        res.render("search");
    });

router.route("/add-to-account")
    .post(function(req, res) {
        var data = req.body;
        data.user_id = req.session.u_id;
        BookServices.addToOwn(data)
            .then(function(result) {
                console.log("Book added to account:");
            })
            .then(function(result){
                console.log({"number": 1, "user_id": data.user_id});
                UserServices.updatePoints({"number": 1, "user_id": data.user_id})
            })
            .then(function(result) {
                console.log("1 Point added to account:");
                console.log(data);
                res.send("Success");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/:id")
    .get(function(req, res) {
        console.log("Searching for: " + req.params.id)
        BookServices.getBookByOLId(req.params.id)
            .then(function(result) {
                if(result.length > 0){
                    result[0].exists = 1;
                    console.log("Result found");
                    console.log(result);
                    res.render("book-page", result[0]);
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
                if(result.length > 0){
                    result[0].exists = 1;
                    console.log("Result found");
                    console.log(result);
                    res.render("book-page", result[0]);
                } else {
                    data.new = 1;
                    console.log("No book found");
                    console.log(data);
                    res.render("book-page", data);
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
