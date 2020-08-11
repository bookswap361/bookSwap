var BookHbsHelpers = {};

BookHbsHelpers.nullDescription = function(description) {
    return description === "null" ? "No description for this book is available" : description;
};

BookHbsHelpers.nullImg = function(thumbnail_url) {
    return thumbnail_url === null ? "No image available" : `<img src=${thumbnail_url} class="img-fluid">`;
};

BookHbsHelpers.formatForm = function(data) {
    return `"${data}"`;
};

module.exports = BookHbsHelpers;