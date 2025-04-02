const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  })
}

async function postNewUser(email, hashedPassword) {
  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword, // Store hashed password
    },
  })
}

module.exports = { findUserByEmail, postNewUser }
