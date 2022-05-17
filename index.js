require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user_model');
const connection = require('./connexion');
const methodeOverride = require('method-override')
const flash = require('express-flash');
const passport_config = require('./passport-config');

const app = express();

connection();

app.use(flash());
app.use(methodeOverride('_method'));
app.use(session({
    secret:process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.session())
app.use(passport.initialize());
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home', {user: req.user})
})
app.get('/login', isguest, (req, res) => {
    res.render('login')
})
app.get('/register', isguest, (req, res) => {
    res.render('register')
})
app.get('/profile',loggedIn ,(req, res) => {
    res.render('profile', {user: req.user})
})
app.post('/register',isguest, (req, res) => {
    if (req.body.name =='' || req.body.email =='' || req.body.password =='') {
        console.log('champs vide');
        res.redirect('/register')      
    }else{
        const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save().then(() =>{
        console.log('User saved in DB');
        res.redirect('/login')
    })
    }
})

app.post('/login',isguest, passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}))

app.delete('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

function loggedIn(req, res, next){
    if(req.user){
        next();
    }else{
        res.redirect('/login');
    }
}

function isguest(req, res, next){
    if(req.user){
        res.redirect('/profile');
    }else{
        next();
    }
}
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Server au port ' + PORT));