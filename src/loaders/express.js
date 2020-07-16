var express = require("express");
var app = express();
var forumHelpers = require("../helpers/forum");
var session = require('express-session');
var handlebars = require("express-handlebars").create({
    "defaultLayout": "main",
    "helpers": {
        "formatResolveLink": forumHelpers.formatResolveLink,
        "formatThreadLink": forumHelpers.formatThreadLink,
        "setChecked": forumHelpers.setChecked
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
    app.use("/", userDetails, require("../api/pages"));
    app.use("/book", userDetails, require("../api/book"));
    app.use("/user", userDetails, require("../api/user"));
    app.use("/account", userDetails, require("../api/account"));
    app.use("/swap", userDetails, require("../api/swap"));
    app.use("/forum", userDetails, require("../api/forum"));
};

function userDetails(req, res, next) {
    if (req.session.authenticated) {
        res.locals.first_name = req.session.u_name;
    }
    next();
};

module.exports = settings;

