const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
//const db = require("../db/queries")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const getIndex = (req, res) => {
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("index", {
    messages: flashMessages,
    user: req.user,
  })
}
// Login handler
const loginUser = passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/",
  failureFlash: true,
})

// Logout handler
const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return next(err)
    res.redirect("/")
  })
}

module.exports = { getIndex, loginUser, logoutUser }
