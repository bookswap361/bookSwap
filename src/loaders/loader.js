var databaseLoader = require("./mysql");
var expressSettings = require("./express");

var init = function(app) {
    return new Promise(function(resolve, reject) {
        databaseLoader.connection()
        .then(function(){
            console.log("Database connection established..");
            expressSettings(app);
            resolve();
        })
        .catch(function(err) {console.log(err)})    
    });
};

module.exports = init;
