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
    return display ? "<button type='button text-center' class='btn btn-primary' id='addWishBtn' onclick='addBook.call(null, \"wishlist\")'><i class='far fa-heart'></i> Add to my wishlist</button>" : "";
};

module.exports = WishlistHbsHelpers;
