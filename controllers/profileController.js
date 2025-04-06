const { body, validationResult } = require("express-validator")
const db = require("../db/queries")
const emptyErr = "cannot be empty."

const getProfile = async (req, res) => {
  console.log(`the user id is ${req.user.id}`)
  const folders = await db.getAllFolders(req.user.id)
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("profile", {
    messages: flashMessages,
    folders: folders,
    user: req.user,
  })
}
const getFileDetails = async (req, res) => {
  console.log(`the user id is ${req.user.id}`)
  const fileId = req.params.fileId
  const folderId = req.params.folderId
  console.log(`the fileId is ${fileId}`)
  console.log(`the folderId is ${folderId}`)
  const file = await db.findFileById(fileId)
  const folder = await db.findFolderById(folderId)
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("file-details", {
    messages: flashMessages,
    folder: folder,
    file: file,
    user: req.user,
  })
}
const getFileDelete = async (req, res) => {
  console.log(`the user id is ${req.user.id}`)
  const { folderId, fileId } = req.params
  console.log(`the fileId is ${fileId}`)

  console.log(`folderId is ${folderId}`)
  const folder = db.findFolderById(folderId)
  const files = await db.findFilesByFolderId(folderId)
  const deletedFile = await db.fileDelete(fileId)

  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  // res.render("folder-details", {
  //   messages: flashMessages,
  //   folder: folder,
  //   files: files,
  //   user: req.user,
  // })
  res.redirect("/profile/folder/details/" + folderId)
}
const getFolderDetails = async (req, res) => {
  console.log(`the user id is ${req.user.id}`)
  const folderId = req.params.folderId
  console.log(`the folderId is ${folderId}`)
  const folder = await db.findFolderById(folderId)
  const files = await db.findFilesByFolderId(folderId)
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("folder-details", {
    messages: flashMessages,
    folder: folder,
    files: files,
    user: req.user,
  })
}
const getFolderDelete = async (req, res) => {
  console.log(`the user id is ${req.user.id}`)
  const folderId = req.params.folderId
  console.log(`the folderId is ${folderId}`)
  await db.folderDelete(folderId)
  const folders = await db.getAllFolders(req.user.id)
  // Get the flash messages from the session
  const flashMessages = req.session.flash || {}

  // Clear the flash messages from the session
  req.session.flash = {}

  // Render the page with messages
  res.render("profile", {
    messages: flashMessages,
    folders: folders,
    user: req.user,
  })
}

const validateFile = [
  body("file_name").trim().notEmpty().withMessage(`File Name: ${emptyErr}`),
]
const validateFolder = [
  body("folder_name").trim().notEmpty().withMessage(`Folder Name: ${emptyErr}`),
]
const newValidateFile = [
  body("new_file_name").trim().notEmpty().withMessage(`File Name: ${emptyErr}`),
]
const newValidateFolder = [
  body("new_folder_name")
    .trim()
    .notEmpty()
    .withMessage(`Folder Name: ${emptyErr}`),
]
const postProfile = [
  validateFile,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("profile", {
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
      res.redirect("/profile")
    } catch (error) {
      console.error("File upload failed:", error)
      res.status(500).send("Error uploading file")
    }
  },
]
const postNewFolder = [
  validateFolder,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("profile", {
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

    let folder_name = req.body.folder_name
    console.log(`folder_name: ${folder_name}`)

    try {
      await db.postNewFolder(userId, folder_name)
      res.redirect("/profile")
    } catch (error) {
      console.error("Folder creation failed:", error)
      res.status(500).send("Error creating folder")
    }
  },
]
const postFolderDetails = [
  newValidateFolder,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("profile", {
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
    const { folderId } = req.params
    const folder = await db.findFolderById(folderId)
    // Get the flash messages from the session
    const flashMessages = req.session.flash || {}

    // Clear the flash messages from the session
    req.session.flash = {}
    console.log(`Trying to update folderId: ${folderId}`)
    let new_folder_name = req.body.new_folder_name
    console.log(`new_folder_name: ${new_folder_name}`)

    try {
      await db.postNewNameFolder(folderId, new_folder_name)

      // // Render the page with messages
      // res.render("folder-details", {
      //   messages: flashMessages,
      //   folder: folder,
      //   user: req.user,
      // })
      res.redirect("/profile/folder/details/" + folderId)
    } catch (error) {
      console.error("Folder Name update failed:", error)
      res.status(500).send("Error changing folder name")
    }
  },
]
const postFileDetails = [
  newValidateFile,
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log("errors found")
      return res.status(400).render("profile", {
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
    const { fileId, folderId } = req.params
    const file = await db.findFileById(fileId)
    // Get the flash messages from the session
    const flashMessages = req.session.flash || {}

    // Clear the flash messages from the session
    req.session.flash = {}
    console.log(`Trying to update fileId: ${fileId}`)
    let new_file_name = req.body.new_file_name
    console.log(`new_file_name: ${new_file_name}`)

    try {
      await db.postNewNameFile(fileId, new_file_name)

      // // Render the page with messages
      // res.render("folder-details", {
      //   messages: flashMessages,
      //   folder: folder,
      //   user: req.user,
      // })
      res.redirect("/profile/folder/details/" + folderId + "/" + fileId)
    } catch (error) {
      console.error("Folder File update failed:", error)
      res.status(500).send("Error changing file name")
    }
  },
]
module.exports = {
  getProfile,
  postProfile,
  postNewFolder,
  getFolderDetails,
  postFolderDetails,
  getFolderDelete,
  getFileDetails,
  postFileDetails,
  getFileDelete,
}
