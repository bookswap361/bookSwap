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

Swap.updateSwapShipDate = function(info) {
    return mysql.query(getQuery("updateSwapShipDate"), [info.ship_date, info.swap_id]);
};

Swap.updateSwapReceivedDate = function(info) {
    return mysql.query(getQuery("updateSwapReceivedDate"), [info.received_date, info.swap_id]);
};

Swap.updateSwapCompleteId = function(info) {
    return mysql.query(getQuery("updateSwapCompleteId"), [info.is_complete, info.swap_id]);
};

Swap.deleteSwap = function(id) {
    return mysql.query(getQuery("deleteSwap"), [id]);
};

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
            query = "SELECT swap.swap_id, swap.is_accepted, swap.is_complete, DATE_FORMAT(swap.request_date,'%M-%D-%Y') as request_date, DATE_FORMAT(swap.approve_date,'%M-%D-%Y') as approve_date, DATE_FORMAT(swap.reject_date,'%M-%D-%Y') as reject_date, DATE_FORMAT(swap.ship_date,'%M-%D-%Y') as ship_date, DATE_FORMAT(swap.lost_date,'%M-%D-%Y') as lost_date, DATE_FORMAT(swap.received_date,'%M-%D-%Y') as received_date, DATE_FORMAT(swap.refund_date,'%M-%D-%Y') as refund_date, swap.has_claim, DATE_FORMAT(swap.claim_open_date,'%M-%D-%Y') as claim_open_date, DATE_FORMAT(swap.claim_settle_date,'%M-%D-%Y') as claim_settle_date, u.first_name, u.last_name, b.title FROM swap \
            INNER JOIN books_owned AS bo ON swap.list_id=bo.list_id \
            INNER JOIN book AS b ON bo.book_id=b.book_id \
            INNER JOIN user AS u ON swap.traded_to = u.user_id \
            WHERE swap.traded_by = ?;";
            break;
        case "getSwapsTradedTo":
            query = "SELECT swap.swap_id, swap.is_accepted, swap.is_complete, DATE_FORMAT(swap.request_date,'%M-%D-%Y') as request_date, DATE_FORMAT(swap.approve_date,'%M-%D-%Y') as approve_date, DATE_FORMAT(swap.reject_date,'%M-%D-%Y') as reject_date, DATE_FORMAT(swap.ship_date,'%M-%D-%Y') as ship_date, DATE_FORMAT(swap.lost_date,'%M-%D-%Y') as lost_date, DATE_FORMAT(swap.received_date,'%M-%D-%Y') as received_date, DATE_FORMAT(swap.refund_date,'%M-%D-%Y') as refund_date, swap.has_claim, DATE_FORMAT(swap.claim_open_date,'%M-%D-%Y') as claim_open_date, DATE_FORMAT(swap.claim_settle_date,'%M-%D-%Y') as claim_settle_date, u.first_name, u.last_name, b.title FROM swap \
            INNER JOIN books_owned AS bo ON swap.list_id=bo.list_id \
            INNER JOIN book AS b ON bo.book_id=b.book_id \
            INNER JOIN user AS u ON swap.traded_by = u.user_id \
            WHERE swap.traded_to = ?";
            break;
        case "createSwap":
            query = "INSERT INTO swap (list_id, traded_to, traded_by, request_date) VALUES (?, ?, ?, ?);";
            break;
        case "updateSwapAccepted":
            query = "UPDATE swap SET is_accepted = ?, approve_date = ?, reject_date = ? WHERE swap_id = ?;";
            break;
        case "updateSwapShipDate":
            query = "UPDATE swap SET ship_date = ? WHERE swap_id = ?;";
            break;
        case "updateSwapReceivedDate":
            query = "UPDATE swap SET received_date = ? WHERE swap_id = ?;";
            break;
        case "updateSwapCompleteId":
            query = "UPDATE swap SET is_complete = ? WHERE swap_id = ?;";
            break;
        case "deleteSwap":
            query = "DELETE FROM swap WHERE swap_id = ?;";
            break;
    }

    return query;
};

module.exports = Swap;
