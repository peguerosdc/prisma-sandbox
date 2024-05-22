import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {},
  });
  console.log("user", user)

  const profile = await prisma.profile.create({
    data: {
      name: "name",
      userId: user.id,
    },
  });
  console.log("profile", profile)
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
