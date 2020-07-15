var express = require("express");
var router = express.Router()
var BooksOwnedServices = require("../services/books_owned");

router.get("/:id", function(req, res){
    BooksOwnedServices.getInventoryByUserId(req.params.id)
        .then(function(books) {
            console.log("Processing result in api/books_owned...");
            console.log(books[0].author);
            res.render("account", books);
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.post("/:id", function(req, res){
    BooksOwnedServices.deleteInventory(req.body)
        .then(function(result) {
            console.log("Deleting inventory api/books_owned...");
            res.redirect('/account');
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.get("/update/:id", function(req, res){
    BooksOwnedServices.getInventoryByUserId(req.params.id)
        .then(function(books) {
            console.log("Processing result in api/books_owned...");
            console.log(books[0].author);
            res.send(books);
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

module.exports = router;