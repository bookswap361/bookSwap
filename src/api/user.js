var express = require("express");
var router = express.Router();
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res) {
        res.render("user");
    })

//TODO
router.route("/search")
    .get(function(req, res, next) {
        console.log(req)
        UserServices.searchUsers(Number(req.query.criteria), req.query.content)
        .then(function(result) {
            // this part is just a placeholder
            res.render("searchuser", {"result": result})
        })
        .catch(function(err) {
            next(err);
        })
    })

module.exports = router;
