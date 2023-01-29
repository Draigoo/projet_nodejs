const express = require('express');
const router = express.Router();
const path = require("path");
const reservation = require(path.join(__dirname,'../model/Reservation.js'));
const user = require(path.join(__dirname,'../model/User.js'));
const resource = require(path.join(__dirname,'../model/Resource.js'));

router.get('/', async (req, res) => {
    res.render("ressource", {title: "Ressource", user : req.session.user, list_resource: await resource.getAll()});
});

router.post('/',async (req, res) => {
    await resource.insert(req.body.type);
    res.redirect("/");

});


module.exports = router;