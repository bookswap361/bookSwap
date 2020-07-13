var express = require("express");
var router = express.Router();
var ForumServices = require("../services/forum");

router.route("/")
    .get(function(req, res) {
        if (req.query && req.query.id) {
            ForumServices.getThreadById(req.query.id)
            .then(function(result) {
                res.render("thread", {"thread": result.messages, "title": result.title, "id": result.thread_id});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
        } else {
            ForumServices.getAllThreads()
                .then(function(result) {
                    res.render("forum", {"threads": result});
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
         ForumServices.createThread(req.body)
            .then(function(result) {
                res.render("thread", {"thread": result.messages, "title": result.title, "id": result.thread_id});
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    });

router.route("/insert")
    .post(function(req, res) {
        ForumServices.insertMessage(req.body)
            .then(function(result) {
                res.redirect("/forum/?id=" + result);
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    })

module.exports = router;
