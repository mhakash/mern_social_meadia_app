const passportJwt = require('passport-jwt');
const mongoose = require('mongoose');

const JwtStrat = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const User = mongoose.model('users');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};

const passport = require('passport')
module.exports = () => {
    passport.use(new JwtStrat(options, (payload, done) => {
        User.findById(payload.id)
            .then((user) => {
                if (user) return done(null, user);
                return done(null, false)
            })
            .catch(err => console.log(err));
    }))
};