var BookModel = require("../models/book");
    UserModel = require("../models/user");
    SwapModel = require("../models/swap");
var SwapServices = {};


// For testing:
SwapServices.createTable = function() {
    return new Promise(function(resolve, reject){
        SwapModel.createTable()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.deleteTable = function(id) {
    return new Promise(function(resolve, reject){
        SwapModel.deleteTable(id)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getAllSwaps = function() {
    return new Promise(function(resolve, reject){
        SwapModel.getAllSwaps()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getSwapById = function(id) {
    return new Promise(function(resolve, reject){
        SwapModel.getSwapById()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getCompletedSwaps = function(id) {
    return new Promise(function(resolve, reject){
        SwapModel.getCompletedSwaps()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getSwapByTradedTo = function(id) {
    return new Promise(function(resolve, reject){
        SwapModel.getSwapByTradedTo()
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.getSwapByTradedBy = function(user_id) {
    return new Promise(function(resolve, reject){
        SwapModel.getSwapByTradedBy(user_id)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.createSwap = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.createSwap(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwapAccepted = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateSwapAccepted(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwapShipDate = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateSwapShipDate(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwapReceivedDate = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateSwapReceivedDate(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwapStatusId = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateSwapStatusId(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.deleteSwap = function(id) {
    return new Promise(function(resolve, reject){
        SwapModel.deleteSwap(id)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.updateSwap = function(id){
    return new Promise(function(resolve, reject){
        SwapModel.updateSwap(id)
            .then(resolve)
            .catch(reject);
    });  
}

module.exports = SwapServices;