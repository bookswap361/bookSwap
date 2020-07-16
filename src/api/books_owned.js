var express = require("express");
var router = express.Router()
var BooksOwnedServices = require("../services/books_owned");

router.get("/", function(req, res){
    console.log(req.session.u_id);
    BooksOwnedServices.getInventoryByUserId(req.session.u_id)
        .then(function(books) {
            console.log("Processing result in api/books_owned...");
            res.send(books);
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.post("/update", function(req, res){
    BooksOwnedServices.updateCondition(req.body)
        .then(function(result) {
            console.log("Updating inventory api/books_owned...");
            res.redirect('/account');
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.post("/delete", function(req, res){
    BooksOwnedServices.deleteInventory(req.body)
        .then(function(result) {
            console.log("Deleting inventory api/books_owned...");
            res.redirect('/account');
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})


module.exports = router;