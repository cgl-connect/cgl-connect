import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const deviceTypes = ['Temperature Sensor', 'Humidity Sensor', 'Pressure Sensor', 'Flow Sensor']
  for (const deviceType of deviceTypes) {
    await prisma.deviceType.upsert({
      where: {
        name: deviceType,
      },
      update: {},
      create: {
        name: deviceType,
      },
    })
  }

  await prisma.user.upsert({
    where: {
      email: 'cgl@email.com',
    },
    create: {
      email: 'cgl@email.com',
      password: bcrypt.hashSync('password123'),
    },
    update: {},
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
