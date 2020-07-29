var ForumHbsHelpers = {};

ForumHbsHelpers.formatResolveLink = function(threadId) {
    return "/forum/resolve/?id=" + threadId;
};

ForumHbsHelpers.formatThreadLink = function(threadId) {
    return "/forum/?id=" + threadId;
};

ForumHbsHelpers.setChecked = function(value, currentValue) {
    return value == currentValue ? "checked" : "";
};

ForumHbsHelpers.ifUser = function(criteria) {
    return criteria == "userId" ? true : false;
};

module.exports = ForumHbsHelpers;
