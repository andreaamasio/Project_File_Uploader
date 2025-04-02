const { Router } = require("express")
const express = require("express")

const profileController = require("../controllers/profileController")
const profileRouter = Router()
profileRouter.use(express.urlencoded({ extended: true }))

profileRouter.get("/", profileController.getProfile)

module.exports = profileRouter
