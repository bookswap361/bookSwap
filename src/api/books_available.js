var express = require("express");
var router = express.Router();
var BooksAvailableServices = require("../services/books_available");

router.get("/", function(req, res) {
    BooksAvailableServices.getAvailableBooks(req.session.u_id)
        .then(function(result) {
            res.render("book", {"books": result});
        })
        .catch(function(err) {
            res.status(400).json({"error": err});
        });
});

router.post("/condition", function(req, res) {
    BooksAvailableServices.getCondition(req.body, req.session.u_id)
        .then(function(books) {
            console.log("api/books condition: ");
            console.log(books);
            res.send(books);
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
});

module.exports = router;
