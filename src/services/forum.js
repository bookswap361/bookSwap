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
                        "is_resolved": thread.is_resolved ? "Resolved" : ""
                    });
                });
                resolve(threads);
            })
            .catch(reject);
    });
};

ForumServices.filterThread = function(criteria, userId) {
    var promise;
    switch(criteria) {
        case "resolved":
            promise = ForumModel.getResolvedThreads();
            break;
        case "unresolved":
            promise = ForumModel.getUnresolvedThreads();
            break;
        case "userId":
            promise = ForumModel.getThreadsByUserId(userId);
            break;
        default:
            return ForumServices.getAllThreads();
    }
    return new Promise(function(resolve, reject) {
        promise
        .then(function(result) {
            var threads = [];
            result.forEach(function(thread) {
                threads.push({
                    "thread_id": thread.thread_id,
                    "title": thread.title,
                    "create_date": thread.create_date,
                    "user": thread.first_name + " " + thread.last_name,
                    "is_resolved": thread.is_resolved ? "Resolved" : ""
                });
            });
            resolve(threads);
        })
        .catch(reject);
    });
}

ForumServices.getThreadById = function(threadId, userId) {
    return new Promise(function(resolve, reject) {
        ForumModel.getThreadById(threadId)
            .then(function(result) {
            var messages = [];
            var title = "";
            var thread_id = "";
            var isOwner = false;
            var isResolved = false;
            if (result) {
                title = result[0].title;
                thread_id = result[0].thread_id;
                isOwner = result[0].owner_id == userId;
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

ForumServices.createThread = function(data, userId) {
    var variables = {
        "user_id": userId,
        "title": data.title,
        "date": new Date(),
        "message": DOMPurify.sanitize(data.message)
    };

    return new Promise(function(resolve, reject) {
        ForumModel.createThread(variables)
        .then(ForumModel.getLastInsertId.bind(null, userId))
        .then(function(result) {
            variables["thread_id"] = result;
            ForumModel.insertMessage(variables)
            .then(function() {
                resolve(variables["thread_id"]);
            }).catch(reject);
        })
    })        
};

ForumServices.insertMessage = function(data, userId) {
    var variables = {
        "user_id": userId,
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

ForumServices.scrubForumByDeletedUserId = function(user_id) {
    return new Promise(function(resolve, reject) {
        ForumModel.scrubMessagesByDeletedUserId(user_id)
            .then(ForumModel.scrubThreadsByDeletedUserId.bind(null, user_id))
            .then(resolve)
            .catch(reject);
    });
}

module.exports = ForumServices;
