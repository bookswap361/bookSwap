var AlertModel = require("../models/alert");
var AlertServices = {};

AlertServices.addAlert = function(id, content) {
    return AlertModel.addAlert(id, content);
};

AlertServices.getByUserId = function(id) {
    return AlertModel.getByUserId(id);
};

module.exports = AlertServices;
