var WishlistHbsHelpers = {};

WishlistHbsHelpers.displayButton = function(wishlist, bookId) {
    var disableHtml = "";
    var buttonText = "Add to my wishlist";
    var format = "info";
    for (var i = 0; i < wishlist.length; i++) {
        var list = wishlist[i];
        if (list.book_id == bookId) {
            format = "secondary";
            disableHtml = "disabled";
            buttonText = "Already in wishlist";
            break;
        }
    }
    
    return "<button type='button' class='btn text-center btn-" + format + " ' id='addWishBtn' onclick='makeReq.call(null, \"wishlist\")' " + disableHtml + "><i class='far fa-heart'></i> " + buttonText + "</button>";
};

module.exports = WishlistHbsHelpers;
