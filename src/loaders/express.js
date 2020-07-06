var express = require("express");
var app = express();
var handlebars = require("express-handlebars").create({"defaultLayout": "main"});
var bodyParser = require("body-parser");
var path = require("path");

var settings = function(app) {
    app.engine("handlebars", handlebars.engine);
    app.use(bodyParser.urlencoded({"extended": false}));
    app.use(bodyParser.json());
    app.use(express.static(path.join(process.cwd(), "/public")));
    app.set("views", path.join(process.cwd(), "/public/views"));
    app.set("view engine", "handlebars");
    app.use("/", require("../api/pages"));
    app.use("/book", require("../api/book"));
    app.use("/user", require("../api/user"));
};

module.exports = settings;

