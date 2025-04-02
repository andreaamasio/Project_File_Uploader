const { body, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
//const db = require("../db/queries")
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const emptyErr = "cannot be empty."
const validateUser = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage(`Email: ${emptyErr}`)
    .isEmail()
    .withMessage(`Email: Please use a valid email address`)
    .normalizeEmail({ gmail_remove_dots: false })
    .custom(async (value) => {
      const existingUser = await db.findUserByEmail(value)
      if (existingUser) {
        throw new Error("Email already exists. Please choose another one.")
      }
    }),

  body("password")
    .notEmpty()
    .withMessage(`Password: ${emptyErr}`)
    .isLength({ min: 8 })
    .withMessage(`Password: Minimum 8 characters`)
    .matches(/[A-Z]/)
    .withMessage(`Password: Must contain at least one uppercase letter`)
    .matches(/[0-9]/)
    .withMessage(`Password: Must contain at least one number`)
    .matches(/[\W_]/)
    .withMessage(
      `Password: Must contain at least one special character (!@#$%^&*)`
    ),
]

const getSignUp = (req, res) => {
  res.render("sign-up")
}
const postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("sign-up-form", {
        errors: errors.array(),
      })
    }

    let email = req.body.email
    const hashedPassword = await bcrypt.hash(req.body.password, 10)

    await db.postNewUser(email, hashedPassword)

    res.redirect("/")
  },
]
module.exports = { getSignUp, postSignUp }
