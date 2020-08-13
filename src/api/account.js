var express = require("express");
var router = express.Router();
var AccountServices = require("../services/account");
var AlertServices = require("../services/alert");
var UserServices = require("../services/user");

router.route("/")
    .get(function(req, res, next) {
        AccountServices.getAccount(req.session.u_id)
            .then(function(account) {
                res.render('account', {"account": account, "tab": req.query && req.query.tab ? JSON.stringify(req.query.tab) : "profile"});
            })
            .catch(function(err) {
                next(err);
            });
    })

router.route("/logout")
    .post(function(req, res, next) {
        if (req.session.u_id) {
            req.session.destroy();         
            res.redirect('/');
        } else {
            next(err);
        }
    })

//add books to account
router.route("/add_books")
    .post(function(req, res, next) {
        AccountServices.addBook(req.body, req.session.u_id)
            .then(function(result) {
                if (result) {
                    res.send('Book successfully added');
                }
            })
            .catch(function(err) {
                next(err);
            });
    })

//add books to wishlist
router.route("/add_wish")
 .post(function(req, res, next) {
        AccountServices.addWish(req.session.u_id, req.body.book_id)
            .then(function(result) {
                if (result) {
                    res.send('Book successfully added');
                }
            })
            .catch(function(err) {
                next(err);
            });
    })


//delete account
router.route("/delete")
    .post(function(req, res, next) {
        AccountServices.deleteAccount(req.body)
            .then(function(result) {
                if (result) {
                    req.session.destroy();
                    res.redirect('/');
                }
            })
            .catch(function(err) {
                res.render("manageaccount", err);
            });
    })


//update books owned
router.post("/update_books", function(req, res, next){
    AccountServices.updateCondition(req.body)
        .then(function(result) {
            res.redirect('/account/?tab=books');
        }).catch(function(err) {
            next(err);
        });
})


//delete from books owned
router.route("/delete_books")
    .post(function(req, res, next) {
        AccountServices.deleteBooks(req.body, req.session.u_id)
            .then(function(result) {
                if (result) {
                    res.redirect('/account/?tab=books');
                }
            })
            .catch(function(err) {
                next(err);
            });
    })


//delete from wishlist
router.route("/delete_wish")
    .post(function(req, res, next) {
        AccountServices.deleteWish(req.session.u_id, req.body.book_id)
            .then(function(result) {
                if (result) {
                    res.redirect('/account/?tab=wish');
                }
            })
            .catch(function(err) {
                next(err);
            });
    })

//update account info
router.route("/update")
    .post(function(req, res, next) {
        AccountServices.updateAccount(req.body)
            .then(function() {
                res.redirect('/account');
            })
            .catch(function(err) {
                next(err);
            });
    })

router.route("/update_password")
    .post(function(req, res, next) {
        UserServices.updatePassword(req.body)
        .then(function() {
            res.redirect('/account');
        })
        .catch(function(err) {
            res.render("manageaccount", err);
        })
    })

//update points
router.route("/update_points")
    .put(function(req, res) {
        AccountServices.updatePoints(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account/?tab=profile');
                }
            })
            .catch(function(err) {
                next(err);
            });
    })

router.route("/delete_alert")
    .post(function(req, res, next) {
        AlertServices.deleteByAlertId(req.body.alertId)
        .then(function() {
            res.redirect("/account/?tab=profile");
        })
        .catch(function(err) {
            next(err);
        })
    })

router.route("/manage")
    .get(function(req, res, next) {
        UserServices.getUserById(req.session.u_id)
        .then(function(user) {
            if (user[0].private == 1) {
                user[0].private = "checked";
            } else {
                user[0].private = "";
            }
            res.render("manageaccount", user[0])
        })
        .catch(function(err) {
            next(err);
        })
    })

module.exports = router;
