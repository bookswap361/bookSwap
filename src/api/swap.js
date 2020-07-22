var express = require("express");
var router = express.Router()
var SwapServices = require("../services/swap");

router.get("/", function(req, res){
    SwapServices.getAllSwaps()
        .then(function(result) {
            console.log(result);
            res.render("swap", {"swaps": result});
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})


router.put("/:id", function(req, res){
    SwapServices.updateSwap()
    .then(function(result) {
        res.send("Update the swap progress");
    }).catch(function(err) {
        res.status(400).json({"error": err});
    });
})

router.put("/completed-swaps", function(req, res){
    SwapServices.getCompletedSwaps()
    .then(function(result) {
        res.render("swap", {"payload": result});
    }).catch(function(err) {
        res.status(400).json({"error": err});
    });
})

/*
//TODO: Change to GET
router.put("/swap-by-traded-to", function(req, res){
    SwapServices.getSwapByTradedTo()
    .then(function(result) {
        res.render("swap", {"payload": result});
    }).catch(function(err) {
        res.status(400).json({"error": err});
    });
})
*/
/* Will need updated once page layout is finished */
// TODO: Change to GET
/*
router.route("/get_swap_by_traded_by")
    .post(function(req, res) {
        console.log("Retrieving swap information...");
        SwapServices.getSwapByTradedBy(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                    console.log("Success: Swap Information Retrieved");
                }
            })
            .catch(function(err) {
                res.status(400).json({ "error": err });
            });
})
*/
router.route("/create")
    .post(function(req, res) {
        console.log("Creating swap...");
        console.log(req.body)
        SwapServices.createSwap({"list_id": Number(req.body.list_id), "traded_by": req.body.owner_id, "traded_to": req.session.u_id})
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                    console.log("Success: Swap Created");
                }
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
})

router.route("/accept")
    .post(function(req, res) {
        console.log("Updating swap information...", req.body);
        SwapServices.acceptSwap(Number(req.body.swapId))
            .then(function(result) {
                res.redirect("/account");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            })
    });

router.route("/reject")
    .post(function(req, res) {
        SwapServices.rejectSwap(Number(req.body.swapId))
            .then(function(result) {
                res.redirect("/account");
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
    });

router.route("/update_swap_ship_date")
    .post(function(req, res) {
        console.log("Updating Shipped Date of swap...");
        SwapServices.updateSwapShipDate(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                    console.log("Success: Shipped Date Updated");
                }
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
})

router.route("/update_swap_received_date")
    .post(function(req, res) {
        console.log("Updating Received Date of swap...");
        SwapServices.updateSwapReceivedDate(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                    console.log("Success: Received Date Updated");
                }
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
})

router.route("/update_swap_status_id")
    .post(function(req, res) {
        console.log("Updating Status of swap...");
        SwapServices.updateSwapStatusId(req.body)
            .then(function(result) {
                if (result) {
                    res.redirect('/account');
                    console.log("Success: Status Updated");
                }
            })
            .catch(function(err) {
                res.status(400).json({"error": err});
            });
})

router.post("/confirm-delete", function(req, res){
    SwapServices.deleteSwap(req.params.id)
    .then(function(result) {
        res.render("swap", {"payload": "Swap for book has been deleted"});
    }).catch(function(err) {
        res.status(400).json({"error": err});
    });
})

module.exports = router;
