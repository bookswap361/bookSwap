var ForumHbsHelpers = {};

ForumHbsHelpers.formatResolveLink = function(threadId) {
    return "/forum/resolve/?id=" + threadId;
};

ForumHbsHelpers.formatThreadLink = function(threadId) {
    return "/forum/?id=" + threadId;
};

module.exports = ForumHbsHelpers;
