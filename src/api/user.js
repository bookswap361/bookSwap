var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/user")
    .get(function(req, res) {
        res.render("/user");
    })



router.route("/search_user")
    .get(function(req, res) {
        UserServices.searchUsers(req.session.u_id, req.params.query, req.params.search_by)
            .then(function(result) {
                res.render('/search', result);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    })



module.exports = router;
