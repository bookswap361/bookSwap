var GeneralHbsHelpers = {};

GeneralHbsHelpers.formatDate = function(date) {
    var dateObj = new Date(date);
    return (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + "-" + dateObj.getFullYear();
};

GeneralHbsHelpers.setChecked = function(value, currentValue) {
    return value == currentValue ? "checked" : "";
};

GeneralHbsHelpers.setSelected = function(value, currentValue) {
    return value == currentValue ? "selected" : "";
 };

module.exports = GeneralHbsHelpers;