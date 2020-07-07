var express = require("express");
var router = express.Router()
var SwapServices = require("../services/");

router.get("/", function(req, res){
    SwapServices.getAllSwaps()
        .then(function(result) {
            res.json({"payload": result});
        }).catch(function(err) {
            console.error(err);
            res.send("Error");
        });
})

router.get("/:id", function(req, res){
    SwapServices.getSwapById()
        .then(function(result) {
            res.json({"payload": result});
        }).catch(function(err) {
            console.error(err);
            res.send("Error");
        });
})

router.post("/:id", function(req, res){
    SwapServices.addSwap()
        .then(function(result) {
            res.send("Add Book Swap to Selected Book");
        }).catch(function(err) {
            console.error(err);
            res.send("Error");
        });
})

router.post("/:id", function(req, res){
    SwapServices.deleteSwap()
    .then(function(result) {
        res.send("Delete Book Swap");
    }).catch(function(err) {
        console.error(err);
        res.send("Error");
    });
})

router.put("/:id", function(req, res){
    SwapServices.updateSwap()
    .then(function(result) {
        res.send("Update the swap progress");
    }).catch(function(err) {
        console.error(err);
        res.send("Error");
    });
})

module.exports = router;