const expressSession = require("express-session")
const { PrismaSessionStore } = require("@quixo3/prisma-session-store")
const { PrismaClient } = require("@prisma/client")
const passport = require("./passportConfig")
const path = require("node:path")
const db = require("./db/queries")
//const { Pool } = require("pg")
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")

const LocalStrategy = require("passport-local").Strategy
const indexRouter = require("./routers/indexRouter")
const signUpRouter = require("./routers/signUpRouter")
const app = express()

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.use(flash())
app.use((req, res, next) => {
  res.locals.user = req.user // Make user available in all templates
  next()
})

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }))
app.use(passport.session())
app.use(express.urlencoded({ extended: false }))

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
)
app.use(passport.initialize())
app.use(passport.session())

// Set up Passport Local Strategy

app.use("/sign-up", signUpRouter)
app.use("/", indexRouter)

app.listen(3000, () => console.log("app listening on port 3000!"))
