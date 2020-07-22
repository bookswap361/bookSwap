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

SwapServices.getSwapsByUserId = function(userId, isTradedToCase) {
    var promise;
    if (isTradedToCase) {
        promise = SwapModel.getSwapsTradedTo;
    } else {
        promise = SwapModel.getSwapsTradedBy;
    }
    return new Promise(function(resolve, reject) {
        promise(userId)
        .then(function(results) {
            var returnObj = isTradedToCase ? {"newReqs": 0} : {};
            var swaps = [];
            results.forEach(function(item) {
                if (isTradedToCase && !item.is_accepted) {
                    returnObj.newReqs++;
                }
                swaps.push({
                    "swap_id": item.swap_id,
                    "is_complete": item.is_complete,
                    "name": item.first_name + " " + item.last_name,
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
            });
            console.log('swaps made in new service', swaps);

            if (isTradedToCase) {
                returnObj.swapsToMe = swaps;
            } else {
                returnObj.swapsByMe = swaps;
            }
            return returnObj;
        })
        .then(resolve)
        .catch(reject);
    });
};

SwapServices.getCompletedSwaps = function() {
    return SwapModel.getCompletedSwaps();
};

SwapServices.createSwap = function(info) {
    return new Promise(function(resolve, reject) {
        SwapModel.createSwap(info)
            .then(resolve)
            .catch(reject);
    });
}

SwapServices.acceptSwap = function(swapId) {
    return SwapModel.acceptSwap(swapId, new Date());
};

SwapServices.rejectSwap = function(swapId) {
    return SwapModel.rejectSwap(swapId, new Date());
};

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
