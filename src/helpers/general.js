var GeneralHbsHelpers = {};

GeneralHbsHelpers.formatDate = function(date) {
    var dateObj = new Date(date);
    return (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + "-" + dateObj.getFullYear();
};

module.exports = GeneralHbsHelpers;
