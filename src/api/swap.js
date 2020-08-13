var express = require("express");
var router = express.Router()
var SwapServices = require("../services/swap");

router.route("/create")
    .post(function(req, res, next) {
        SwapServices.createSwap({"list_id": Number(req.body.list_id), "traded_by": req.body.owner_id, "traded_to": req.session.u_id, "cost": req.body.cost})
            .then(function(result) {
                if (req.body.book_page) {
                    res.redirect("/account/?tab=swaps");
                }
                else res.send(result[0]);
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/accept")
    .post(function(req, res, next) {
        SwapServices.acceptSwap(Number(req.body.swapId), req.session.u_name + " " + req.session.u_name_last)
            .then(function() {
                res.redirect("/account/?tab=swaps");
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/reject")
    .post(function(req, res, next) {
        SwapServices.rejectSwap(Number(req.body.swapId), req.session.u_name + " " + req.session.u_name_last)
            .then(function() {
                res.redirect("/account/?tab=swaps");
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/shipped")
    .post(function(req, res, next) {
        SwapServices.updateShipDate(Number(req.body.swapId), req.session.u_name + " " + req.session.u_name_last)
            .then(function(result) {
                res.redirect("/account/?tab=swaps");
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/received")
    .post(function(req, res, next) {
        SwapServices.updateReceivedDate(Number(req.body.swapId))
            .then(function(result) {
                res.redirect("/account/?tab=swaps");
            })
            .catch(function(err) {
                next(err);
            });
});

router.route("/lost")
    .post(function(req, res, next) {
        SwapServices.updateLostDate(Number(req.body.swapId), req.session.u_id)
            .then(function() {
                res.redirect("/account/?tab=swaps");
            })
            .catch(function(err) {
                next(err);
            });
    });

router.route("/not_received")
    .post(function(req, res, next) {
        SwapServices.notReceived(Number(req.body.swapId))
        .then(function() {
            res.redirect("/account/?tab=swaps");
        })
        .catch(function(err) {
            next(err);
        });
    });

router.route("/not_received_refund")
    .post(function(req, res, next) {
        SwapServices.notReceived(Number(req.body.swapId))
        .then(SwapServices.refundSwap.bind(null, Number(req.body.swapId)))
        .then(function() {
            res.redirect("/account/?tab=swaps");
        })
        .catch(function(err) {
            next(err);
        });
    });

router.route("/claim")
    .post(function(req, res, next) {
        SwapServices.updateClaimDate(Number(req.body.swapId))
        .then(function() {
            res.redirect("/account/?tab=swaps");
        })
        .catch(function(err) {
            next(err);
        });
    });

router.route("/get-shipping")
    .post(function(req, res, next) {
        SwapServices.getShippingAddress(Number(req.body.swapId))
        .then(function(result) {
            res.render("shipping", result);
        })
        .catch(function(err) {
            next(err);
        });
    });
module.exports = router;
