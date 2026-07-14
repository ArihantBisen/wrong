import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const existingUser =
    await prisma.authUser.findUnique({
      where: {
        username: 'superadmin'
      }
    })

  if (existingUser) {
    console.log(
      'Super Admin already exists'
    )
    return
  }

  const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, 10)

  const user =
    await prisma.authUser.create({
      data: {
  name: process.env.SUPER_ADMIN_NAME,
  username: process.env.SUPER_ADMIN_USERNAME,
  email: process.env.SUPER_ADMIN_EMAIL,
  password: hashedPassword,
  role: 'super_admin',
  isActive: true,
  isDeleted: false
}
    })

  console.log(
    'Super Admin created successfully'
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })