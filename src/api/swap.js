var express = require("express");
var router = express.Router()
var SwapServices = require("../services/");

router.get("/", function(req, res){
    SwapServices.getAllSwaps()
        .then(function(result) {
            res.json({"payload": result});
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.get("/:id", function(req, res){
    SwapServices.getSwapById(req.params.id)
        .then(function(result) {
            res.json({"payload": result});
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.post("/:id", function(req, res){
    SwapServices.addSwap()
        .then(function(result) {
            res.send("Add Book Swap to Selected Book");
        }).catch(function(err) {
            res.status(400).json({"error": err});
        });
})

router.post("/:id", function(req, res){
    SwapServices.deleteSwap(req.params.id)
    .then(function(result) {
        res.send("Delete Book Swap");
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

module.exports = router;