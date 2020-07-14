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
        BookServices.getOlKeys()
            .then(function(result){
                var keys = [];
                result.forEach(function(element){
                    keys.push(element.ol_key);
                });
                console.log(keys);

                res.render("createbook", {"keys": keys});
            })
            .catch(function(err){
                res.status(400).json({"error": err});
            });
})

router.route("/:id")
    .get(function(req, res) {
        var data = req.body;
        BookServices.getBookByOLId(req.body.id)
            .then(function(result) {
                if(result.length > 0){
                    console.log(result);
                    res.render("book-page", result[0]);
                } else {
                    console.log(result);
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

router.route("/create-book")
    .post(function(req, res) {
        console.log(req.body);
        new Promise(function(resolve, reject){
            resolve(BookServices.createBook(req.body));
        }).then(function(result){
            res.send("Successful add!");
        })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/add-to-account")
    .post(function(req, res) {
        BookServices.addToOwn(req.body)
            .then(function(result) {
                console.log("Book added");
                res.send("Book added");
            })
            .catch(function(err) {
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
