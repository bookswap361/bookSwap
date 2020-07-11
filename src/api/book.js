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
    })

router.route("/:id")
    .get(function(req, res) {
        BookServices.getBookByOLId(req.params.id)
            .then(function(result) {
                console.log("Result: " + result);
                res.render("book", {"book-page": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
})


module.exports = router;
