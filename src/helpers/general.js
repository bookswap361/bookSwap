var GeneralHbsHelpers = {};

GeneralHbsHelpers.formatDate = function(date) {
    var dateObj = new Date(date);
    return (dateObj.getMonth() + 1) + "-" + dateObj.getDate() + "-" + dateObj.getFullYear();
};

GeneralHbsHelpers.setChecked = function(value, currentValue) {
    return value == currentValue ? "checked" : "";
};

GeneralHbsHelpers.nullDescription = function(description) {
    return description == "null" ? "No description for this book is available" : description;
};

GeneralHbsHelpers.setSelected = function(value, currentValue) {
	console.log("value: " + value + " currentValue: " + currentValue);
    return value == currentValue ? "selected" : "";
 };

module.exports = GeneralHbsHelpers;
