var express = require("express");
var app = express();

app.set("port", 8000);

app.listen(app.get("port"), function() {
    console.log("Listening on port " + app.get("port") + "...");
});
