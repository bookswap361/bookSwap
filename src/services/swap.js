var BookModel = require("../models/book");
    UserModel = require("../models/swap");
    SwapModel = require("../models/swap");
var SwapServices = {};

SwapServices.getAllSwaps = function() {
    return new Promise(function(resolve, reject){
        SwapModel.getAllSwaps()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getSwapById = function() {
    return new Promise(function(resolve, reject){
        SwapModel.getSwapById()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.deleteSwap = function() {
    return new Promise(function(resolve, reject){
        SwapModel.deleteSwap()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwap = function(){
    return new Promise(function(resolve, reject){
        SwapModel.updateSwap()
            .then(resolve)
            .catch(reject);
    });  
}

module.exports = SwapServices;