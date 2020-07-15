var express = require("express");
var router = express.Router();

router.route("/")
    .get(function(req, res) {
        res.render("about");
    });

router.route("/search")
    .get(function(req, res) {
        res.render("search");
    });

router.route("/signup")
    .get(function(req, res) {
        res.render("signup")
    })

module.exports = router;
