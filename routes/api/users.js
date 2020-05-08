const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require("../../models/User");


router.get("/test", (req, res) => {
  res.send("testing");
});

// @route  POST api/users/register
// @descr  register
// @access Public

router.post("/register", (req, res) => {
  User.findOne({
    email: req.body.email
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        msg: "email already exists"
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.err(err));
        });
      });
    }
  });
});

// @route  POST api/users/login
// @descr  returns JWT Token
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //check if email exists
  User.findOne({
      email: email
    })
    .then((user) => {
      if (!user) {
        // email not exists
        return res.status(404).json('email: user not found');
      }
      bcrypt.compare(password, user.password)
        .then(isMatched => {
          if (isMatched) {
            // user matched
            const payload = {
              id: user._id,
              name: user.name
            };
            jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: '3d'
            }, (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
              })
            });

          } else return res.status(400).json({
            // password not matched
            msg: 'password not matched'
          });
        });

    })
})

// @route  GET api/users/current
// @descr  returns JWT Token
// @access Private
router.get('/current', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  res.json({
    msg: 'success',
    user: req.user
  });
});


module.exports = router;