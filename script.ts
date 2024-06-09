import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function base() {
  const root = await prisma.profile.create({
    data: {},
  });
  return root.id;
}

async function thisWorks(id: string) {
  await prisma.profile.update({
    where: { id },
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

async function thisDoesntWork(id: string) {
  await prisma.profile.update({
    where: { id },
    data: {
      one: {
        delete: true,
        create: {}
      }
    }
  });
  console.log(":( Creating and deleting in 1-1 DOESN'T work!")
}

async function thisIsTheWorkaround(id: string) {
  const root = await prisma.profile.findUniqueOrThrow({
    where: { id },
    include: { one: true }
  })
  await prisma.profile.update({
    where: { id },
    data: {
      one: root.one ? {
        delete: true,
        create: {}
      } : { create: {} }
    }
  });
  console.log(":) Creating and deleting in 1-1 works, but I need one extra go to the db!")
}

base()
  .then(thisIsTheWorkaround)
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
