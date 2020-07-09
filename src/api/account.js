var express = require("express");
var router = express.Router();
var AccountServices = require("../services/account");


router.route("/")
    .get(function(req, res) {
        id = 1;                                //test variable until sessions are implemented
        AccountServices.getAccount(id)
            .then(function(account) {
<<<<<<< HEAD
                let merged = {...account[0], ...account[1], ...account[2]};
                res.render('account', merged);
            })
            .catch(function(err) {
                res.redirect('/');
            });
    })

//add books to account
router.route("/add_books")
    .post(function(req, res) {
        AccountServices.addBooks(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

//add books to wishlist
router.route("/add_wish")
    .post(function(req, res) {
        AccountServices.addWish(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
=======
                res.render('account', account);
>>>>>>> master
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

<<<<<<< HEAD
=======
//add books to account
router.route("/add_books")
    .post(function(req, res) {
        AccountServices.addBooks(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

//add books to wishlist
router.route("/add_wish")
    .post(function(req, res) {
        AccountServices.addWish(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

>>>>>>> master
//delete account
router.route("/delete")
    .post(function(req, res) {
        AccountServices.deleteAccount(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/home');
                }
            })
            .catch(function(err) {
                res.redirect('/account');
            });
    })
//delete from books owned
router.route("/delete_books")
    .post(function(req, res) {
        AccountServices.deleteBooks(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })
//delete from wishlist
router.route("/delete_wish")
    .post(function(req, res) {
        AccountServices.deleteWish(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })
//update account info
router.route("/update")
    .put(function(req, res) {
        AccountServices.updateAccount(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })
//update points
router.route("/update_points")
    .put(function(req, res) {
        AccountServices.updatePoints(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })
//update lost limit
router.route("/update_lost")
    .put(function(req, res) {
        AccountServices.updateLostLimit(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })



module.exports = router;
