var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        res.render("user");
    })

//TODO
router.route("/search_by_name")
    .get(function(req, res, next) {
        UserServices.searchUsersByName(req.query.name)
            .then(function(result) {
                console.log(result);
                res.render('search_user', result);
            })
            .catch(function(err) {
                next(err);
            })
    })

router.route("/search_by_email")
    .get(function(req, res, next) {
        UserServices.searchUsersByEmail(req.query.email)
            .then(function(result) {
                res.render('search_user', result);
            })
            .catch(function(err) {
                next(err);
            })
    })



module.exports = router;
