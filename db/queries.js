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

module.exports = { findUserByEmail, findUserById, postNewUser, uploadFile }
