var mysql = require("../loaders/mysql");
var Swap = {};

Swap.getAllSwaps = function() {
    return mysql.query(getQuery("allSwaps"), []);
};

Swap.getSwapById = function(id) {
    return mysql.query(getQuery("swapById"), [id]);
};

Swap.getCompletedSwaps = function() {
    return mysql.query(getQuery("completedSwaps"), []);
};

Swap.getSwapsTradedTo = function(user_id) {
    return mysql.query(getQuery("getSwapsTradedTo"), [user_id]);
};

/* To be used to pull swap information for a particular 'traded_by' user 
in order to check whether the user has multiple "lost in mail" statuses */
Swap.getSwapsTradedBy = function(user_id) {
    return mysql.query(getQuery("getSwapsTradedBy"), [user_id]);
};

Swap.createSwap = function(info) {
    return mysql.query(getQuery("createSwap"), [info.list_id, info.traded_to, info.traded_by, new Date()]);
};

Swap.acceptSwap = function(swapId, date) {
    return mysql.query(getQuery("acceptSwap"), [new Date(), swapId]);
};

Swap.rejectSwap = function(swapId, date) {
    return mysql.query(getQuery("rejectSwap"), [new Date(), swapId]);
};

Swap.getListId = function(swapId) {
    return mysql.query(getQuery("getListId"), [swapId]);
};

Swap.getShippingAddress = function(swapId) {
    return mysql.query(getQuery("getShippingAddress"), [swapId]);
}

Swap.updateShipDate = function(swapId) {
    return mysql.query(getQuery("updateShipDate"), [new Date(), swapId]);
};

Swap.updateReceivedDate = function(swapId) {
    return mysql.query(getQuery("updateReceivedDate"), [new Date(), swapId]);
};

Swap.updateNotReceived = function(swapId) {
    return mysql.query(getQuery("updateNotReceived"), [swapId]);
};

Swap.updateLostDate = function(swapId) {
    return mysql.query(getQuery("updateLostDate"), [new Date(), swapId]);
};

Swap.updateClaimDate = function(swapId) {
    return mysql.query(getQuery("updateClaimDate"), [new Date(), new Date(), swapId]);
};

Swap.updateRefundDate = function(swapId) {
    return mysql.query(getQuery("updateRefundDate"), [new Date(), swapId]);
};

Swap.updateClaimSettleDate = function(swapId) {
    return mysql.query(getQuery("updateClaimSettleDate", [new Date(), swapId]));
};

Swap.completeSwap = function(swapId) {
    return mysql.query(getQuery("completeSwap"), [swapId]);
};

Swap.deleteSwap = function(id) {
    return mysql.query(getQuery("deleteSwap"), [id]);
};

Swap.getTradedById = function(swapId) {
    return mysql.query(getQuery("getTradedById"), [swapId]);
}

Swap.getTradedToId = function(swapId) {
    return mysql.query(getQuery("getTradedToId"), [swapId]);
}

Swap.deleteSwapsByListId = function(list_id) {
    return mysql.query(getQuery("deleteSwapsByListId"), [list_id.list_id]);
}

Swap.scrubTradedToByDeletedUserId = function(user_id) {
    return mysql.query(getQuery("scrubTradedToByDeletedUserId"), [user_id]);
}

Swap.scrubTradedByByDeletedUserId = function(user_id) {
    return mysql.query(getQuery("scrubTradedByByDeletedUserId"), [user_id]);
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allSwaps":
            query = "SELECT * FROM swap;";
            break;
        case "swapById":
            query = "SELECT * FROM swap WHERE swap_id = ?;";
            break;
        case "acceptSwap":
            query = "UPDATE swap SET approve_date = ?, is_accepted = 1 WHERE swap_id = ?";
            break;
        case "rejectSwap":
            query = "UPDATE swap SET reject_date = ?, is_complete = 1 WHERE swap_id = ?";
            break;
        case "getListId":
            query = "SELECT list_id FROM swap WHERE swap_id = ?";
            break;
        case "completedSwaps":
            query = "SELECT * FROM swap WHERE is_complete = 1;";
            break;
        case "getSwapsTradedBy":
            query = "SELECT swap.swap_id, swap.is_not_received, u.lost_limit_reached, swap.traded_to, swap.traded_by, swap.is_accepted, swap.is_complete, swap.request_date, swap.approve_date, swap.reject_date, swap.ship_date, swap.lost_date, swap.received_date, swap.refund_date, swap.has_claim, swap.claim_open_date, swap.claim_settle_date, u.first_name, u.last_name, b.title FROM swap \
            INNER JOIN books_owned AS bo ON swap.list_id=bo.list_id \
            INNER JOIN book AS b ON bo.book_id=b.book_id \
            INNER JOIN user AS u ON swap.traded_to = u.user_id \
            WHERE swap.traded_by = ? ORDER BY swap.swap_id;";
            break;
        case "getSwapsTradedTo":
            query = "SELECT swap.swap_id, swap.is_not_received, u.lost_limit_reached, swap.traded_to, swap.traded_by, swap.is_accepted, swap.is_complete, swap.request_date, swap.approve_date, swap.reject_date, swap.ship_date, swap.lost_date, swap.received_date, swap.refund_date, swap.has_claim, swap.claim_open_date, swap.claim_settle_date, u.first_name, u.last_name, b.title FROM swap \
            INNER JOIN books_owned AS bo ON swap.list_id=bo.list_id \
            INNER JOIN book AS b ON bo.book_id=b.book_id \
            INNER JOIN user AS u ON swap.traded_by = u.user_id \
            WHERE swap.traded_to = ? ORDER BY swap.swap_id;";
            break;
        case "getShippingAddress":
            query = "SELECT user.first_name AS ship_fname, user.last_name AS ship_lname, user.street, user.city, user.state, user.zip FROM swap \
            INNER JOIN user ON swap.traded_to = user.user_id WHERE swap.swap_id = ?;"
            break;
        case "createSwap":
            query = "INSERT INTO swap (list_id, traded_to, traded_by, request_date) VALUES (?, ?, ?, ?);";
            break;
        case "updateSwapAccepted":
            query = "UPDATE swap SET is_accepted = ?, approve_date = ?, reject_date = ? WHERE swap_id = ?;";
            break;
        case "updateShipDate":
            query = "UPDATE swap SET ship_date = ? WHERE swap_id = ?;";
            break;
        case "updateReceivedDate":
            query = "UPDATE swap SET received_date = ?, is_complete = 1 WHERE swap_id = ?;";
            break;
        case "updateNotReceived":
            query = "UPDATE swap SET is_not_received = 1 WHERE swap_id = ?;";
            break;
        case "updateLostDate":
            query = "UPDATE swap SET lost_date = ? WHERE swap_id = ?;";
            break;
        case "updateClaimDate":
            query = "UPDATE swap SET has_claim = 1, received_date = ?, claim_open_date = ? WHERE swap_id = ?;";
            break;
        case "updateClaimSettleDate":
            query = "UPDATE swap SET has_claim = 0, claim_settle_date = ? WHERE swap_id = ?;";
            break;
        case "updateRefundDate":
            query = "UPDATE swap SET refund_date = ? WHERE swap_id = ?;";
            break;
        case "completeSwap":
            query = "UPDATE swap SET is_complete = 1 WHERE swap_id = ?;";
            break;
        case "deleteSwap":
            query = "DELETE FROM swap WHERE swap_id = ?;";
            break;
        case "getTradedById":
            query = "SELECT bc.cost, s.traded_by FROM swap AS s  \
                    INNER JOIN books_owned AS bo ON s.list_id = bo.list_id \
                    INNER JOIN book_condition AS bc ON bo.condition_id = bc.condition_id \
                    WHERE swap_id = ?;";
            break;
        case "getTradedToId":
            query = "SELECT bc.cost, s.traded_to FROM swap AS s  \
                    INNER JOIN books_owned AS bo ON s.list_id = bo.list_id \
                    INNER JOIN book_condition AS bc ON bo.condition_id = bc.condition_id \
                    WHERE swap_id = ?;";
            break;
        case "deleteSwapsByListId":
            query = "DELETE FROM swap WHERE list_id = ?;";
            break;
        case "scrubTradedToByDeletedUserId":
            query = "UPDATE swap SET traded_to = 1 WHERE traded_to = ?;"
            break;
        case "scrubTradedByByDeletedUserId":
            query = "UPDATE swap SET traded_by = 1 WHERE traded_by = ?;"
            break;
    }

    return query;
};

module.exports = Swap;
