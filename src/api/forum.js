var express = require("express");
var router = express.Router();
var ForumServices = require("../services/forum");

router.route("/")
    .get(function(req, res) {
        if (req.query && req.query.id) {
            ForumServices.getThreadById(req.query.id)
            .then(function(result) {
                console.log(result)
                res.render("thread", {"thread": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
        } else {
            ForumServices.getAllThreads()
                .then(function(result) {
                    res.render("forum", {"threads": result});
                })
                .catch(function(err) {
                    res.status(400).json({"error": err});
                })
        }
    });

router.route("/create")
    .get(function(req, res) {
        res.render("createthread");
    })

module.exports = router;
