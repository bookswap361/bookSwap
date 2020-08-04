var express = require("express");
var router = express.Router();
var AccountServices = require("../services/account");
var AlertServices = require("../services/alert");

router.route("/")
    .get(function(req, res) {
        AccountServices.getAccount(req.session.u_id)
            .then(function(account) {
                let merged = {...account[0], ...account[1], ...account[2], ...account[3], ...account[4], ...account[5]};
                res.render('account', merged);
            })
            .catch(function(err) {
                res.redirect('/');
            });
    })

//add books to account
router.route("/add_books")
    .post(function(req, res) {
        req.body.user_id = req.session.u_id;
        AccountServices.addBook(req.body, req.session.u_id)
            .then(function(result) {
                if (result) {
                    res.send('Book successfully added');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })

//add books to wishlist
router.route("/add_wish")
 .post(function(req, res) {
        req.body.user_id = req.session.u_id;
        AccountServices.addWish(req.body)
            .then(function(result) {
                if (result) {
                    res.send('Book successfully added');
                }
            })
            .catch(function(err) {
                res.redirect('/about');
            });
    })


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


//update books owned
router.post("/update_books", function(req, res, next){
    AccountServices.updateCondition(req.body)
        .then(function(result) {
            res.redirect('/account');
        }).catch(function(err) {
            next(err);
        });
})


//delete from books owned
router.route("/delete_books")
    .post(function(req, res) {
        AccountServices.deleteBooks(req.body, req.session.u_id)
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
        req.body.user_id = req.session.u_id;
        req.body.book_id = parseInt(req.body.book_id);
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

router.route("/delete_alert")
    .post(function(req, res, next) {
        AlertServices.deleteByAlertId(req.body.alertId)
        .then(function() {
            res.redirect("/account");
        })
        .catch(function(err) {
            next(err);
        })
    })

module.exports = router;
