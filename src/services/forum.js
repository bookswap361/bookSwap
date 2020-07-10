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
                    })
                });
                resolve(threads);
            })
            .catch(reject);
    });
};

module.exports = ForumServices;
