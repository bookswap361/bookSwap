var BookHbsHelpers = {};

BookHbsHelpers.nullDescription = function(description) {
    return description ? description : "No description for this book is available";
};

BookHbsHelpers.nullImg = function(thumbnail_url) {
    return thumbnail_url ? `<img src=${thumbnail_url} class="img-fluid">` : "No image available";
};

BookHbsHelpers.formatForm = function(data) {
    return data ? `value="${data}"` : null;
};

BookHbsHelpers.createResultPages = function(totalPages, query) {
    var query = `/book/search?title=${query.title}&author=${query.author}`;
    var span = `<a href="${query}">1</a> &nbsp;`;
    for(var i=2; i<=totalPages; i++) {
        span += `<a href="${query}&page=${i}">${i}</a> &nbsp;`;
    }
    return span;
};

BookHbsHelpers.showResultsRange = function(page, total) {
    if (page*100 > total) return `${page-1}00 to ${total}`;
    else if (page) return `${page-1}00 to ${page-1}99`;
    else return `1 to 99`;
};

module.exports = BookHbsHelpers;