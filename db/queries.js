const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (user) {
      console.log(`User found: ${email}`)
    } else {
      console.log(`User not found: ${email}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by email (${email}):`, error)
    throw error
  }
}

async function findUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (user) {
      console.log(`User found by ID: ${id}`)
    } else {
      console.log(`User not found by ID: ${id}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding user by ID (${id}):`, error)
    throw error
  }
}
async function findFolderById(id) {
  try {
    const user = await prisma.folder.findUnique({
      where: { id },
    })

    if (user) {
      console.log(`Folder found by ID: ${id}`)
    } else {
      console.log(`Folder not found by ID: ${id}`)
    }

    return user
  } catch (error) {
    console.error(`Error finding folder by ID (${id}):`, error)
    throw error
  }
}
async function findFileById(id) {
  try {
    const file = await prisma.files.findUnique({
      where: { id },
    })

    if (file) {
      console.log(`File found by ID: ${id}`)
    } else {
      console.log(`File not found by ID: ${id}`)
    }

    return file
  } catch (error) {
    console.error(`Error finding file by ID (${id}):`, error)
    throw error
  }
}

async function findFilesByFolderId(id) {
  try {
    const files = await prisma.files.findMany({
      where: { folderId: id },
    })

    if (files) {
      console.log(`Files found by Folder ID: ${id}`)
    } else {
      console.log(`Files not found by Folder ID: ${id}`)
    }

    return files
  } catch (error) {
    console.error(`Error finding files by Folder ID (${id}):`, error)
    throw error
  }
}
async function getAllFolders(userId) {
  try {
    const folders = await prisma.folder.findMany({
      where: { createdById: userId },
    })

    if (folders) {
      console.log(`Folders founds: ${folders}`)
    } else {
      console.log(`Folders not found by userID: ${userId}`)
    }

    return folders
  } catch (error) {
    console.error(`Error finding folders by ID (${userId}):`, error)
    throw error
  }
}

async function folderDelete(folderId) {
  try {
    const deletedFolder = await prisma.folder.delete({
      where: { id: folderId },
    })

    console.log(
      `Folder deleted successfully: ${deletedFolder.id} (${deletedFolder.name})`
    )
    return deletedFolder
  } catch (error) {
    console.error(`Error deleting folder by ID (${folderId}):`, error)
    throw error
  }
}
async function fileDelete(fileId) {
  try {
    const deletedFile = await prisma.files.delete({
      where: { id: fileId },
    })

    console.log(
      `File deleted successfully: ${deletedFile.id} (${deletedFile.name})`
    )
    return deletedFile
  } catch (error) {
    console.error(`Error deleting folder by ID (${folderId}):`, error)
    throw error
  }
}
// async function postNewUser(email, hashedPassword) {
//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         email,
//         password: hashedPassword,
//       },
//     })

//     console.log(`User successfully created: ${email}`)
//     return newUser
//   } catch (error) {
//     console.error(`Error creating new user (${email}):`, error)
//     throw error
//   }
// }
async function postNewUser(email, hashedPassword) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        folders: {
          create: {
            name: "main", // Create a default folder named "main"
          },
        },
      },
      include: {
        folders: true, // Include created folders in response
      },
    })

    console.log(`User successfully created: ${email}`)
    return newUser
  } catch (error) {
    console.error(`Error creating new user (${email}):`, error)
    throw error
  }
}
async function uploadFile(userId, file_name, folderName = "main") {
  try {
    // Find the "main" folder or the specified folder
    let folder = await prisma.folder.findFirst({
      where: {
        createdById: userId,
        name: folderName, // Default to "main" if no folder is provided
      },
    })

    if (!folder) {
      throw new Error(`Folder "${folderName}" not found for user.`)
    }

    const newFile = await prisma.files.create({
      data: {
        name: file_name,
        uploadedById: userId,
        folderId: folder.id,
      },
    })

    console.log(`File uploaded successfully to folder: ${folderName}`)
    return newFile
  } catch (error) {
    console.error(`Error uploading file:`, error)
    throw error
  }
}
async function postNewFolder(userId, folder_name) {
  try {
    const newFolder = await prisma.folder.create({
      data: {
        name: folder_name,
        createdById: userId,
      },
    })

    console.log(`Folder created successfully in db with name: ${folder_name}`)
    return newFolder
  } catch (error) {
    console.error(`Error creating folder:`, error)
    throw error
  }
}

async function postNewNameFolder(folderId, new_folder_name) {
  try {
    const updatedFolder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: new_folder_name,
      },
    })

    console.log(
      `Folder updated successfully in db with new name: ${new_folder_name}`
    )
    return updatedFolder
  } catch (error) {
    console.error(`Error updating folder name:`, error)
    throw error
  }
}
async function postNewNameFile(fileId, new_file_name) {
  try {
    const updatedFile = await prisma.files.update({
      where: {
        id: fileId,
      },
      data: {
        name: new_file_name,
      },
    })

    console.log(
      `File updated successfully in db with new name: ${new_file_name}`
    )
    return updatedFile
  } catch (error) {
    console.error(`Error updating file name:`, error)
    throw error
  }
}
module.exports = {
  findUserByEmail,
  findUserById,
  postNewUser,
  uploadFile,
  postNewFolder,
  getAllFolders,
  postNewNameFolder,
  findFolderById,
  folderDelete,
  findFileById,
  fileDelete,
  postNewNameFile,
  findFilesByFolderId,
}
