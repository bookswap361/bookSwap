var SwapHbsHelpers = {};

// TODO: Add additional status and button rendering
SwapHbsHelpers.getStatus = function(approveDate, rejectDate, shipDate) {
    if (!(approveDate || rejectDate)) {
        return "Approval Pending";
    } else if (rejectDate) {
        return "Rejected";
    } else if (approveDate && !shipDate) {
        return "Shipment Pending";
    } else {
        return "--PENDING ADDITIONAL STATUSES--";
    }
};

module.exports = SwapHbsHelpers;
