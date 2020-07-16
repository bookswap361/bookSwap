var mysql = require("../loaders/mysql");
var Swap = {};

Swap.getAllSwaps = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("allSwaps"), [])
            .then(resolve)
            .catch(reject);
    });
}

Swap.getSwapById = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("swapById"), [id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.getCompletedSwaps = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("completedSwaps"), [id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.getSwapByTradedTo = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getSwapByTradedTo"), [id])
            .then(resolve)
            .catch(reject);
    });
}

/* To be used to pull swap information for a particular 'traded_by' user 
in order to check whether the user has multiple "lost in mail" statuses */
Swap.getSwapByTradedBy = function(user_id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getSwapByTradedBy"), [user_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.getSwapByUserId = function(user_id) {
    return new Promise(function(resolve, reject) {
        console.log("Processing in models/swap...");
        mysql.query(getQuery("getSwapByUserId"), [user_id, user_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.createSwap = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("createSwap"), [info.list_id, 
        info.traded_to, info.traded_by, info.is_accepted,
        info.request_date, info.approve_date, info.reject_date,
        info.ship_date, info.received_date, info.status_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.updateSwapAccepted = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("updateSwapAccepted"), [info.is_accepted, info.approve_date, info.reject_date, info.swap_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.updateSwapShipDate = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("updateSwapShipDate"), [info.ship_date, info.swap_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.updateSwapReceivedDate = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("updateSwapReceivedDate"), [info.received_date, info.swap_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.updateSwapStatusId = function(info) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("updateSwapStatusId"), [info.status_id, info.swap_id])
            .then(resolve)
            .catch(reject);
    });
}

Swap.deleteSwap = function(id) {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("deleteSwap"), [id])
            .then(resolve)
            .catch(reject);
    });
}

function getQuery(type) {
    var query = "";
    switch(type) {
        case "allSwaps":
            query = "SELECT * FROM swap;"
            break;
        case "swapById":
            query = "SELECT * FROM swap WHERE swap_id = ?;"
            break;
        case "completedSwaps":
            query = "SELECT * FROM swap WHERE is_complete = ?;"
            break;
        case "getSwapByTradedBy":
            query = "SELECT traded_by, status_id FROM swap WHERE traded_by = ?;"
            break;
        case "getSwapByTradedTo":
            query = "SELECT traded_to, status_id FROM swap WHERE traded_to = ?;"
            break;
        case "getSwapByUserId":
            query = "SELECT swap.swap_id, swap.is_accepted, swap.request_date, b.title FROM swap \
            INNER JOIN books_owned AS bo ON swap.list_id=bo.list_id \
            INNER JOIN book AS b ON bo.book_id=b.book_id \
            WHERE swap.traded_to = ? OR swap.traded_by = ?;"
            break;
        case "createSwap":
            query = "INSERT INTO swap \
            (list_id, traded_to, traded_by, is_accepted, request_date, \
            approve_date, reject_date, ship_date, received_date, status_id) \
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);"
            break;
        case "updateSwapAccepted":
            query = "UPDATE swap SET is_accepted = ?, approve_date = ?, reject_date = ? WHERE swap_id = ?;"
            break;
        case "updateSwapShipDate":
            query = "UPDATE swap SET ship_date = ? WHERE swap_id = ?;"
            break;
        case "updateSwapReceivedDate":
            query = "UPDATE swap SET received_date = ? WHERE swap_id = ?;"
            break;
        case "updateSwapStatusId":
            query = "UPDATE swap SET status_id = ? WHERE swap_id = ?;"
            break;
        case "deleteSwap":
            query = "DELETE FROM swap WHERE swap_id = ?;"
            break;    
    }

    return query;
};

module.exports = Swap;