var express = require("express");
var router = express.Router();
var ForumServices = require("../services/forum");

router.route("/")
    .get(function(req, res) {
        if (req.query && req.query.id) {
            ForumServices.getThreadById(req.query.id, req.session.u_id)
            .then(function(result) {
                res.render("thread", {"isResolved": result.isResolved, "thread": result.messages, "title": result.title, "id": result.thread_id, "isOwner": result.isOwner});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
        } else if (req.query.filter) {
            ForumServices.filterThread(req.query.filter, req.session.u_id)
            .then(function(result) {
                res.render("forum", {"threads": result, "criteria": req.query.filter});
            });
        } else {
            ForumServices.getAllThreads()
                .then(function(result) {
                    res.render("forum", {"threads": result, "criteria": "all"});
                })
                .catch(function(err) {
                    res.status(400).json({"error": err});
                })
        }
    });

router.route("/create")
    .get(function(req, res) {
        res.render("createthread");
    })
    .post(function(req, res) {
         ForumServices.createThread(req.body, req.session.u_id)
            .then(function(result) {
                res.redirect("/forum/?id=" + result);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    });

router.route("/insert")
    .post(function(req, res) {
        ForumServices.insertMessage(req.body, req.session.u_id)
            .then(function(result) {
                res.redirect("/forum/?id=" + result);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    });

router.route("/resolve")
    .post(function(req, res) {
        if (req.query && req.query.id) {
            //TODO: Make sure the ownerid matches current user-id for resolving
            ForumServices.resolveThread(req.query)
            .then(function() {
                res.redirect("/forum");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
        }
    });

module.exports = router;
