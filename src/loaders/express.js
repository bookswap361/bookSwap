var express = require("express");
var app = express();
var generalHelpers = require("../helpers/general");
var forumHelpers = require("../helpers/forum");
var swapHelpers = require("../helpers/swap");
var wishlistHelpers = require("../helpers/wishlist");
var session = require('express-session');
var handlebars = require("express-handlebars").create({
    "defaultLayout": "main",
    "helpers": {
        "formatDate": generalHelpers.formatDate,
        "formatResolveLink": forumHelpers.formatResolveLink,
        "formatThreadLink": forumHelpers.formatThreadLink,
        "setChecked": generalHelpers.setChecked,
        "getStatus": swapHelpers.getStatus,
        "ifUser": forumHelpers.ifUser,
        "displayButton": wishlistHelpers.displayButton
    }
});
var helpers = require('handlebars-helpers')();
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
    app.use("/account", checkAuth, userDetails, require("../api/account"));
    app.use("/swap", checkAuth, userDetails, require("../api/swap"));
    app.use("/forum", checkAuth, userDetails, require("../api/forum"));
    app.use(handle404);
    app.use(handle500);
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

function handle404(req, res) {
    res.status(404);
    res.render("error", {"errorMessage": "404: Page Not Found"}); 
};

function handle500(error, req, res, next) {
    console.error(error.stack);
    res.status(500);
    res.render("error", {"errorMessage": "500: Internal Server Error"});
};

module.exports = settings;

