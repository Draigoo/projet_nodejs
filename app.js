require('dotenv').config()

// modules
const morgan = require('morgan');
const express = require('express');
const path = require('path');
const session = require("express-session");

const app = express();
const port = process.env.PORT;
const user = require(path.join(__dirname,'/model/User.js'));
const reservationRouter = require(path.join(__dirname,'routes/reservation.js'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }))

app.use(session({
    secret: 'top secret',
    resave: true,
    saveUninitialized: true
}));

// middleware d'authentification
function auth(req, res, next) {
    if (req?.session?.user) {
        return next();
    }
    else {
        return res.sendStatus(401);
    }
}

app.get('/', function(req, res) {
    if(req?.session?.user){
        res.redirect("/home");
    }
    else{
        res.redirect("/login");
    }

});

app.get('/login', function(req, res) {
    console.log("login");
    res.render("login", {title: "Connexion"});
});

app.post('/login', async function(req, res) {

    // Utilisateur fake ici
    // TODO : aller chercher l'utilisateur en base de données à partir du login et du (hash du) mot de passe
    let users = await user.getAll();

    let i = 0;
    while(users[i])
    {
        if(req.body.login === users[i].name && req.body.password === users[i].password)
        {
            req.session.user = { firstname : req.body.login};
        }
        i++;
    }
    res.redirect("/home");


});

app.get('/home', auth, function(req, res) {
    res.render("layout", {title: "Page d'accueil", user : req.session.user});
});

app.post('/logout', function(req, res) {

    req.session.destroy();
    res.redirect("/login");
});

app.use("/reservation", reservationRouter);




// server start
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

