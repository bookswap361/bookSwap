var express = require("express");
var router = express.Router();
var ForumServices = require("../services/forum");

router.route("/")
    .get(function(req, res) {
        console.log('here')
        ForumServices.getAllThreads()
            .then(function(result) {
                console.log(result);
                res.render("forum", {"threads": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    })

module.exports = router;
