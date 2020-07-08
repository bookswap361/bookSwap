var express = require("express");
var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");


router.route("/")
    .get(function(req, res) {
        id = 11;                                //test variable until sessions
        UserServices.getUserById(id)
            .then(function(user) {
                res.render('account', user[0]);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    })

module.exports = router;