var SwapHbsHelpers = {};

// TODO: Add additional status and button rendering
SwapHbsHelpers.getStatus = function(userId, swapId, tradedToId, tradedById, approveDate, rejectDate, shipDate, receiveDate) {
    var returnHtml = "";
    console.log(arguments)

    // I am the owner of the swap - the shipper
    if (userId == tradedById) {
        if (!(approveDate || rejectDate)) {
            returnHtml += "<button type='submit' form='accept-trade' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Accept Trade</button>";
            returnHtml += "<button type='submit' form='reject-trade' name='swapId' value=" + swapId + " class='btn btn-outline-danger'>Reject Trade</button>";
        } else if (approveDate && !shipDate) {
            returnHtml += "<button type='submit' form='shipped' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Mark Shipped</button>";
        } else if (shipDate && !receiveDate) {
            returnHtml += "In Transit";
        }
    } else {
        if (!(approveDate || rejectDate)) {
            returnHtml += "Approval Pending";
        } else if (rejectDate) {
            returnHtml += "Rejected";
        } else if (approveDate && !shipDate) {
            returnHtml += "Shipment Pending";
        } else if (shipDate && !receiveDate) {
            returnHtml += "<button type='submit' form='received' name='swapId' value=" + swapId + " class='btn btn-outline-primary'>Mark Received</button>";
        }
    }

    return returnHtml;
};

module.exports = SwapHbsHelpers;
