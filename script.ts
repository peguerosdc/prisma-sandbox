import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function thisWorks() {
  const root = await prisma.profile.create({
    data: {},
  });
  const profile = await prisma.profile.update({
    where: { id: root.id },
    data: {
      many: {
        deleteMany: {},
        createMany: {
          data: [{}]
        }
      }
    }
  });
  console.log(":) Creating and deleting in 1-n worked!")
}

async function thisDoesntWork() {
  const root = await prisma.profile.create({
    data: {},
  });
  const profile = await prisma.profile.update({
    where: { id: root.id },
    data: {
      one: {
        delete: true,
        create: {}
      }
    }
  });
  console.log(":( Creating and deleting in 1-1 DOESN'T work!")
}

async function thisIsTheWorkaround() {
  const root = await prisma.profile.create({
    data: {},
    include: { one: true }
  });
  const profile = await prisma.profile.update({
    where: { id: root.id },
    data: {
      one: root.one ? {
        delete: true,
        create: {}
      } : { create: {} }
    }
  });
  console.log(":) Creating and deleting in 1-1 works, but I need one extra go to the db!")
}

thisIsTheWorkaround()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
