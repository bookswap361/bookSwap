var express = require("express");
var router = express.Router();
var BookServices = require("../services/book");

router.route("/")
    .get(function(req, res) {
        BookServices.getAllBooks()
            .then(function(result) {
                res.json({"payload": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    })


module.exports = router;
