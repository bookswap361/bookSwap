var express = require("express");
var router = express.Router()
var BooksOwnedServices = require("../services/books_owned"),
    UserServices = require("../services/user");

router.get("/", function(req, res){
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

router.route("/add-to-account")
    .post(function(req, res) {
        var data = req.body;
        data.user_id = req.session.u_id;
        BooksOwnedServices.addToOwn(data)
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


module.exports = router;