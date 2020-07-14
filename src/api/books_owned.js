var express = require("express");
var router = express.Router()
var BooksOwnedServices = require("../services/books_owned");

router.get("/:id", function(req, res){
    BooksOwnedServices.getInventoryByUserId(req.params.id)
        .then(function(books) {
            console.log("Processing result in api/books_owned...");
            console.log(books);
            res.render("account", {"payload": books});
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

module.exports = router;