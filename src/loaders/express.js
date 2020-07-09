var express = require("express");
var app = express();
var handlebars = require("express-handlebars").create({"defaultLayout": "main"});
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");

var settings = function(app) {
    app.engine("handlebars", handlebars.engine);
    app.use(bodyParser.urlencoded({"extended": true}));
    app.use(bodyParser.json());
    app.use(session({secret:"noOneKnows"}));
    app.use(express.static(path.join(process.cwd(), "/public")));
    app.set("views", path.join(process.cwd(), "/public/views"));
    app.set("view engine", "handlebars");
    app.use("/", require("../api/pages"));
    app.use("/book", require("../api/book"));
    app.use("/user", require("../api/user"));
    app.use("/account", require("../api/account"));
    app.use("/swap", require("../api/swap"));
};

module.exports = settings;

