const { Router } = require("express")
const express = require("express")

const indexController = require("../controllers/indexController")
const indexRouter = Router()
indexRouter.use(express.urlencoded({ extended: true }))

indexRouter.get("/", indexController.getIndex)
indexRouter.post("/login", indexController.loginUser)
indexRouter.get("/logout", indexController.logoutUser)

module.exports = indexRouter
