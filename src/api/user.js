var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        UserServices.getAllUsers()
            .then(function(result) {
                res.json({"payload": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    })

router.route("/create")
    .post(function(req, res) {
        UserServices.createUser(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/');
            });
    })

router.route("/delete")
    .post(function(req, res) {
        UserServices.deleteUser(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/');
                }
            })
            .catch(function(err) {
                res.redirect('/');
            });
    })

router.route("/login")
    .post(function(req, res) {
        UserServices.verifyLogin(req.body)
            .then(function(result) {
                if (result) {
                    req.session.u_id = result.user_id;
                    req.session.u_name = result.first_name;
                    req.session.authenticated = true;
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/');
            });
    })

router.route("/signup")
    .get(function(req, res) {
        res.render('signup');
    })

router.route("/:id")
    .get(function(req, res) {
        UserServices.getUserById(req.params.id)
            .then(function(result) {
                res.json({"payload": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    })

router.route("/logout")
    .post(function(req, res) {
        if (req.session.u_id)
            {
            req.session.destroy();
            console.log("You've been logged out.");            
            res.redirect('/');
            }
            else {
            console.log("Could not logout");
            }
            })


module.exports = router;
