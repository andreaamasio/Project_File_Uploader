const { body, validationResult } = require("express-validator")

const emptyErr = "cannot be empty."
const validateUser = [
  body("file_name").trim().notEmpty().withMessage(`Email: ${emptyErr}`),
]

const getProfile = (req, res) => {
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("profile", {
    messages: flashMessages,
    user: req.user,
  })
}
const postSignUp = [
  validateUser,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("sign-up", {
        errors: errors.array(),
      })
    }

    let file_name = req.body.file_name

    console.log(`file_name:${file_name}`)

    await db.postNewUser(email, hashedPassword)

    res.redirect("/")
  },
]
module.exports = { getProfile }
