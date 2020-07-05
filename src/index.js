var express = require("express");
var init = require("./loaders/loader");
var config = require("./config/config");

var startServer = function() {
    var app = express();
    init(app)
        .then(function() {
            app.listen(config.port, function() {
            console.log("Server connection establisted..\nListening on port " + config.port + "..");
        });
    });
};

startServer();
