const { Router } = require("express")
const express = require("express")

const indexController = require("../controllers/indexController")
const indexRouter = Router()
indexRouter.use(express.urlencoded({ extended: true }))

indexRouter.get("/", indexController.getIndex)

module.exports = indexRouter
