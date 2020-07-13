var ForumModel = require("../models/forum");
var ForumServices = {};
var createDOMPurify = require("dompurify");
var JSDOM = require("jsdom").JSDOM;
var window = new JSDOM("").window;
var DOMPurify = createDOMPurify(window);

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
        //TODO: Get current user_id from session
        var user_id = 1;
        ForumModel.getThreadById(id)
            .then(function(result) {
            var messages = [];
            var title = "";
            var thread_id = "";
            var isOwner = false;
            var isResolved = false;
            if (result) {
                title = result[0].title;
                thread_id = result[0].thread_id;
                isOwner = result[0].owner_id == user_id;
                isResolved = Boolean(result[0].is_resolved);
            }
            result.forEach(function(message) {
                messages.push({
                    "message_id": message.message_id,
                    "user": message.first_name + " " + message.last_name,
                    "post": message.post,
                    "date": message.date
                });
            });
            resolve({"isResolved": isResolved, "thread_id": thread_id, "title": title, "messages": messages, "isOwner": isOwner});
        })
        .catch(reject);
    });
};

ForumServices.createThread = function(data) {
    //TODO: Use user_id saved from session
    var variables = {
        "user_id": 1,
        "title": data.title,
        "date": new Date(),
        "message": data.message
    };

    return new Promise(function(resolve, reject) {
        ForumModel.createThread(variables)
        .then(ForumModel.getLastInsertId)
        .then(function(result) {
            variables["thread_id"] = result;
            ForumModel.insertMessage(variables)
            .then(function() {
                ForumServices.getThreadById(variables["thread_id"])
                .then(function(result) {
                    resolve(result);
                })
                .catch(reject);
            })
        })
    })        
};

ForumServices.insertMessage = function(data) {
    //TODO: Change user_id to the one saved in session
    var variables = {
        "user_id": 2,
        "date": new Date(),
        "message": DOMPurify.sanitize(data.post),
        "thread_id": Number(data.thread_id)
    };
    return new Promise(function(resolve, reject) {
        ForumModel.insertMessage(variables)
        .then(function() {
            resolve(data.thread_id);
        })
        .catch(reject);
    });
};

ForumServices.resolveThread = function(data) {
    return ForumModel.resolveThread(Number(data.id));        
};

module.exports = ForumServices;
