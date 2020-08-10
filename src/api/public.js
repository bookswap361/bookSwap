var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        res.render("about", req.session);
    });

router.route("/signup")
    .get(function(req, res) {
        res.render("signup");
    });

router.route("/about_us")
    .get(function(req, res) {
        res.render("about_us");
    })

router.route("/login")
    .post(function(req, res) {
        UserServices.verifyLogin(req.body)
            .then(function(result) {
                if (result) {
                    req.session.u_id = result.user_id;
                    req.session.u_name = result.first_name;
                    req.session.u_name_last = result.last_name;
                    req.session.authenticated = true;
                    req.session.save();
                    res.redirect("/account");
                }
            })
            .catch(function(err) {
                req.session.bad_login = true;
                res.redirect("/");
            });
    });

router.route("/create")
    .post(function(req, res) {
        UserServices.createUser(req.body)
            .then(function(result) {
                if (result) {
                    req.session.u_id = result.user_id;
                    req.session.u_name = result.first_name;
                    req.session.u_name_last = result.last_name;
                    req.session.authenticated = true;
                    req.session.save();
                    res.redirect("/about_us");
                }
            })
            .catch(function(err) {
                res.render("signup", err);
            });
    });

module.exports = router;
