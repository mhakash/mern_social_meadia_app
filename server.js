const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

require("dotenv").config();
const app = express();
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// connect to mongodb
require('./config/mongo')();

// passport middleware
app.use(passport.initialize())
require('./config/passport')();

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log("server started :)"));