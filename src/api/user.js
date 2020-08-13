var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        res.render("user");
    })

router.route("/search")
    .get(function(req, res, next) {
        UserServices.searchUsers(req.query.criteria, req.query.content, req.session.u_id)
        .then(function(result) {
            UserServices.getPoints(req.session.u_id)
                .then(function(points) {
                    res.render("search_user", {"users": result, "points": points[0].points})
                })
        })
        .catch(function(err) {
            next(err);
        })
    })

module.exports = router;
