const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const passport = require('passport');
const User = require('./models/user_model')

passport.use(new localStrategy({usernameField: 'email'},(email, password, done) => {
  User.findOne({email: email}).then((user) => {
        if(user == null ){
            return done(null, false, {message: 'Utilisateur ou mot de passe incorrect'})
        }
        if(password == user.password){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Utilisateur ou mot de passe incorrect'})
        }
    })
}))
// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser((id, done) => {
//     const fetchuser = (id) => User.findById(id)
//     fetchuser(id).then((user)=>{
//         return done(null, user);
//     }) 
// })
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
