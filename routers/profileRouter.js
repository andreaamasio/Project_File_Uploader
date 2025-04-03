const { Router } = require("express")
const express = require("express")
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

const profileController = require("../controllers/profileController")
const profileRouter = Router()
profileRouter.use(express.urlencoded({ extended: true }))

profileRouter.get("/", profileController.getProfile)
profileRouter.post(
  "/",
  upload.single("uploaded_file"),
  profileController.postProfile
)

module.exports = profileRouter
