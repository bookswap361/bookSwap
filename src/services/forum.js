var ForumModel = require("../models/forum");
var ForumServices = {};

ForumServices.getAllThreads = function() {
    return new Promise(function(resolve, reject) {
        ForumModel.getAllThreads()
            .then(function(result) {
                var threads = [];
                result.forEach(function(thread) {
                    threads.push({
                        "thread_id": thread.thread_id,
                        "title": thread.title,
                        "create_date": thread.create_date,
                        "user": thread.first_name + " " + thread.last_name,
                        "is_resolved": thread.is_resolved ? "Yes" : "No"
                    });
                });
                resolve(threads);
            })
            .catch(reject);
    });
};

ForumServices.getThreadById = function(id) {
    return new Promise(function(resolve, reject) {
        ForumModel.getThreadById(id)
            .then(function(result) {
            var messages = [];
            result.forEach(function(message) {
                messages.push({
                    "thread_id": message.thread_id,
                    "message_id": message.message_id,
                    "user": message.first_name + " " + message.last_name,
                    "post": message.post,
                    "date": message.date
                });
            });
            resolve(messages);
        })
        .catch(reject);
    });
};

module.exports = ForumServices;
