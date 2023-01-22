const express = require('express');
const router = express.Router();
const path = require("path");
const reservation = require(path.join(__dirname,'../model/Reservation.js'));
const user = require(path.join(__dirname,'../model/User.js'));
const resource = require(path.join(__dirname,'../model/Resource.js'));

router.get('/', async (req, res) => {
    console.log(await resource.getAvailable());

    res.render("reservation", {title: "Reservation", user : req.session.user, list_resource: await resource.getAvailable()});
});

router.post('/',async (req, res) => {

    res.redirect("/home");


});


module.exports = router;