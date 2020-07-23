var SwapHbsHelpers = {};

// TODO: Add additional status and button rendering
SwapHbsHelpers.getStatus = function(userId, swapId, tradedToId, tradedById, approveDate, rejectDate, shipDate, receiveDate, notReceived, lostLimit, refundDate, isComplete, hasClaim) {
    var returnHtml = "";
    console.log({
        "isComplete": isComplete,
        "lostLimit": lostLimit,
        "refundDate": refundDate
    })

    // I am the owner of the swap - the shipper
    if (userId == tradedById) {
        if (isComplete) {
            returnHtml += (rejectDate ? "Rejected" : refundDate ? "Refunded" : "Complete");
        } else if (!(approveDate || rejectDate)) {
            returnHtml += "<button type='submit' form='accept-trade' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Accept Trade</button>";
            returnHtml += "<button type='submit' form='reject-trade' name='swapId' value=" + swapId + " class='btn btn-outline-danger'>Reject Trade</button>";
        } else if (approveDate && !shipDate) {
            returnHtml += "<button type='submit' form='shipped' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Mark Shipped</button>";
        } else if (shipDate && !receiveDate) {
            returnHtml += "In Transit";
        } else if (shipDate && notReceived && !lostLimit) {
            returnHtml += "<button type='submit' form='lost' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Lost in Transit</button>";
        } else if (hasClaim) {
            returnHtml += "Open Claim";
        }
    } else {
        if (isComplete) {
            returnHtml += (rejectDate ? "Rejected" : refundDate ? "Refunded" : "Complete");
        } else if (!(approveDate || rejectDate)) {
            returnHtml += "Approval Pending";
        } else if (rejectDate) {
            returnHtml += "Rejected";
        } else if (approveDate && !shipDate) {
            returnHtml += "Shipment Pending";
        } else if (shipDate && !receiveDate) {
            var today = new Date();
            var ship = new Date(shipDate);
            var milliseconds = today - ship;
            var dayDiff = parseInt(milliseconds / (1000 * 60 * 60 * 24));
            var minuteDiff = parseInt(milliseconds / (1000 * 60)); // For test
            console.log(minuteDiff)
            if (minuteDiff > 4) {
                if (lostLimit) {
                    returnHtml += "<button type='submit' form='lost' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Not Received</button>";
                } else {
                    returnHtml += "<button type='submit' form='not-received' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Not Received</button>";
                }
            } else {
                returnHtml += "<button type='submit' form='received' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Received</button>";
                returnHtml += "<button type='submit' form='claim' name='swapId' value=" + swapId + " class='btn btn-outline-danger'>Received in Poor Condition</button>";
           }
        } else if (hasClaim) {
            returnHtml += "Open Claim";
        }
    }

    return returnHtml;
};

module.exports = SwapHbsHelpers;
