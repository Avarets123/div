import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  await prisma.user.create({
    data: {
      id: '475f94e0-011f-4748-a254-3b3f7876a237',
      name: 'Роман',
      surname: 'Васильев',
      patronymic: 'Венедиктович',
      role: 'PLATFORM_ADMIN',
      displayName: 'Васильев Роман Венедиктович',
      communications: {
        create: [
          {
            id: '7247f635-8828-4611-b02e-35745b7c6000',
            type: 'email',
            value: 'beau0@ethereal.email',
            confirmed: true,
          },
        ],
      },
    },
  })
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
