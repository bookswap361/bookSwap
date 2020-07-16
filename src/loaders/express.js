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
    app.use("/", require("../api/pages"));
    app.use("/book", require("../api/book"));
    app.use("/user", require("../api/user"));
    app.use("/account", require("../api/account"));
    app.use("/swap", require("../api/swap"));
    app.use("/forum", require("../api/forum"));
};

module.exports = settings;

