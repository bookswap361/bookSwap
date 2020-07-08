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
                res.redirect('/about');
            });
    })

router.route("/delete")
    .post(function(req, res) {
        UserServices.deleteUser(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/home');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

router.route("/login")
    .post(function(req, res) {
        UserServices.verifyLogin(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/home')
            });
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


module.exports = router;
