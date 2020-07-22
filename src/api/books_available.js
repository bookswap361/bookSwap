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

router.get("/condition/:id", function(req, res) {
    BooksAvailableServices.getCondition(req.params.id, req.session.u_id)
        .then(function(books) {
            res.send(books);
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
});

router.post("/add-swap", function(req, res) {
    BooksAvailableServices.addSwap(req.body, req.session.u_id)
        .then(function(result) {
            res.redirect('/');
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

module.exports = router;
