var mysql = require("../loaders/mysql");
var ForumModel = {};

ForumModel.getAllThreads = function() {
    return mysql.query(getQuery("allThreads"), []);
};

ForumModel.getThreadById = function(id) {
    return mysql.query(getQuery("getThreadById"), [id]);
};

ForumModel.createThread = function(data) {
    var variables = [
        data.user_id,
        data.title,
        data.date
    ];
    return mysql.query(getQuery("createThread"), variables);
};

ForumModel.getLastInsertId = function() {
    return new Promise(function(resolve, reject) {
        mysql.query(getQuery("getLastInsertId"), [])
        .then(function(result) {
            resolve(result[0]["LAST_INSERT_ID()"]);
        })
        .catch(reject);
    });
};

ForumModel.insertMessage = function(data) {
    var variables = [
        data.user_id,
        data.thread_id,
        data.message,
        data.date
    ];
    return mysql.query(getQuery("insertMessage"), variables);
};

ForumModel.resolveThread = function(id) {
    return mysql.query(getQuery("resolveThread"), [id]);
};

ForumModel.getResolvedThreads = function() {
    return mysql.query(getQuery("getResolvedThreads"), []);
};

ForumModel.getUnresolvedThreads = function() {
    return mysql.query(getQuery("getUnresolvedThreads"), []);
};

ForumModel.getThreadsByUserId = function(id) {
    return mysql.query(getQuery("getThreadsByUserId"), [id]);
};

function getQuery(type) {
    var query = "";
    switch(type) {
        case "getLastInsertId":
            query = "SELECT LAST_INSERT_ID()";
            break;
        case "allThreads":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
        case "createThread":
            query = "INSERT INTO thread (user_id, title, create_date) VALUES (?,?,?);";
            break;
        case "getThreadById":
            query = "SELECT m.message_id, t.user_id as owner_id, t.is_resolved, m.user_id, m.thread_id, u.first_name, u.last_name, m.post, DATE_FORMAT(m.date, '%M-%D-%Y') as date, t.title FROM messages m INNER JOIN user u ON m.user_id = u.user_id INNER JOIN thread t ON m.thread_id = t.thread_id WHERE m.thread_id = ? ORDER BY m.date ASC;";
            break;
        case "insertMessage":
            query = "INSERT INTO messages (user_id, thread_id, post, date) VALUES (?,?,?,?);";
            break;
        case "resolveThread":
            query = "UPDATE thread SET is_resolved = 1 WHERE thread_id = ?;";
            break;
        case "getResolvedThreads":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id WHERE t.is_resolved = 1 GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
        case "getUnresolvedThreads":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id WHERE t.is_resolved = 0 GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
        case "getThreadsByUserId":
            query = "SELECT t.thread_id, t.title, u.first_name, u.last_name, DATE_FORMAT(t.create_date,'%M-%D-%Y') as create_date, t.is_resolved FROM thread t INNER JOIN user u ON t.user_id = u.user_id WHERE t.user_id = ? GROUP BY t.thread_id ORDER BY t.thread_id;";
            break;
    }
    return query;
};

module.exports = ForumModel;
