var SwapHbsHelpers = {};

SwapHbsHelpers.getStatus = function(swapObject) {
    if (isShipper(swapObject)) { // For the shipper
        return generateShipperStatus(swapObject);
    } else { // For the receiver
        return generateReceiverStatus(swapObject);
    }
};

function isShipper(swapObject) {
    return swapObject.user_id == swapObject.traded_by;
};

function getCompleteStatus(swapObject) {
    return swapObject.reject_date ? "Rejected" : swapObject.lost_date ? "Lost in Transit" : swapObject.refund_date ? "Refunded" : "Complete";
};

function getButtonHtml(swapId, form, isPrimary, text) {
    return "<button type='submit' form=" + form + " name='swapId' value=" + swapId + " class='btn btn-" + (isPrimary ? "primary" : "danger") + "'>" + text + "</button>";
};

function generateShipperStatus(swapObject) {
    var returnHtml = "";
    if (swapObject.is_complete) {
        returnHtml += getCompleteStatus(swapObject);
    } else if (!(swapObject.approve_date || swapObject.reject_date)) {
        returnHtml += getButtonHtml(swapObject.swap_id, "accept-trade", true, "Accept Trade");
        returnHtml += getButtonHtml(swapObject.swap_id, "reject-trade", false, "Reject Trade");
    } else if (swapObject.approve_date && !swapObject.ship_date) {
        returnHtml += getButtonHtml(swapObject.swap_id, "get-shipping", true, "Get Shipping Address");
        returnHtml += getButtonHtml(swapObject.swap_id, "shipped", true, "Mark Shipped");
    } else if (swapObject.ship_date && !swapObject.received_date && !swapObject.not_received) {
        returnHtml += "In Transit";
    } else if (swapObject.ship_date && swapObject.not_received && !swapObject.lost_limit) { 
        returnHtml += getButtonHtml(swapObject.swap_id, "lost", true, "Lost In Transit");
    } else if (swapObject.has_claim) {
        returnHtml += "Open Claim";
    }
    return returnHtml;
};

function getTimeElapsed(shipDate) {
    var today = new Date();
    var ship = new Date(shipDate);
    var milliseconds = today - ship;
    var dayDiff = parseInt(milliseconds / (1000 * 60 * 60 * 24));
    var minuteDiff = parseInt(milliseconds / (1000 * 60)); // For test
    return minuteDiff; // Return dayDiff when done
};

function generateReceiverStatus(swapObject) {
    var returnHtml = "";
    if (swapObject.is_complete) {
        returnHtml += getCompleteStatus(swapObject);
    } else if (!(swapObject.approve_date || swapObject.reject_date)) {
        returnHtml += "Approval Pending";
    } else if (swapObject.reject_date) {
        returnHtml += "Rejected";
    } else if (swapObject.approve_date && !swapObject.ship_date) {
        returnHtml += "Shipment Pending";
    } else if (swapObject.ship_date && !swapObject.received_date && !swapObject.not_received) {
        var elapsedTime = getTimeElapsed(swapObject.ship_date)
        if (elapsedTime > 1) { // 'Show Not Received' button after 4 minutes for test, change to use dayDiff later
            if (swapObject.lost_limit) {
                returnHtml += getButtonHtml(swapObject.swap_id, "not-received-refund", false, "Not Received");
            } else {
                returnHtml += getButtonHtml(swapObject.swap_id, "not-received", false, "Not Received");
            }
        } else {
            returnHtml += getButtonHtml(swapObject.swap_id, "received", true, "Received");
            returnHtml += getButtonHtml(swapObject.swap_id, "claim", false, "Received in Poor Condition");
        }
    } else if (swapObject.ship_date && swapObject.not_received) {
        returnHtml += "Marked Not Received -- Pending Shipper";
    } else if (swapObject.has_claim) {
        returnHtml += "Open Claim";
    }
    return returnHtml;
};

module.exports = SwapHbsHelpers;
