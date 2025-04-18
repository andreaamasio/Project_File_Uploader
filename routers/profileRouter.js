const { Router } = require("express")
const express = require("express")
// const multer = require("multer")
// const upload = multer({ dest: "uploads/" })
//cloudinary setup
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../cloudinary")

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "file_uploader", // Cloudinary folder
    allowed_formats: ["jpg", "png", "pdf", "docx", "txt"],
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
})

const upload = multer({ storage })

//module.exports = upload;

const profileController = require("../controllers/profileController")
const profileRouter = Router()
profileRouter.use(express.urlencoded({ extended: true }))

profileRouter.get("/", profileController.getProfile)
profileRouter.post(
  "/",
  upload.single("uploaded_file"),
  profileController.postProfile
)
profileRouter.post("/new-folder", profileController.postNewFolder)
profileRouter.get(
  "/folder/details/:folderId",
  profileController.getFolderDetails
)
profileRouter.post(
  "/folder/details/:folderId",
  profileController.postFolderDetails
)
profileRouter.get(
  "/folder/details/:folderId/delete",
  profileController.getFolderDelete
)
profileRouter.get(
  "/folder/details/:folderId/:fileId",
  profileController.getFileDetails
)
profileRouter.post(
  "/folder/details/:folderId/:fileId",
  profileController.postFileDetails
)
profileRouter.get(
  "/folder/details/:folderId/:fileId/delete",
  profileController.getFileDelete
)

module.exports = profileRouter
