var BookModel = require("../models/book");
    UserModel = require("../models/user");
    SwapModel = require("../models/swap");
var SwapServices = {};

SwapServices.getAllSwaps = function() {
    return new Promise(function(resolve, reject){
        SwapModel.getAllSwaps()
            .then(function(results){
                var allSwaps = [];
                results.forEach(function(swapItem) {
                    allSwaps.push({
                      "swap_id": swapItem.swap_id,
                      "traded_by": swapItem.traded_by,
                      "traded_to": swapItem.traded_to,
                      "is_complete": swapItem.is_complete
                  });
                })
                return allSwaps;
            })
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

SwapServices.getSwapByUserId = function(user_id) {
    return new Promise(function(resolve, reject){
        SwapModel.getSwapByUserId(user_id)
            .then(function(results){
                console.log("Processing in services/swap...");
                var swaps = [];
                results.forEach(function(item) {
                    swaps.push({
                      "swap_id": item.swap_id,
                      "traded_by": item.first_name + " " + item.last_name,
                      "claim_settle_date": item.claim_settle_date,
                      "claim_open_date": item.claim_open_date,
                      "has_claim": item.has_claim,
                      "approve_date": item.approve_date,
                      "reject_date": item.reject_date,
                      "received_date": item.received_date,
                      "refund_date": item.refund_date,
                      "ship_date": item.ship_date,
                      "lost_date": item.lost_date,
                      "is_accepted": item.is_accepted,
                      "request_date": item.request_date,
                      "title": item.title
                  });
                })
                return swaps;
            })
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
