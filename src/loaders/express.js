var express = require("express");
var app = express();
var generalHelpers = require("../helpers/general");
var forumHelpers = require("../helpers/forum");
var swapHelpers = require("../helpers/swap");
var session = require('express-session');
var handlebars = require("express-handlebars").create({
    "defaultLayout": "main",
    "helpers": {
        "formatDate": generalHelpers.formatDate,
        "formatResolveLink": forumHelpers.formatResolveLink,
        "formatThreadLink": forumHelpers.formatThreadLink,
        "setChecked": forumHelpers.setChecked,
        "getStatus": swapHelpers.getStatus
    }
});
var bodyParser = require("body-parser");
var path = require("path");
var config = require("../config/config.js");

var settings = function(app) {
    app.engine("handlebars", handlebars.engine);
    app.use(bodyParser.urlencoded({"extended": true}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(process.cwd(), "/public")));
    app.set("views", path.join(process.cwd(), "/public/views"));
    app.set("view engine", "handlebars");
    app.use(session({
        secret: config.secret,
        resave: false,
        saveUninitialized: false
    }));

    app.use("/", userDetails, require("../api/public"));
    app.use("/book", checkAuth, userDetails, require("../api/book"));
    app.use("/books_available", checkAuth, userDetails, require("../api/books_available"));
    app.use("/user", checkAuth, userDetails, require("../api/user"));
    app.use("/account", checkAuth, userDetails, require("../api/account"));
    app.use("/swap", checkAuth, userDetails, require("../api/swap"));
    app.use("/books_owned", checkAuth, userDetails, require("../api/books_owned"));
    app.use("/forum", checkAuth, userDetails, require("../api/forum"));
};

function userDetails(req, res, next) {
    if (req.session.authenticated) {
        res.locals.first_name = req.session.u_name;
    }
    next();
};

function checkAuth(req, res, next) {
    if (req.session.authenticated) {
        next();
    } else {
        res.redirect("/");
    }
};

module.exports = settings;

