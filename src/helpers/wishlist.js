var WishlistHbsHelpers = {};

WishlistHbsHelpers.displayButton = function(wishlist, bookId) {
    var display = true;
    for (var i = 0; i < wishlist.length; i++) {
        var list = wishlist[i];
        if (list.book_id == bookId) {
            display = false;
            break;
        }
    }

    return display ? "<button type='button' class='btn btn-primary' id='addWishBtn' onclick='addBook.call(null, \"wishlist\")'>Add to my wishlist</button>" : "";
};

module.exports = WishlistHbsHelpers;
