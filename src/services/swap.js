var BookModel = require("../models/book"),
    UserModel = require("../models/user"),
    SwapModel = require("../models/swap"),
    BooksOwnedModel = require("../models/books_owned"),
    AlertModel = require("../models/alert");
    ForumServices = require("../services/forum")
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
            var returnObj = !isTradedToCase ? {"newReqs": 0, "swapsByMeComplete": 0, "swapsByMePending": 0} : {"swapsToMeComplete": 0, "swapsToMePending": 0};
            var swaps = [];
            results.forEach(function(item) {
                if (!isTradedToCase) {
                    if (!item.is_accepted && !item.is_complete) {
                        returnObj.newReqs++;
                    } else if (!item.is_complete) {
                        returnObj.swapsByMePending++;
                    } else if (item.is_complete) {
                        returnObj.swapsByMeComplete++;
                    }
                } else {
                    if (!item.is_complete) {
                        returnObj.swapsToMePending++;
                    } else if (item.is_complete) {
                        returnObj.swapsToMeComplete++;
                    }
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
    var newSwap = new Promise(function(resolve, reject) {
        SwapModel.createSwap(info)
        .then(BooksOwnedModel.updateAvailability.bind(null, Number(info.list_id), false))
        .then(function() {
            BookModel.getTitleByListId(info.list_id)
                .then(function(result) {
                    resolve({"title": result[0].title, "author": result[0].name});
                })
                .catch(reject)
        })
    });
    var deletePoints = new Promise(function(resolve, reject){
        UserModel.deletePoints(info.cost, info.traded_to)
            .then(resolve)
            .catch(reject)
        });
    return Promise.all([newSwap, deletePoints]);
};

SwapServices.acceptSwap = function(swapId, tradedBy) {
    var accept = new Promise(function(resolve, reject) {
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
    });
    var addPoints = new Promise(function(resolve, reject) {
        SwapModel.getTradedById(swapId)
        .then(function(result) {
            var cost = result[0].cost;
            var traded_by = result[0].traded_by;
            resolve(UserModel.updatePoints(cost, traded_by))
            })
        .catch(reject)
    });
    return Promise.all([accept, addPoints]);
};

SwapServices.rejectSwap = function(swapId, tradedBy) {
    var rejected = new Promise(function(resolve, reject) {
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
    var addPoints = new Promise(function(resolve, reject) {
        SwapModel.getTradedToId(swapId)
        .then(function(result) {
            var cost = result[0].cost;
            var traded_to = result[0].traded_to;
            resolve(UserModel.updatePoints(cost, traded_to))
            })
        .catch(reject)
    });
    return Promise.all([rejected, addPoints]);
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
    var refund = new Promise(function(resolve, reject) {
        SwapModel.updateRefundDate(swapId)
        .then(SwapServices.completeSwap.bind(null, swapId))
        .then(resolve)
        .catch(reject);
    });
    var addPoints = new Promise(function(resolve, reject) {
        SwapModel.getTradedToId(swapId)
        .then(function(result) {
            var cost = result[0].cost;
            var traded_to = result[0].traded_to;
            resolve(UserModel.updatePoints(cost, traded_to))
            })
        .catch(reject)
    });
    return Promise.all([refund, addPoints]);
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

SwapServices.scrubSwapsByDeletedUserId = function(id) {
    return new Promise(function(resolve, reject) {
        SwapModel.scrubTradedByByDeletedUserId(id)
            .then(SwapModel.scrubTradedToByDeletedUserId.bind(null, id))
            .then(resolve)
            .catch(reject);
    });
};

module.exports = SwapServices;
