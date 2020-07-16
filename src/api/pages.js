var express = require("express");
var router = express.Router();

router.route("/")
    .get(function(req, res) {
        res.render("about", req.session);
    });

router.route("/search")
    .get(function(req, res) {
        res.render("search");
    });

module.exports = router;
