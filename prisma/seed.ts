import { PrismaClient, TopicSuffix } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const deviceTypes = [
    {
      name: 'Temperature Sensor',
      topicSuffixes: [TopicSuffix.STATUS_TEMPERATURE]
    },
    {
      name: 'Humidity Sensor',
      topicSuffixes: [TopicSuffix.STATUS_HUMIDITY]
    },
    {
      name: 'Temperature and Humidity Sensor',
      topicSuffixes: [TopicSuffix.STATUS_TEMPERATURE, TopicSuffix.STATUS_HUMIDITY]
    }
  ]

  for (const deviceType of deviceTypes) {
    await prisma.deviceType.upsert({
      where: {
        name: deviceType.name
      },
      update: {},
      create: {
        ...deviceType
      }
    })
  }

  await prisma.user.upsert({
    where: {
      email: 'cgl@email.com'
    },
    create: {
      email: 'cgl@email.com',
      password: bcrypt.hashSync('password123')
    },
    update: {}
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
