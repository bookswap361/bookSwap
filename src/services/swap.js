var BookModel = require("../models/book"),
    UserModel = require("../models/user"),
    SwapModel = require("../models/swap"),
    BooksOwnedModel = require("../models/books_owned"),
    AlertModel = require("../models/alert");
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


// tradedTo means to me, tradedBy means by owner
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
            // Get requests only if book is traded by you
            var returnObj = !isTradedToCase ? {"newReqs": 0} : {};
            var swaps = [];
            results.forEach(function(item) {
                if (!isTradedToCase && !item.is_accepted && !item.is_complete) {
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
                    "title": item.title,
                    "traded_to": item.traded_to,
                    "traded_by": item.traded_by,
                    "user_id": userId,
                    "not_received": item.is_not_received,
                    "lost_limit": item.lost_limit_reached
                });
            });
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
        .then(BooksOwnedModel.updateAvailability.bind(null, Number(info.list_id), false))
        .then(resolve)
        .catch(reject)
    })
}

SwapServices.acceptSwap = function(swapId, tradedBy) {
    return new Promise(function(resolve, reject) {
        SwapModel.acceptSwap(swapId)
        .then(function() {
            SwapModel.getTradedToId(swapId)
            .then(function(result) {
                AlertModel.addAlert(result[0]["traded_to"], "Your swap with " + tradedBy + " has been accepted!")
                .then(resolve)
                .catch(reject)
            })
        })
        .catch(reject)
    })
};

SwapServices.rejectSwap = function(swapId, tradedBy) {
    return new Promise(function(resolve, reject) {
        SwapModel.getListId(swapId)
        .then(function(result) {
            var listId = result[0].list_id;
            SwapModel.rejectSwap(swapId)
            .then(BooksOwnedModel.updateAvailability.bind(null, listId, true))
            .then(function() {
                SwapModel.getTradedToId(swapId)
                .then(function(result) {
                    AlertModel.addAlert(result[0]["traded_to"], "Your swap with " + tradedBy + " has been rejected!")
                    .then(resolve)
                    .catch(reject);
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
};

SwapServices.updateShipDate = function(swapId, tradedBy) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateShipDate(swapId)
        .then(function() {
            SwapModel.getTradedToId(swapId)
            .then(function(result) {
                AlertModel.addAlert(result[0]["traded_to"], "Your swap with " + tradedBy + " has been shipped!")
                .then(resolve)
                .catch(reject);
            })
            .catch(reject);
        })
    })
};

SwapServices.getShippingAddress = function(swapId) {
    return new Promise(function(resolve, reject) {
        SwapModel.getShippingAddress(swapId)
        .then(function(result) {
            resolve(result[0]);
        })
        .catch(reject);
    });
}

SwapServices.updateReceivedDate = function(swapId) {
    return SwapModel.updateReceivedDate(swapId);
    return new Promise(function(resolve, reject) {
        SwapModel.updateReceivedDate(swapId)
        .then(SwapServices.completeSwap.bind(null, swapId))
        .then(resolve)
        .catch(reject);
    });
};


SwapServices.notReceived = function(swapId) {
    return new Promise (function(resolve, reject) {
        SwapModel.updateNotReceived(swapId)
        .then(resolve)
        .catch(reject);
    })
};

SwapServices.refundSwap = function(swapId) {
    return new Promise(function(resolve, reject) {
        SwapModel.updateRefundDate(swapId)
        .then(SwapServices.completeSwap.bind(null, swapId))
        .then(resolve)
        .catch(reject);
    });
};

SwapServices.completeSwap = function(swapId) {
    return SwapModel.completeSwap(swapId);
};

SwapServices.updateLostDate = function(swapId, userId) {
    return new Promise (function(resolve, reject) {
        SwapModel.updateLostDate(swapId)
        .then(UserModel.updateLostLimit.bind(null, userId))
        .then(SwapModel.completeSwap.bind(null, swapId))
        .then(resolve)
        .catch(reject)
    });
};

SwapServices.updateClaimDate = function(swapId) {
    return SwapModel.updateClaimDate(swapId);
};

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
