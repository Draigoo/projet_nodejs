const express = require('express');
const router = express.Router();
const path = require("path");
const reservation = require(path.join(__dirname,'../model/Reservation.js'));
const user = require(path.join(__dirname,'../model/User.js'));
const resource = require(path.join(__dirname,'../model/Resource.js'));

router.get('/', async (req, res) => {
    res.render("reservation", {title: "Reservation", user : req.session.user, list_resource: await resource.getType()});
});

router.post('/',async (req, res) => {
    console.log(req.session.user.firstname)
    await reservation.insert(req.body.start_date, req.body.end_date, req.body.type, req.session.user);
    res.redirect("/home");




});


module.exports = router;