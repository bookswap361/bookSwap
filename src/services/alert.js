var AlertModel = require("../models/alert");
var AlertServices = {};

AlertServices.addAlert = function(id, content) {
    return AlertModel.addAlert(id, content);
};

AlertServices.getByUserId = function(id) {
    return AlertModel.getByUserId(id);
};

AlertServices.deleteByAlertId = function(id) {
    return AlertModel.deleteByAlertId(id);
};

AlertServices.deleteByUserId = function(id) {
    return AlertModel.deleteByUserId(id);
};

module.exports = AlertServices;
