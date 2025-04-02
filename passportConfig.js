const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const db = require("./db/queries") // Import database functions

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Use email instead of username
    async (email, password, done) => {
      try {
        const user = await db.findUserByEmail(email)
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id) // Store user ID in session
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.findUserById(id) // Fetch user by ID
    done(null, user)
  } catch (error) {
    done(error)
  }
})

module.exports = passport
