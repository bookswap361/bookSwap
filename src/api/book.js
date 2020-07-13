var express = require("express");
var router = express.Router();
var BookServices = require("../services/book");

router.route("/")
    .get(function(req, res) {
        BookServices.getAvailableBooks()
            .then(function(result) {
            	console.log("Retrieving Available Books...");
            	console.log("Result: " + result);
                res.render("book", {"books": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/create-book")
    .get(function(req, res) {
    res.render("create-book")
})

router.route("/create-book")
    .post(function(req, res) {
        BookServices.createBook(req.body)
            .then(function(result) {
            	console.log("Book created");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/:id")
    .get(function(req, res) {
        BookServices.getBookByOLId(req.params.id)
            .then(function(result) {
                if(result.length > 0){
                    console.log(result);
                    res.render("book-page", result[0]);
                } else {
                    console.log(result);
                    // To do 
                    res.render("book-page", {title: "Placeholder"})
                }
            })
            .catch(function(err) {
                console.error(err);
                res.status(400).json({"error": err});
            });
    });

router.route("/add-owned-book")
    .post(function(req, res) {
        BookServices.addToOwn(req.body)
            .then(function(result) {
            	console.log("Book added");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });


module.exports = router;
