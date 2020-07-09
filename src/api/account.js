var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");


router.route("/")
    .get(function(req, res) {
        id = 1;                                //test variable until sessions are implemented
        UserServices.getUserById(id)
            .then(function(user) {
                res.render('account', user[0]);
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

module.exports = router;