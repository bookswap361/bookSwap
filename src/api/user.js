var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        console.log(req.params);
        UserServices.getAllUsers()
            .then(function(result) {
                res.json({"payload": result});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
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
