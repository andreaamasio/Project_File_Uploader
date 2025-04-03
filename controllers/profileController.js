const { body, validationResult } = require("express-validator")
const db = require("../db/queries")
const emptyErr = "cannot be empty."

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
const validateFile = [
  body("file_name").trim().notEmpty().withMessage(`File Name: ${emptyErr}`),
]
const postProfile = [
  validateFile,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("sign-up", {
        errors: errors.array(),
      })
    }

    // Fix: Extract user ID correctly
    let userId = req.user?.id // Ensure it's the ID, not the whole user object
    console.log(`userId: ${userId}`)

    if (!userId) {
      console.error("Error: User ID not found.")
      return res.status(401).send("Unauthorized: No user logged in.")
    }

    let file_name = req.body.file_name
    console.log(`file_name: ${file_name}`)

    try {
      await db.uploadFile(userId, file_name)
      res.redirect("/")
    } catch (error) {
      console.error("File upload failed:", error)
      res.status(500).send("Error uploading file")
    }
  },
]
module.exports = { getProfile, postProfile }
